import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

export function PhoneFrame({
  src,
  width,
  height,
  alt,
  sizes,
  preload = false,
  className = "",
}: PhoneFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border-[6px] border-ink bg-ink ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        preload={preload}
        className="block h-auto w-full rounded-[1.3rem]"
      />
    </div>
  );
}
