import type { IconProps } from "./types";

export function Sun({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.25 1.25V3.25M12.25 21.25V23.25M4.47 4.47L5.89 5.89M18.61 18.61L20.03 20.03M1.25 12.25H3.25M21.25 12.25H23.25M4.47 20.03L5.89 18.61M18.61 5.89L20.03 4.47M17.25 12.25C17.25 15.0114 15.0114 17.25 12.25 17.25C9.48858 17.25 7.25 15.0114 7.25 12.25C7.25 9.48858 9.48858 7.25 12.25 7.25C15.0114 7.25 17.25 9.48858 17.25 12.25Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
