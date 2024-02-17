import * as vscode from 'vscode'
import { Command } from './contracts'
import { addPackage, loadProjects, removePackage } from './parseProject'
import { TaskManager } from './taskManager'
import { loadSources, logger, postMessage } from './utilities'

export const createMessageHandler =
  (panel: vscode.WebviewPanel, taskManager: TaskManager) => async (message: Command) => {
    logger(`message received ${message.command}`)
    switch (message.command) {
      case 'reloadProjects':
        // TODO load projects from multiple providers.
        const projects = await loadProjects()
        postMessage(panel, {
          command: 'setProjects',
          payload: projects.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
        })
        break

      case 'reloadSources':
        loadSources(panel)
        break

      case 'add': {
        const tasks = addPackage(message)
        taskManager.addTasks(tasks)
        break
      }

      case 'remove': {
        const tasks = removePackage(message)
        taskManager.addTasks(tasks)
        break
      }

      default:
        break
    }
  }
