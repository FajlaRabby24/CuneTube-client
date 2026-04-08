import Image from "next/image";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/auth_bg.webp"
        alt="Movie background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
    </div>
  );
}
