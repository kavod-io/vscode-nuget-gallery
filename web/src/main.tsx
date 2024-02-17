import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { registerMockVsCodeApi } from './mockVsCodeApi'
import { ErrorBoundary } from 'react-error-boundary'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const windowAny = window as any
if (!windowAny.vscode) {
  try {
    windowAny.vscode = acquireVsCodeApi()
  } catch {
    console.log(
      'Failed calling acquireVsCodeApi, probably running outside of VS Code.  Using mock instead'
    )
    registerMockVsCodeApi()
  }
}

const queryClient = new QueryClient()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fallbackRender = ({ error }: { error: any }) => {
  console.error({ message: 'failed to render', error })

  return (
    <div role="alert">
      <p>
        You're a developer, you've seen this before. Stay calm and re-open the tab. If you can
        reproduce this error, raise an issue on Github.
      </p>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={fallbackRender}>
      <QueryClientProvider client={queryClient}>
        <App vscode={windowAny.vscode} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
