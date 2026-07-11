import React from 'react';
import { useProjects } from '../context/projectcontext';

export default function Sidebar({ setView, closeSidebar }) {
  const { projects, activeProject, selectProject, loading } = useProjects();

  return (
    <aside className="w-72 bg-brand-surface border-r border-slate-800 flex flex-col justify-between h-full text-slate-300 shadow-2xl lg:shadow-none">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-md">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">panel maestro</h1>
              <span className="text-xs text-slate-500 font-medium">Centro de Control</span>
            </div>
          </div>
          {/* Botón de salida para móviles */}
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white text-xl p-2 focus:outline-none">
            ✕
          </button>
        </div>

        <nav className="space-y-1 mb-8">
          <button onClick={() => setView('config')} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <span>➕ Añadir Plataforma</span>
          </button>
          
          {/* 👇 NUEVO BOTÓN: CONECTA DIRECTO CON TU CONSOLA DE PONER Y QUITAR CARACTERÍSTICAS */}
          <button onClick={() => setView('plataforma')} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <span>🌐 Administrar Características</span>
          </button>

          <button onClick={() => setView('appearance')} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <span>🎨 Personalizar Panel</span>
          </button>
          <button onClick={() => setView('instructions')} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
            <span>📖 Instrucciones y Reglas</span>
          </button>
        </nav>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-4 mb-3">Tus Plataformas</span>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto">
            {loading ? (
              <p className="text-xs text-slate-600 px-4 italic animate-pulse">Conectando a Firebase...</p>
            ) : projects.length === 0 ? (
              <p className="text-xs text-slate-600 px-4 italic">No hay páginas vinculadas</p>
            ) : (
              projects.map((proj) => (
                <button key={proj.id} onClick={() => { selectProject(proj); setView('manage'); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${activeProject?.id === proj.id ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-slate-800/50 text-slate-400'}`}>
                  {proj.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}