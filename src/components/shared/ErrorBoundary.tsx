import { Component, ErrorInfo, ReactNode } from 'react'
interface Props {
  children?: ReactNode
}
interface State {
  hasError: boolean
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in boundary:', error, errorInfo)
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-destructive">
            Something went wrong.
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
