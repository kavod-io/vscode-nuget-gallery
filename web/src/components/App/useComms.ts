/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from 'react'
import { WebviewApi } from 'vscode-webview'
import { PackageInfo } from '../../clients/nuget'
import { Command, Message, PackageSource, Project } from '../../contracts'

export const useComms = (vscode: WebviewApi<unknown>) => {
  const [nugetSources, setNugetSources] = useState<PackageSource[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<Message>) => {
      // if ('data' in event && "command" in event.data) {
      //   console.log(event)
      // }
      switch (event.data.command) {
        case 'setProjects':
          setProjects(event.data.payload)
          break
        case 'setSources':
          setNugetSources(event.data.payload)
          break
      }
    })

    return () => {
      // TODO figure out how to unregister the listener.
    }
  }, [])

  const postCommand = useCallback(
    (command: Command) => {
      vscode.postMessage(command)
    },
    [vscode]
  )

  const requestReloadProjects = useCallback(() => {
    postCommand({
      command: 'reloadProjects'
    })
  }, [postCommand])

  const requestInstall = (
    pack: PackageInfo,
    projects: Project[],
    version: string,
    source: string
  ) => {
    postCommand({
      command: 'add',
      projects,
      packageId: pack.id,
      version,
      source
    })
  }

  const requestUninstall = (pack: PackageInfo, projects: Project[]) => {
    postCommand({
      command: 'remove',
      projects,
      packageId: pack.id
    })
  }

  const requestReloadSources = useCallback(() => {
    postCommand({
      command: 'reloadSources'
    })
  }, [postCommand])

  return {
    projects,
    nugetSources,
    requestReloadProjects,
    requestInstall,
    requestUninstall,
    requestReloadSources
  }
}
