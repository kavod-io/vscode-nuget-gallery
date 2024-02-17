// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path'

import { TaskManager } from './taskManager'
import { createMessageHandler } from './createMessageHandler'
import { extractScriptAndStylesheetPaths, getNonce } from './utilities'

const fs = require('fs')

const webviewOutputRelativePath = 'web/dist'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.start', () => {
      const panel = vscode.window.createWebviewPanel(
        'nuget-gallery', // Identifies the type of the webview. Used internally
        'NuGet Gallery', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'out'),
            vscode.Uri.joinPath(context.extensionUri, webviewOutputRelativePath)
          ]
        }
      )

      const taskManager = new TaskManager(vscode.tasks.executeTask, (e: any) => {})
      vscode.tasks.onDidEndTask((e) => taskManager.handleDidEndTask(e))

      panel.webview.onDidReceiveMessage(
        createMessageHandler(panel, taskManager),
        undefined,
        context.subscriptions
      )

      panel.webview.html = createHtml(context, panel)
    })
  )
}

const createHtml = (context: vscode.ExtensionContext, panel: vscode.WebviewPanel) => {
  const html = fs.readFileSync(
    path.join(context.extensionPath, webviewOutputRelativePath, 'index.html'),
    'utf8'
  )
  const { scriptPath, stylesheetPath } = extractScriptAndStylesheetPaths(html)

  // https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/src/utilities/getNonce.ts
  const stylesUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, webviewOutputRelativePath, stylesheetPath ?? '')
  )

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, webviewOutputRelativePath, scriptPath ?? '')
  )

  const nonce = getNonce()

  return replaceScriptAndStylesheetWithCSP(
    html,
    `${scriptUri}`,
    `${stylesUri}`,
    `default-src 'none'; style-src ${panel.webview.cspSource}; script-src 'nonce-${nonce}';connect-src * data: blob: 'unsafe-inline'; img-src * data: blob: 'unsafe-inline';`,
    nonce
  )
}

const replaceScriptAndStylesheetWithCSP = (
  htmlString: string,
  newScriptSrc: string,
  newStylesheetHref: string,
  cspValue: string,
  nonce: string
): string => {
  return htmlString
    .replace(
      /<script\b[^>]*>([\s\S]*?)<\/script>/g,
      `<script type="module" nonce="${nonce}" src="${newScriptSrc}"></script>`
    )
    .replace(
      /<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/g,
      `<link rel="stylesheet" type="text/css" href="${newStylesheetHref}">`
    )
    .replace(
      /<meta\b[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/g,
      `<meta http-equiv="Content-Security-Policy" content="${cspValue}">`
    )
}

export function deactivate() {}
