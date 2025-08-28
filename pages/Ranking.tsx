import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

// Página simples para não quebrar enquanto ajustamos layout completo
export default function Ranking() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Star className="h-5 w-5 text-yellow-500" /> Ranking de Vendedores
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-bold">R$ 0,00</p>
          <Progress value={0} />
        </CardContent>
      </Card>
    </div>
  );
}
