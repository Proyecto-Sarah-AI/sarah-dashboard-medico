
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
  invertTrendColor?: boolean // When true, down is good (green) and up is bad (red)
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon,
  variant = "default",
  invertTrendColor = false
}: KPICardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/50",
    warning: "border-warning/50",
    danger: "border-destructive/50"
  }

  const trendIcon = {
    up: <TrendingUp className="h-3 w-3" />,
    down: <TrendingDown className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />
  }

  const trendColor = invertTrendColor 
    ? {
        up: "text-destructive",
        down: "text-success",
        neutral: "text-muted-foreground"
      }
    : {
        up: "text-success",
        down: "text-destructive",
        neutral: "text-muted-foreground"
      }

  return (
    <Card className={cn("bg-card border", variantStyles[variant])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className={cn("flex items-center gap-1 text-xs", trendColor[trend])}>
                {trendIcon[trend]}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
