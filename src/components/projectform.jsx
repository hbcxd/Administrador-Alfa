import React, { useState } from 'react';
import { useProjects } from '../context/projectcontext';

export default function ProjectForm() {
  const { addProject } = useProjects();
  const [name, setName] = useState('');
  const [config, setConfig] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !config) {
      setStatus('⚠️ Por favor, rellena todos los campos.');
      return;
    }
    setStatus('Guardando en la nube...');
    await addProject(name, config);
    setName('');
    setConfig('');
    setStatus('✅ ¡Plataforma vinculada con éxito!');
    setTimeout(() => setStatus(''), 4000);
  };

  return (
    <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800 max-w-lg mx-auto shadow-xl">
      <h2 className="text-xl font-bold text-white mb-2">Añadir Nueva Plataforma</h2>
      <p className="text-sm text-slate-400 mb-6">Configura los accesos de la base de datos de tu página hija.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Nombre de la página</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Pedacito de Gracia" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-primary" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Firebase Config (Objeto de Texto)</label>
          <textarea rows="5" value={config} onChange={(e) => setConfig(e.target.value)} placeholder="Pega el bloque completo: const firebaseConfig = { ... };" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-primary font-mono" />
        </div>
        
        {status && <p className="text-xs font-medium text-center text-slate-300 transition-all">{status}</p>}
        
        <button type="submit" className="w-full bg-brand-primary text-white font-medium p-3 rounded-xl hover:bg-blue-600 transition text-sm shadow-lg shadow-brand-primary/20">
          Guardar en Base de Datos
        </button>
      </form>
    </div>
  );
}
