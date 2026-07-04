import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  Download,
  Edit,
} from "lucide-react";

interface ConteudoItem {
  id: number;
  titulo: string;
  tipo: "resumo" | "revisao" | "video";
  disciplina: string;
  data: string;
  status: "publicado" | "rascunho";
  visualizacoes: number;
}

const mockConteudos: ConteudoItem[] = [
  {
    id: 1,
    titulo: "Resumo: Funções Quadráticas",
    tipo: "resumo",
    disciplina: "Matemática",
    data: "2024-09-25",
    status: "publicado",
    visualizacoes: 45,
  },
  {
    id: 2,
    titulo: "Revisão: Revolução Industrial",
    tipo: "revisao",
    disciplina: "História",
    data: "2024-09-24",
    status: "publicado",
    visualizacoes: 32,
  },
  {
    id: 3,
    titulo: "Videoaula: Leis de Newton",
    tipo: "video",
    disciplina: "Física",
    data: "2024-09-23",
    status: "rascunho",
    visualizacoes: 0,
  },
];

export default function RevisoesResumos() {
  const [conteudos] = useState<ConteudoItem[]>(mockConteudos);
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "resumo":
        return <FileText className="h-4 w-4" />;
      case "revisao":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      resumo: "bg-blue-100 text-blue-800 border-blue-200",
      revisao: "bg-green-100 text-green-800 border-green-200",
      video: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return variants[tipo as keyof typeof variants] || variants.resumo;
  };

  const getStatusBadge = (status: string) => {
    return status === "publicado"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            📚 Revisões & Resumos
          </h2>
          <p className="text-white/80">
            Gerencie conteúdos educacionais, resumos e revisões para seus
            alunos.
          </p>
        </div>
        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
          <Plus className="h-4 w-4 mr-2" />
          Publicar conteúdo
        </Button>
      </div>

      {/* Filtros e busca */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar conteúdos..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2">
              {["todos", "resumo", "revisao", "video"].map((filtro) => (
                <Button
                  key={filtro}
                  variant={filtroAtivo === filtro ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFiltroAtivo(filtro)}
                  className={
                    filtroAtivo === filtro
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  }
                >
                  {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de conteúdos */}
      <div className="grid gap-4">
        {conteudos.map((item) => (
          <Card
            key={item.id}
            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-white/10">
                    {getTipoIcon(item.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">
                        {item.titulo}
                      </h3>
                      <Badge className={`text-xs ${getTipoBadge(item.tipo)}`}>
                        {item.tipo}
                      </Badge>
                      <Badge
                        className={`text-xs ${getStatusBadge(item.status)}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span>{item.disciplina}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.data).toLocaleDateString("pt-BR")}
                      </span>
                      <span>•</span>
                      <span>{item.visualizacoes} visualizações</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-white/70">Conteúdos publicados</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">247</div>
            <div className="text-sm text-white/70">Total de visualizações</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-white/70">Rascunhos pendentes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
