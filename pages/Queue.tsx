import { useState } from "react";
import { QueueCard } from "@/components/queue/QueueCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react"; // Added missing import

type FeedbackType = "converted" | "lost" | "exchange" | "multi" | "reserved" | "cancelled";

interface Salesperson {
  id: string;
  name: string;
  avatar?: string;
  status: "waiting" | "serving" | "outstore" | "offline";
  pin?: string;
  activeStart?: number; // timestamp de início do atendimento/ausência
  history?: number[]; // durações em segundos
}

const Queue = () => {
  const { toast } = useToast();
  const [salespeople, setSalespeople] = useState<Salesperson[]>([
    { id: "1", name: "João Silva", status: "waiting", pin: "1234", history: [] },
    { id: "2", name: "Ana Costa", status: "waiting", pin: "2345", history: [] },
    { id: "3", name: "Pedro Rocha", status: "outstore", pin: "3456", activeStart: Date.now(), history: [] },
    { id: "4", name: "Carla Santos", status: "serving", pin: "4567", activeStart: Date.now(), history: [] },
    { id: "5", name: "Erik Lima", status: "offline", pin: "5678", history: [] }
  ]);

  const lanes = [
    { id: "waiting", title: "Esperando a vez" },
    { id: "serving", title: "Em atendimento" },
    { id: "outstore", title: "Fora da loja" },
    { id: "offline", title: "Vendedor Offline" },
  ];

  const offlineList = salespeople.filter(s => s.status === "offline");

  const [tick, setTick] = useState(0);
  const [feedbackPerson, setFeedbackPerson] = useState<Salesperson | null>(null);
  // Atualiza a cada segundo para re-renderizar timers ativos
  React.useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFeedback = (type: FeedbackType) => {
    if (!feedbackPerson) return;
    toast({ title: `Feedback: ${type}`, description: `${feedbackPerson.name} - ${type}` });
    setFeedbackPerson(null);
  };

  const [pendingMove, setPendingMove] = useState<{ personId: string; dest: string } | null>(null);
  const [pinInput, setPinInput] = useState("");

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    // Se sair do offline, requer PIN via modal
    if (source.droppableId === "offline" && destination.droppableId !== "offline") {
      setPendingMove({ personId: draggableId, dest: destination.droppableId });
      return;
    }

    // Se concluindo atendimento -> abrir feedback
    if ((source.droppableId === "serving" || source.droppableId === "outstore") && destination.droppableId === "waiting") {
      const person = salespeople.find(p => p.id === draggableId);
      if (person) setFeedbackPerson(person);
    }

    setSalespeople(prev => prev.map(p => {
      if (p.id !== draggableId) return p;

      // Se saindo do offline -> PIN já tratado acima

      let updated: Salesperson = { ...p };

      // Se mudança para serving ou outstore, inicia timer
      if (destination.droppableId === "serving" || destination.droppableId === "outstore") {
        updated.activeStart = Date.now();
      }

      // Se estava em atendimento/fora e volta para waiting, calcula duração
      if ((p.status === "serving" || p.status === "outstore") && destination.droppableId === "waiting" && p.activeStart) {
        const durationSec = Math.floor((Date.now() - p.activeStart) / 1000);
        updated.history = [...(p.history || []), durationSec];
        updated.activeStart = undefined;
      }

      updated.status = destination.droppableId as any;
      return updated;
    }));
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Fila de Atendimento</h1>
        <p className="text-muted-foreground">Arraste os vendedores entre as colunas</p>
      </div>

      {/* Lanes */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {lanes.map(lane => (
            <Card key={lane.id} className="card-shadow-hover">
              <CardHeader>
                <CardTitle>
                  {lane.title} ({salespeople.filter(s => s.status === lane.id).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={lane.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4 min-h-[50px]"
                    >
                      {salespeople.filter(s => s.status === lane.id).map((person, index) => (
                        <Draggable key={person.id} draggableId={person.id} index={index}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="flex items-center justify-between bg-white border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={person.avatar} />
                                  <AvatarFallback>{person.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{person.name}</span>
                              </div>
                              {(lane.id === "serving" || lane.id === "outstore") && person.activeStart && (
                                <span className="text-primary font-mono text-sm">
                                  {new Date(Date.now() - person.activeStart).toISOString().substr(14,5)}
                                </span>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Offline card removido, coluna já incluída na grid */}
      </DragDropContext>

      {/* Modal PIN */}
      <Dialog open={!!pendingMove} onOpenChange={(open) => { if (!open) { setPendingMove(null); setPinInput(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digite seu PIN</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="PIN"
            className="mb-4"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => { setPendingMove(null); setPinInput(""); }}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!pendingMove) return;
                const person = salespeople.find(p => p.id === pendingMove.personId);
                if (person && pinInput === person.pin) {
                  setSalespeople(prev => prev.map(p => p.id === person.id ? { ...p, status: pendingMove.dest as any } : p));
                  setPendingMove(null);
                  setPinInput("");
                  toast({ title: "Autenticado", description: `${person.name} entrou na fila.` });
                } else {
                  toast({ title: "PIN incorreto", description: "Tente novamente.", variant: "destructive" });
                }
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Feedback */}
      <Dialog open={!!feedbackPerson} onOpenChange={(o)=>{if(!o) setFeedbackPerson(null);}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feedbackPerson?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button className="w-full" onClick={()=>handleFeedback("converted")}>
              Venda convertida
            </Button>
            <Button variant="destructive" className="w-full" onClick={()=>handleFeedback("lost")}>Venda perdida</Button>
            <Button variant="secondary" className="w-full" onClick={()=>handleFeedback("exchange")}>Troca de produto</Button>
            <Button variant="secondary" className="w-full" onClick={()=>handleFeedback("multi")}>Vários atendimentos</Button>
            <Button variant="secondary" className="w-full" onClick={()=>handleFeedback("reserved")}>Reserva de outro vendedor</Button>
            <Button variant="outline" className="w-full" onClick={()=>handleFeedback("cancelled")}>Cancelar atendimento</Button>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={()=>setFeedbackPerson(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Queue;