type AvatarProps = {
  name: string;
  size?: "sm" | "md";
};

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();

  const sizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-indigo-500 font-semibold text-white ${sizes[size]}`}
    >
      {initials}
    </div>
  );
}