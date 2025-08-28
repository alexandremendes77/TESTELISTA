import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Pencil, X as XIcon, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useReasons, Reason } from "@/context/ReasonsContext";

interface ReasonCategory {
  id: string;
  label: string;
}

const categories: ReasonCategory[] = [
  { id: "attendance", label: "Motivos de Atendimento" },
  { id: "outstore", label: "Motivos Fora da Loja" },
  { id: "offline", label: "Motivos Offline" },
];

const Settings = () => {
  const { reasons, setReasons } = useReasons();
  const [activeCat, setActiveCat] = useState<string>("attendance");
  const [modalOpen, setModalOpen] = useState(false);
  const [editReason, setEditReason] = useState<Reason | null>(null);
  const [reasonLabel, setReasonLabel] = useState("");
  const [reasonColor, setReasonColor] = useState("#3b82f6");

  const openNew = () => {
    setEditReason(null);
    setReasonLabel("");
    setReasonColor("#3b82f6");
    setModalOpen(true);
  };

  const openEdit = (r: Reason) => {
    setEditReason(r);
    setReasonLabel(r.label);
    setReasonColor(r.color);
    setModalOpen(true);
  };

  const saveReason = () => {
    if (!reasonLabel.trim()) return;
    setReasons({
      ...reasons,
      [activeCat]: editReason
        ? reasons[activeCat].map((r) => (r.id === editReason.id ? { ...r, label: reasonLabel.trim(), color: reasonColor } : r))
        : [...reasons[activeCat], { id: Date.now().toString(), label: reasonLabel.trim(), color: reasonColor }],
    });
    setModalOpen(false);
  };

  const deleteReason = (id: string) => {
    setReasons({
      ...reasons,
      [activeCat]: reasons[activeCat].filter((r) => r.id !== id),
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;
    const updated = Array.from(reasons[activeCat]);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setReasons({ ...reasons, [activeCat]: updated });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>

      <Card className="card-shadow-hover">
        <CardHeader>
          <CardTitle>Motivos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCat} onValueChange={setActiveCat} className="w-full">
            <TabsList className="mb-4">
              {categories.map((c) => (
                <TabsTrigger key={c.id} value={c.id} className="capitalize">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((c) => (
              <TabsContent key={c.id} value={c.id} className="space-y-4">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="reasons">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                        {reasons[c.id].map((reason, idx) => (
                          <Draggable key={reason.id} draggableId={reason.id} index={idx}>
                            {(dragProvided) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className="flex items-center justify-between p-3 bg-muted/20 rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                  <span className="w-3 h-3 rounded-full" style={{ background: reason.color }} />
                                  <span>{reason.label}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="icon" variant="outline" onClick={() => openEdit(reason)}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button size="icon" variant="destructive" onClick={() => deleteReason(reason.id)}>
                                    <XIcon className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Button variant="secondary" onClick={openNew}>
                  <Plus className="mr-2 h-4 w-4" /> {editReason ? "Editar Motivo" : "Adicionar Motivo"}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editReason ? "Editar Motivo" : "Novo Motivo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={reasonLabel} onChange={(e)=>setReasonLabel(e.target.value)} placeholder="Motivo" />
            <div className="flex items-center gap-3">
              <span>Cor:</span>
              <input type="color" value={reasonColor} onChange={(e)=>setReasonColor(e.target.value)} className="h-8 w-8 p-0 border-none bg-transparent" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={()=>setModalOpen(false)}>Cancelar</Button>
            <Button onClick={saveReason}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
