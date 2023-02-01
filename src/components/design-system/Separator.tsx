import React from "react";

export default function Separator({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center">
      <div className="w-full border-b" />
      {children && (
        <span className="z-10 mx-4 bg-white text-center text-xs font-medium text-slate-500">
          {children}
        </span>
      )}
      <div className="w-full border-b" />
    </div>
  );
}
