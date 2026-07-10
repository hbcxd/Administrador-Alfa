import React, { useState } from 'react';

export default function Instructions() {
  const [activeTab, setActiveTab] = useState('steps');

  // Código plantilla para las páginas hijas
  const daughterTemplateCode = `import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// 1. CREDENCIALES COMPARTIDAS (Usa las mismas de tu Panel Maestro)
const firebaseConfig = {
  apiKey: "TU_API_KEY_DEL_PANEL",
  authDomain: "TU_AUTH_DOMAIN_DEL_PANEL",
  projectId: "TU_PROJECT_ID_DEL_PANEL",
  storageBucket: "TU_STORAGE_BUCKET_DEL_PANEL",
  messagingSenderId: "TU_MESSAGING_SENDER_ID_DEL_PANEL",
  appId: "TU_APP_ID_DEL_PANEL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. EL FILTRO MAESTRO: ID único que diferencia esta web de las demás
const CONFIG_DOCUMENT_ID = "PEGAR_AQUÍ_EL_ID_GENERADO_EN_EL_PANEL";

export default function App() {
  const [appearance, setAppearance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha únicamente el documento que le corresponde a esta página
    const docRef = doc(db, "plataformas", CONFIG_DOCUMENT_ID);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAppearance(docSnap.data().appearance);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">Cargando...</div>;

  const dynamicStyles = \`
    :root {
      --child-bg: \${appearance?.bgColor || '#0f172a'};
      --child-surface: \${appearance?.surfaceColor || '#1e293b'};
      --child-primary: \${appearance?.primaryColor || '#3b82f6'};
      --child-text: \${appearance?.textColor || '#ffffff'};
    }
    .custom-bg { background-color: var(--child-bg) !important; }
    .custom-surface { background-color: var(--child-surface) !important; }
    .custom-text { color: var(--child-text) !important; }
    .custom-btn { background-color: var(--child-primary) !important; }
  \`;

  return (
    <div className="min-h-screen custom-bg custom-text p-6 flex flex-col items-center justify-center">
      <style>\${dynamicStyles}</style>
      <div className="custom-surface p-8 rounded-2xl max-w-md w-full text-center border border-white/5 shadow-2xl">
        <h1 className="text-xl font-bold mb-2">Plataforma Sincronizada</h1>
        <p className="text-xs opacity-70 mb-6">Controlada con el ID: \${CONFIG_DOCUMENT_ID}</p>
        <button className="custom-btn w-full py-3 rounded-xl font-medium text-white shadow-lg">Estructura Base</button>
      </div>
    </div>
  );
}`;

  // Código de las reglas de seguridad de Firebase
  const firebaseRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. MI PROPIA PLATAFORMA: Solo el Administrador con su UID real puede entrar
    match /config_sistema/panel_maestro {
      allow read, write: if request.auth != null && request.auth.uid == 'TU_UID_DE_ADMINISTRADOR_AQUÍ';
    }

    // 2. PÁGINAS HIJAS: Comparten la base de datos pero con accesos restringidos
    match /plataformas/{plataformaId} {
      // Público: La web hija puede LEER solo su propio documento asignado (usando 'get')
      allow get: if true;
      
      // Bloqueado: Nadie en internet puede listar o ver todos tus clientes juntos
      allow list: if false;
      
      // Protegido: Solo tú desde tu Panel Maestro puedes crear o editar datos
      allow write: if request.auth != null && request.auth.uid == 'TU_UID_DE_ADMINISTRADOR_AQUÍ';
    }
    
  }
}`;

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    alert(message);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      
      {/* CABECERA */}
      <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 shadow-xl">
        <h2 className="text-xl font-bold text-white">Manual y Arquitectura del Sistema</h2>
        <p className="text-xs text-slate-400">Concepto de Base de Datos Centralizada y Despliegue de Aplicaciones.</p>
      </div>

      {/* TABS DE NAVEGACIÓN INTERNA */}
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-900 gap-2">
        <button onClick={() => setActiveTab('steps')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'steps' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'}`}>
          1. Concepto y Pasos
        </button>
        <button onClick={() => setActiveTab('code')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'code' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'}`}>
          2. Código Web Hija
        </button>
        <button onClick={() => setActiveTab('security')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'security' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:text-white'}`}>
          3. Seguridad (Firebase)
        </button>
      </div>

      {/* CONTENIDO 1: CONCEPTO Y PASOS */}
      {activeTab === 'steps' && (
        <div className="space-y-6">
          <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 space-y-4">
            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">¿Cómo funciona la Base de Datos?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fíjate: <strong>No necesitas crear un Firebase para cada página nueva.</strong> Todas tus páginas hijas van a usar la misma base de datos de tu Panel Maestro. Comparten el mismo código de conexión (<code className="text-emerald-400">firebaseConfig</code>).
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
              <h4 className="text-xs font-bold text-white">¿Qué es el <code>CONFIG_DOCUMENT_ID</code>?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cuando registras una plataforma en tu panel, Firebase genera un código automático único para ese cliente (un ID largo). Ese ID es el <code className="text-brand-primary font-mono">CONFIG_DOCUMENT_ID</code>. Al colocarlo en el código de la nueva web, le estás diciendo al navegador: <em>"De todos los datos que hay en la base de datos, lee únicamente los colores y textos de esta casilla"</em>. Así es como una página se diferencia de otra.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-surface p-4 rounded-xl border border-slate-800/40">
              <span className="text-xs font-bold text-brand-primary">Paso 1</span>
              <h4 className="text-xs font-bold text-white mt-1 mb-2">Registrar en Panel</h4>
              <p className="text-[11px] text-slate-400">Crea el proyecto en la pantalla principal del panel para generar su espacio en la nube.</p>
            </div>
            <div className="bg-brand-surface p-4 rounded-xl border border-slate-800/40">
              <span className="text-xs font-bold text-brand-primary">Paso 2</span>
              <h4 className="text-xs font-bold text-white mt-1 mb-2">Copiar el ID Único</h4>
              <p className="text-[11px] text-slate-400">Ve a "Gestionar", selecciona el proyecto y copia el ID alfanumérico que te da el sistema.</p>
            </div>
            <div className="bg-brand-surface p-4 rounded-xl border border-slate-800/40">
              <span className="text-xs font-bold text-brand-primary">Paso 3</span>
              <h4 className="text-xs font-bold text-white mt-1 mb-2">Pegar en Plantilla</h4>
              <p className="text-[11px] text-slate-400">Monta tu nueva web de React, pega el código de la pestaña 2 y asígnale el ID copiado.</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 2: CÓDIGO TEMPLATE */}
      {activeTab === 'code' && (
        <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Estructura para la Nueva Web (`App.jsx`)</h3>
              <p className="text-[11px] text-slate-400">Usa este código exacto cada vez que vayas a levantar un sitio web hijo desde cero.</p>
            </div>
            <button onClick={() => copyToClipboard(daughterTemplateCode, '¡Plantilla de código copiada!')} className="bg-brand-primary text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-md">
              📋 Copiar
            </button>
          </div>
          <pre className="text-xs bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-emerald-400 font-mono max-h-96 overflow-y-auto leading-relaxed">
            {daughterTemplateCode}
          </pre>
        </div>
      )}

      {/* CONTENIDO 3: REGLAS DE SEGURIDAD */}
      {activeTab === 'security' && (
        <div className="bg-brand-surface p-6 rounded-2xl border border-slate-800/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Reglas de Producción de Firestore</h3>
              <p className="text-[11px] text-slate-400">Pega esto en la pestaña "Rules" de tu Firebase para blindar los accesos públicos.</p>
            </div>
            <button onClick={() => copyToClipboard(firebaseRulesCode, '¡Reglas de seguridad copiadas!')} className="bg-brand-primary text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-md">
              📋 Copiar Reglas
            </button>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-900 space-y-2">
            <h4 className="text-xs font-bold text-amber-400">💡 Instrucción Importante para tu UID:</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Recuerda ir a <strong>Authentication -> Users</strong> en tu Firebase, copia tu código de usuario único y reemplázalo en el texto de abajo donde dice <code className="text-white">'TU_UID_DE_ADMINISTRADOR_AQUÍ'</code> antes de publicar las reglas.
            </p>
          </div>

          <pre className="text-xs bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto text-amber-200 font-mono max-h-80 overflow-y-auto leading-relaxed">
            {firebaseRulesCode}
          </pre>
        </div>
      )}

    </div>
  );
}
