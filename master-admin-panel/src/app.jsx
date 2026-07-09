import React, { useState } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import Sidebar from './components/Sidebar';
import ProjectForm from './components/ProjectForm';
import AppearanceForm from './components/AppearanceForm';

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

          {/* Área Derecha: Vista Previa */}
          <div className="hidden lg:block w-[450px] bg-brand-surface/40 border-l border-slate-900 p-4">
            <div className="h-full w-full rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-sm">
              Espacio de Vista Previa (iFrame público)
            </div>
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}
