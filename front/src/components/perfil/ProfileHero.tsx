"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Camera, LogOut, Save, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export interface ProfileStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "violet" | "amber" | "green";
}

const STAT_COLOR_CLASSES: Record<ProfileStat["color"], { border: string; iconBg: string; iconColor: string }> = {
  blue: { border: "border-l-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  violet: { border: "border-l-violet-500", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  amber: { border: "border-l-amber-500", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  green: { border: "border-l-green-500", iconBg: "bg-green-100", iconColor: "text-green-600" },
};

interface ProfileHeroProps {
  nomeCompleto: string;
  subtitulo: string;
  badges?: string[];
  fotoUrl?: string | null;
  onUploadFoto?: (file: File) => void;
  uploadingFoto?: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  onSignOut: () => void;
  stats?: ProfileStat[];
}

export function ProfileHero({
  nomeCompleto,
  subtitulo,
  badges,
  fotoUrl,
  onUploadFoto,
  uploadingFoto,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saving,
  onSignOut,
  stats,
}: ProfileHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && onUploadFoto) onUploadFoto(file);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative -mt-16 shrink-0">
              <div className="h-32 w-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-violet-500 flex items-center justify-center">
                    <User className="h-14 w-14 text-white" />
                  </div>
                )}
              </div>
              {onUploadFoto && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFoto}
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-60"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{nomeCompleto}</h1>
              <p className="text-gray-600 mt-1">{subtitulo}</p>
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {badges.slice(0, 3).map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700"
                    >
                      {badge}
                    </span>
                  ))}
                  {badges.length > 3 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      +{badges.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {!isEditing ? (
                <Button onClick={onEdit} className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onSave}
                    disabled={saving}
                    className="rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button onClick={onCancel} variant="outline" disabled={saving} className="rounded-xl">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
              <Button
                onClick={onSignOut}
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, idx) => {
            const classes = STAT_COLOR_CLASSES[stat.color];
            const Icon = stat.icon;
            return (
              <Card key={idx} className={`rounded-xl shadow-sm border-l-4 ${classes.border}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-lg ${classes.iconBg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${classes.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
