import React, { useState } from 'react';
import { ProjectProvider, useProjects } from './context/projectcontext';
import Sidebar from './components/sidebar';
import ProjectForm from './components/projectform';
import AppearanceForm from './components/appearanceform';
import ProjectManager from './components/projectmanager';
import Instructions from './components/instructions';

function AppContent() {
  const { masterSettings } = useProjects();
  const [view, setView] = useState('config');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inyección de estilos CSS mágicos basados en tu base de datos
  const dynamicStyles = `
    :root {
      --b-bg: ${masterSettings.bgColor};
      --b-surface: ${masterSettings.surfaceColor};
      --b-primary: ${masterSettings.primaryColor};
      --b-secondary: ${masterSettings.secondaryColor};
      --b-text: ${masterSettings.textColor};
      --b-muted: ${masterSettings.mutedColor};
      --b-radius: ${masterSettings.borderRadius};
    }
    .bg-brand-bg { background-color: var(--b-bg) !important; }
    .bg-brand-surface { background-color: var(--b-surface) !important; }
    .text-brand-primary { color: var(--b-primary) !important; }
    .bg-brand-primary { background-color: var(--b-primary) !important; }
    .border-brand-primary { border-color: var(--b-primary) !important; }
    .text-slate-100 { color: var(--b-text) !important; }
    .text-slate-300 { color: var(--b-text) !important; }
    .text-slate-400, .text-slate-500 { color: var(--b-muted) !important; }
    .rounded-xl, .rounded-2xl { border-radius: var(--b-radius) !important; }
  `;

  // Control de posición del menú lateral (Izquierda o Derecha)
  const layoutDirection = masterSettings.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={`flex h-screen bg-brand-bg font-sans overflow-hidden text-slate-100 relative ${layoutDirection}`}>
      
      {/* Inyector HTML del estilo en tiempo real */}
      <style>{dynamicStyles}</style>

      {/* Menú Lateral Adaptable */}
      <div className={`fixed inset-y-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : masterSettings.sidebarPosition === 'right' ? 'translate-x-full' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out h-full ${masterSettings.sidebarPosition === 'right' ? 'right-0' : 'left-0'}`}>
        <Sidebar setView={(v) => { setView(v); setIsSidebarOpen(false); }} closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Capa oscura para teléfonos */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-45 lg:hidden" />
      )}

      {/* Bloque de Trabajo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Encabezado Móvil */}
        <header className="lg:hidden bg-brand-surface border-b border-slate-800/50 p-4 flex items-center justify-between z-40 shadow-md">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white text-2xl p-1">☰</button>
          <h1 className="text-md font-bold text-white tracking-tight">{masterSettings.brandName}</h1>
          <div className="w-8"></div>
        </header>

        {/* Contenido Dinámico */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {view === 'config' && <ProjectForm />}
          {view === 'appearance' && <AppearanceForm />}
          {view === 'manage' && <ProjectManager />}
          {view === 'instructions' && <Instructions />}
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
