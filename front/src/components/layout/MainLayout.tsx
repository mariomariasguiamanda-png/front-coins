"use client";

import React from "react";
import { Navigation } from "../ui/Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const navigationItems = [
  { href: "/homepage", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/perfil", label: "Perfil" },
  { href: "/ajuda", label: "Ajuda" },
];

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavigation = true,
}) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      {showNavigation && <Navigation items={navigationItems} />}
      <main className={showNavigation ? "pt-8" : ""}>{children}</main>
    </div>
  );
};
