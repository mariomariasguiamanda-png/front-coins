import React from "react";

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function Popover({ trigger, children }: PopoverProps) {
  // Stub: render trigger and children inline. Replace with a proper popover if needed.
  return (
    <div className="inline-flex flex-col gap-2">
      <div>{trigger}</div>
      <div>{children}</div>
    </div>
  );
}

type ItemProps = React.HTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };
export function PopoverItem({ children, className = "", ...rest }: ItemProps) {
  return (
    <button
      type="button"
      className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Popover;
