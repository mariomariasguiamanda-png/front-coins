import { DashboardProfessor } from "@/components/professor/DashboardProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function TeacherDashboardPage() {
  // Mock data - replace with API calls later
  const teacherData = {
    name: "Ana Silva",
    activities: [
      {
        discipline: "Matemática",
        total: 15,
        pending: 5,
        corrected: 10,
        color: "border-blue-500",
      },
      {
        discipline: "Física",
        total: 12,
        pending: 3,
        corrected: 9,
        color: "border-green-500",
      },
      {
        discipline: "Química",
        total: 10,
        pending: 4,
        corrected: 6,
        color: "border-purple-500",
      },
    ],
  };

  return (
    <ProfessorLayout>
      <DashboardProfessor
        teacherName={teacherData.name}
        activities={teacherData.activities}
      />
    </ProfessorLayout>
  );
}