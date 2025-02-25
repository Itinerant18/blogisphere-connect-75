import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 border border-red-300 rounded bg-red-50">
      <h2 className="text-lg font-bold text-red-800">Something went wrong</h2>
      <p className="text-red-700 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
      >
        Try again
      </button>
    </div>
  );
} 