import { Command, Message } from './contracts'

export const registerMockVsCodeApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowAny = window as any

  windowAny.vscode = {
    postMessage: (message: Command) => {
      console.log({ text: 'mock VS Code API called', message })
      switch (message.command) {
        case 'reloadSources':
          dispatchSetSourcesEvent()
          break

        case 'reloadProjects':
          dispatchSetProjectsEvent()
          break

        default:
          break
      }
    }
  }
}

const dispatchSetSourcesEvent = () => {
  dispatchCustomEvent({
    command: 'setSources',
    payload: [
      {
        name: 'Nuget.org',
        url: 'https://api.nuget.org/v3/index.json',
        credentials: null
      },
      {
        name: 'Other',
        url: 'TODO',
        credentials: {
          username: '',
          password: ''
        }
      }
    ]
  })
}

const dispatchSetProjectsEvent = () => {
  dispatchCustomEvent({
    command: 'setProjects',
    payload: [
      {
        projectName: 'My Project',
        path: 'c:/users/loser',
        packages: []
      },
      {
        projectName: 'My Project',
        path: 'c:/users/loser',
        packages: []
      },
      {
        projectName: 'My Project',
        path: 'c:/users/loser',
        packages: []
      },
      {
        projectName: 'My Project',
        path: 'c:/users/loser',
        packages: []
      }
    ]
  })
}

const dispatchCustomEvent = (payload: Message) => {
  const event = new CustomEvent('message')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(event as any).data = payload
  window.dispatchEvent(event)
}
