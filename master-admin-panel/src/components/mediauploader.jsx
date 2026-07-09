import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function MediaUploader({ onUploadSuccess }) {
  const { activeProject, currentInstances } = useProjects();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Si no hay un proyecto seleccionado, no mostramos el cargador
  if (!activeProject) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Vista previa local instantánea
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor, selecciona un archivo primero");
    
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;

    try {
      let finalUrl = '';

      // CASO 1: SUBIDA A FIREBASE STORAGE
      if (activeProject.storageProvider === 'firebase') {
        if (!currentInstances.storage) {
          throw new Error("El servicio de Firebase Storage no está inicializado.");
        }
        // Creamos la referencia en el bucket del proyecto hijo
        const storageRef = ref(currentInstances.storage, `uploads/${fileName}`);
        // Subimos los bytes
        const snapshot = await uploadBytes(storageRef, file);
        // Obtenemos la URL pública final
        finalUrl = await getDownloadURL(snapshot.ref);
      } 
      
      // CASO 2: SUBIDA A SUPABASE STORAGE
      else if (activeProject.storageProvider === 'supabase') {
        if (!currentInstances.supabaseClient) {
          throw new Error("El cliente de Supabase no está inicializado.");
        }
        
        const bucketName = activeProject.supabaseConfig.bucket;
        
        // Subimos el archivo al bucket configurado
        const { data, error } = await currentInstances.supabaseClient
          .storage
          .from(bucketName)
          .upload(`uploads/${fileName}`, file);

        if (error) throw error;

        // Obtenemos la URL pública desde Supabase
        const { data: publicUrlData } = currentInstances.supabaseClient
          .storage
          .from(bucketName)
          .getPublicUrl(`uploads/${fileName}`);
          
        finalUrl = publicUrlData.publicUrl;
      }

      alert("¡Imagen subida con éxito!");
      setFile(null);
      setPreviewUrl('');
      
      // Le pasamos la URL al formulario padre para que la guarde en Firestore
      if (onUploadSuccess) onUploadSuccess(finalUrl);

    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert(`Error en la subida: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
      <h4 className="text-sm font-semibold text-slate-300">
        Cargar Multimedia para: <span className="text-brand-primary">{activeProject.name}</span>
      </h4>
      <p className="text-xs text-slate-500">
        Proveedor activo: <span className="capitalize font-mono text-slate-400">{activeProject.storageProvider} Storage</span>
      </p>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 bg-slate-950/40 hover:border-slate-600 transition">
        {previewUrl ? (
          <img src={previewUrl} alt="Vista previa" className="max-h-40 rounded-lg object-cover mb-3" />
        ) : (
          <span className="text-2xl mb-2">🖼️</span>
        )}
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
        />
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-slate-800 text-white text-sm font-medium rounded-xl transition shadow-md"
        >
          {uploading ? 'Subiendo archivo...' : 'Confirmar y Subir Imagen'}
        </button>
      )}
    </div>
  );
}
