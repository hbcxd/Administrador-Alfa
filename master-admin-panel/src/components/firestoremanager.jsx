import React, { useState } from 'react';
import { useProjects } from '../context/projectcontext';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirestoreManager() {
  const { activeProject, currentInstances } = useProjects();
  const [collectionName, setCollectionName] = useState('');
  const [fields, setFields] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  if (!activeProject) return null;

  // Añadir una nueva fila de campo (Clave / Valor) dinámicamente
  const addFieldRow = () => {
    setFields([...fields, { key: '', value: '' }]);
  };

  // Manejar el cambio de texto en los campos dinámicos
  const handleFieldChange = (index, event) => {
    const newFields = [...fields];
    newFields[index][event.target.name] = event.target.value;
    setFields(newFields);
  };

  // Eliminar una fila de campo
  const removeFieldRow = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // GUARDAR DATOS "COMO VENGAN" EN FIRESTORE
  const handleSaveData = async (e) => {
    e.preventDefault();
    if (!collectionName.trim()) return alert("Escribe un nombre para la colección");
    if (!currentInstances.db) return alert("La base de datos de este proyecto no está conectada");

    setLoading(true);

    try {
      // Convertimos el array de filas [{key: 'nombre', value: 'chocolate'}] en un objeto plano {nombre: 'chocolate'}
      const dataToSave = {};
      fields.forEach(field => {
        if (field.key.trim()) {
          dataToSave[field.key.trim()] = field.value;
        }
      });

      // Firebase crea la colección automáticamente si no existe y guarda el documento
      const docRef = await addDoc(collection(currentInstances.db, collectionName.trim()), dataToSave);
      
      alert(`¡Datos guardados con éxito! Documento creado con ID: ${docRef.id}`);
      
      // Limpiamos los campos del formulario para poder meter otro registro
      setFields([{ key: '', value: '' }]);
      
      // Actualizamos la lista automáticamente para ver el cambio
      handleFetchData();

    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // LEER DATOS DE LA COLECCIÓN ESCRITA
  const handleFetchData = async () => {
    if (!collectionName.trim()) return alert("Escribe el nombre de la colección que quieres consultar");
    if (!currentInstances.db) return alert("La base de datos no está conectada");

    try {
      const querySnapshot = await getDocs(collection(currentInstances.db, collectionName.trim()));
      const docsData = [];
      querySnapshot.forEach((doc) => {
        docsData.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docsData);
    } catch (error) {
      console.error("Error al leer de Firestore:", error);
      alert(`No se pudo leer la colección: ${error.message}. Asegúrate de tener las reglas de Firebase públicas.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Colección Dinámica */}
      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Colección de Destino (Se creará si no existe)
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Ej. productos, usuarios, pedidos..."
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-white"
          />
          <button 
            type="button"
            onClick={handleFetchData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
          >
            Ver Datos
          </button>
        </div>
      </div>

      {/* Formulario de Estructura Dinámica */}
      <form onSubmit={handleSaveData} className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-slate-300">Campos del Documento</h4>
          <button 
            type="button" 
            onClick={addFieldRow}
            className="text-xs text-brand-primary hover:underline font-medium"
          >
            + Añadir campo
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2 items-center animate-fadeIn">
              <input 
                type="text" 
                name="key"
                value={field.key}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Nombre del campo (ej. precio)"
                className="w-1/2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                required
              />
              <input 
                type="text" 
                name="value"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Valor (ej. 15$)"
                className="w-1/2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                required
              />
              {fields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeFieldRow(index)}
                  className="text-red-400 hover:text-red-500 text-sm px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand-secondary hover:bg-brand-secondary/90 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-md"
        >
          {loading ? 'Guardando en Firebase...' : 'Enviar Datos a la Nube'}
        </button>
      </form>

      {/* Visor de los registros guardados */}
      {documents.length > 0 && (
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <h5 className="text-xs font-bold text-slate-400 uppercase">Documentos en "{collectionName}":</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto text-xs font-mono">
            {documents.map((doc) => (
              <div key={doc.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800/60">
                <p className="text-brand-primary text-[10px] mb-1">ID: {doc.id}</p>
                <pre className="text-slate-300 whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
