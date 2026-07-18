import type { IconProps } from "./types";

export function ClLogo({ size = 32, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={typeof size === "number" ? (size * 28) / 32 : size}
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 23H32V28H14C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0H21V23Z"
        fill="currentColor"
      />
    </svg>
  );
}
