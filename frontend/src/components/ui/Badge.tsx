type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
};

const variants = {
  default: "bg-gray-800 text-gray-300",
  success: "bg-green-500/10 text-green-400",
  warning: "bg-yellow-500/10 text-yellow-400",
  danger: "bg-red-500/10 text-red-400",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
