import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';

export default function ProjectForm() {
  const { addProject } = useProjects();
  const [name, setName] = useState('');
  const [publicUrl, setPublicUrl] = useState(''); // <-- Nuevo campo para el iFrame
  const [storageProvider, setStorageProvider] = useState('firebase');
  
  // Estados para credenciales de Firebase
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  // Estados para credenciales de Supabase
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseBucket, setSupabaseBucket] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: `proj_${Date.now()}`,
      name,
      publicUrl, // <-- Guardamos la URL de la página
      storageProvider,
      firebaseConfig: {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId
      },
      supabaseConfig: storageProvider === 'supabase' ? {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        bucket: supabaseBucket
      } : null
    };

    addProject(newProject);
    
    // Limpiamos el formulario para el siguiente registro
    setName('');
    setPublicUrl('');
    setApiKey('');
    setAuthDomain('');
    setProjectId('');
    setStorageBucket('');
    setMessagingSenderId('');
    setAppId('');
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSupabaseBucket('');
    
    alert("¡Plataforma registrada con éxito!");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Registrar Nueva Página Web</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fila principal: Nombre y URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nombre del Proyecto</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition text-sm"
              placeholder="Ej. Mi Página de Catálogo" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">URL Pública (Para Vista Previa)</label>
            <input 
              type="url" 
              value={publicUrl} 
              onChange={(e) => setPublicUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition text-sm"
              placeholder="https://tu-pagina.com o http://localhost:3000" 
              required 
            />
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-semibold text-blue-400">Credenciales de Firebase (Base de Datos y Auth)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
            <input type="text" placeholder="Auth Domain" value={authDomain} onChange={e => setAuthDomain(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
            <input type="text" placeholder="Project ID" value={projectId} onChange={e => setProjectId(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
            <input type="text" placeholder="Storage Bucket (Opcional si usa Supabase)" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" />
            <input type="text" placeholder="Messaging Sender ID" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
            <input type="text" placeholder="App ID" value={appId} onChange={e => setAppId(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-400">Almacenamiento de Imágenes</h3>
            <select 
              value={storageProvider} 
              onChange={(e) => setStorageProvider(e.target.value)}
              className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="firebase">Firebase Storage</option>
              <option value="supabase">Supabase Storage</option>
            </select>
          </div>

          {storageProvider === 'supabase' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <input type="text" placeholder="Supabase URL" value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
              <input type="password" placeholder="Anon Key" value={supabaseAnonKey} onChange={e => setSupabaseAnonKey(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
              <input type="text" placeholder="Nombre del Bucket de Supabase" value={supabaseBucket} onChange={e => setSupabaseBucket(e.target.value)} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm" required />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg transition transform active:scale-95"
        >
          Guardar y Vincular Plataforma
        </button>
      </form>
    </div>
  );
}
