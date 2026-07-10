import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { supabase } from '../config/supabase';

export default function ProjectContentForm({ plataformaId }) {
  const [loading, setLoading] = useState(false);
  
  // Estados para el Menú Superior
  const [menuLabel, setMenuLabel] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  // Estados para las Secciones Dinámicas
  const [blockType, setBlockType] = useState('hero');
  const [blockTitle, setBlockTitle] = useState('');
  const [blockContent, setBlockContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Subidor de imágenes a Supabase Storage
  const handleImageUpload = async (file) => {
    if (!file) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${plataformaId}/${Date.now()}.${fileExt}`;
      const filePath = `contenidos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('plataformas-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('plataformas-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error("Error en Supabase Storage:", err.message);
      alert("Error al subir la imagen");
      return null;
    }
  };

  // Guardar Enlace del Menú
  const saveMenuLink = async (e) => {
    e.preventDefault();
    if (!menuLabel || !menuUrl) return;
    setLoading(true);

    try {
      const docRef = doc(db, "plataformas", plataformaId);
      await updateDoc(docRef, {
        "navigation.links": arrayUnion({ label: menuLabel, url: menuUrl })
      });
      setMenuLabel('');
      setMenuUrl('');
      alert("¡Enlace agregado al menú!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar Bloque de Diseño (Hero, Tarjeta, Galería)
  const saveBlock = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrl = await handleImageUpload(imageFile);

      const newBlock = {
        id: `block_${Date.now()}`,
        type: blockType,
        title: blockTitle,
        content: blockContent,
        imageUrl: uploadedImageUrl || "",
        createdAt: new Date().toISOString()
      };

      const docRef = doc(db, "plataformas", plataformaId);
      await updateDoc(docRef, {
        blocks: arrayUnion(newBlock)
      });

      setBlockTitle('');
      setBlockContent('');
      setImageFile(null);
      alert(`¡Bloque [${blockType}] publicado con éxito!`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      
      {/* MENÚ DE NAVEGACIÓN */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">🔗 Enlaces del Menú</h3>
          <p className="text-[11px] text-slate-400">Añade accesos como #servicios o #contacto.</p>
        </div>
        <form onSubmit={saveMenuLink} className="space-y-2">
          <input 
            type="text" 
            placeholder="Nombre (Ej. Galería)" 
            value={menuLabel}
            onChange={(e) => setMenuLabel(e.target.value)}
            className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs w-full text-white"
          />
          <input 
            type="text" 
            placeholder="Enlace (Ej. #galeria)" 
            value={menuUrl}
            onChange={(e) => setMenuUrl(e.target.value)}
            className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs w-full text-white"
          />
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold p-2.5 rounded-lg text-xs transition disabled:opacity-50">
            {loading ? 'Guardando...' : 'Añadir al Menú'}
          </button>
        </form>
      </div>

      {/* BLOQUES DE CONTENIDO */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">🧱 Estructurar Secciones</h3>
          <p className="text-[11px] text-slate-400">Inserta elementos interactivos en la página hija.</p>
        </div>
        <form onSubmit={saveBlock} className="space-y-3">
          <select 
            value={blockType} 
            onChange={(e) => setBlockType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white"
          >
            <option value="hero">Portada Principal (Hero Banner)</option>
            <option value="tarjetas">Sección de Tarjetas (Catálogo)</option>
            <option value="galeria">Galería de Fotos Estructurada</option>
          </select>

          <input 
            type="text" 
            required
            placeholder="Título de la sección..." 
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white"
          />

          {blockType !== 'galeria' && (
            <textarea 
              rows="3"
              placeholder="Descripción o cuerpo del texto..." 
              value={blockContent}
              onChange={(e) => setBlockContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white resize-none"
            />
          )}

          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-slate-400 file:bg-blue-600 file:text-white file:border-0 file:text-[11px] file:px-2.5 file:py-1 file:rounded-md"
          />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold p-2.5 rounded-lg text-xs transition disabled:opacity-50">
            {loading ? 'Subiendo Medias...' : 'Publicar Bloque'}
          </button>
        </form>
      </div>

    </div>
  );
}
