import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Calendar, FileText, Coins } from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  balance: number;
}

interface StudentHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  studentBalance: number;
}

export function StudentHistoryDialog({ 
  open, 
  onClose, 
  studentName,
  studentBalance 
}: StudentHistoryDialogProps) {
  // Mock data - substituir por dados reais da API
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "credit",
      amount: 100,
      description: "Participação em atividade - Matemática",
      date: "2024-11-01",
      balance: 450
    },
    {
      id: "2",
      type: "debit",
      amount: 50,
      description: "Compra de material escolar",
      date: "2024-10-30",
      balance: 350
    },
    {
      id: "3",
      type: "credit",
      amount: 150,
      description: "Nota acima da média - Português",
      date: "2024-10-28",
      balance: 400
    },
    {
      id: "4",
      type: "debit",
      amount: 80,
      description: "Troca por brinde",
      date: "2024-10-25",
      balance: 250
    },
    {
      id: "5",
      type: "credit",
      amount: 200,
      description: "Projeto extra - Ciências",
      date: "2024-10-20",
      balance: 330
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Histórico de Transações - {studentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Balance */}
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo Atual</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {studentBalance} <span className="text-lg font-normal text-gray-500">moedas</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider px-1">
              Últimas Transações
            </h3>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="rounded-lg shadow-sm hover:shadow-md transition-shadow border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          transaction.type === "credit" 
                            ? "bg-green-100" 
                            : "bg-red-100"
                        }`}>
                          {transaction.type === "credit" ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg font-bold ${
                          transaction.type === "credit" 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {transaction.type === "credit" ? "+" : "-"}{transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Saldo: {transaction.balance}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
