import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Salesperson {
  id: string;
  name: string;
  avatar?: string;
  isAvailable: boolean;
  currentCustomers: number;
  totalSalesToday: number;
  averageServiceTime: number;
  position: number;
}

interface QueueCardProps {
  salesperson: Salesperson;
  onToggleAvailability: (id: string) => void;
  onStartService: (id: string) => void;
}

export const QueueCard = ({ salesperson, onToggleAvailability, onStartService }: QueueCardProps) => {
  const initials = salesperson.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card className={cn(
      "card-shadow-hover",
      salesperson.isAvailable ? "border-primary/20" : "border-muted/30"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={salesperson.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                salesperson.isAvailable ? "bg-green-500" : "bg-gray-400"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{salesperson.name}</h3>
              <Badge 
                variant={salesperson.isAvailable ? "default" : "secondary"}
                className="text-xs"
              >
                Posição #{salesperson.position}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">R$ {salesperson.totalSalesToday}</p>
            <p className="text-xs text-muted-foreground">vendas hoje</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{salesperson.currentCustomers} atendendo</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{salesperson.averageServiceTime}min médio</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={salesperson.isAvailable ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggleAvailability(salesperson.id)}
            className="flex-1"
          >
            {salesperson.isAvailable ? "Sair da Fila" : "Entrar na Fila"}
          </Button>
          
          {salesperson.isAvailable && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onStartService(salesperson.id)}
              className="flex-1"
            >
              Iniciar Atendimento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};