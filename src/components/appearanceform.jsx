import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/projectcontext';

export default function AppearanceForm() {
  const { masterSettings, updateMasterSettings } = useProjects();
  const [form, setForm] = useState(masterSettings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setForm(masterSettings);
  }, [masterSettings]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('Guardando nueva identidad visual...');
    await updateMasterSettings(form);
    setStatus('✅ ¡Panel Maestro transformado con éxito!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 max-w-2xl mx-auto shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Personalizar mi Plataforma</h2>
        <p className="text-xs text-slate-400">Modifica el diseño completo de este centro de control en tiempo real.</p>
      </div>

      {status && <p className="text-xs text-center font-medium text-brand-primary mb-4 animate-pulse">{status}</p>}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECCIÓN 1: IDENTIDAD */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">1. Textos y Logotipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Nombre del Panel</label>
              <input type="text" value={form.brandName} onChange={(e) => handleChange('brandName', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Eslogan / Subtítulo</label>
              <input type="text" value={form.brandSubtitle} onChange={(e) => handleChange('brandSubtitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">URL del Logo (Imagen Online)</label>
            <input type="text" value={form.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} placeholder="https://tuservidor.com/imagen.png" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
          </div>
        </div>

        {/* SECCIÓN 2: PALETA DE COLORES */}
        <div className="space-y-4 pt-4 border-t border-slate-800/50">
          <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">2. Paleta de Colores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Color de Fondo</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.bgColor} onChange={(e) => handleChange('bgColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.bgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Color de Tarjetas</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.surfaceColor} onChange={(e) => handleChange('surfaceColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.surfaceColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Color Primario</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Color Secundario</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto Principal</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.textColor} onChange={(e) => handleChange('textColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.textColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto Secundario</label>
              <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                <input type="color" value={form.mutedColor} onChange={(e) => handleChange('mutedColor', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <span className="text-xs font-mono">{form.mutedColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: ESTRUCTURA */}
        <div className="space-y-4 pt-4 border-t border-slate-800/50">
          <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">3. Estructura y Estilos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Redondeado de Esquinas</label>
              <select value={form.borderRadius} onChange={(e) => handleChange('borderRadius', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none">
                <option value="0px">Cuadrado total (0px)</option>
                <option value="6px">Suave (6px)</option>
                <option value="12px">Estándar (12px)</option>
                <option value="16px">Moderno Redondeado (16px)</option>
                <option value="28px">Súper Curvo (28px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Posición del Menú Lateral</label>
              <select value={form.sidebarPosition} onChange={(e) => handleChange('sidebarPosition', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none">
                <option value="left">Izquierda (Por Defecto)</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-brand-primary text-white font-medium p-3 rounded-xl hover:opacity-90 transition text-sm shadow-lg shadow-brand-primary/20">
          Aplicar Cambios en mi Plataforma
        </button>
      </form>
    </div>
  );
}
