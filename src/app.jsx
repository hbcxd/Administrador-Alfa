import React, { useState } from 'react';
import { ProjectProvider } from './context/projectcontext';
import Sidebar from './components/sidebar';
import ProjectForm from './components/projectform';
import AppearanceForm from './components/appearanceform';
import ProjectManager from './components/projectmanager';
import Instructions from './components/instructions';
import LivePreview from './components/livepreview';

export default function App() {
  const [view, setView] = useState('config');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProjectProvider>
      <div className="flex h-screen bg-brand-bg font-sans overflow-hidden text-slate-100 relative">
        
        {/* Menú Lateral Desplegable */}
        <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
          <Sidebar setView={(v) => { setView(v); setIsSidebarOpen(false); }} closeSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {/* Capa oscura de enfoque al abrir el menú en teléfono */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-45 lg:hidden" />
        )}

        {/* Contenedor de la Interfaz Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Encabezado exclusivo para Pantallas Móviles */}
          <header className="lg:hidden bg-brand-surface border-b border-slate-800 p-4 flex items-center justify-between z-40 shadow-md">
            <button onClick={() => setIsSidebarOpen(true)} className="text-white text-2xl p-1 focus:outline-none">
              ☰
            </button>
            <h1 className="text-md font-bold text-white tracking-tight">panel maestro</h1>
            <div className="w-8"></div>
          </header>

          {/* Área de Contenido de Trabajo */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
              {view === 'config' && <ProjectForm />}
              {view === 'appearance' && <AppearanceForm />}
              {view === 'manage' && <ProjectManager />}
              {view === 'instructions' && <Instructions />}
            </div>
            
            {/* El panel lateral derecho se esconde por completo en teléfonos */}
            <div className="hidden xl:block w-[350px] bg-brand-surface/40 border-l border-slate-900 p-4">
              <LivePreview />
            </div>
          </div>
        </div>

      </div>
    </ProjectProvider>
  );
}
