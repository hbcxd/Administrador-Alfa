import React, { useState } from 'react';
import { ProjectProvider } from './context/projectcontext';
import Sidebar from './components/sidebar';
import ProjectForm from './components/projectform';
import AppearanceForm from './components/appearanceform';
import ProjectManager from './components/projectmanager';
import Instructions from './components/instructions'; // <-- IMPORTAMOS LAS INSTRUCCIONES
import LivePreview from './components/livepreview';

export default function App() {
  const [view, setView] = useState('config'); // 'config', 'appearance', 'manage' o 'instructions'

  return (
    <ProjectProvider>
      <div className="flex h-screen bg-brand-bg font-sans overflow-hidden transition-colors duration-300">
        
        {/* Barra Lateral Izquierda */}
        <Sidebar setView={setView} />

        {/* Contenedor Principal de Trabajo */}
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto border-r border-slate-900/60">
            {view === 'config' && <ProjectForm />}
            {view === 'appearance' && <AppearanceForm />}
            {view === 'manage' && <ProjectManager />}
            {view === 'instructions' && <Instructions />} {/* <-- RENDERIZADO DEL MANUAL */}
          </div>

          {/* Área Derecha: Vista Previa Activa */}
          <div className="hidden lg:block w-[450px] bg-brand-surface/40 border-l border-slate-900 p-4">
            <LivePreview />
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}
