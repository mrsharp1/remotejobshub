import { Component, ReactNode } from 'react';

// Simple error boundary that catches render errors and displays a minimal UI.
export class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red', zIndex: 9999, position: 'relative', background: 'white' }}>
          <h1>Error</h1>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

