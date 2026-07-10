import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProjects } from './context/projectcontext';
import { auth } from './config/firebase'; // Asegúrate de importar tu auth configurado
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import Sidebar from './components/sidebar';
import ProjectForm from './components/projectform';
import AppearanceForm from './components/appearanceform';
import ProjectManager from './components/projectmanager';
import Instructions from './components/instructions';

// 1. COMPONENTE DE INICIO DE SESIÓN (LOGIN)
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Por favor, verifique e intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans p-4 relative overflow-hidden">
      {/* Efecto de fondo decorativo */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Panel Maestro</h2>
          <p className="text-xs text-slate-400">Ingrese sus credenciales de administrador para continuar.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium p-3 rounded-xl hover:bg-blue-500 transition text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. CONTENIDO PRINCIPAL DEL PANEL (SÓLO SI ESTÁ AUTENTICADO)
function AppContent() {
  const { masterSettings } = useProjects();
  const [view, setView] = useState('config');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      await signOut(auth);
    }
  };

  // Inyección de estilos CSS dinámicos basados en tu base de datos
  const dynamicStyles = `
    :root {
      --b-bg: ${masterSettings.bgColor};
      --b-surface: ${masterSettings.surfaceColor};
      --b-primary: ${masterSettings.primaryColor};
      --b-secondary: ${masterSettings.secondaryColor};
      --b-text: ${masterSettings.textColor};
      --b-muted: ${masterSettings.mutedColor};
      --b-radius: ${masterSettings.borderRadius};
    }
    .bg-brand-bg { background-color: var(--b-bg) !important; }
    .bg-brand-surface { background-color: var(--b-surface) !important; }
    .text-brand-primary { color: var(--b-primary) !important; }
    .bg-brand-primary { background-color: var(--b-primary) !important; }
    .border-brand-primary { border-color: var(--b-primary) !important; }
    .text-slate-100 { color: var(--b-text) !important; }
    .text-slate-300 { color: var(--b-text) !important; }
    .text-slate-400, .text-slate-500 { color: var(--b-muted) !important; }
    .rounded-xl, .rounded-2xl { border-radius: var(--b-radius) !important; }
  `;

  const layoutDirection = masterSettings.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={`flex h-screen bg-brand-bg font-sans overflow-hidden text-slate-100 relative ${layoutDirection}`}>
      
      <style>{dynamicStyles}</style>

      {/* Menú Lateral Adaptable */}
      <div className={`fixed inset-y-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : masterSettings.sidebarPosition === 'right' ? 'translate-x-full' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out h-full ${masterSettings.sidebarPosition === 'right' ? 'right-0' : 'left-0'}`}>
        <Sidebar setView={(v) => { setView(v); setIsSidebarOpen(false); }} closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Capa oscura para teléfonos */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-45 lg:hidden" />
      )}

      {/* Bloque de Trabajo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Encabezado Principal */}
        <header className="bg-brand-surface border-b border-slate-800/50 p-4 flex items-center justify-between z-40 shadow-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-white text-2xl p-1 lg:hidden">☰</button>
            <h1 className="text-md font-bold text-white tracking-tight hidden lg:block uppercase">{masterSettings.brandName}</h1>
            <span className="text-xs text-slate-400 hidden lg:block">| {masterSettings.brandSubtitle}</span>
          </div>
          
          {/* Botón de Cerrar Sesión */}
          <button 
            onClick={handleLogout}
            className="bg-slate-950 hover:bg-red-950/30 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            Cerrar Sesión ↩
          </button>
        </header>

        {/* Contenido Dinámico */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-brand-bg">
          {view === 'config' && <ProjectForm />}
          {view === 'appearance' && <AppearanceForm />}
          {view === 'manage' && <ProjectManager />}
          {view === 'instructions' && <Instructions />}
        </div>
      </div>

    </div>
  );
}

// 3. ENRUTADOR RAÍZ CON VERIFICACIÓN DE SESIÓN
export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Escucha si hay una sesión activa en el navegador
    const unsubscribe = onSnapshot(auth, (currentUser) => {
      // Nota: Tradicionalmente se usa onAuthStateChanged(auth, ...), 
      // si prefieres puedes usarlo de forma directa:
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (userSnap) => {
      setUser(userSnap);
      setInitializing(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Pantalla de carga inicial mientras Firebase verifica la sesión
  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 tracking-wider">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Filtro definitivo: Si no hay usuario, directo al Login. Si hay usuario, entra al sistema.
  return user ? (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  ) : (
    <Login />
  );
}
