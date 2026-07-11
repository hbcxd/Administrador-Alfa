import React, { useEffect, useState } from 'react';
import { db } from './firebaseconfig';
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';

export default function AdminPlataforma() {
  // Lista de todas las páginas hijas disponibles
  const [platformsList, setPlatformsList] = useState([]);
  // ID de la página hija seleccionada actualmente en el menú desplegable
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Estados locales para los campos de texto editables
  const [waPhone, setWaPhone] = useState('');
  const [rate, setRate] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // 1. CARGAR LA LISTA DE TODAS LAS PÁGINAS HIJAS AL INICIAR
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plataformas'));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, name: doc.data().name || 'Sin Nombre' });
        });
        setPlatformsList(list);
        
        // Si hay plataformas, seleccionamos la primera por defecto para no arrancar en blanco
        if (list.length > 0) {
          setSelectedPlatformId(list[0].id);
        }
      } catch (error) {
        console.error("Error al cargar la lista de plataformas:", error);
      }
    };

    fetchPlatforms();
  }, []);

  // 2. ESCUCHAR EN TIEMPO REAL LA PÁGINA HIJA SELECCIONADA
  useEffect(() => {
    if (!selectedPlatformId) return;

    setLoadingConfig(true);
    const docRef = doc(db, 'plataformas', selectedPlatformId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig(data);
        setWaPhone(data.whatsappPhone || '');
        setRate(data.exchangeRate || '');
        setAdminUser(data.adminCredentials?.usuario || '');
        setAdminPass(data.adminCredentials?.contrasena || '');
      }
      setLoadingConfig(false);
    }, (error) => {
      console.error("Error al conectar con la plataforma seleccionada:", error);
      setLoadingConfig(false);
    });

    return () => unsubscribe();
  }, [selectedPlatformId]);

  // Función interna para guardar los cambios visuales en la base de datos
  const saveToFirebase = async (updatedFields) => {
    if (!selectedPlatformId) return;
    try {
      const docRef = doc(db, 'plataformas', selectedPlatformId);
      await updateDoc(docRef, updatedFields);
    } catch (error) {
      console.error("Error al actualizar de forma visual:", error);
      alert("Hubo un problema al guardar los cambios en esta página.");
    }
  };

  // --- ACCIONES VISUALES (BOTONES) ---

  const handleAddCatalog = () => {
    if (!config) return;
    const currentBlocks = config.blocks || [];
    if (currentBlocks.some(b => b.type === 'tarjetas')) {
      alert("Esta página ya tiene un catálogo activo.");
      return;
    }

    const newCatalogBlock = {
      type: 'tarjetas',
      title: 'Nuestros Productos',
      subtitle: 'Explora nuestro catálogo exclusivo y realiza tu pedido en línea.',
      items: [
        { title: 'Producto Inicial', description: 'Nueva descripción', price: '0', imageUrl: '', stock: '10' }
      ]
    };
    saveToFirebase({ blocks: [...currentBlocks, newCatalogBlock] });
  };

  const handleAddHero = () => {
    if (!config) return;
    const currentBlocks = config.blocks || [];
    const newHeroBlock = {
      type: 'hero',
      title: 'Bienvenidos',
      subtitle: 'Diseño profesional y a la medida para potenciar tu negocio.',
      imageUrl: ''
    };
    saveToFirebase({ blocks: [...currentBlocks, newHeroBlock] });
  };

  const handleToggleFeature = (featureKey) => {
    if (!config) return;
    const currentFeatures = config.features || {};
    saveToFirebase({
      features: {
        ...currentFeatures,
        [featureKey]: !currentFeatures[featureKey]
      }
    });
  };

  const handleSaveAdminCredentials = (e) => {
    e.preventDefault();
    saveToFirebase({
      adminCredentials: { usuario: adminUser, contrasena: adminPass }
    });
    alert("Acceso administrativo interno actualizado.");
  };

  const handleSaveQuickSettings = () => {
    saveToFirebase({
      whatsappPhone: waPhone,
      exchangeRate: rate
    });
    alert("Parámetros comerciales aplicados.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* SECTOR SUPERIOR: SELECCIÓN DINÁMICA DE CLIENTE */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-white">EP Web • Consola Madre Multisitio</h1>
            <p className="text-xs text-slate-400">Selecciona visualmente qué página hija deseas configurar en este momento.</p>
          </div>
          
          <div className="w-full md:w-72 space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400">Página activa en edición:</label>
            <select 
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner"
            >
              {platformsList.length === 0 ? (
                <option value="">Cargando directorios...</option>
              ) : (
                platformsList.map((plat) => (
                  <option key={plat.id} value={plat.id}>🌐 {plat.name}</option>
                ))
              )}
            </select>
          </div>
        </header>

        {loadingConfig ? (
          <div className="text-center py-20">
            <p className="text-sm text-slate-400 animate-pulse">Sincronizando datos del cliente...</p>
          </div>
        ) : !config ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-500">No hay ninguna plataforma seleccionada o la base de datos está vacía.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* CONSTRUCTOR DE BLOQUES (HERO / PORTADA) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h2 className="text-base font-bold text-white">⚙️ Módulos Estructurales</h2>
                <p className="text-xs text-slate-400">Inyecta componentes interactivos en blanco directo a la estructura de la web seleccionada.</p>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <button 
                    onClick={handleAddHero}
                    className="bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-sm font-bold text-white group-hover:text-blue-400">➕ Añadir Portada Informativa</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Estructura base ideal para posicionamiento de marca y banners.</span>
                  </button>

                  <button 
                    onClick={handleAddCatalog}
                    className="bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-sm font-bold text-white group-hover:text-emerald-400">🛍️ Inicializar Catálogo Web</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Habilita la cuadrícula modular para exhibir productos o servicios.</span>
                  </button>
                </div>
              </div>

              {/* PANEL ADMINISTRATIVO PRIVADO */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">🔐 Panel Administrativo del Cliente</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Módulo Asignado</span>
                </div>
                <p className="text-xs text-slate-400">Establece de forma visual las claves de acceso para el panel interno de administración de este cliente específico.</p>

                <form onSubmit={handleSaveAdminCredentials} className="grid sm:grid-cols-3 gap-4 items-end pt-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Usuario</label>
                    <input 
                      type="text" required placeholder="ej: usuario_web" value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Contraseña</label>
                    <input 
                      type="text" required placeholder="ej: password123" value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-md">
                    Actualizar Acceso
                  </button>
                </form>
              </div>
            </div>

            {/* INTERRUPTORES DE CARACTERÍSTICAS (TOGGLES DE VENTAS) */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                <h2 className="text-base font-bold text-white">💎 Interruptores de Activación</h2>
                
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Sistema de Pedidos</label>
                      <span className="text-[11px] text-slate-400 block">Enciende el botón "+ Carrito" y el checkout directo a WhatsApp.</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('sistemaPedidos')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.sistemaPedidos ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.sistemaPedidos ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Control de Inventario</label>
                      <span className="text-[11px] text-slate-400 block">Valida cantidades disponibles y muestra carteles de "AGOTADO".</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('inventario')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.inventario ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.inventario ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 pb-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Tasa de Cambio Extra</label>
                      <span className="text-[11px] text-slate-400 block">Muestra de manera simultánea los precios en Dólares y Bolívares.</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('tasaCambio')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.tasaCambio ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.tasaCambio ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Teléfono Receptor (WhatsApp)</label>
                    <input 
                      type="text" placeholder="Ej: 584121234567" value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tasa del Dólar Actualizada (Bs.)</label>
                    <input 
                      type="number" step="0.01" placeholder="Ej: 45.50" value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  <button 
                    onClick={handleSaveQuickSettings}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg border border-slate-700 transition-all shadow-sm"
                  >
                    Guardar Variables
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* RESUMEN DE COMPONENTES DEL CLIENTE ACTIVO */}
        {config && !loadingConfig && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
            <h2 className="text-base font-bold text-white mb-2">📋 Distribución del Layout en Vivo</h2>
            <p className="text-xs text-slate-400 mb-4">Esta es la secuencia actual de elementos estructurales que el visitante ve en la página web hija.</p>
            <div className="flex flex-wrap gap-2">
              {(!config.blocks || config.blocks.length === 0) ? (
                <span className="text-xs text-slate-500 italic">El sitio web de este cliente se encuentra completamente vacío en este momento.</span>
              ) : (
                config.blocks.map((b, idx) => (
                  <span key={idx} className="bg-slate-950 text-slate-300 border border-slate-800 text-xs px-3 py-1.5 rounded-xl capitalize font-medium">
                    {b.type === 'tarjetas' ? '🛍️ Catálogo Activo' : b.type === 'hero' ? '🖼️ Banner de Portada' : `📄 Bloque ${b.type}`}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}