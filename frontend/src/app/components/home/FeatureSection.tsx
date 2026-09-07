import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Track Issues",
    description:
      "Create, prioritize, assign, and track issues from open to resolved.",
  },
  {
    title: "Manage Projects",
    description:
      "Keep issues organized by project and give your team a clear view of ongoing work.",
  },
  {
    title: "Work Together",
    description:
      "Assign issues to team members and keep project progress visible to everyone.",
  },
];

export default function FeatureSection() {
  return (
    <section className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Everything you need
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Keep your development work organized
          </h2>

          <p className="mt-4 text-gray-400">
            A focused workspace for managing issues and keeping projects moving
            forward.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
