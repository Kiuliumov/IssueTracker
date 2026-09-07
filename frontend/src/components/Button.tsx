import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({
  href,
  children,
  variant = "primary",
}: ButtonProps) {
  const baseStyles = "rounded-lg px-7 py-3.5 text-sm font-semibold transition";

  const variantStyles = {
    primary: "bg-white text-gray-950 hover:bg-gray-200",
    secondary:
      "border border-gray-700 text-white hover:border-gray-600 hover:bg-gray-900",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </Link>
  );
}
