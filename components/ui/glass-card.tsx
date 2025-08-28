import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "primary" | "accent" | "success" | "none";
}

export const GlassCard = ({ children, className, glow = "none" }: GlassCardProps) => {
  const glowClasses = {
    primary: "shadow-glow-primary",
    accent: "shadow-glow-accent", 
    success: "shadow-glow-success",
    none: ""
  };

  return (
    <div 
      className={cn(
        "glass rounded-lg p-6 transition-smooth hover:scale-[1.02]",
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
};