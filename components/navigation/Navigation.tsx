import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Home,
  Users, 
  ClipboardList, 
  Trophy, 
  Target, 
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "queue", label: "Fila", icon: Users },
  { id: "attendance", label: "Atendimentos", icon: ClipboardList },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "goals", label: "Metas", icon: Target },
  { id: "reports", label: "Relatórios", icon: BarChart3 }
];

const SidebarContent = ({ currentPage, onPageChange, onLinkClick }: { currentPage: string; onPageChange: (page: string) => void; onLinkClick?: () => void; }) => (
  <div className="flex flex-col h-full">
    <div className="p-4 mb-4">
      <h2 className="text-lg font-semibold text-foreground/80">
        Sistema de Gestão de Atendimento
      </h2>
    </div>
    <div className="p-4">
      <Input placeholder="Pesquisar..." className="bg-background" />
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => {
                onPageChange(item.id);
                if (onLinkClick) onLinkClick();
            }}
            className={cn(
              "w-full justify-start gap-3",
              isActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Button>
        );
      })}
    </nav>
  </div>
);


export const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
        <SidebarContent currentPage={currentPage} onPageChange={onPageChange} />
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
             <SidebarContent 
                currentPage={currentPage} 
                onPageChange={onPageChange} 
                onLinkClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};