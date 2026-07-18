import type { IconProps } from "./types";

export function Mail({ size = 23, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.25 3.25C21.25 2.15 20.35 1.25 19.25 1.25H3.25C2.15 1.25 1.25 2.15 1.25 3.25M21.25 3.25V15.25C21.25 16.35 20.35 17.25 19.25 17.25H3.25C2.15 17.25 1.25 16.35 1.25 15.25V3.25M21.25 3.25L11.25 10.25L1.25 3.25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
