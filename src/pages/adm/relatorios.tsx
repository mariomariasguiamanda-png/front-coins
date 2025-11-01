import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
	LineChart as LineChartIcon,
	Search,
	Download,
	TrendingUp,
	Medal,
	AlertTriangle,
	Coins,
	FileText,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Line,
	LineChart,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlunoNota {
	disciplina: string;
	nota: number;
	mediaMinima: number;
	data: string;
}

interface MovimentacaoMoedas {
	id: string;
	tipo: "ganho" | "gasto";
	quantidade: number;
	motivo: string;
	disciplina: string;
	data: string;
}

interface DadosTurma {
	turma: string;
	disciplina: string;
	professor: string;
	mediaMoedas: number;
	mediaNotas: number;
	totalAlunos: number;
	distribuicaoMoedas: { nome: string; moedas: number }[];
	evolucaoMensal: {
		mes: string;
		moedas: number;
		notas: number;
	}[];
	avaliacoes: {
		nome: string;
		media: number;
		data: string;
	}[];
}

interface AlunoDesempenho {
	id: string;
	nome: string;
	matricula: string;
	turma: string;
	saldoMoedas: number;
	ranking: {
		posicaoTurma: number;
		totalAlunosTurma: number;
		posicaoEscola: number;
		totalAlunosEscola: number;
	};
	notas: AlunoNota[];
	historicoMoedas: MovimentacaoMoedas[];
}

const mockAlunos: AlunoDesempenho[] = [
	{
		id: "1",
		nome: "João Silva",
		matricula: "2023001",
		turma: "3º A",
		saldoMoedas: 450,
		ranking: {
			posicaoTurma: 2,
			totalAlunosTurma: 30,
			posicaoEscola: 5,
			totalAlunosEscola: 150,
		},
		notas: [
			{ disciplina: "Matemática", nota: 8.5, mediaMinima: 7, data: "2025-10-01" },
			{ disciplina: "História", nota: 6.5, mediaMinima: 7, data: "2025-10-05" },
			{ disciplina: "Português", nota: 9.2, mediaMinima: 7, data: "2025-09-28" },
		],
		historicoMoedas: [
			{
				id: "1",
				tipo: "ganho",
				quantidade: 20,
				motivo: "Atividade entregue com nota máxima",
				disciplina: "Matemática",
				data: "2025-10-01",
			},
			{
				id: "2",
				tipo: "gasto",
				quantidade: 50,
				motivo: "Resgate de recompensa",
				disciplina: "História",
				data: "2025-10-05",
			},
			{
				id: "3",
				tipo: "ganho",
				quantidade: 35,
				motivo: "Participação em projeto",
				disciplina: "Português",
				data: "2025-09-28",
			},
		],
	},
	{
		id: "2",
		nome: "Maria Fernandes",
		matricula: "2023002",
		turma: "3º A",
		saldoMoedas: 510,
		ranking: {
			posicaoTurma: 1,
			totalAlunosTurma: 30,
			posicaoEscola: 2,
			totalAlunosEscola: 150,
		},
		notas: [
			{ disciplina: "Matemática", nota: 9.4, mediaMinima: 7, data: "2025-10-01" },
			{ disciplina: "História", nota: 8.1, mediaMinima: 7, data: "2025-10-05" },
			{ disciplina: "Português", nota: 8.8, mediaMinima: 7, data: "2025-09-28" },
		],
		historicoMoedas: [
			{
				id: "4",
				tipo: "ganho",
				quantidade: 40,
				motivo: "Entrega de projeto colaborativo",
				disciplina: "História",
				data: "2025-10-04",
			},
			{
				id: "5",
				tipo: "gasto",
				quantidade: 30,
				motivo: "Compra de bônus de estudo",
				disciplina: "Matemática",
				data: "2025-09-30",
			},
		],
	},
];

const mockTurmas: DadosTurma[] = [
	{
		turma: "3º A",
		disciplina: "Matemática",
		professor: "Prof. Carlos",
		mediaMoedas: 120,
		mediaNotas: 7.8,
		totalAlunos: 30,
		distribuicaoMoedas: [
			{ nome: "Maria", moedas: 160 },
			{ nome: "João", moedas: 150 },
			{ nome: "Pedro", moedas: 95 },
			{ nome: "Camila", moedas: 80 },
		],
		evolucaoMensal: [
			{ mes: "Jan", moedas: 100, notas: 7.5 },
			{ mes: "Fev", moedas: 110, notas: 7.6 },
			{ mes: "Mar", moedas: 125, notas: 7.9 },
			{ mes: "Abr", moedas: 130, notas: 8 },
		],
		avaliacoes: [
			{ nome: "Prova diagnóstica", media: 7.2, data: "2025-02-10" },
			{ nome: "Projeto interdisciplinar", media: 8.4, data: "2025-03-15" },
			{ nome: "Simulado bimestral", media: 7.9, data: "2025-04-05" },
		],
	},
	{
		turma: "3º B",
		disciplina: "Português",
		professor: "Profa. Ana",
		mediaMoedas: 110,
		mediaNotas: 8.2,
		totalAlunos: 28,
		distribuicaoMoedas: [
			{ nome: "Lucas", moedas: 140 },
			{ nome: "Julia", moedas: 125 },
			{ nome: "Carlos", moedas: 85 },
			{ nome: "Sofia", moedas: 75 },
		],
		evolucaoMensal: [
			{ mes: "Jan", moedas: 90, notas: 7.8 },
			{ mes: "Fev", moedas: 102, notas: 8.1 },
			{ mes: "Mar", moedas: 114, notas: 8.3 },
			{ mes: "Abr", moedas: 118, notas: 8.4 },
		],
		avaliacoes: [
			{ nome: "Redação argumentativa", media: 8.1, data: "2025-02-12" },
			{ nome: "Seminário de literatura", media: 8.7, data: "2025-03-18" },
			{ nome: "Prova bimestral", media: 7.8, data: "2025-04-08" },
		],
	},
];
type PeriodoAnalise = "semana" | "mes" | "bimestre" | "semestre" | "ano";
type ExportKind = "alunos" | "turmas" | "disciplinas";

export default function RelatoriosPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
	const [filtroTurma, setFiltroTurma] = useState<string>("todas");
	const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
	const [periodoAnalise, setPeriodoAnalise] = useState<PeriodoAnalise>("mes");
	const [viewMode, setViewMode] = useState<"alunos" | "turmas">("alunos");
	const [filtroProfessor, setFiltroProfessor] = useState<string>("todos");
	const [exportKind, setExportKind] = useState<ExportKind>("alunos");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const turmasUnicas = useMemo(
		() => Array.from(new Set(mockAlunos.map((aluno) => aluno.turma))),
		[],
	);

	const disciplinasUnicas = useMemo(
		() => Array.from(new Set(mockTurmas.map((turma) => turma.disciplina))),
		[],
	);

	const professoresUnicos = useMemo(
		() => Array.from(new Set(mockTurmas.map((turma) => turma.professor))),
		[],
	);

	const alunosFiltrados = useMemo(() => {
		const termo = searchTerm.trim().toLowerCase();
		return mockAlunos.filter((aluno) => {
			const matchesSearch =
				!termo || aluno.nome.toLowerCase().includes(termo) || aluno.matricula.includes(searchTerm.trim());
			const matchesTurma = filtroTurma === "todas" || aluno.turma === filtroTurma;
			return matchesSearch && matchesTurma;
		});
	}, [searchTerm, filtroTurma]);

	useEffect(() => {
		if (!alunosFiltrados.length) {
			setSelectedAlunoId(null);
			return;
		}
		if (!selectedAlunoId || !alunosFiltrados.some((aluno) => aluno.id === selectedAlunoId)) {
			setSelectedAlunoId(alunosFiltrados[0].id);
		}
	}, [alunosFiltrados, selectedAlunoId]);

	const alunoAtivo = useMemo(() => {
		if (!alunosFiltrados.length) {
			return null;
		}
		if (!selectedAlunoId) {
			return alunosFiltrados[0];
		}
		return alunosFiltrados.find((aluno) => aluno.id === selectedAlunoId) ?? alunosFiltrados[0];
	}, [alunosFiltrados, selectedAlunoId]);

	const timelineOrdenada = useMemo(() => {
		if (!alunoAtivo) {
			return [] as MovimentacaoMoedas[];
		}
		return [...alunoAtivo.historicoMoedas].sort(
			(a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
		);
	}, [alunoAtivo]);

	const notasOrdenadas = useMemo(() => {
		if (!alunoAtivo) {
			return [] as AlunoNota[];
		}
		return [...alunoAtivo.notas].sort(
			(a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
		);
	}, [alunoAtivo]);

	const alunosRankingTabela = useMemo(() => {
		return [...alunosFiltrados].sort((a, b) => a.ranking.posicaoTurma - b.ranking.posicaoTurma);
	}, [alunosFiltrados]);

	const turmasFiltradas = useMemo(() => {
		const termo = searchTerm.trim().toLowerCase();
		return mockTurmas.filter((turma) => {
			const matchesTurma = filtroTurma === "todas" || turma.turma === filtroTurma;
			const matchesDisciplina = filtroDisciplina === "todas" || turma.disciplina.toLowerCase() === filtroDisciplina;
			const matchesProfessor = filtroProfessor === "todos" || turma.professor === filtroProfessor;
			const matchesSearch =
				!termo || turma.turma.toLowerCase().includes(termo) || turma.disciplina.toLowerCase().includes(termo);
			return matchesTurma && matchesDisciplina && matchesProfessor && matchesSearch;
		});
	}, [searchTerm, filtroTurma, filtroDisciplina, filtroProfessor]);

	function filterByPeriodo<T extends { mes: string }>(evolucao: T[]): T[] {
		const size = evolucao.length;
		switch (periodoAnalise) {
			case "semana":
				return evolucao.slice(Math.max(0, size - 1));
			case "bimestre":
				return evolucao.slice(Math.max(0, size - 2));
			case "semestre":
				return evolucao.slice(Math.max(0, size - 6));
			case "ano":
				return evolucao.slice(-12);
			case "mes":
			default:
				return evolucao.slice(Math.max(0, size - 1));
		}
	}

	const turmaRef = useMemo(() => {
		const base = turmasFiltradas[0] ?? mockTurmas[0];
		if (!base) {
			return {
				turma: "-",
				disciplina: "-",
				professor: "-",
				mediaMoedas: 0,
				mediaNotas: 0,
				totalAlunos: 0,
				distribuicaoMoedas: [],
				evolucaoMensal: [],
				avaliacoes: [],
			} as DadosTurma;
		}
		return {
			...base,
			evolucaoMensal: filterByPeriodo(base.evolucaoMensal),
			distribuicaoMoedas: base.distribuicaoMoedas,
			avaliacoes: base.avaliacoes,
		};
	}, [turmasFiltradas, periodoAnalise]);

	const indicadoresTurmas = useMemo(() => {
		if (!turmasFiltradas.length) {
			return {
				mediaMoedas: 0,
				mediaNotas: 0,
				totalAlunos: 0,
			};
		}
		const totalAlunos = turmasFiltradas.reduce((acc, turma) => acc + turma.totalAlunos, 0);
		const mediaMoedas = turmasFiltradas.reduce((acc, turma) => acc + turma.mediaMoedas, 0) / turmasFiltradas.length;
		const mediaNotas = turmasFiltradas.reduce((acc, turma) => acc + turma.mediaNotas, 0) / turmasFiltradas.length;
		return {
			mediaMoedas,
			mediaNotas,
			totalAlunos,
		};
	}, [turmasFiltradas]);

	const resumoTurmas = useMemo(() => {
		if (turmasFiltradas.length) {
			return indicadoresTurmas;
		}
		return {
			mediaMoedas: turmaRef.mediaMoedas,
			mediaNotas: turmaRef.mediaNotas,
			totalAlunos: turmaRef.totalAlunos,
		};
	}, [indicadoresTurmas, turmaRef, turmasFiltradas.length]);

	const turmasParaTabela = useMemo(() => {
		return turmasFiltradas.length ? turmasFiltradas : mockTurmas;
	}, [turmasFiltradas]);

	const rankingTurmaAtual = useMemo(() => {
		return [...turmaRef.distribuicaoMoedas].sort((a, b) => b.moedas - a.moedas);
	}, [turmaRef]);

	const avaliacoesOrdenadas = useMemo(() => {
		return [...turmaRef.avaliacoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
	}, [turmaRef]);

	const houveNotasBaixas = useMemo(() => {
		return alunoAtivo ? alunoAtivo.notas.some((nota) => nota.nota < nota.mediaMinima) : false;
	}, [alunoAtivo]);

	const topAlunoTurma = rankingTurmaAtual[0] ?? null;
	const ultimoAlunoTurma = rankingTurmaAtual.length
		? rankingTurmaAtual[rankingTurmaAtual.length - 1]
		: null;
	const mediaMoedasTurmaAtiva = turmaRef.mediaMoedas;

	return (
		<AdminLayout>
			<div className="space-y-6">
				<header className="flex items-center justify-between">
					<div className="space-y-1">
						<h1 className="flex items-center gap-2 text-2xl font-bold">
							<LineChartIcon className="h-5 w-5 text-violet-500" />
							Relatórios de Desempenho
						</h1>
						<p className="text-muted-foreground">
							Analise o desempenho por turma ou aluno e exporte os indicadores principais.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Select value={exportKind} onValueChange={(valor) => setExportKind(valor as ExportKind)}>
							<SelectTrigger className="w-[180px] rounded-lg">
								<SelectValue placeholder="Exportar" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="alunos">Alunos</SelectItem>
								<SelectItem value="turmas">Turmas</SelectItem>
								<SelectItem value="disciplinas">Disciplinas</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							className="rounded-lg"
							onClick={() => {
								let rows: Record<string, string | number>[] = [];
								if (exportKind === "alunos") {
									rows = alunosFiltrados.map((aluno) => ({
										nome: aluno.nome,
										matricula: aluno.matricula,
										turma: aluno.turma,
										saldoMoedas: aluno.saldoMoedas,
										posicaoTurma: aluno.ranking.posicaoTurma,
										posicaoEscola: aluno.ranking.posicaoEscola,
									}));
								} else if (exportKind === "turmas") {
									rows = turmasParaTabela.map((turma) => ({
										turma: turma.turma,
										disciplina: turma.disciplina,
										professor: turma.professor,
										mediaMoedas: turma.mediaMoedas,
										mediaNotas: turma.mediaNotas,
										totalAlunos: turma.totalAlunos,
									}));
								} else {
									const map = new Map<
										string,
										{ disciplina: string; mediaMoedas: number[]; mediaNotas: number[]; totalAlunos: number }
									>();
									turmasParaTabela.forEach((turma) => {
										const atual =
											map.get(turma.disciplina) ?? {
												disciplina: turma.disciplina,
												mediaMoedas: [],
												mediaNotas: [],
												totalAlunos: 0,
											};
										atual.mediaMoedas.push(turma.mediaMoedas);
										atual.mediaNotas.push(turma.mediaNotas);
										atual.totalAlunos += turma.totalAlunos;
										map.set(turma.disciplina, atual);
									});
									rows = Array.from(map.values()).map((disciplina) => ({
										disciplina: disciplina.disciplina,
										mediaMoedas: (
											disciplina.mediaMoedas.reduce((acc, valor) => acc + valor, 0)
											/ (disciplina.mediaMoedas.length || 1)
										).toFixed(2),
										mediaNotas: (
											disciplina.mediaNotas.reduce((acc, valor) => acc + valor, 0)
											/ (disciplina.mediaNotas.length || 1)
										).toFixed(2),
										totalAlunos: disciplina.totalAlunos,
									}));
								}
								const headers = Object.keys(rows[0] || {});
								const csv = [
									headers.join(","),
									...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")),
								].join("\n");
								const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
								const url = URL.createObjectURL(blob);
								const anchor = document.createElement("a");
								anchor.href = url;
								anchor.download = `relatorio-${exportKind}.csv`;
								anchor.click();
								URL.revokeObjectURL(url);
							}}
						>
							<Download className="mr-2 h-4 w-4" />
							Exportar CSV
						</Button>
						<Button className="rounded-lg bg-violet-600 hover:bg-violet-700" onClick={() => window.print()}>
							Imprimir/PDF
						</Button>
					</div>
				</header>

				<div className="hidden border-b pb-4 print:block">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
							<div>
								<p className="font-semibold">Escola Exemplo</p>
								<p className="text-sm text-muted-foreground">Relatórios de Desempenho</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("pt-BR")}</p>
					</div>
				</div>

				<div className="flex space-x-2 border-b">
					<button
						className={`px-4 py-2 text-sm font-medium ${
							viewMode === "alunos"
								? "border-b-2 border-violet-600 text-violet-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => {
							setViewMode("alunos");
							setExportKind("alunos");
						}}
					>
						Visualização por Alunos
					</button>
					<button
						className={`px-4 py-2 text-sm font-medium ${
							viewMode === "turmas"
								? "border-b-2 border-violet-600 text-violet-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => {
							setViewMode("turmas");
							setExportKind("turmas");
						}}
					>
						Análise por Turmas
					</button>
				</div>

				<Card className="mt-4 rounded-xl">
					<CardContent className="p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="flex max-w-[320px] items-center gap-2">
								<Search className="h-4 w-4 text-muted-foreground" />
								<Input
									placeholder={
										viewMode === "alunos"
											? "Buscar por nome ou matrícula..."
											: "Buscar por turma ou disciplina..."
									}
									className="rounded-lg"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Select value={filtroTurma} onValueChange={setFiltroTurma}>
									<SelectTrigger className="w-[180px] rounded-lg">
										<SelectValue placeholder="Turma" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todas">Todas as turmas</SelectItem>
										{turmasUnicas.map((turma) => (
											<SelectItem key={turma} value={turma}>
												{turma}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
									<SelectTrigger className="w-[180px] rounded-lg">
										<SelectValue placeholder="Disciplina" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todas">Todas as disciplinas</SelectItem>
										{disciplinasUnicas.map((disciplina) => (
											<SelectItem key={disciplina} value={disciplina.toLowerCase()}>
												{disciplina}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={filtroProfessor} onValueChange={setFiltroProfessor}>
									<SelectTrigger className="w-[200px] rounded-lg">
										<SelectValue placeholder="Professor" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="todos">Todos os professores</SelectItem>
										{professoresUnicos.map((professor) => (
											<SelectItem key={professor} value={professor}>
												{professor}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={periodoAnalise} onValueChange={(valor) => setPeriodoAnalise(valor as PeriodoAnalise)}>
									<SelectTrigger className="w-[200px] rounded-lg">
										<SelectValue placeholder="Período" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="semana">Semana</SelectItem>
										<SelectItem value="mes">Mês</SelectItem>
										<SelectItem value="bimestre">Bimestre</SelectItem>
										<SelectItem value="semestre">Semestre</SelectItem>
										<SelectItem value="ano">Ano letivo</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				{viewMode === "turmas" && (
					<div className="grid gap-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-muted-foreground">Média de moedas</p>
											<h3 className="text-3xl font-bold text-violet-600">
												{resumoTurmas.mediaMoedas.toFixed(1)}
											</h3>
											<p className="mt-2 text-xs text-muted-foreground">
												Destaque atual: {turmaRef.turma} • {turmaRef.disciplina}
											</p>
										</div>
										<Coins className="h-8 w-8 text-violet-500" />
									</div>
								</CardContent>
							</Card>
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-muted-foreground">Média de notas</p>
											<h3 className="text-3xl font-bold text-violet-600">
												{resumoTurmas.mediaNotas.toFixed(1)}
											</h3>
											<p className="mt-2 text-xs text-muted-foreground">
												Professor responsável: {turmaRef.professor}
											</p>
										</div>
										<TrendingUp className="h-8 w-8 text-violet-500" />
									</div>
								</CardContent>
							</Card>
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-muted-foreground">Total de alunos</p>
											<h3 className="text-3xl font-bold text-violet-600">{resumoTurmas.totalAlunos}</h3>
											<p className="mt-2 text-xs text-muted-foreground">Inclui turmas dentro dos filtros aplicados</p>
										</div>
										<FileText className="h-8 w-8 text-violet-500" />
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<h3 className="mb-4 text-lg font-semibold">Evolução mensal</h3>
									<p className="mb-4 text-sm text-muted-foreground">
										Acompanhe a progressão das moedas e das notas no período selecionado.
									</p>
									{isClient ? (
										<ResponsiveContainer width="100%" height={300}>
											<LineChart data={turmaRef.evolucaoMensal}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="mes" />
												<YAxis yAxisId="left" />
												<YAxis yAxisId="right" orientation="right" />
												<Tooltip />
												<Legend />
												<Line yAxisId="left" type="monotone" dataKey="moedas" stroke="#8b5cf6" name="Moedas" />
												<Line yAxisId="right" type="monotone" dataKey="notas" stroke="#22c55e" name="Notas" />
											</LineChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[300px] w-full animate-pulse rounded-lg bg-muted" />
									)}
								</CardContent>
							</Card>

							<Card className="rounded-xl">
								<CardContent className="p-6">
									<h3 className="mb-4 text-lg font-semibold">Distribuição de moedas</h3>
									<p className="mb-4 text-sm text-muted-foreground">
										Compare rapidamente o volume de moedas distribuídas entre os alunos.
									</p>
									{isClient ? (
										<ResponsiveContainer width="100%" height={300}>
											<BarChart data={turmaRef.distribuicaoMoedas}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="nome" />
												<YAxis />
												<Tooltip />
												<Bar dataKey="moedas" fill="#8b5cf6">
													{turmaRef.distribuicaoMoedas.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.moedas >= mediaMoedasTurmaAtiva ? "#22c55e" : "#8b5cf6"} />
													))}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[300px] w-full animate-pulse rounded-lg bg-muted" />
									)}
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<h3 className="mb-4 text-lg font-semibold">Participação por aluno</h3>
									<p className="mb-4 text-sm text-muted-foreground">
										Distribuição percentual de moedas por aluno dentro da turma selecionada.
									</p>
									{isClient ? (
										<ResponsiveContainer width="100%" height={300}>
											<PieChart>
												<Pie data={turmaRef.distribuicaoMoedas} dataKey="moedas" nameKey="nome" outerRadius={100} label>
													{turmaRef.distribuicaoMoedas.map((entry, index) => (
														<Cell key={`slice-${index}`} fill={["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"][index % 5]} />
													))}
												</Pie>
												<Tooltip />
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									) : (
										<div className="h-[300px] w-full animate-pulse rounded-lg bg-muted" />
									)}
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-6 lg:grid-cols-2">
							<Card className="rounded-xl">
								<CardContent className="p-6">
									<h3 className="text-lg font-semibold">Notas médias por avaliação</h3>
									<p className="text-sm text-muted-foreground">
										Resultados da turma em cada avaliação registrada no período.
									</p>
									<div className="mt-4 overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b text-left">
													<th className="py-2 font-medium">Avaliação</th>
													<th className="py-2 font-medium">Data</th>
													<th className="py-2 font-medium">Média</th>
												</tr>
											</thead>
											<tbody>
												{avaliacoesOrdenadas.map((avaliacao) => (
													<tr key={`${avaliacao.nome}-${avaliacao.data}`} className="border-b last:border-0">
														<td className="py-2">{avaliacao.nome}</td>
														<td className="py-2 text-muted-foreground">
															{new Date(avaliacao.data).toLocaleDateString("pt-BR")}
														</td>
														<td className="py-2 font-medium text-violet-600">{avaliacao.media.toFixed(1)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardContent>
							</Card>

							<Card className="rounded-xl">
								<CardContent className="p-6">
									<h3 className="text-lg font-semibold">Ranking completo da turma</h3>
									<p className="text-sm text-muted-foreground">
										Ordenação dos alunos por saldo total de moedas acumuladas.
									</p>
									<div className="mt-4 overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b text-left">
													<th className="py-2 font-medium">Posição</th>
													<th className="py-2 font-medium">Aluno</th>
													<th className="py-2 font-medium">Moedas</th>
												</tr>
											</thead>
											<tbody>
												{rankingTurmaAtual.map((aluno, index) => (
													<tr key={aluno.nome} className="border-b last:border-0">
														<td className="py-2 font-medium">{index + 1}º</td>
														<td className="py-2">
															<div className="flex items-center gap-2">
																<span>{aluno.nome}</span>
																{index < 3 && (
																	<Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
																		Top {index + 1}
																	</Badge>
																)}
															</div>
														</td>
														<td className="py-2 font-semibold text-violet-600">{aluno.moedas}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card className="rounded-xl">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold">Insights rápidos</h3>
								<div className="mt-4 space-y-2 text-sm text-muted-foreground">
									<p>
										- Maior saldo: {topAlunoTurma ? `${topAlunoTurma.nome} (${topAlunoTurma.moedas} moedas)` : "sem dados"}
									</p>
									<p>
										- Menor saldo: {ultimoAlunoTurma ? `${ultimoAlunoTurma.nome} (${ultimoAlunoTurma.moedas} moedas)` : "sem dados"}
									</p>
									<p>
										- Diferença para a média: {
											topAlunoTurma
												? `${(topAlunoTurma.moedas - mediaMoedasTurmaAtiva).toFixed(1)} moedas acima`
												: "sem dados"
										}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-xl">
							<CardContent className="p-6">
								<h3 className="mb-4 text-lg font-semibold">Resumo por turma</h3>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b">
												<th className="py-3 text-left font-medium">Turma</th>
												<th className="py-3 text-left font-medium">Disciplina</th>
												<th className="py-3 text-left font-medium">Professor</th>
												<th className="py-3 text-left font-medium">Média moedas</th>
												<th className="py-3 text-left font-medium">Média notas</th>
												<th className="py-3 text-left font-medium">Total alunos</th>
											</tr>
										</thead>
										<tbody>
											{turmasParaTabela.map((turma) => {
												const isAtiva = turma.turma === turmaRef.turma && turma.disciplina === turmaRef.disciplina;
												return (
													<tr
														key={`${turma.turma}-${turma.disciplina}`}
														className={`border-b last:border-0 ${isAtiva ? "bg-violet-50/60" : ""}`}
													>
														<td className="py-3 font-medium text-foreground">{turma.turma}</td>
														<td className="py-3 text-muted-foreground">{turma.disciplina}</td>
														<td className="py-3 text-muted-foreground">{turma.professor}</td>
														<td className="py-3">{turma.mediaMoedas.toFixed(1)}</td>
														<td className="py-3">{turma.mediaNotas.toFixed(1)}</td>
														<td className="py-3">{turma.totalAlunos}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{viewMode === "alunos" && (
					<div className="space-y-6">
						<Card className="rounded-xl">
							<CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
								<div>
									<h2 className="text-xl font-semibold text-foreground">Painel individual do aluno</h2>
									<p className="text-sm text-muted-foreground">
										Selecione um aluno para visualizar ranking, notas, moedas e alertas em detalhes.
									</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">Aluno</span>
									<Select
										disabled={!alunosFiltrados.length}
										value={selectedAlunoId ?? (alunosFiltrados[0]?.id ?? "")}
										onValueChange={(valor) => setSelectedAlunoId(valor)}
									>
										<SelectTrigger className="w-[220px] rounded-lg">
											<SelectValue placeholder="Selecionar aluno" />
										</SelectTrigger>
										<SelectContent>
											{alunosFiltrados.map((aluno) => (
												<SelectItem key={aluno.id} value={aluno.id}>
													{aluno.nome} • {aluno.turma}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						{alunoAtivo ? (
							<>
								<Card className="rounded-xl">
									<CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
										<div className="space-y-3">
											<div>
												<h3 className="text-2xl font-semibold text-foreground">{alunoAtivo.nome}</h3>
												<p className="text-sm text-muted-foreground">
													Matrícula: {alunoAtivo.matricula} • Turma: {alunoAtivo.turma}
												</p>
											</div>
											<div className="flex flex-wrap gap-2">
												<Badge variant="secondary" className="rounded-full">
													Posição na turma: {alunoAtivo.ranking.posicaoTurma}º de {alunoAtivo.ranking.totalAlunosTurma}
												</Badge>
												<Badge variant="outline" className="rounded-full border-violet-200 text-violet-600">
													Posição na escola: {alunoAtivo.ranking.posicaoEscola}º de {alunoAtivo.ranking.totalAlunosEscola}
												</Badge>
												<Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
													Saldo atual: {alunoAtivo.saldoMoedas} moedas
												</Badge>
											</div>
										</div>
										<div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm leading-relaxed text-violet-800">
											<p>
												Destaque: {alunoAtivo.ranking.posicaoTurma <= 3 ? "entre os melhores da turma." : "acompanhamento em progresso."}
											</p>
											<p className="mt-1 text-xs text-muted-foreground">
												Última atualização: {timelineOrdenada[0] ? new Date(timelineOrdenada[0].data).toLocaleDateString("pt-BR") : "sem registros"}
											</p>
										</div>
									</CardContent>
								</Card>

								<div className="grid gap-4 md:grid-cols-3">
									<Card className="rounded-xl">
										<CardContent className="p-6">
											<p className="text-sm text-muted-foreground">Saldo de moedas</p>
											<div className="mt-2 flex items-baseline gap-2">
												<Coins className="h-6 w-6 text-amber-500" />
												<span className="text-3xl font-bold text-violet-600">{alunoAtivo.saldoMoedas}</span>
												<span className="text-sm text-muted-foreground">moedas</span>
											</div>
											<p className="mt-2 text-xs text-muted-foreground">
												Consulte a linha do tempo para ver ganhos e gastos detalhados.
											</p>
										</CardContent>
									</Card>
									<Card className="rounded-xl">
										<CardContent className="p-6">
											<p className="text-sm text-muted-foreground">Ranking na turma</p>
											<div className="mt-2 flex items-baseline gap-2">
												<Medal className="h-6 w-6 text-emerald-500" />
												<span className="text-3xl font-bold text-violet-600">{alunoAtivo.ranking.posicaoTurma}º</span>
												<span className="text-sm text-muted-foreground">de {alunoAtivo.ranking.totalAlunosTurma}</span>
											</div>
											<p className="mt-2 text-xs text-muted-foreground">
												Posições melhores habilitam recompensas adicionais.
											</p>
										</CardContent>
									</Card>
									<Card className="rounded-xl">
										<CardContent className="p-6">
											<p className="text-sm text-muted-foreground">Ranking na escola</p>
											<div className="mt-2 flex items-baseline gap-2">
												<TrendingUp className="h-6 w-6 text-sky-500" />
												<span className="text-3xl font-bold text-violet-600">{alunoAtivo.ranking.posicaoEscola}º</span>
												<span className="text-sm text-muted-foreground">de {alunoAtivo.ranking.totalAlunosEscola}</span>
											</div>
											<p className="mt-2 text-xs text-muted-foreground">
												Comparativo geral com estudantes de outras turmas.
											</p>
										</CardContent>
									</Card>
								</div>

								<div className="grid gap-6 lg:grid-cols-2">
									<Card className="rounded-xl">
										<CardContent className="p-6">
											<h4 className="text-lg font-semibold">Notas por disciplina</h4>
											<p className="text-sm text-muted-foreground">
												Comparativo entre a nota do aluno e a média mínima esperada.
											</p>
											<div className="mt-4 overflow-x-auto">
												<table className="w-full text-sm">
													<thead>
														<tr className="border-b text-left">
															<th className="py-2 font-medium">Disciplina</th>
															<th className="py-2 font-medium">Nota</th>
															<th className="py-2 font-medium">Média mínima</th>
															<th className="py-2 font-medium">Data</th>
														</tr>
													</thead>
													<tbody>
														{notasOrdenadas.map((nota) => (
															<tr key={`${nota.disciplina}-${nota.data}`} className="border-b last:border-0">
																<td className="py-2">{nota.disciplina}</td>
																<td
																	className={`py-2 font-semibold ${
																		nota.nota < nota.mediaMinima ? "text-red-600" : "text-emerald-600"
																	}`}
																>
																	{nota.nota.toFixed(1)}
																</td>
																<td className="py-2 text-muted-foreground">{nota.mediaMinima.toFixed(1)}</td>
																<td className="py-2 text-muted-foreground">
																	{new Date(nota.data).toLocaleDateString("pt-BR")}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</CardContent>
									</Card>

									<Card className="rounded-xl">
										<CardContent className="p-6">
											<h4 className="text-lg font-semibold">Linha do tempo de moedas</h4>
											<p className="text-sm text-muted-foreground">
												Registro detalhado de ganhos e gastos por disciplina.
											</p>
											<div className="relative mt-4 pl-6">
												<div className="absolute left-2 top-0 bottom-0 w-px bg-violet-200" />
												<div className="space-y-3">
													{timelineOrdenada.map((movimento) => (
														<div key={movimento.id} className="relative">
															<span className="absolute -left-[7px] mt-2 h-3 w-3 rounded-full border-2 border-violet-400 bg-white" />
															<div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3">
																<div className="flex items-center justify-between">
																	<span className="font-medium">{movimento.disciplina}</span>
																	<span className={movimento.tipo === "ganho" ? "text-green-600" : "text-red-600"}>
																		{movimento.tipo === "ganho" ? "+" : "-"}
																		{movimento.quantidade}
																	</span>
																</div>
																<p className="mt-1 text-sm text-muted-foreground">{movimento.motivo}</p>
																<p className="mt-1 text-xs text-muted-foreground">
																	{new Date(movimento.data).toLocaleDateString("pt-BR")}
																</p>
															</div>
														</div>
													))}
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{houveNotasBaixas && (
									<Card className="rounded-xl border-yellow-200 bg-yellow-50/80">
										<CardContent className="flex items-start gap-3 p-4 text-yellow-800">
											<AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
											<div>
												<p className="font-semibold">Atenção aos indicadores</p>
												<p className="text-sm">
													Este aluno possui ao menos uma nota abaixo da média mínima definida para a disciplina.
												</p>
											</div>
										</CardContent>
									</Card>
								)}

								<Card className="rounded-xl">
									<CardContent className="p-6">
										<h4 className="text-lg font-semibold">Ranking da turma (alunos filtrados)</h4>
										<p className="text-sm text-muted-foreground">
											Veja como o aluno selecionado se posiciona em relação aos demais resultados filtrados.
										</p>
										<div className="mt-4 overflow-x-auto">
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b text-left">
														<th className="py-2 font-medium">Posição</th>
														<th className="py-2 font-medium">Aluno</th>
														<th className="py-2 font-medium">Turma</th>
														<th className="py-2 font-medium">Saldo de moedas</th>
													</tr>
												</thead>
												<tbody>
													{alunosRankingTabela.map((aluno) => (
														<tr
															key={aluno.id}
															className={`border-b last:border-0 ${
																alunoAtivo.id === aluno.id ? "bg-violet-50/60" : ""
															}`}
														>
															<td className="py-2">{aluno.ranking.posicaoTurma}º</td>
															<td className="py-2">{aluno.nome}</td>
															<td className="py-2 text-muted-foreground">{aluno.turma}</td>
															<td className="py-2 font-medium text-violet-600">{aluno.saldoMoedas}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</>
						) : (
							<Card className="rounded-xl border-dashed">
								<CardContent className="p-10 text-center text-muted-foreground">
									Nenhum aluno encontrado com os filtros aplicados.
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
