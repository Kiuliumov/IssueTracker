import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-800/80 p-8 shadow-2xl sm:p-10">
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mt-3 text-center text-sm text-zinc-400">
              {description}
            </p>
          </div>

          {children}

          <div className="mt-8 text-center text-sm text-zinc-400">{footer}</div>
        </div>
      </div>
    </main>
  );
}
