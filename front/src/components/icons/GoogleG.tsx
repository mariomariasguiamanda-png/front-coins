import React from "react";

interface GoogleGProps {
  className?: string;
  title?: string;
  width?: number;
  height?: number;
}

export default function GoogleG({
  className = "h-4 w-4",
  title,
  width = 18,
  height = 18,
}: GoogleGProps) {
  const a11yProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": "true" as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={width}
      height={height}
      className={className}
      {...a11yProps}
    >
      {/* Azul */}
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6384-.0573-1.2518-.1636-1.8363H9v3.4727h4.8445a4.143 4.143 0 0 1-1.796 2.7155v2.2564h2.9073c1.7018-1.5664 2.6842-3.8727 2.6842-6.6083z"
      />
      {/* Verde */}
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4686-.8062 5.9582-2.1873l-2.9073-2.2564c-.8062.54-1.8377.8614-3.0509.8614-2.3464 0-4.3327-1.5837-5.0418-3.7118H.9573v2.3346C2.4391 15.9836 5.4818 18 9 18z"
      />
      {/* Amarelo */}
      <path
        fill="#FBBC05"
        d="M3.9582 10.7059A5.4162 5.4162 0 0 1 3.675 9c0-.5932.1018-1.1673.2832-1.7059V4.9591H.9573A8.9957 8.9957 0 0 0 0 9c0 1.4627.3491 2.8464.9573 4.0409l3.0009-2.335z"
      />
      {/* Vermelho */}
      <path
        fill="#EA4335"
        d="M9 3.5455c1.3214 0 2.5127.455 3.4473 1.3486l2.5854-2.5855C13.4659.8714 11.4273 0 9 0 5.4818 0 2.4391 2.0164.9573 4.9591l3.0009 2.3349C4.6673 5.1655 6.6536 3.5455 9 3.5455z"
      />
    </svg>
  );
}
