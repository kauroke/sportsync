import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  textClassName?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  darkMode?: boolean
}

export function Logo({ className, textClassName, size = "md", showText = true, darkMode = false }: LogoProps) {
  // Size mappings
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon - Tennis ball with connection element */}
      <div className={cn("relative overflow-hidden rounded-md", sizes[size])}>
        {/* Tennis ball base */}
        <div className="absolute inset-0 bg-[#FFFF00] rounded-full"></div>

        {/* Tennis ball curve line */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(45deg, transparent 40%, #4CAF50 40%, #4CAF50 60%, transparent 60%)",
            transform: "rotate(-15deg)",
          }}
        ></div>

        {/* Connection element - overlapping circle */}
        <div
          className="absolute rounded-full bg-[#4CAF50]"
          style={{
            width: "70%",
            height: "70%",
            bottom: "-10%",
            right: "-10%",
            opacity: 0.9,
          }}
        ></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={cn(textSizes[size], "font-bold", darkMode ? "text-white" : "text-gray-900", textClassName)}>
          court
        </span>
      )}
    </div>
  )
}

