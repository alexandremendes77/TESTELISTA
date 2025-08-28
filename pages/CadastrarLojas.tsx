import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus, Search, X, Store } from "lucide-react";
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

interface Loja {
  id: string;
  codigo: string;
  nome: string;
}

export default function CadastrarLojas() {
  const { toast } = useToast();
  const [lojas, setLojas] = useState<Loja[]>([
    { id: "1", codigo: "001", nome: "Loja Centro" },
    { id: "2", codigo: "002", nome: "Loja Shopping" },
    { id: "3", codigo: "003", nome: "Loja Norte" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoja, setEditingLoja] = useState<Loja | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ codigo: "", nome: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lojaToDelete, setLojaToDelete] = useState<Loja | null>(null);

  // Função de filtro otimizada
  const filteredLojas = useMemo(() => {
    if (!searchTerm.trim()) return lojas;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return lojas.filter(loja => {
      // Busca no código (permite busca exata)
      if (loja.codigo.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no nome (mínimo 2 caracteres para evitar matches muito amplos)
      if (searchLower.length >= 2 && loja.nome.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca exata no início do nome (permite 1 caracter)
      if (loja.nome.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [lojas, searchTerm]);

  const handleSave = () => {
    if (!formData.codigo || !formData.nome) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingLoja) {
      // Editando loja existente
      setLojas(prev => prev.map(loja => 
        loja.id === editingLoja.id 
          ? { ...loja, codigo: formData.codigo, nome: formData.nome }
          : loja
      ));
      toast({
        title: "Sucesso",
        description: "Loja atualizada com sucesso",
      });
    } else {
      // Criando nova loja
      const novaLoja: Loja = {
        id: Date.now().toString(),
        codigo: formData.codigo,
        nome: formData.nome,
      };
      setLojas(prev => [...prev, novaLoja]);
      toast({
        title: "Sucesso",
        description: "Loja cadastrada com sucesso",
      });
    }

    setIsDialogOpen(false);
    setEditingLoja(null);
    setFormData({ codigo: "", nome: "" });
  };

  const handleEdit = (loja: Loja) => {
    setEditingLoja(loja);
    setFormData({ codigo: loja.codigo, nome: loja.nome });
    setIsDialogOpen(true);
  };

  const handleDelete = (loja: Loja) => {
    setLojaToDelete(loja);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (lojaToDelete) {
      setLojas(prev => prev.filter(loja => loja.id !== lojaToDelete.id));
      toast({
        title: "Sucesso",
        description: "Loja removida com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setLojaToDelete(null);
    }
  };

  const handleNewLoja = () => {
    setEditingLoja(null);
    setFormData({ codigo: "", nome: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Lojas</h1>
        </div>
        <Button onClick={handleNewLoja}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Loja
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Campo de busca */}
            <div className="relative max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código ou nome da loja..."
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
                {filteredLojas.length} de {lojas.length} lojas
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome da Loja</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLojas.map((loja) => (
                <TableRow key={loja.id}>
                  <TableCell className="font-mono">{loja.codigo}</TableCell>
                  <TableCell>{loja.nome}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(loja)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(loja)}
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

      {/* Dialog para criar/editar loja */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLoja ? "Editar Loja" : "Nova Loja"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código da Loja *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Ex: 001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Loja *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Loja Centro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingLoja ? "Atualizar" : "Salvar"}
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
              Tem certeza que deseja excluir a loja "{lojaToDelete?.nome}" (código: {lojaToDelete?.codigo})?
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
