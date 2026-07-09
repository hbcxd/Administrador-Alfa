import React from 'react';
import { useProjects } from '../context/projectcontext';

export default function ProjectManager() {
  const { activeProject } = useProjects();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Gestionando: {activeProject?.name || 'Selecciona una plataforma'}</h2>
      <p className="text-sm text-slate-400">Desde aquí puedes enviar información en tiempo real a la nube.</p>
    </div>
  );
}
