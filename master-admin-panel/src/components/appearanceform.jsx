import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/projectcontext';

export default function AppearanceForm() {
  const { theme, updateThemeInCloud } = useProjects();
  
  // Inicializamos los estados locales con lo que venga de la nube
  const [primary, setPrimary] = useState(theme.primary);
  const [secondary, setSecondary] = useState(theme.secondary);
  const [bg, setBg] = useState(theme.bg);
  const [surface, setSurface] = useState(theme.surface);

  // Sincronizar el formulario si los colores cambian en el servidor
  useEffect(() => {
    setPrimary(theme.primary);
    setSecondary(theme.secondary);
    setBg(theme.bg);
    setSurface(theme.surface);
  }, [theme]);

  const applyTheme = async (e) => {
    e.preventDefault();
    await updateThemeInCloud({ primary, secondary, bg, surface });
    alert("¡Diseño guardado de forma permanente en la nube!");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-brand-surface text-slate-100 rounded-2xl shadow-xl border border-slate-800/80 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Personalizar Aspecto de la Plataforma</h2>
        <p className="text-sm text-slate-400 mt-1">Ajusta los colores de tu entorno de trabajo. Se guardarán en tu nube maestra.</p>
      </div>

      <form onSubmit={applyTheme} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
          
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color Primario</label>
              <span className="text-xs text-slate-500">Botones y acentos</span>
            </div>
            <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color Secundario</label>
              <span className="text-xs text-slate-500">Etiquetas y estados de éxito</span>
            </div>
            <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Fondo General</label>
              <span className="text-xs text-slate-500">Fondo de la aplicación</span>
            </div>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color de Contenedores</label>
              <span className="text-xs text-slate-500">Tarjetas y barra lateral</span>
            </div>
            <input type="color" value={surface} onChange={(e) => setSurface(e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg" />
          </div>

        </div>

        <button type="submit" className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl shadow-lg transition transform active:scale-95">
          Guardar Configuración Visual en la Nube
        </button>
      </form>
    </div>
  );
}
