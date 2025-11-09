import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  School,
  Camera,
  Save,
  Lock,
  Shield,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Award,
  Eye,
  EyeOff,
  Upload
} from "lucide-react";
import { useState } from "react";

interface ProfileData {
  readonly: {
    nomeCompleto: string;
    matricula: string;
    cpf: string;
    disciplinas: string[];
    turmas: string[];
    emailInstitucional: string;
    dataAdmissao?: string;
    departamento?: string;
  };
  editable: {
    emailAlternativo: string;
    telefone: string;
    senha: string;
    foto: string;
    endereco?: string;
    biografia?: string;
  };
  stats?: {
    totalAulas: number;
    totalAlunos: number;
    mediaAvaliacoes: number;
  };
}

export function PerfilProfessor({ data }: { data: ProfileData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(data.editable);

  const handleSave = () => {
    // Implementar salvamento
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableData(data.editable);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Avatar Grande */}
      <Card className="rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
                <img
                  src={editableData.foto || "/placeholder-avatar.png"}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 md:mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.readonly.nomeCompleto}</h1>
              <p className="text-gray-600 mt-1">Professor(a) • Matrícula {data.readonly.matricula}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.readonly.disciplinas.slice(0, 3).map((disciplina, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700"
                  >
                    {disciplina}
                  </span>
                ))}
                {data.readonly.disciplinas.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    +{data.readonly.disciplinas.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      {data.stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Aulas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.totalAulas}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.totalAlunos}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.mediaAvaliacoes.toFixed(1)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados Institucionais */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <School className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados Institucionais</h2>
                <p className="text-sm text-gray-500">Informações não editáveis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Nome Completo
                </Label>
                <Input 
                  value={data.readonly.nomeCompleto} 
                  disabled 
                  className="rounded-xl mt-1 bg-gray-50" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Matrícula
                  </Label>
                  <Input 
                    value={data.readonly.matricula} 
                    disabled 
                    className="rounded-xl mt-1 bg-gray-50" 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    CPF
                  </Label>
                  <Input 
                    value={data.readonly.cpf} 
                    disabled 
                    className="rounded-xl mt-1 bg-gray-50" 
                  />
                </div>
              </div>

              {data.readonly.departamento && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Departamento
                  </Label>
                  <Input 
                    value={data.readonly.departamento} 
                    disabled 
                    className="rounded-xl mt-1 bg-gray-50" 
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  Disciplinas
                </Label>
                <Input 
                  value={data.readonly.disciplinas.join(", ")} 
                  disabled 
                  className="rounded-xl mt-1 bg-gray-50" 
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  Turmas
                </Label>
                <Input 
                  value={data.readonly.turmas.join(", ")} 
                  disabled 
                  className="rounded-xl mt-1 bg-gray-50" 
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  E-mail Institucional
                </Label>
                <Input 
                  value={data.readonly.emailInstitucional} 
                  disabled 
                  className="rounded-xl mt-1 bg-gray-50" 
                />
              </div>

              {data.readonly.dataAdmissao && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Data de Admissão
                  </Label>
                  <Input 
                    value={new Date(data.readonly.dataAdmissao).toLocaleDateString('pt-BR')} 
                    disabled 
                    className="rounded-xl mt-1 bg-gray-50" 
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais Editáveis */}
        <Card className={`rounded-xl shadow-sm ${isEditing ? 'border-2 border-violet-300' : ''}`}>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                <p className="text-sm text-gray-500">Informações editáveis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  E-mail Alternativo
                </Label>
                <Input 
                  value={editableData.emailAlternativo}
                  onChange={(e) => setEditableData({ ...editableData, emailAlternativo: e.target.value })}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="seu.email@gmail.com"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Telefone/WhatsApp
                </Label>
                <Input 
                  value={editableData.telefone}
                  onChange={(e) => setEditableData({ ...editableData, telefone: e.target.value })}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="(11) 98765-4321"
                />
              </div>

              {editableData.endereco !== undefined && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Endereço
                  </Label>
                  <Input 
                    value={editableData.endereco}
                    onChange={(e) => setEditableData({ ...editableData, endereco: e.target.value })}
                    disabled={!isEditing}
                    className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Rua, número, bairro"
                  />
                </div>
              )}

              {editableData.biografia !== undefined && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    Biografia
                  </Label>
                  <textarea
                    value={editableData.biografia}
                    onChange={(e) => setEditableData({ ...editableData, biografia: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-xl border mt-1 min-h-[100px] ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Alterar Senha
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha atual"
                      disabled={!isEditing}
                      className={`rounded-xl ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        className="rounded-xl"
                      />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmar nova senha"
                        className="rounded-xl"
                      />
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-gray-500" />
                  Foto de Perfil
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-violet-100 overflow-hidden">
                    <img
                      src={editableData.foto || "/placeholder-avatar.png"}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    disabled={!isEditing}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar foto
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}