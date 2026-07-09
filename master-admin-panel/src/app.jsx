import React, { useState } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import Sidebar from './components/Sidebar';
import ProjectForm from './components/ProjectForm';
import AppearanceForm from './components/AppearanceForm';
import LivePreview from './components/LivePreview'; // <--- IMPORTAMOS EL COMPONENTE

export default function App() {
  const [view, setView] = useState('config'); // 'config' o 'appearance'

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
          </div>

          {/* Área Derecha: Vista Previa Activa */}
          <div className="hidden lg:block w-[450px] bg-brand-surface/40 border-l border-slate-900 p-4">
            <LivePreview /> {/* <--- REEMPLAZAMOS EL MARCADOR POR EL COMPONENTE REAL */}
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}
