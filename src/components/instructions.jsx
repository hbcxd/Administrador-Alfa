import React from 'react';

export default function Instructions() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-300 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Manual de Conexión</h2>
        <p className="text-sm text-slate-400 mt-2">Sigue este protocolo para vincular nuevas páginas web hijas.</p>
      </div>
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white">1. Credenciales Requeridas</h3>
        <p className="text-sm text-slate-400">Debes registrar el objeto de configuración que te da Firebase al crear la app web.</p>
      </section>
    </div>
  );
}
