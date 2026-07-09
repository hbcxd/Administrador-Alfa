import React from 'react';
import { useProjects } from '../context/projectcontext';
import MediaUploader from './mediauploader';      // Ruta en minúscula
import FirestoreManager from './firestoremanager'; // <-- IMPORTAMOS EL NUEVO COMPONENTE

export default function ProjectManager() {
  const { activeProject } = useProjects();

  if (!activeProject) {
    return (
      <div className="text-center p-12 text-slate-400">
        <p>Selecciona un proyecto de la barra lateral para gestionarlo.</p>
      </div>
    );
  }

  const handleUrlRetrieved = (url) => {
    console.log("URL de la imagen lista para guardarse en Firestore:", url);
    // Tip de oro: El usuario puede copiar esta URL que devuelve el cargador
    // y ponerla como valor en cualquier campo del FirestoreManager abajo.
    alert(`Copia esta URL si quieres guardarla en un campo: \n\n${url}`);
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

        {/* Lado Derecho: Contenido y Base de Datos Dinámica */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Estructura de Datos (Firestore)</h3>
          {/* REEMPLAZAMOS EL MARCADOR POR EL COMPONENTE COMPLETO */}
          <FirestoreManager /> 
        </div>

      </div>
    </div>
  );
}
