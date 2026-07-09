import React from 'react';
import { useProjects } from '../context/ProjectContext';

export default function Sidebar({ setView }) {
  const { projects, activeProject, selectProject } = useProjects();

  return (
    <aside className="w-72 bg-brand-surface border-r border-slate-800 flex flex-col justify-between h-full text-slate-300">
      {/* Encabezado del Panel */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-md shadow-brand-primary/20">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">MasterPanel</h1>
            <span className="text-xs text-slate-500 font-medium">Centro de Control</span>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="space-y-1 mb-8">
          <button 
            onClick={() => setView('config')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>➕ Añadir Plataforma</span>
          </button>
          <button 
            onClick={() => setView('appearance')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition"
          >
            <span>🎨 Personalizar Panel</span>
          </button>
        </nav>

        {/* Lista de Páginas Conectadas */}
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-4 mb-3">
            Tus Plataformas
          </span>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-2">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-600 px-4 italic">No hay páginas vinculadas aún</p>
            ) : (
              projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => selectProject(proj)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                    activeProject?.id === proj.id 
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{proj.name}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {proj.storageProvider}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pie de la barra lateral */}
      <div className="p-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-600 font-medium">Desarrollado con React + Vite</p>
      </div>
    </aside>
  );
}

