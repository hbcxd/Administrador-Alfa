import React from 'react';

export default function ProjectForm() {
  return (
    <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Añadir Nueva Plataforma</h2>
      <p className="text-sm text-slate-400 mb-6">Configura los accesos de la base de datos de tu página hija.</p>
      <div className="space-y-4">
        <input type="text" placeholder="Nombre de la página (Ej. Pedacito de Gracia)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-primary" />
        <button className="w-full bg-brand-primary text-white font-medium p-3 rounded-xl hover:bg-blue-600 transition text-sm">Guardar Configuración</button>
      </div>
    </div>
  );
}
