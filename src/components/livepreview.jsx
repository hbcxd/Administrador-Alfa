import React from 'react';

export default function LivePreview() {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center p-6">
      <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-brand-primary animate-spin mb-4"></div>
      <p className="text-sm font-medium text-slate-400">Vista Previa Activa</p>
    </div>
  );
}
