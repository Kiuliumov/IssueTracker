type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-800 bg-gray-900 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}