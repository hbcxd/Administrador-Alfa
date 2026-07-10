import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/projectcontext';

// INCORPORACIÓN DE LAS DOS NUEVAS HERRAMIENTAS
import SecurityConfigForm from './securityconfigForm';
import ProjectContentForm from './projectcontentform';

export default function ProjectManager() {
  const { activeProject, updateProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editConfig, setEditConfig] = useState('');
  
  // Estados para la apariencia de la hija
  const [childApp, setChildApp] = useState({ primaryColor: '#3b82f6', bgColor: '#0f172a', surfaceColor: '#1e293b', textColor: '#ffffff' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (activeProject) {
      setEditName(activeProject.name);
      setEditConfig(activeProject.config);
      setChildApp(activeProject.appearance || { primaryColor: '#3b82f6', bgColor: '#0f172a', surfaceColor: '#1e293b', textColor: '#ffffff' });
      setIsEditing(false);
      setStatus('');
    }
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="text-center p-8 bg-brand-surface rounded-2xl border border-slate-800/40 text-slate-400">
        <p>Selecciona una plataforma en el menú lateral para gestionar sus parámetros y diseño.</p>
      </div>
    );
  }

  const handleSaveData = async (e) => {
    e.preventDefault();
    setStatus('Guardando datos en la nube...');
    await updateProject(activeProject.id, { name: editName, config: editConfig });
    setIsEditing(false);
    setStatus('✅ Datos técnicos actualizados.');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleSaveChildAppearance = async (key, val) => {
    const updatedAppearance = { ...childApp, [key]: val };
    setChildApp(updatedAppearance);
    await updateProject(activeProject.id, { appearance: updatedAppearance });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* SECCIÓN TÉCNICA (FIREBASE CONFIG) */}
      <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Configuración: {activeProject.name}</h2>
            <span className="text-xs font-mono text-slate-500">ID: {activeProject.id}</span>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-medium">✏️ Editar Llaves</button>
          )}
        </div>

        {status && <p className="text-xs text-center text-brand-primary mb-3">{status}</p>}

        {!isEditing ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-300 font-medium bg-slate-950/50 p-3 rounded-xl border border-slate-900">{activeProject.name}</p>
            <pre className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-900 overflow-x-auto">{activeProject.config}</pre>
          </div>
        ) : (
          <form onSubmit={handleSaveData} className="space-y-3">
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
            <textarea rows="4" value={editConfig} onChange={(e) => setEditConfig(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none font-mono" />
            <div className="flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 text-slate-400">Cancelar</button>
              <button type="submit" className="bg-brand-primary px-4 py-2 rounded-xl text-white font-medium">Guardar Llaves</button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN DE DISEÑO EXTENSO DE LA PLATAFORMA HIJA */}
      <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2">🎨 Diseño de la Página Hija</h3>
        <p className="text-xs text-slate-400 mb-4">Cambia la apariencia que usará esta aplicación secundaria desde aquí mismo.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Fondo de la Hija</label>
            <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input type="color" value={childApp.bgColor} onChange={(e) => handleSaveChildAppearance('bgColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              <span className="text-xs font-mono">{childApp.bgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tarjetas de la Hija</label>
            <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input type="color" value={childApp.surfaceColor} onChange={(e) => handleSaveChildAppearance('surfaceColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              <span className="text-xs font-mono">{childApp.surfaceColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Color Destacado</label>
            <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input type="color" value={childApp.primaryColor} onChange={(e) => handleSaveChildAppearance('primaryColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              <span className="text-xs font-mono">{childApp.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Texto de la Hija</label>
            <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <input type="color" value={childApp.textColor} onChange={(e) => handleSaveChildAppearance('textColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              <span className="text-xs font-mono">{childApp.textColor}</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-4 italic">Nota: Los cambios de diseño de la app hija se guardan automáticamente al mover el selector de color.</p>
      </div>

      {/* BLOQUE NUEVO 1: SELECTOR DE SEGURIDAD Y PRIVACIDAD */}
      <SecurityConfigForm plataformaId={activeProject.id} />

      {/* BLOQUE NUEVO 2: CREADOR DE MENÚS Y BLOQUES MULTIMEDIA DE SUPABASE */}
      <ProjectContentForm plataformaId={activeProject.id} />

    </div>
  );
}
