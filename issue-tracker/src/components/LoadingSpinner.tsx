export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div
        className="size-8 animate-spin rounded-full border-4 border-zinc-700 border-t-indigo-500"
        aria-label="Loading"
      />
    </div>
  );
}