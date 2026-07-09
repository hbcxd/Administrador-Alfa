import React from 'react';
import { useProjects } from '../context/ProjectContext';
import MediaUploader from './MediaUploader';

export default function ProjectManager() {
  const { activeProject } = useProjects();

  if (!activeProject) {
    return (
      <div className="text-center p-12 text-slate-400">
        <p>Selecciona un proyecto de la barra lateral para gestionarlo.</p>
      </div>
    );
  }

  // Función que se ejecutará cuando la imagen se suba con éxito
  const handleUrlRetrieved = (url) => {
    console.log("URL de la imagen lista para guardarse en Firestore:", url);
    // Aquí conectaremos la lógica para guardar la URL en la colección correspondiente de Firestore
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn text-slate-100">
      {/* Encabezado del Proyecto Activo */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">Panel Operativo</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">{activeProject.name}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Proveedor de Imágenes</span>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-emerald-400 capitalize border border-slate-700">
            {activeProject.storageProvider}
          </span>
        </div>
      </div>

      {/* Zona de Trabajo del Proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lado Izquierdo: Gestión de Multimedia */}
        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Galería y Archivos</h3>
            <MediaUploader onUploadSuccess={handleUrlRetrieved} />
          </div>
        </div>

        {/* Lado Derecho: Contenido y Base de Datos (Estructura base) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-semibold text-white">Estructura de Datos (Firestore)</h3>
          <p className="text-sm text-slate-400">Aquí podrás interactuar con las colecciones específicas de esta página web de manera dinámica.</p>
          
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center text-slate-500 h-48 border-dashed">
            <span>⚙️</span>
            <p className="text-xs mt-2">Módulo de colecciones dinámicas listo para ser enlazado</p>
          </div>
        </div>

      </div>
    </div>
  );
}
