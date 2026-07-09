import React from 'react';
import { useProjects } from '../context/ProjectContext';

export default function LivePreview() {
  const { activeProject } = useProjects();

  // Si no hay ningún proyecto seleccionado en la barra lateral
  if (!activeProject) {
    return (
      <div className="h-full w-full rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-slate-900/20">
        <span>🔍</span>
        <p className="text-sm mt-2 font-medium">Selecciona una plataforma en la barra lateral para ver la vista previa pública</p>
      </div>
    );
  }

  // Si el proyecto seleccionado no tiene una URL configurada todavía
  if (!activeProject.publicUrl) {
    return (
      <div className="h-full w-full rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-slate-900/20">
        <span>🌐</span>
        <p className="text-sm mt-2 font-medium">Esta plataforma ({activeProject.name}) no tiene una URL de producción configurada</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Barra de dirección simulada para que parezca un navegador moderno */}
      <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/40 block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/40 block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/40 block"></span>
        </div>
        <div className="flex-1 bg-slate-950 text-xs text-slate-400 py-1 px-3 rounded-lg border border-slate-800/60 truncate font-mono select-none">
          {activeProject.publicUrl}
        </div>
      </div>

      {/* El iFrame que cargará la página web */}
      <iframe 
        src={activeProject.publicUrl} 
        title={`Vista previa de ${activeProject.name}`}
        className="w-full flex-1 bg-white border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
