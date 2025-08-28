import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, X, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Motivo {
  id: string;
  nome: string;
  descricao: string;
  tipo: "positivo" | "negativo" | "neutro";
  ativo: boolean;
}

export default function CadastrarMotivos() {
  const { toast } = useToast();
  const [motivos, setMotivos] = useState<Motivo[]>([
    { id: "1", nome: "Venda Convertida", descricao: "Cliente realizou compra", tipo: "positivo", ativo: true },
    { id: "2", nome: "Venda Perdida", descricao: "Cliente não realizou compra", tipo: "negativo", ativo: true },
    { id: "3", nome: "Troca de Produto", descricao: "Cliente veio realizar troca", tipo: "neutro", ativo: true },
    { id: "4", nome: "Apenas Informação", descricao: "Cliente só pediu informações", tipo: "neutro", ativo: true },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMotivo, setEditingMotivo] = useState<Motivo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "neutro" as Motivo["tipo"],
    ativo: true,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [motivoToDelete, setMotivoToDelete] = useState<Motivo | null>(null);

  // Função de filtro otimizada
  const filteredMotivos = useMemo(() => {
    if (!searchTerm.trim()) return motivos;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return motivos.filter(motivo => {
      // Busca no nome (mínimo 2 caracteres para evitar matches muito amplos)
      if (searchLower.length >= 2 && motivo.nome.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca exata no início do nome (permite 1 caracter)
      if (motivo.nome.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      // Busca na descrição
      if (motivo.descricao.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no tipo
      if (motivo.tipo.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no status
      const status = motivo.ativo ? "ativo" : "inativo";
      if (status.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [motivos, searchTerm]);

  const handleSave = () => {
    if (!formData.nome || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingMotivo) {
      // Editando motivo existente
      setMotivos(prev => prev.map(motivo => 
        motivo.id === editingMotivo.id 
          ? { ...motivo, ...formData }
          : motivo
      ));
      toast({
        title: "Sucesso",
        description: "Motivo atualizado com sucesso",
      });
    } else {
      // Criando novo motivo
      const novoMotivo: Motivo = {
        id: Date.now().toString(),
        ...formData,
      };
      setMotivos(prev => [...prev, novoMotivo]);
      toast({
        title: "Sucesso",
        description: "Motivo cadastrado com sucesso",
      });
    }

    setIsDialogOpen(false);
    setEditingMotivo(null);
    setFormData({ nome: "", descricao: "", tipo: "neutro", ativo: true });
  };

  const handleEdit = (motivo: Motivo) => {
    setEditingMotivo(motivo);
    setFormData({
      nome: motivo.nome,
      descricao: motivo.descricao,
      tipo: motivo.tipo,
      ativo: motivo.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (motivo: Motivo) => {
    setMotivoToDelete(motivo);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (motivoToDelete) {
      setMotivos(prev => prev.filter(motivo => motivo.id !== motivoToDelete.id));
      toast({
        title: "Sucesso",
        description: "Motivo removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setMotivoToDelete(null);
    }
  };

  const handleNewMotivo = () => {
    setEditingMotivo(null);
    setFormData({ nome: "", descricao: "", tipo: "neutro", ativo: true });
    setIsDialogOpen(true);
  };

  const getTipoBadgeVariant = (tipo: Motivo["tipo"]) => {
    switch (tipo) {
      case "positivo":
        return "default";
      case "negativo":
        return "destructive";
      case "neutro":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Motivos e Sub-motivos</h1>
        </div>
        <Button onClick={handleNewMotivo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Motivo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Campo de busca */}
            <div className="relative max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, descrição, tipo, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredMotivos.length} de {motivos.length} motivos
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMotivos.map((motivo) => (
                <TableRow key={motivo.id}>
                  <TableCell className="font-medium">{motivo.nome}</TableCell>
                  <TableCell>{motivo.descricao}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoBadgeVariant(motivo.tipo)}>
                      {motivo.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={motivo.ativo ? "default" : "secondary"}>
                      {motivo.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(motivo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(motivo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para criar/editar motivo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMotivo ? "Editar Motivo" : "Novo Motivo"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Motivo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Venda Convertida"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o motivo..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: Motivo["tipo"]) => 
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positivo">Positivo</SelectItem>
                  <SelectItem value="negativo">Negativo</SelectItem>
                  <SelectItem value="neutro">Neutro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="ativo">Motivo ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingMotivo ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o motivo "{motivoToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
