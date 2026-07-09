import React, { useState } from 'react';

export default function AppearanceForm() {
  // Estados locales para los colores (inicializados con los de por defecto)
  const [primary, setPrimary] = useState('#3b82f6');
  const [secondary, setSecondary] = useState('#10b981');
  const [bg, setBg] = useState('#020617');
  const [surface, setSurface] = useState('#0f172a');

  // Función mágica que inyecta los colores seleccionados en el :root de la app
  const applyTheme = (e) => {
    e.preventDefault();
    
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-bg', bg);
    document.documentElement.style.setProperty('--color-surface', surface);

    // Nota: Aquí guardaremos también este objeto de colores en la base de datos de la plataforma maestra
    alert("¡Tema aplicado con éxito en la plataforma!");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-brand-surface text-slate-100 rounded-2xl shadow-xl border border-slate-800/80 animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Personalizar Aspecto de la Plataforma</h2>
        <p className="text-sm text-slate-400 mt-1">Ajusta los colores corporativos, logos y entornos visuales para adaptarlo a tu gusto técnico.</p>
      </div>

      <form onSubmit={applyTheme} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
          
          {/* Selector Color Primario */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color Primario</label>
              <span className="text-xs text-slate-500">Botones, selecciones y acentos principales</span>
            </div>
            <input 
              type="color" 
              value={primary} 
              onChange={(e) => setPrimary(e.target.value)}
              className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
            />
          </div>

          {/* Selector Color Secundario */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color Secundario</label>
              <span className="text-xs text-slate-500">Etiquetas, estados de éxito y alternativos</span>
            </div>
            <input 
              type="color" 
              value={secondary} 
              onChange={(e) => setSecondary(e.target.value)}
              className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
            />
          </div>

          {/* Selector Color de Fondo */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Fondo General</label>
              <span className="text-xs text-slate-500">Color del fondo de la computadora (Body)</span>
            </div>
            <input 
              type="color" 
              value={bg} 
              onChange={(e) => setBg(e.target.value)}
              className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
            />
          </div>

          {/* Selector Color de Superficie */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300">Color de Contenedores</label>
              <span className="text-xs text-slate-500">Barra lateral y tarjetas de formularios</span>
            </div>
            <input 
              type="color" 
              value={surface} 
              onChange={(e) => setSurface(e.target.value)}
              className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
            />
          </div>

        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl shadow-lg transition transform active:scale-95"
        >
          Guardar Configuración Visual
        </button>
      </form>
    </div>
  );
}
