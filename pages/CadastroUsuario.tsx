import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, Plus, User, Eye, EyeOff, Search, X, Key, Copy, Check } from "lucide-react";
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

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  codigoPdv: string;
  login: string;
  senha: string;
  lojaId: string;
  perfilId: string;
  ativo: boolean;
  criadoEm: string;
  dataInicio: string;
  pesoMeta: number;
  ultimoAcesso?: string;
  token?: string;
}

interface Loja {
  id: string;
  codigo: string;
  nome: string;
}

interface PerfilAcesso {
  id: string;
  nome: string;
}

// Dados mockados das lojas (normalmente viriam de uma API)
const lojas: Loja[] = [
  { id: "1", codigo: "001", nome: "Loja Centro" },
  { id: "2", codigo: "002", nome: "Loja Shopping" },
  { id: "3", codigo: "003", nome: "Loja Norte" },
];

// Dados mockados dos perfis (normalmente viriam de uma API)
const perfis: PerfilAcesso[] = [
  { id: "1", nome: "Administrador" },
  { id: "2", nome: "Vendedor" },
  { id: "3", nome: "Supervisor" },
];

export default function CadastroUsuario() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao@haass.com.br",
      telefone: "(11) 99999-9999",
      cpf: "123.456.789-01",
      codigoPdv: "PDV001",
      login: "joao.silva",
      senha: "123456",
      lojaId: "1",
      perfilId: "2",
      ativo: true,
      criadoEm: "2024-01-15",
      dataInicio: "2024-01-15",
      pesoMeta: 25.5,
      ultimoAcesso: "2024-01-20",
      token: "123456",
    },
    {
      id: "2",
      nome: "Ana Costa",
      email: "ana@haass.com.br",
      telefone: "(11) 88888-8888",
      cpf: "987.654.321-09",
      codigoPdv: "PDV002",
      login: "ana.costa",
      senha: "123456",
      lojaId: "1",
      perfilId: "2",
      ativo: true,
      criadoEm: "2024-01-16",
      dataInicio: "2024-01-16",
      pesoMeta: 30.0,
      ultimoAcesso: "2024-01-19",
    },
    {
      id: "3",
      nome: "Carlos Mendes",
      email: "carlos@haass.com.br",
      telefone: "(11) 77777-7777",
      cpf: "456.789.123-45",
      codigoPdv: "PDV003",
      login: "carlos.mendes",
      senha: "123456",
      lojaId: "2",
      perfilId: "3",
      ativo: false,
      criadoEm: "2024-01-17",
      dataInicio: "2024-01-17",
      pesoMeta: 20.0,
      token: "789012", // Token que será cancelado por estar inativo
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [generatedToken, setGeneratedToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  
  // Efeito para limpar tokens de usuários inativos na inicialização
  useEffect(() => {
    setUsuarios(prev => prev.map(usuario => 
      !usuario.ativo && usuario.token 
        ? { ...usuario, token: undefined }
        : usuario
    ));
  }, []);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    codigoPdv: "",
    login: "",
    senha: "",
    lojaId: "",
    perfilId: "",
    dataInicio: "",
    pesoMeta: 0,
    ativo: true,
  });

  // Função de filtro otimizada
  const filteredUsuarios = useMemo(() => {
    if (!searchTerm.trim()) return usuarios;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return usuarios.filter(usuario => {
      // Busca no nome (mínimo 2 caracteres para evitar matches muito amplos)
      if (searchLower.length >= 2 && usuario.nome.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca exata no início do nome (permite 1 caracter)
      if (usuario.nome.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      // Busca no email
      if (usuario.email.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no login
      if (usuario.login.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no telefone (só números com pelo menos 2 dígitos)
      const searchNumeros = searchTerm.replace(/\D/g, '');
      if (searchNumeros.length >= 2) {
        const telefoneNumeros = usuario.telefone.replace(/\D/g, '');
        if (telefoneNumeros.includes(searchNumeros)) {
          return true;
        }
      }
      
      // Busca no CPF
      if (usuario.cpf.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no CPF sem formatação
      if (searchNumeros.length >= 3) {
        const cpfNumeros = usuario.cpf.replace(/\D/g, '');
        if (cpfNumeros.includes(searchNumeros)) {
          return true;
        }
      }
      
      // Busca no código PDV
      if (usuario.codigoPdv.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca na loja
      const loja = lojas.find(l => l.id === usuario.lojaId);
      if (loja) {
        const lojaNome = `${loja.codigo} - ${loja.nome}`.toLowerCase();
        if (lojaNome.includes(searchLower)) {
          return true;
        }
      }
      
      // Busca no perfil
      const perfil = perfis.find(p => p.id === usuario.perfilId);
      if (perfil && perfil.nome.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Busca no status
      const status = usuario.ativo ? "ativo" : "inativo";
      if (status.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [usuarios, searchTerm]);

  // Funções auxiliares (usadas em outras partes do componente)
  const getLojaNome = (lojaId: string) => {
    const loja = lojas.find(l => l.id === lojaId);
    return loja ? `${loja.codigo} - ${loja.nome}` : "Loja não encontrada";
  };

  const getPerfilNome = (perfilId: string) => {
    const perfil = perfis.find(p => p.id === perfilId);
    return perfil ? perfil.nome : "Perfil não encontrado";
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email || !formData.cpf || !formData.codigoPdv || !formData.login || !formData.senha || !formData.lojaId || !formData.perfilId || !formData.dataInicio || formData.pesoMeta <= 0) {
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

    // Validar CPF
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      toast({
        title: "Erro",
        description: "Digite um CPF válido",
        variant: "destructive",
      });
      return;
    }

    // Validar peso da meta
    if (formData.pesoMeta <= 0 || formData.pesoMeta > 100) {
      toast({
        title: "Erro",
        description: "O peso da meta deve estar entre 0.1% e 100%",
        variant: "destructive",
      });
      return;
    }

    // Validar se login já existe (exceto quando editando o mesmo usuário)
    const loginExists = usuarios.some(u => 
      u.login === formData.login && u.id !== editingUsuario?.id
    );
    if (loginExists) {
      toast({
        title: "Erro",
        description: "Este login já está em uso",
        variant: "destructive",
      });
      return;
    }

    // Validar se CPF já existe (exceto quando editando o mesmo usuário)
    const cpfExists = usuarios.some(u => 
      u.cpf === formData.cpf && u.id !== editingUsuario?.id
    );
    if (cpfExists) {
      toast({
        title: "Erro",
        description: "Este CPF já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    // Validar se Código PDV já existe (exceto quando editando o mesmo usuário)
    const pdvExists = usuarios.some(u => 
      u.codigoPdv === formData.codigoPdv && u.id !== editingUsuario?.id
    );
    if (pdvExists) {
      toast({
        title: "Erro",
        description: "Este código PDV já está em uso",
        variant: "destructive",
      });
      return;
    }

    if (editingUsuario) {
      // Editando usuário existente
      const updatedData = { ...formData };
      
      // Se o usuário está sendo inativado, cancelar o token
      if (!formData.ativo && editingUsuario.token) {
        (updatedData as any).token = undefined;
        toast({
          title: "Token Cancelado",
          description: "Token foi cancelado devido à inativação do usuário",
          variant: "destructive",
        });
      }
      
      setUsuarios(prev => prev.map(usuario => 
        usuario.id === editingUsuario.id 
          ? { ...usuario, ...updatedData }
          : usuario
      ));
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
    } else {
      // Criando novo usuário
      const novoUsuario: Usuario = {
        id: Date.now().toString(),
        ...formData,
        criadoEm: new Date().toISOString().split('T')[0],
        // Usuários inativos não podem ter token desde a criação
        token: formData.ativo ? undefined : undefined,
      };
      setUsuarios(prev => [...prev, novoUsuario]);
      toast({
        title: "Sucesso",
        description: "Usuário cadastrado com sucesso",
      });
    }

    setIsDialogOpen(false);
    setEditingUsuario(null);
    setFormData({ nome: "", email: "", telefone: "", cpf: "", codigoPdv: "", login: "", senha: "", lojaId: "", perfilId: "", dataInicio: "", pesoMeta: 0, ativo: true });
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      codigoPdv: usuario.codigoPdv,
      login: usuario.login,
      senha: usuario.senha,
      lojaId: usuario.lojaId,
      perfilId: usuario.perfilId,
      dataInicio: usuario.dataInicio,
      pesoMeta: usuario.pesoMeta,
      ativo: usuario.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (usuarioToDelete) {
      setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioToDelete.id));
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setUsuarioToDelete(null);
    }
  };

  const handleNewUsuario = () => {
    setEditingUsuario(null);
    setFormData({ nome: "", email: "", telefone: "", cpf: "", codigoPdv: "", login: "", senha: "", lojaId: "", perfilId: "", dataInicio: "", pesoMeta: 0, ativo: true });
    setIsDialogOpen(true);
  };

  const generateLogin = (nome: string) => {
    return nome.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '.') // Substitui espaços por pontos
      .replace(/[^a-z0-9.]/g, ''); // Remove caracteres especiais
  };

  const handleNomeChange = (nome: string) => {
    setFormData(prev => ({
      ...prev,
      nome,
      login: prev.login || generateLogin(nome) // Só gera se login estiver vazio
    }));
  };

  const formatCpf = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return numbers.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (value: string) => {
    const formattedCpf = formatCpf(value);
    setFormData(prev => ({ ...prev, cpf: formattedCpf }));
  };

  const handlePesoMetaChange = (value: string) => {
    // Remove caracteres não numéricos exceto ponto e vírgula
    const cleanValue = value.replace(/[^\d.,]/g, '');
    // Converte vírgula para ponto
    const normalizedValue = cleanValue.replace(',', '.');
    // Converte para número
    const numericValue = parseFloat(normalizedValue) || 0;
    // Limita a 100%
    const limitedValue = Math.min(numericValue, 100);
    
    setFormData(prev => ({ ...prev, pesoMeta: limitedValue }));
  };

  // Função para gerar token único
  const generateToken = () => {
    let token;
    let attempts = 0;
    const maxAttempts = 100; // Evita loop infinito
    
    do {
      // Gera um número aleatório de 6 dígitos (100000 a 999999)
      token = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
    } while (
      usuarios.some(u => u.token === token) && 
      attempts < maxAttempts
    );
    
    return token;
  };

  // Função para gerar token do usuário
  const handleGenerateToken = (usuario: Usuario) => {
    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      toast({
        title: "Erro",
        description: "Não é possível gerar token para usuário inativo",
        variant: "destructive",
      });
      return;
    }
    
    const newToken = generateToken();
    const isRegeneration = !!usuario.token;
    
    // Atualizar o usuário com o novo token
    setUsuarios(prev => prev.map(u => 
      u.id === usuario.id 
        ? { ...u, token: newToken }
        : u
    ));
    
    setSelectedUsuario({ ...usuario, token: newToken });
    setGeneratedToken(newToken);
    setIsTokenDialogOpen(true);
    setTokenCopied(false);
    
    toast({
      title: isRegeneration ? "Token Regenerado" : "Token Gerado",
      description: `Token ${isRegeneration ? 'regenerado' : 'gerado'} com sucesso para ${usuario.nome}`,
    });
  };

  // Função para copiar token
  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setTokenCopied(true);
      toast({
        title: "Token Copiado",
        description: "Token copiado para a área de transferência",
      });
      
      // Reset do estado de copiado após 2 segundos
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o token",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Cadastro de Usuários</h1>
        </div>
        <Button onClick={handleNewUsuario}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Campo de busca */}
          <div className="relative max-w-2xl w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email, login, CPF, código PDV, loja, perfil..."
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
                {filteredUsuarios.length} de {usuarios.length} usuários
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? `Nenhum usuário encontrado para "${searchTerm}"`
                          : "Nenhum usuário cadastrado"
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
                filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.nome}`} />
                        <AvatarFallback>
                          {usuario.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{usuario.nome}</div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{usuario.login}</TableCell>
                  <TableCell>{getLojaNome(usuario.lojaId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPerfilNome(usuario.perfilId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.ativo ? "default" : "secondary"}>
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {usuario.ultimoAcesso 
                      ? new Date(usuario.ultimoAcesso).toLocaleDateString("pt-BR")
                      : "Nunca acessou"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateToken(usuario)}
                        title={
                          !usuario.ativo 
                            ? "Usuário inativo - não é possível gerar token" 
                            : usuario.token 
                              ? "Regenerar Token de Acesso" 
                              : "Gerar Token de Acesso"
                        }
                        className={cn(
                          !usuario.ativo && "opacity-50 cursor-not-allowed",
                          usuario.token && usuario.ativo && "text-green-600 hover:text-green-700"
                        )}
                        disabled={!usuario.ativo}
                      >
                        <Key className={cn("h-4 w-4", usuario.token && usuario.ativo && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(usuario)}
                        title="Editar Usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(usuario)}
                        title="Excluir Usuário"
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

      {/* Dialog para criar/editar usuário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogDescription>Preencha os dados do usuário e associe à loja e perfil desejados.</DialogDescription>
          <DialogHeader>
            <DialogTitle>
              {editingUsuario ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@haass.com.br"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  placeholder="123.456.789-01"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="codigoPdv">Código no PDV *</Label>
                <Input
                  id="codigoPdv"
                  value={formData.codigoPdv}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigoPdv: e.target.value.toUpperCase() }))}
                  placeholder="PDV001"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="login">Login *</Label>
                <Input
                  id="login"
                  value={formData.login}
                  onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                  placeholder="joao.silva"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senha">Senha *</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="Digite a senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pesoMeta">Peso na Meta (%) *</Label>
                <div className="relative">
                  <Input
                    id="pesoMeta"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={formData.pesoMeta || ''}
                    onChange={(e) => handlePesoMetaChange(e.target.value)}
                    placeholder="25.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="loja">Loja *</Label>
                <Select
                  value={formData.lojaId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lojaId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a loja" />
                  </SelectTrigger>
                  <SelectContent>
                    {lojas.map((loja) => (
                      <SelectItem key={loja.id} value={loja.id}>
                        {loja.codigo} - {loja.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="perfil">Perfil de Acesso *</Label>
                <Select
                  value={formData.perfilId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, perfilId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfis.map((perfil) => (
                      <SelectItem key={perfil.id} value={perfil.id}>
                        {perfil.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="ativo">Usuário ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingUsuario ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para exibir token gerado */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Token de Acesso
            </DialogTitle>
            <DialogDescription>
              Token gerado para <strong>{selectedUsuario?.nome}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium text-muted-foreground">
                Token de Acesso
              </Label>
              <div className="mt-2 p-4 bg-background rounded border font-mono text-2xl font-bold text-center tracking-widest text-primary">
                {generatedToken}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>• Este token permite ao usuário acessar a fila de atendimento</p>
              <p>• Ver suas metas e informações pessoais</p>
              <p>• Mantenha o token seguro e não o compartilhe</p>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsTokenDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={handleCopyToken} className="flex items-center gap-2">
              {tokenCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Token
                </>
              )}
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
              Tem certeza que deseja excluir o usuário "{usuarioToDelete?.nome}" (login: {usuarioToDelete?.login})?
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
