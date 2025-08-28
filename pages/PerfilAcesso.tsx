import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Plus, Shield, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface MenuPermission {
  id: string;
  label: string;
  description: string;
}

interface PerfilAcesso {
  id: string;
  nome: string;
  descricao: string;
  permissoes: string[]; // IDs dos menus permitidos
  ativo: boolean;
  criadoEm: string;
}

const menuOptions: MenuPermission[] = [
  { id: "dashboard", label: "Dashboard", description: "Visão geral e métricas" },
  { id: "queue", label: "Fila de Atendimento", description: "Gerenciar fila de vendedores" },
  { id: "attendance", label: "Atendimentos", description: "Histórico de atendimentos" },
  { id: "ranking", label: "Ranking", description: "Ranking de vendedores" },
  { id: "goals", label: "Metas", description: "Gerenciar metas de vendas" },
  { id: "reports", label: "Relatórios", description: "Relatórios e análises" },
  { id: "settings", label: "Configurações", description: "Configurações do sistema" },
  { id: "cadastrar-lojas", label: "Cadastrar Lojas", description: "Gerenciar lojas" },
  { id: "cadastrar-motivos", label: "Cadastrar Motivos", description: "Gerenciar motivos de atendimento" },
];

export default function PerfilAcesso() {
  const { toast } = useToast();
  const [perfis, setPerfis] = useState<PerfilAcesso[]>([
    {
      id: "1",
      nome: "Administrador",
      descricao: "Acesso completo ao sistema",
      permissoes: menuOptions.map(m => m.id),
      ativo: true,
      criadoEm: "2024-01-15",
    },
    {
      id: "2",
      nome: "Vendedor",
      descricao: "Acesso limitado para vendedores",
      permissoes: ["dashboard", "queue", "ranking"],
      ativo: true,
      criadoEm: "2024-01-16",
    },
    {
      id: "3",
      nome: "Supervisor",
      descricao: "Acesso intermediário para supervisores",
      permissoes: ["dashboard", "queue", "attendance", "ranking", "reports"],
      ativo: true,
      criadoEm: "2024-01-17",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<PerfilAcesso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    permissoes: [] as string[],
    ativo: true,
  });

  // Função de filtro otimizada
  const filteredPerfis = useMemo(() => {
    if (!searchTerm.trim()) return perfis;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return perfis.filter(perfil => {
      // Busca no nome (mínimo 2 caracteres para evitar matches muito amplos)
      if (searchLower.length >= 2 && perfil.nome.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca exata no início do nome (permite 1 caracter)
      if (perfil.nome.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      // Busca na descrição
      if (perfil.descricao.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no status
      const status = perfil.ativo ? "ativo" : "inativo";
      if (status.includes(searchLower)) {
        return true;
      }
      
      // Busca nas permissões
      const permissaoLabels = menuOptions
        .filter(menu => perfil.permissoes.includes(menu.id))
        .map(menu => menu.label.toLowerCase())
        .join(" ");
      if (permissaoLabels.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [perfis, searchTerm]);

  const handleSave = () => {
    if (!formData.nome || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (formData.permissoes.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma permissão",
        variant: "destructive",
      });
      return;
    }

    if (editingPerfil) {
      // Editando perfil existente
      setPerfis(prev => prev.map(perfil => 
        perfil.id === editingPerfil.id 
          ? { ...perfil, ...formData }
          : perfil
      ));
      toast({
        title: "Sucesso",
        description: "Perfil de acesso atualizado com sucesso",
      });
    } else {
      // Criando novo perfil
      const novoPerfil: PerfilAcesso = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      setPerfis(prev => [...prev, novoPerfil]);
      toast({
        title: "Sucesso",
        description: "Perfil de acesso criado com sucesso",
      });
    }

    setIsDialogOpen(false);
    setEditingPerfil(null);
    setFormData({ nome: "", descricao: "", permissoes: [], ativo: true });
  };

  const handleEdit = (perfil: PerfilAcesso) => {
    setEditingPerfil(perfil);
    setFormData({
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: [...perfil.permissoes],
      ativo: perfil.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPerfis(prev => prev.filter(perfil => perfil.id !== id));
    toast({
      title: "Sucesso",
      description: "Perfil de acesso removido com sucesso",
    });
  };

  const handleNewPerfil = () => {
    setEditingPerfil(null);
    setFormData({ nome: "", descricao: "", permissoes: [], ativo: true });
    setIsDialogOpen(true);
  };

  const handlePermissionChange = (menuId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: checked
        ? [...prev.permissoes, menuId]
        : prev.permissoes.filter(id => id !== menuId)
    }));
  };

  const getPermissionLabels = (permissoes: string[]) => {
    return menuOptions
      .filter(menu => permissoes.includes(menu.id))
      .map(menu => menu.label)
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Perfil de Acesso</h1>
        </div>
        <Button onClick={handleNewPerfil}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Campo de busca */}
            <div className="relative max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, descrição, permissões, status..."
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
                {filteredPerfis.length} de {perfis.length} perfis
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
                <TableHead>Permissões</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPerfis.map((perfil) => (
                <TableRow key={perfil.id}>
                  <TableCell className="font-medium">{perfil.nome}</TableCell>
                  <TableCell>{perfil.descricao}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <span className="text-sm text-muted-foreground">
                        {getPermissionLabels(perfil.permissoes)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={perfil.ativo ? "default" : "secondary"}>
                      {perfil.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(perfil.criadoEm).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(perfil)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(perfil.id)}
                        disabled={perfil.nome === "Administrador"} // Protege perfil admin
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

      {/* Dialog para criar/editar perfil */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPerfil ? "Editar Perfil de Acesso" : "Novo Perfil de Acesso"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Perfil *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Vendedor, Supervisor, Gerente"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o perfil e suas responsabilidades..."
                rows={3}
              />
            </div>

            <div className="grid gap-4">
              <Label>Permissões de Menu *</Label>
              <div className="border rounded-lg p-4 space-y-4 max-h-64 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="select-all"
                    checked={formData.permissoes.length === menuOptions.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, permissoes: menuOptions.map(m => m.id) }));
                      } else {
                        setFormData(prev => ({ ...prev, permissoes: [] }));
                      }
                    }}
                  />
                  <Label htmlFor="select-all" className="font-medium">
                    Selecionar Todos
                  </Label>
                </div>
                
                {menuOptions.map((menu) => (
                  <div key={menu.id} className="flex items-start space-x-3 p-2 rounded border-l-2 border-l-primary/20">
                    <Checkbox
                      id={menu.id}
                      checked={formData.permissoes.includes(menu.id)}
                      onCheckedChange={(checked) => handlePermissionChange(menu.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={menu.id} className="font-medium cursor-pointer">
                        {menu.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {menu.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked as boolean }))}
              />
              <Label htmlFor="ativo">Perfil ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingPerfil ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
