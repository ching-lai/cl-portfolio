import type { IconProps } from "./types";

export function ChevDown({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={typeof size === "number" ? (size * 14) / 24 : size}
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.75 1.75L11.75 11.75L21.75 1.75"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
