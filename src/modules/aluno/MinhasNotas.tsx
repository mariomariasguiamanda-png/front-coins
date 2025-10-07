import { Card, CardContent } from "@/components/ui/Card";
import { BarChart3, Award, TrendingUp, Calendar } from "lucide-react";

export default function MinhasNotas() {
  // Dados mockados para as estatísticas
  const stats = {
    mediaGeral: 8.0,
    aprovadas: 5,
    recuperacao: 1,
    totalProvas: 6,
  };

  // Dados mockados para o histórico de avaliações
  const historico = [
    {
      disciplina: "Matemática",
      avaliacao: "Avaliação",
      data: "14/09/2024",
      nota: 8.5,
      status: "Aprovado",
    },
    {
      disciplina: "Português",
      avaliacao: "Avaliação",
      data: "19/09/2024",
      nota: 9.2,
      status: "Aprovado",
    },
    {
      disciplina: "História",
      avaliacao: "Avaliação",
      data: "17/09/2024",
      nota: 7.8,
      status: "Aprovado",
    },
    {
      disciplina: "Biologia",
      avaliacao: "Avaliação",
      data: "21/09/2024",
      nota: 6.5,
      status: "Recuperação",
    },
  ];

  const getNotaColor = (nota: number) => {
    if (nota >= 8) return "text-green-600";
    if (nota >= 7) return "text-blue-600";
    if (nota >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Título e Descrição */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-violet-700">Minhas Notas</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe seu desempenho acadêmico e histórico de avaliações.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média Geral</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.mediaGeral}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-violet-400 to-violet-500">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.aprovadas}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-green-400 to-green-500">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recuperação</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.recuperacao}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-yellow-400 to-yellow-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Provas</p>
              <p className="text-2xl font-bold text-violet-700">
                {stats.totalProvas}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-blue-400 to-blue-500">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Avaliações */}
      <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-8 mb-8">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Histórico de Avaliações
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Disciplina
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Avaliação
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                    Data
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                    Nota
                  </th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-all">
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {item.disciplina}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.avaliacao}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.data}</td>
                    <td
                      className={`py-3 px-4 text-center font-bold ${getNotaColor(
                        item.nota
                      )}`}
                    >
                      {item.nota}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Aprovado"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
