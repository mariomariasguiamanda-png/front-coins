import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ImportRow {
  line: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  valid: boolean;
  errors: string[];
}

interface ImportUsersDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (users: Array<{
    name: string;
    email: string;
    phone: string;
    type: "student" | "teacher";
    status: "active" | "inactive";
  }>) => Promise<{ success: number; errors: number }>;
}

export function ImportUsersDialog({ open, onClose, onImport }: ImportUsersDialogProps) {
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRow = (row: any, lineNumber: number): ImportRow => {
    const errors: string[] = [];
    
    if (!row.name?.trim()) {
      errors.push("Nome é obrigatório");
    }
    
    if (!row.email?.trim()) {
      errors.push("E-mail é obrigatório");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push("E-mail inválido");
    }

    if (row.phone && !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(row.phone)) {
      errors.push("Telefone inválido");
    }

    if (!["student", "teacher"].includes(row.type)) {
      errors.push("Tipo deve ser 'student' ou 'teacher'");
    }

    if (!["active", "inactive", "pending"].includes(row.status)) {
      errors.push("Status deve ser 'active', 'inactive' ou 'pending'");
    }

    return {
      line: lineNumber,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      type: row.type || "",
      status: row.status || "",
      valid: errors.length === 0,
      errors,
    };
  };

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      return [];
    }

    // Skip header
    const dataLines = lines.slice(1);
    const parsed: ImportRow[] = [];

    dataLines.forEach((line, index) => {
      const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
      
      if (values.length >= 5) {
        const row = {
          name: values[0],
          email: values[1],
          phone: values[2] || "",
          type: values[3],
          status: values[4],
        };
        
        parsed.push(validateRow(row, index + 2)); // +2 because of header and 0-index
      }
    });

    return parsed;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setRows(parsed);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Erro ao ler arquivo CSV. Verifique o formato.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const validRows = rows.filter(r => r.valid);
    if (validRows.length === 0) {
      alert("Nenhum registro válido para importar");
      return;
    }

    const confirmed = confirm(
      `Confirma a importação de ${validRows.length} usuário(s)?\n` +
      `${rows.length - validRows.length} registro(s) com erro serão ignorados.`
    );

    if (!confirmed) return;

    setImporting(true);
    try {
      const users = validRows.map(r => ({
        name: r.name,
        email: r.email,
        phone: r.phone,
        type: r.type as "student" | "teacher",
        status: r.status as "active" | "inactive",
      }));

      const result = await onImport(users);
      setResult(result);
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar usuários. Tente novamente.");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setRows([]);
    setResult(null);
    setLoading(false);
    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    const template = "name,email,phone,type,status\n" +
      "João Silva,joao@escola.edu.br,(11) 98765-4321,student,active\n" +
      "Maria Santos,maria@escola.edu.br,(11) 98765-4322,teacher,active";
    
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-usuarios.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const validCount = rows.filter(r => r.valid).length;
  const invalidCount = rows.length - validCount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            Importar Usuários
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          {rows.length === 0 && !result && (
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Clique para selecionar arquivo CSV
                </p>
                <p className="text-xs text-gray-500">
                  Formato: nome, email, telefone, tipo, status
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-900 space-y-1">
                    <p className="font-medium text-blue-900">Formato do arquivo CSV:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700">
                      <li>Primeira linha: cabeçalho (name,email,phone,type,status)</li>
                      <li>Tipo: "student" ou "teacher"</li>
                      <li>Status: "active", "inactive" ou "pending"</li>
                      <li>Telefone: formato (XX) XXXXX-XXXX</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="w-full bg-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Baixar Template CSV
              </Button>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && !result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">{validCount} válidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">{invalidCount} inválidos</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRows([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Escolher Outro Arquivo
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Linha</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Nome</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Tipo</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((row) => (
                      <tr 
                        key={row.line} 
                        className={row.valid ? "bg-white" : "bg-red-50"}
                      >
                        <td className="px-3 py-2 text-xs text-gray-500">{row.line}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {row.valid ? (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs truncate">{row.name || "-"}</p>
                              {!row.valid && (
                                <p className="text-xs text-red-600">{row.errors.join(", ")}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs truncate">{row.email || "-"}</td>
                        <td className="px-3 py-2 text-xs">{row.type || "-"}</td>
                        <td className="px-3 py-2 text-xs">{row.status || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Importação Concluída
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">{result.success}</span> usuário(s) importado(s) com sucesso
                  </p>
                  {result.errors > 0 && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">{result.errors}</span> erro(s) durante importação
                    </p>
                  )}
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </div>

        {!result && rows.length > 0 && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={importing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing || validCount === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importando...
                </>
              ) : (
                `Importar ${validCount} Usuário(s)`
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
