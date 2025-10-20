import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";

interface DisciplinePoints {
  maxPoints: number;
  pointPrice: number;
}

interface DisciplineTeacher {
  id: string;
  name: string;
  role: "principal" | "collaborator";
}

interface DisciplineData {
  code: string;
  name: string;
  color: string;
  icon: string;
  classes: string[];
  teachers: DisciplineTeacher[];
  points: DisciplinePoints;
  status: "active" | "archived";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: DisciplineData) => void;
}

const AVAILABLE_CLASSES = [
  "1º A",
  "1º B",
  "2º A",
  "2º B",
  "3º A",
  "3º B",
];

const AVAILABLE_ICONS = [
  { value: "calculator", label: "Calculadora" },
  { value: "book", label: "Livro" },
  { value: "test", label: "Teste" },
  { value: "globe", label: "Globo" },
  { value: "microscope", label: "Microscópio" },
];

export function CreateDisciplineDialog({ open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<DisciplineData>({
    code: "",
    name: "",
    color: "#4F46E5",
    icon: "",
    classes: [],
    teachers: [],
    points: {
      maxPoints: 50,
      pointPrice: 20,
    },
    status: "active",
  });

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Disciplina*</Label>
              <Input
                id="name"
                className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                placeholder="Ex: Matemática"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código Interno*</Label>
              <Input
                id="code"
                className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                placeholder="Ex: MAT001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Cor da Disciplina*</Label>
              <div className="relative">
                <div
                  className="w-full h-10 rounded-lg cursor-pointer border bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  style={{ backgroundColor: formData.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && (
                  <div className="absolute z-10 mt-2">
                    <HexColorPicker
                      color={formData.color}
                      onChange={(color) => setFormData({ ...formData, color })}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ícone*</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                  <SelectValue placeholder="Selecione um ícone" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Turmas*</Label>
              <Select
                value={formData.classes[0]}
                onValueChange={(value) =>
                  setFormData({ ...formData, classes: [value] })
                }
              >
                <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                  <SelectValue placeholder="Selecione as turmas" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_CLASSES.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configurações de Pontos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Pontos</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxPoints">Máximo de Pontos*</Label>
                <Input
                  id="maxPoints"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.points.maxPoints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: {
                        ...formData.points,
                        maxPoints: Number(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointPrice">Preço por Ponto (moedas)*</Label>
                <Input
                  id="pointPrice"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.points.pointPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: {
                        ...formData.points,
                        pointPrice: Number(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-violet-600 hover:bg-violet-700"
            >
              Criar Disciplina
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}