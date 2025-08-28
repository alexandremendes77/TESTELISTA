import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, Plus, Building, Search, X, Upload, Eye } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface Empresa {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  website?: string;
  descricao?: string;
  logo?: string;
  ativo: boolean;
  criadoEm: string;
}

// Dados mockados das empresas
const empresasMock: Empresa[] = [
  {
    id: "1",
    nomeFantasia: "HAASS Tecnologia",
    razaoSocial: "HAASS Tecnologia Ltda",
    cnpj: "12.345.678/0001-90",
    inscricaoEstadual: "123.456.789.123",
    inscricaoMunicipal: "123456789",
    email: "contato@haass.com.br",
    telefone: "(11) 3333-4444",
    endereco: "Rua das Flores, 123 - Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    website: "https://www.haass.com.br",
    descricao: "Empresa especializada em soluções tecnológicas para varejo",
    logo: "https://via.placeholder.com/100x100?text=HAASS",
    ativo: true,
    criadoEm: "2024-01-01",
  },
  {
    id: "2",
    nomeFantasia: "TechSolutions",
    razaoSocial: "TechSolutions Sistemas Ltda",
    cnpj: "98.765.432/0001-10",
    inscricaoEstadual: "987.654.321.987",
    inscricaoMunicipal: "987654321",
    email: "info@techsolutions.com.br",
    telefone: "(11) 5555-6666",
    endereco: "Av. Paulista, 1000 - Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    website: "https://www.techsolutions.com.br",
    descricao: "Desenvolvimento de software e consultoria em TI",
    ativo: true,
    criadoEm: "2024-01-15",
  },
];

export default function CadastroEmpresa() {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    website: "",
    descricao: "",
    logo: "",
    ativo: true,
  });

  // Função de filtro otimizada
  const filteredEmpresas = useMemo(() => {
    if (!searchTerm.trim()) return empresas;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return empresas.filter(empresa => {
      // Busca no nome fantasia
      if (searchLower.length >= 2 && empresa.nomeFantasia.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca na razão social
      if (empresa.razaoSocial.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no CNPJ
      const cnpjNumbers = empresa.cnpj.replace(/\D/g, '');
      const searchNumbers = searchTerm.replace(/\D/g, '');
      if (searchNumbers.length >= 3 && cnpjNumbers.includes(searchNumbers)) {
        return true;
      }
      
      // Busca no email
      if (empresa.email.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca na cidade
      if (empresa.cidade.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no estado
      if (empresa.estado.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no status
      const status = empresa.ativo ? "ativo" : "inativo";
      if (status.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [empresas, searchTerm]);

  // Função para formatar CNPJ
  const formatCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    return numbers.slice(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  // Função para formatar CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return numbers.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
  };

  const handleCnpjChange = (value: string) => {
    const formattedCnpj = formatCnpj(value);
    setFormData(prev => ({ ...prev, cnpj: formattedCnpj }));
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value);
    setFormData(prev => ({ ...prev, cep: formattedCep }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Apenas arquivos de imagem são permitidos",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.nomeFantasia || !formData.razaoSocial || !formData.cnpj || !formData.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validar se email é válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Digite um email válido",
        variant: "destructive",
      });
      return;
    }

    // Validar CNPJ
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      toast({
        title: "Erro",
        description: "Digite um CNPJ válido",
        variant: "destructive",
      });
      return;
    }

    // Validar se CNPJ já existe (exceto quando editando a mesma empresa)
    const cnpjExists = empresas.some(e => 
      e.cnpj === formData.cnpj && e.id !== editingEmpresa?.id
    );
    if (cnpjExists) {
      toast({
        title: "Erro",
        description: "Este CNPJ já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    if (editingEmpresa) {
      // Editando empresa existente
      setEmpresas(prev => prev.map(empresa => 
        empresa.id === editingEmpresa.id 
          ? { ...empresa, ...formData }
          : empresa
      ));
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso",
      });
    } else {
      // Criando nova empresa
      const novaEmpresa: Empresa = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
      };
      setEmpresas(prev => [...prev, novaEmpresa]);
      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso",
      });
    }

    setIsDialogOpen(false);
    setEditingEmpresa(null);
    setLogoPreview(null);
    setFormData({ 
      nomeFantasia: "", razaoSocial: "", cnpj: "", inscricaoEstadual: "", 
      inscricaoMunicipal: "", email: "", telefone: "", endereco: "", 
      cidade: "", estado: "", cep: "", website: "", descricao: "", 
      logo: "", ativo: true 
    });
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nomeFantasia: empresa.nomeFantasia,
      razaoSocial: empresa.razaoSocial,
      cnpj: empresa.cnpj,
      inscricaoEstadual: empresa.inscricaoEstadual,
      inscricaoMunicipal: empresa.inscricaoMunicipal,
      email: empresa.email,
      telefone: empresa.telefone,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      cep: empresa.cep,
      website: empresa.website || "",
      descricao: empresa.descricao || "",
      logo: empresa.logo || "",
      ativo: empresa.ativo,
    });
    setLogoPreview(empresa.logo || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setEmpresaToDelete(empresa);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (empresaToDelete) {
      setEmpresas(prev => prev.filter(empresa => empresa.id !== empresaToDelete.id));
      toast({
        title: "Sucesso",
        description: "Empresa removida com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setEmpresaToDelete(null);
    }
  };

  const handleNewEmpresa = () => {
    setEditingEmpresa(null);
    setLogoPreview(null);
    setFormData({ 
      nomeFantasia: "", razaoSocial: "", cnpj: "", inscricaoEstadual: "", 
      inscricaoMunicipal: "", email: "", telefone: "", endereco: "", 
      cidade: "", estado: "", cep: "", website: "", descricao: "", 
      logo: "", ativo: true 
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Empresas</h1>
        </div>
        <Button onClick={handleNewEmpresa}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, razão social, CNPJ, cidade, estado..."
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
                {filteredEmpresas.length} de {empresas.length} empresas
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? `Nenhuma empresa encontrada para "${searchTerm}"`
                          : "Nenhuma empresa cadastrada"
                        }
                      </p>
                      {searchTerm && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                        >
                          Limpar busca
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={empresa.logo} />
                        <AvatarFallback>
                          <Building className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{empresa.nomeFantasia}</div>
                        <div className="text-sm text-muted-foreground">{empresa.razaoSocial}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{empresa.cnpj}</TableCell>
                  <TableCell>{empresa.email}</TableCell>
                  <TableCell>{empresa.cidade}/{empresa.estado}</TableCell>
                  <TableCell>
                    <Badge variant={empresa.ativo ? "default" : "secondary"}>
                      {empresa.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(empresa)}
                        title="Editar Empresa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(empresa)}
                        title="Excluir Empresa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para criar/editar empresa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da empresa. Campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Logo Upload */}
            <div className="grid gap-2">
              <Label>Logo da Empresa</Label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={logoPreview || formData.logo} />
                    <AvatarFallback>
                      <Building className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="w-fit"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                <Input
                  id="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                  placeholder="HAASS Tecnologia"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                  placeholder="HAASS Tecnologia Ltda"
                />
              </div>
            </div>

            {/* Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleCnpjChange(e.target.value)}
                  placeholder="12.345.678/0001-90"
                  maxLength={18}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => setFormData(prev => ({ ...prev, inscricaoEstadual: e.target.value }))}
                  placeholder="123.456.789.123"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => setFormData(prev => ({ ...prev, inscricaoMunicipal: e.target.value }))}
                  placeholder="123456789"
                />
              </div>
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@empresa.com.br"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 3333-4444"
                />
              </div>
            </div>

            {/* Website */}
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://www.empresa.com.br"
              />
            </div>

            {/* Endereço */}
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Rua das Flores, 123 - Centro"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                  placeholder="São Paulo"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="01234-567"
                  maxLength={9}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva brevemente as atividades da empresa..."
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="ativo">Empresa ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingEmpresa ? "Atualizar" : "Salvar"}
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
              Tem certeza que deseja excluir a empresa "{empresaToDelete?.nomeFantasia}" (CNPJ: {empresaToDelete?.cnpj})?
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
