import React, { useEffect, useRef, useState } from "react";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
}

export const Popover: React.FC<PopoverProps> = ({ trigger, children, align = "end" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer select-none">
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[140px] rounded-md border border-slate-200 bg-white p-1 text-sm shadow-md ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const PopoverItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button
    className={`w-full rounded-sm px-3 py-1.5 text-left hover:bg-violet-50 hover:text-violet-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);
