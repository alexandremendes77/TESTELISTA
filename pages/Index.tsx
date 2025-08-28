"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconHome,
  IconUsers,
  IconClipboardList,
  IconTrophy,
  IconTarget,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Dashboard from "./Dashboard";
import Queue from "./Queue";
import Ranking from "./Ranking.tsx";
import CadastrarLojas from "./CadastrarLojas";
import CadastrarMotivos from "./CadastrarMotivos";
import PerfilAcesso from "./PerfilAcesso";
import CadastroUsuario from "./CadastroUsuario";
import CadastroEmpresa from "./CadastroEmpresa";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "dashboard"
    },
    {
      label: "Fila",
      href: "#",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "queue"
    },
    {
      label: "Atendimentos",
      href: "#",
      icon: (
        <IconClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "attendance"
    },
    {
      label: "Ranking",
      href: "#",
      icon: (
        <IconTrophy className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "ranking"
    },
    {
      label: "Metas",
      href: "#",
      icon: (
        <IconTarget className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "goals"
    },
    {
      label: "Relatórios",
      href: "#",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "reports"
    },
    {
      label: "Configurações",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "settings",
      submenu: [
        { label: "Empresas", id: "cadastro-empresa" },
        { label: "Lojas", id: "cadastrar-lojas" },
        { label: "Motivos e Sub-motivos", id: "cadastrar-motivos" },
        { label: "Perfil de Acesso", id: "perfil-acesso" },
        { label: "Usuários", id: "cadastro-usuario" },
      ]
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "queue":
        return <Queue />;
      case "attendance":
        return <div className="p-6">Atendimentos em desenvolvimento...</div>;
      case "ranking":
        return <Ranking />;
      case "goals":
        return <div className="p-6">Metas em desenvolvimento...</div>;
      case "reports":
        return <div className="p-6">Relatórios em desenvolvimento...</div>;
      case "cadastro-empresa":
        return <CadastroEmpresa />;
      case "cadastrar-lojas":
        return <CadastrarLojas />;
      case "cadastrar-motivos":
        return <CadastrarMotivos />;
      case "perfil-acesso":
        return <PerfilAcesso />;
      case "cadastro-usuario":
        return <CadastroUsuario />;
      default:
        return <Dashboard />;
    }
  };

  const handleLinkClick = (id: string) => {
    // Não permite navegação para o item principal "Configurações"
    if (id !== "settings") {
      setCurrentPage(id);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col bg-white md:flex-row",
        "min-h-screen md:h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx}>
                  <div onClick={() => handleLinkClick(link.id)}>
                    <SidebarLink link={link} />
                  </div>
                  {link.submenu && (
                    <div className="ml-6 mt-2 flex flex-col gap-1">
                      {link.submenu.map((sublink, subIdx) => (
                        <div
                          key={subIdx}
                          onClick={() => handleLinkClick(sublink.id)}
                          className="flex items-center gap-2 py-2 px-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-150"
                        >
                          <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                          {sublink.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white p-2 pb-6 md:p-6 md:h-full md:overflow-y-auto overflow-x-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        HAASS - Lista da Vez
      </motion.span>
    </div>
  );
};

export default Index;
