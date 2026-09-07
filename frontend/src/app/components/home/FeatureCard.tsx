type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 transition hover:-translate-y-1 hover:border-gray-700">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-sm font-semibold">
        ✓
      </div>

      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <p className="mt-3 leading-7 text-gray-400">{description}</p>
    </div>
  );
}
