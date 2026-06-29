import { Component, ErrorInfo, ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-6 text-center">
          <div className="bg-destructive/15 rounded-full p-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="max-w-xs text-xs text-muted-foreground">
            We encountered an unexpected interface error. Please refresh the
            page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Reload Application
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
