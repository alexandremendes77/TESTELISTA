import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard = ({ title, value, icon: Icon, trend, className }: MetricCardProps) => {
  return (
    <Card className={cn("card-shadow-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
           <div className="text-xs text-muted-foreground">
            <Badge 
              className={cn(
                "text-xs",
                trend.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};