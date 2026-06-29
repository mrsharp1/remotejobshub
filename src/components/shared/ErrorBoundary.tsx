import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, errorMessage: '' }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown error' }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' })
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. This has been logged. You can try
            reloading the page or going back to the home page.
          </p>
          {this.state.errorMessage && (
            <code className="mt-4 block max-w-sm rounded-lg bg-muted px-4 py-2 text-xs text-destructive">
              {this.state.errorMessage}
            </code>
          )}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="hover:bg-primary/90 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition"
            >
              <Home className="h-4 w-4" />
              Go to Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
