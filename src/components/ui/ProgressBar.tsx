import React from "react";

interface ProgressBarProps {
  progress: number;
  liveProgress?: number;
  label?: string;
  showPercentage?: boolean;
  gradient?: string;
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  liveProgress,
  label = "Progresso",
  showPercentage = true,
  gradient = "from-violet-500 to-violet-700",
  height = "h-2",
  className = "",
}) => {
  // Use progresso ao vivo se disponível, senão use o progresso salvo
  const currentProgress = liveProgress !== undefined ? liveProgress : progress;
  const displayProgress = Math.round(
    Math.min(100, Math.max(0, currentProgress))
  );

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <p className="text-xs text-gray-500">{label}</p>}
          {showPercentage && (
            <p className="text-xs font-medium text-gray-700">
              {displayProgress}%
            </p>
          )}
        </div>
      )}

      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}
      >
        <div
          className={`${height} bg-gradient-to-r ${gradient} rounded-full progress-bar`}
          style={{
            width: `${displayProgress}%`,
            transform: "translateZ(0)", // Força aceleração de hardware
            transition:
              liveProgress !== undefined
                ? "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                : "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
};
