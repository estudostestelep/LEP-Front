import React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--background)] [border-radius:var(--border-radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
          className,
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          <div className="absolute inset-0 h-[100cqh] animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent [aspect-ratio:1] [border-radius:0] [mask:none] "></div>
        </div>

        <div className="z-10 flex items-center justify-center gap-2">
          {children}
        </div>

        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;