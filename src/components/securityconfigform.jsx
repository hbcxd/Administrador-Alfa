import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function SecurityConfigForm({ plataformaId }) {
  const [loading, setLoading] = useState(false);
  const [requiereAuth, setRequiereAuth] = useState(false);
  const [alcanceAuth, setAlcanceAuth] = useState('solo_admin');

  useEffect(() => {
    const cargarConfig = async () => {
      const docRef = doc(db, "plataformas", plataformaId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const datos = docSnap.data();
        setRequiereAuth(datos.requiereAuth || false);
        setAlcanceAuth(datos.alcanceAuth || 'solo_admin');
      }
    };
    cargarConfig();
  }, [plataformaId]);

  const guardarConfigSeguridad = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "plataformas", plataformaId);
      await updateDoc(docRef, {
        requiereAuth: requiereAuth,
        alcanceAuth: alcanceAuth
      });
      alert("¡Reglas de acceso aplicadas!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 text-slate-100 font-sans">
      <div>
        <h3 className="text-xs font-black text-white uppercase tracking-wider">🔐 Control de Accesos</h3>
        <p className="text-[11px] text-slate-400">Modifica la privacidad y restricciones de la página hija.</p>
      </div>

      <form onSubmit={guardarConfigSeguridad} className="space-y-4">
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div>
            <label className="text-xs font-semibold text-white block">Inicio de Sesión Activo</label>
            <span className="text-[10px] text-slate-500">Habilita cuentas de usuarios en la web hija.</span>
          </div>
          <input 
            type="checkbox" 
            checked={requiereAuth}
            onChange={(e) => setRequiereAuth(e.target.checked)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
        </div>

        {requiereAuth && (
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-400">Área de restricción:</label>
            <select 
              value={alcanceAuth} 
              onChange={(e) => setAlcanceAuth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs text-white focus:outline-none"
            >
              <option value="solo_admin">Web Pública + Panel Administrativo Privado</option>
              <option value="secciones_privadas">Web Pública + Bloques exclusivos para miembros</option>
              <option value="todo">Bloqueo Total (Obligatorio loguearse para entrar)</option>
            </select>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold p-2.5 rounded-lg text-xs transition disabled:opacity-50">
          {loading ? 'Configurando...' : 'Guardar Privacidad'}
        </button>
      </form>
    </div>
  );
}
