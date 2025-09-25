import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-secondary-600 text-sm">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};
