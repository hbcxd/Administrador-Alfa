import React, { useEffect, useState } from 'react';
import { db } from './firebaseconfig';
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';

export default function AdminPlataforma() {
  const [platformsList, setPlatformsList] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Estados para los campos editables
  const [waPhone, setWaPhone] = useState('');
  const [rate, setRate] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // 1. CARGAR LISTA DE PÁGINAS HIJAS
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plataformas'));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, name: doc.data().name || 'Sin Nombre' });
        });
        setPlatformsList(list);
        if (list.length > 0) {
          setSelectedPlatformId(list[0].id);
        }
      } catch (error) {
        console.error("Error al cargar plataformas:", error);
      }
    };
    fetchPlatforms();
  }, []);

  // 2. ESCUCHAR CONFIGURACIÓN DE LA WEB SELECCIONADA
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
      console.error("Error al conectar:", error);
      setLoadingConfig(false);
    });

    return () => unsubscribe();
  }, [selectedPlatformId]);

  // Guardar datos en Firestore de forma automática
  const saveToFirebase = async (updatedFields) => {
    if (!selectedPlatformId) return;
    try {
      const docRef = doc(db, 'plataformas', selectedPlatformId);
      await updateDoc(docRef, updatedFields);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al procesar el cambio visual.");
    }
  };

  // --- ACCIONES VISUALES DE AGREGAR (PONER) ---

  const handleAddHero = () => {
    if (!config) return;
    const currentBlocks = config.blocks || [];
    const newHeroBlock = {
      type: 'hero',
      title: 'Título de la Portada',
      subtitle: 'Descripción breve de los servicios o propósito de la marca.',
      imageUrl: ''
    };
    saveToFirebase({ blocks: [...currentBlocks, newHeroBlock] });
  };

  const handleAddCatalog = () => {
    if (!config) return;
    const currentBlocks = config.blocks || [];
    if (currentBlocks.some(b => b.type === 'tarjetas')) {
      alert("Este cliente ya tiene un catálogo activo.");
      return;
    }

    const newCatalogBlock = {
      type: 'tarjetas',
      title: 'Catálogo de Servicios',
      subtitle: 'Selecciona el plan ideal y ordénalo directamente por WhatsApp.',
      items: [
        { title: 'Servicio Ejemplo', description: 'Detalle comercial', price: '0', imageUrl: '', stock: '5' }
      ]
    };
    saveToFirebase({ blocks: [...currentBlocks, newCatalogBlock] });
  };

  // --- ACCIÓN VISUAL DE ELIMINAR (QUITAR) ---
  const handleDeleteBlock = (blockIndex) => {
    if (!config) return;
    const currentBlocks = config.blocks || [];
    
    // Filtramos el array para expulsar el bloque que seleccionaste
    const updatedBlocks = currentBlocks.filter((_, idx) => idx !== blockIndex);
    
    // Guardamos el nuevo mapa limpio en Firebase
    saveToFirebase({ blocks: updatedBlocks });
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
    alert("Credenciales del panel interno guardadas.");
  };

  const handleSaveQuickSettings = () => {
    saveToFirebase({
      whatsappPhone: waPhone,
      exchangeRate: rate
    });
    alert("Parámetros actualizados.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* SELECTOR DE CLIENTE MULTIPÁGINA */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white">EP Web • Consola de Control</h1>
            <p className="text-xs text-slate-400">Gestiona e instala características de forma visual.</p>
          </div>
          
          <div className="w-full md:w-72 space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400">Seleccionar página web hija:</label>
            <select 
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {platformsList.length === 0 ? (
                <option value="">Buscando sitios...</option>
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
            <p className="text-sm text-slate-400 animate-pulse">Sincronizando la base de datos...</p>
          </div>
        ) : !config ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-500">Selecciona una plataforma para comenzar.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* SECCIÓN PARA AGREGAR CONTENIDO (PONER) */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h2 className="text-base font-bold text-white">🛠️ Añadir Nuevos Módulos</h2>
                <p className="text-xs text-slate-400">Presiona un botón para inyectar una nueva estructura en blanco a la página.</p>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <button 
                    onClick={handleAddHero}
                    className="bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-sm font-bold text-white group-hover:text-blue-400">🖼️ Insertar Portada Informativa</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Estructura visual con textos principales y banner.</span>
                  </button>

                  <button 
                    onClick={handleAddCatalog}
                    className="bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group"
                  >
                    <span className="block text-sm font-bold text-white group-hover:text-emerald-400">🛍️ Inicializar Catálogo Modular</span>
                    <span className="block text-[11px] text-slate-400 mt-1">Habilita la cuadrícula para renderizar servicios y precios.</span>
                  </button>
                </div>
              </div>

              {/* GESTOR DE DISEÑO EN VIVO (VISUALIZAR Y QUITAR) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <div>
                  <h2 className="text-base font-bold text-white">📋 Características y Módulos Instalados</h2>
                  <p className="text-xs text-slate-400 mt-1">Aquí ves exactamente qué tiene la página web hija en este momento. Puedes eliminar cualquier elemento de inmediato.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {(!config.blocks || config.blocks.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                      <p className="text-xs text-slate-500 italic">La página web de este cliente está vacía (Lienzo en blanco).</p>
                    </div>
                  ) : (
                    config.blocks.map((b, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {b.type === 'tarjetas' ? '🛍️' : b.type === 'hero' ? '🖼️' : '📄'}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white capitalize">{b.type === 'tarjetas' ? 'Catálogo Web Dinámico' : b.type === 'hero' ? 'Portada Informativa' : b.type}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{b.title || 'Sin título asignado'}</p>
                          </div>
                        </div>
                        
                        {/* BOTÓN MÁGICO PARA QUITAR EL MÓDULO */}
                        <button 
                          onClick={() => handleDeleteBlock(idx)}
                          className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          Quitar Módulo
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PANEL PRIVADO INTERNO */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h2 className="text-base font-bold text-white">🔐 Panel Administrativo Privado</h2>
                <p className="text-xs text-slate-400">Asigna las llaves de acceso para el sistema interno del cliente.</p>
                <form onSubmit={handleSaveAdminCredentials} className="grid sm:grid-cols-3 gap-4 items-end pt-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Usuario</label>
                    <input type="text" required placeholder="ej: usuario" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Contraseña</label>
                    <input type="text" required placeholder="ej: clave" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all">Establecer</button>
                </form>
              </div>

            </div>

            {/* COLUMNA DERECHA: INTERRUPTORES (TOGGLES DE CARACTERÍSTICAS) */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                <h2 className="text-base font-bold text-white">💎 Habilidades Comerciales</h2>
                
                <div className="space-y-5">
                  {/* SWITCH: SISTEMA DE PEDIDOS */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Sistema de Pedidos</label>
                      <span className="text-[11px] text-slate-400 block">Enciende el botón "+ Carrito" en la web.</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('sistemaPedidos')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.sistemaPedidos ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.sistemaPedidos ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* SWITCH: INVENTARIO */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Control de Inventario</label>
                      <span className="text-[11px] text-slate-400 block">Bloquea ventas si el stock llega a cero.</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('inventario')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.inventario ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.inventario ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* SWITCH: TASA DE CAMBIO */}
                  <div className="flex items-start justify-between gap-4 pb-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Tasa de Cambio Extra</label>
                      <span className="text-[11px] text-slate-400 block">Muestra precios paralelos en Bolívares.</span>
                    </div>
                    <button 
                      onClick={() => handleToggleFeature('tasaCambio')}
                      className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.tasaCambio ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.tasaCambio ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* VARIABLES COMERCIALES */}
                <div className="border-t border-slate-800 pt-4 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Teléfono WhatsApp</label>
                    <input type="text" placeholder="Ej: 584121234567" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Valor del Dólar (Bs.)</label>
                    <input type="number" step="0.01" placeholder="Ej: 45.50" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none" />
                  </div>
                  <button onClick={handleSaveQuickSettings} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg border border-slate-700 transition-all">
                    Guardar Variables
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}