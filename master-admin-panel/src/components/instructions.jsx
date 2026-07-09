import React from 'react';

export default function Instructions() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-300 pb-12 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Manual de Conexión y Seguridad</h2>
        <p className="text-sm text-slate-400 mt-2">
          Sigue este protocolo para vincular nuevas páginas web hijas y asegurar que la comunicación en la nube sea totalmente fluida.
        </p>
      </div>

      {/* SECCIÓN 1: CREDENCIALES */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <span className="text-xl">🔑</span>
          <h3 className="text-lg font-semibold text-white">1. Credenciales Requeridas</h3>
        </div>
        <p className="text-sm text-slate-400">
          Para que el panel maestro pueda tomar el control, necesitas registrar el objeto de configuración que te da Firebase al crear la app web. El formato obligatorio es:
        </p>
        <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800/60">
{`{
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcd"
}`}
        </pre>
        <p className="text-xs text-amber-400 font-medium">
          ⚠️ Nota: Si la página utiliza Supabase para las imágenes, el bucket de almacenamiento debe ser público y requerirás la URL del proyecto junto con la Anon Key.
        </p>
      </section>

      {/* SECCIÓN 2: REGLAS DE SEGURIDAD */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <span className="text-xl">🛡️</span>
          <h3 className="text-lg font-semibold text-white">2. Configuración de Seguridad en la Nube</h3>
        </div>
        <p className="text-sm text-slate-400">
          Por defecto, Firebase bloquea las conexiones externas. Para permitir que este panel maestro guarde información y suba fotos en tus páginas hijas, debes ir a la consola de cada servicio y publicar estas reglas:
        </p>
        
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reglas para Firestore Database:</h4>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-blue-400 overflow-x-auto border border-slate-800/60">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Permite acceso total para la gestión administrativa externa
      allow read, write: if true; 
    }
  }
}`}
          </pre>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reglas para Firebase Storage (Imágenes):</h4>
          <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-purple-400 overflow-x-auto border border-slate-800/60">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Permite lectura pública y escritura desde el panel maestro
      allow read: if true;
      allow write: if true;
    }
  }
}`}
          </pre>
        </div>
      </section>

      {/* SECCIÓN 3: ESTRUCTURA DE LA PÁGINA HIJA */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <span className="text-xl">🏗️</span>
          <h3 className="text-lg font-semibold text-white">3. Estructura Requerida en la Página Hija</h3>
        </div>
        <p className="text-sm text-slate-400">
          Para que el catálogo o los elementos cargados desde este panel se muestren correctamente en el frontend de la página web de cara al cliente, la página hija debe cumplir con las siguientes características técnicas:
        </p>
        <ul className="space-y-3 text-sm list-disc pl-5 text-slate-300">
          <li>
            <strong className="text-white">Renderizado Dinámico:</strong> El código frontend de la página hija no debe depender de variables fijas. Debe realizar un mapa (<code className="text-brand-primary bg-slate-950 px-1.5 py-0.5 rounded text-xs">.map()</code>) de los documentos que devuelva la colección de Firestore en tiempo real.
          </li>
          <li>
            <strong className="text-white">Lectura Desestructurada:</strong> Dado que el panel maestro permite enviar datos "como vengan" (esquema libre), el frontend de la página hija debe pintar los campos de forma segura evaluando si existen, por ejemplo: 
            <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded text-xs ml-1">producto.precio || 'Consultar'</code>.
          </li>
          <li>
            <strong className="text-white">Compatibilidad Multimedia:</strong> El campo asignado para las imágenes guardará un enlace HTTP directo en texto plano. Asegúrate de que las etiquetas <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded text-xs">&lt;img src=\{...\} /&gt;</code> de la página hija apunten directamente a esa variable URL.
          </li>
        </ul>
      </section>
    </div>
  );
}
