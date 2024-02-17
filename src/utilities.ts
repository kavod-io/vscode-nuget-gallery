import { exec } from 'child_process'
import { promisify } from 'util'
import * as vscode from 'vscode'
import { Credentials, Message } from './contracts'

let channel: vscode.OutputChannel | undefined

export const logger = (message: string) => {
  if (!channel) {
    channel = vscode.window.createOutputChannel('nuget-package-gallery')
  }
  channel.appendLine(message)
}

export const getCredentialsFromStore = async (
  configuration: vscode.WorkspaceConfiguration,
  source: string
): Promise<Credentials | null> => {
  let command =
    process.platform === 'win32'
      ? `"${configuration.credentialProviderFolder}/CredentialProvider.Microsoft.exe"`
      : `dotnet "${configuration.credentialProviderFolder}/CredentialProvider.Microsoft.dll"`
  command += ' -C -F Json -U ' + source

  try {
    const { stdout, stderr } = await promisify(exec)(command)
    return JSON.parse(stdout) as Credentials
  } catch (error) {
    console.error({ message: 'failed to retrieve credentials', error, source })
    return null
  }
}

export const getNonce = () => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const extractScriptAndStylesheetPaths = (
  htmlString: string
): {
  scriptPath: string | null
  stylesheetPath: string | null
} => {
  let scriptPath: string | null = null
  let stylesheetPath: string | null = null

  const scriptSrcRegex = /<script\b[^>]*src=["']?([^"']*)["']?[^>]*>/g
  const stylesheetHrefRegex =
    /<link\b[^>]*rel=["']?stylesheet["']?[^>]*href=["']?([^"']*)["']?[^>]*>/g

  const scriptMatch = scriptSrcRegex.exec(htmlString)
  if (scriptMatch && scriptMatch[1]) {
    scriptPath = scriptMatch[1]
  }

  const stylesheetMatch = stylesheetHrefRegex.exec(htmlString)
  if (stylesheetMatch && stylesheetMatch[1]) {
    stylesheetPath = stylesheetMatch[1]
  }

  return { scriptPath, stylesheetPath }
}

export function postMessage(panel: vscode.WebviewPanel, message: Message) {
  panel.webview.postMessage(message)
}

/**
 * A definition for the Nuget sources configured in this extension's settings.
 */
interface NugetSourceExtensionSettings {
  name: string
  url: string
  requiresAuth: boolean | undefined
}

export const loadSources = async (panel: vscode.WebviewPanel) => {
  const configuration = vscode.workspace.getConfiguration('NugetGallery')

  const payload = await Promise.all(
    (configuration.sources as NugetSourceExtensionSettings[]).map(
      async ({ requiresAuth, name, url }) => {
        const credentials = requiresAuth ? await getCredentialsFromStore(configuration, url) : null

        return {
          name,
          url,
          credentials
        }
      }
    )
  )

  postMessage(panel, {
    command: 'setSources',
    payload
  })
}
