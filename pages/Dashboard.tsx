import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  BarChart3,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  // Dados mockados
  const metrics = [
    {
      title: "Vendas Hoje",
      value: "R$ 12.450",
      icon: DollarSign,
      trend: { value: 15.2, isPositive: true },
    },
    {
      title: "Atendimentos",
      value: "45",
      icon: Users,
      trend: { value: 8.1, isPositive: true },
    },
    {
      title: "Conversões",
      value: "32",
      icon: CheckCircle,
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "Ticket Médio",
      value: "R$ 389",
      icon: TrendingUp,
      trend: { value: 5.3, isPositive: false },
    }
  ];

  const alerts = [
    {
      type: "warning" as const,
      title: "Meta Diária",
      message: "Faltam R$ 2.550 para atingir a meta do dia"
    },
    {
      type: "success" as const,
      title: "Vendedor Destaque",
      message: "João Silva lidera com 8 vendas hoje"
    },
    {
      type: "info" as const,
      title: "Fila de Atendimento",
      message: "3 vendedores disponíveis na fila"
    }
  ];

  const recentSales = [
    { id: 1, customer: "Maria Santos", salesperson: "João Silva", value: 450, time: "14:30" },
    { id: 2, customer: "Carlos Oliveira", salesperson: "Ana Costa", value: 280, time: "14:15" },
    { id: 3, customer: "Fernanda Lima", salesperson: "Pedro Rocha", value: 650, time: "14:00" }
  ];

  const AlertIcon = ({ type }: { type: 'warning' | 'success' | 'info' }) => {
    switch (type) {
      case 'warning':
        return <span className="text-xs font-bold text-red-600 bg-red-100 rounded-full px-2 py-1">⚠️</span>;
      case 'success':
        return <span className="text-xs font-bold text-green-600 bg-green-100 rounded-full px-2 py-1">✔️</span>;
      case 'info':
        return <span className="text-xs font-bold text-blue-600 bg-blue-100 rounded-full px-2 py-1">ℹ️</span>;
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard - Visão Geral
        </h1>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <DatePickerWithRange />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="store">Loja</Label>
            <Select>
              <SelectTrigger className="w-[200px]">
                <Store className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Selecionar loja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as lojas</SelectItem>
                <SelectItem value="loja-1">Loja Centro</SelectItem>
                <SelectItem value="loja-2">Loja Shopping</SelectItem>
                <SelectItem value="loja-3">Loja Norte</SelectItem>
                <SelectItem value="loja-4">Loja Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

             {/* Alerts and Recent Sales */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="card-shadow-hover">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <AlertTriangle className="h-5 w-5" />
               Alertas
             </CardTitle>
           </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <AlertIcon type={alert.type} />
              </div>
            ))}
          </CardContent>
        </Card>

                 <Card className="card-shadow-hover">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               Vendas Recentes
             </CardTitle>
           </CardHeader>
          <CardContent className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{sale.customer}</h3>
                  <p className="text-sm text-muted-foreground">{sale.salesperson}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {sale.value}</p>
                  <p className="text-sm text-muted-foreground">{sale.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

             {/* Quick Actions */}
       <Card className="card-shadow hover:card-shadow-hover transition-shadow duration-300">
         <CardHeader>
             <CardTitle>Ações Rápidas</CardTitle>
         </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <Button variant="outline" className="flex flex-col h-24 justify-center items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Novo Atendimento</span>
           </Button>
           <Button variant="outline" className="flex flex-col h-24 justify-center items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span>Relatórios</span>
           </Button>
           <Button variant="outline" className="flex flex-col h-24 justify-center items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <span>Histórico</span>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;