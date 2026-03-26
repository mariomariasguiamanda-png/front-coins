import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { RankingTurmaProfessor } from "@/components/professor/RankingTurmaProfessor";

export default function RankingTurmaPage() {
  const rankingData = [
    {
      studentId: "2024001",
      studentName: "João Silva",
      averageGrade: 9.0,
      totalCoins: 520,
      discipline: "Matemática",
      class: "1º A",
      attendance: 98,
    },
    {
      studentId: "2024002",
      studentName: "Maria Santos",
      averageGrade: 8.75,
      totalCoins: 485,
      discipline: "Matemática",
      class: "1º A",
      attendance: 95,
    },
    {
      studentId: "2024003",
      studentName: "Pedro Oliveira",
      averageGrade: 8.25,
      totalCoins: 420,
      discipline: "Matemática",
      class: "1º A",
      attendance: 92,
    },
    {
      studentId: "2024004",
      studentName: "Ana Costa",
      averageGrade: 7.75,
      totalCoins: 380,
      discipline: "Física",
      class: "2º B",
      attendance: 90,
    },
    {
      studentId: "2024005",
      studentName: "Carlos Ferreira",
      averageGrade: 7.25,
      totalCoins: 345,
      discipline: "Química",
      class: "3º C",
      attendance: 88,
    },
    {
      studentId: "2024006",
      studentName: "Beatriz Lima",
      averageGrade: 9.25,
      totalCoins: 500,
      discipline: "Biologia",
      class: "2º B",
      attendance: 97,
    },
    {
      studentId: "2024007",
      studentName: "Rafael Souza",
      averageGrade: 6.75,
      totalCoins: 310,
      discipline: "História",
      class: "3º C",
      attendance: 85,
    },
    {
      studentId: "2024008",
      studentName: "Juliana Alves",
      averageGrade: 8.25,
      totalCoins: 410,
      discipline: "Matemática",
      class: "1º A",
      attendance: 93,
    },
    {
      studentId: "2024009",
      studentName: "Lucas Mendes",
      averageGrade: 5.75,
      totalCoins: 260,
      discipline: "Química",
      class: "3º C",
      attendance: 80,
    },
    {
      studentId: "2024010",
      studentName: "Fernanda Rocha",
      averageGrade: 9.25,
      totalCoins: 510,
      discipline: "Português",
      class: "1º A",
      attendance: 96,
    },
    {
      studentId: "2024011",
      studentName: "Gabriel Torres",
      averageGrade: 8.0,
      totalCoins: 390,
      discipline: "Física",
      class: "2º B",
      attendance: 91,
    },
    {
      studentId: "2024012",
      studentName: "Larissa Martins",
      averageGrade: 4.75,
      totalCoins: 220,
      discipline: "Matemática",
      class: "1º A",
      attendance: 78,
    },
  ];

  return (
    <ProfessorLayout>
      <RankingTurmaProfessor rankingData={rankingData} />
    </ProfessorLayout>
  );
}
