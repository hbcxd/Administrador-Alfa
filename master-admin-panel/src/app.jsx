import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import Sidebar from './components/Sidebar';
import ProjectForm from './components/ProjectForm';

export default function App() {
  return (
    <ProjectProvider>
      <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
        {/* Barra Lateral Izquierda */}
        <Sidebar />

        {/* Contenedor Principal de Trabajo */}
        <main className="flex-1 flex overflow-hidden">
          {/* Panel de Control y Formularios */}
          <div className="flex-1 p-8 overflow-y-auto border-r border-slate-900">
            <ProjectForm />
          </div>

          {/* Área Derecha: Reservada para la Vista Previa (iFrame) */}
          <div className="hidden lg:block w-[450px] bg-slate-900 border-l border-slate-800 p-4">
            <div className="h-full w-full rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
              Vista Previa en Tiempo Real (iFrame)
            </div>
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}
