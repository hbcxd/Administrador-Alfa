import React, { useState } from 'react';
import { ProjectProvider } from './context/projectcontext'; // Ruta en minúscula
import Sidebar from './components/sidebar';               // Ruta en minúscula
import ProjectForm from './components/projectform';         // Ruta en minúscula
import AppearanceForm from './components/appearanceform';   // Ruta en minúscula
import ProjectManager from './components/projectmanager';   // Ruta en minúscula
import LivePreview from './components/livepreview';         // Ruta en minúscula

export default function App() {
  const [view, setView] = useState('config'); // 'config', 'appearance' o 'manage'

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
