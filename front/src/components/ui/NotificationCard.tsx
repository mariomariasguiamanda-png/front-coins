"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface NotificationCardProps {
  show: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "warning" | "info" | "error";
  autoClose?: boolean;
  duration?: number;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  show,
  onClose,
  message,
  type = "info",
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  const getTypeData = () => {
    switch (type) {
      case "success":
        return {
          color: "emerald",
          icon: CheckCircle,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          iconColor: "text-emerald-600",
        };
      case "warning":
        return {
          color: "yellow",
          icon: AlertCircle,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600",
        };
      case "error":
        return {
          color: "red",
          icon: AlertCircle,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600",
        };
      default:
        return {
          color: "blue",
          icon: Info,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-600",
        };
    }
  };

  const typeData = getTypeData();
  const IconComponent = typeData.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <Card
        className={`max-w-sm ${typeData.bgColor} ${typeData.borderColor} border-2 shadow-lg rounded-xl`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <IconComponent className={`h-5 w-5 ${typeData.iconColor}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${typeData.textColor}`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${typeData.iconColor} hover:opacity-70 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCard;
