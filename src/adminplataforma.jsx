import React, { useEffect, useState } from 'react';
import { db } from './config/firebase'; 
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';

export default function AdminPlataforma() {
  const [platformsList, setPlatformsList] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Estados para los campos de control generales
  const [waPhone, setWaPhone] = useState('');
  const [rate, setRate] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // 👇 NUEVO: Estado para saber qué bloque se está editando en el momento
  const [editingBlockIdx, setEditingBlockIdx] = useState(null);
  const [tempBlockData, setTempBlockData] = useState(null);

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
    setEditingBlockIdx(null); // Resetea el editor al cambiar de cliente
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

  // Guardar datos en Firestore
  const saveToFirebase = async (updatedFields) => {
    if (!selectedPlatformId) return;
    try {
      const docRef = doc(db, 'plataformas', selectedPlatformId);
      await updateDoc(docRef, updatedFields);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al procesar el cambio en la base de datos.");
    }
  };

  // --- ACCIONES DE AGREGAR (PONER) ---
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

  // --- ACCIÓN DE ELIMINAR (QUITAR) ---
  const handleDeleteBlock = (blockIndex) => {
    if (!window.confirm("¿Seguro que deseas eliminar este módulo por completo?")) return;
    const currentBlocks = config.blocks || [];
    const updatedBlocks = currentBlocks.filter((_, idx) => idx !== blockIndex);
    if (editingBlockIdx === blockIndex) setEditingBlockIdx(null);
    saveToFirebase({ blocks: updatedBlocks });
  };

  // --- 👇 NUEVO: ENRUTADOR DEL EDITOR EN VIVO ---
  const handleStartEditing = (index, block) => {
    setEditingBlockIdx(index);
    // Clonamos profundamente el bloque para no alterar el estado global mientras se edita
    setTempBlockData(JSON.parse(JSON.stringify(block)));
  };

  const handleSaveBlockChanges = () => {
    const updatedBlocks = [...config.blocks];
    updatedBlocks[editingBlockIdx] = tempBlockData;
    saveToFirebase({ blocks: updatedBlocks });
    setEditingBlockIdx(null);
    alert("Contenido del módulo actualizado con éxito.");
  };

  // Manejo interno para los productos del catálogo
  const handleUpdateItemField = (itemIdx, field, value) => {
    const updatedItems = [...tempBlockData.items];
    updatedItems[itemIdx][field] = value;
    setTempBlockData({ ...tempBlockData, items: updatedItems });
  };

  const handleAddCatalogItem = () => {
    const newItem = { title: 'Nuevo Servicio', description: 'Descripción', price: '0', imageUrl: '', stock: '1' };
    setTempBlockData({ ...tempBlockData, items: [...tempBlockData.items, newItem] });
  };

  const handleDeleteCatalogItem = (itemIdx) => {
    const updatedItems = tempBlockData.items.filter((_, idx) => idx !== itemIdx);
    setTempBlockData({ ...tempBlockData, items: updatedItems });
  };

  // --- TOGGLES Y VARIABLES GENERALES ---
  const handleToggleFeature = (featureKey) => {
    if (!config) return;
    const currentFeatures = config.features || {};
    saveToFirebase({
      features: { ...currentFeatures, [featureKey]: !currentFeatures[featureKey] }
    });
  };

  const handleSaveAdminCredentials = (e) => {
    e.preventDefault();
    saveToFirebase({ adminCredentials: { usuario: adminUser, contrasena: adminPass } });
    alert("Credenciales del panel interno guardadas.");
  };

  const handleSaveQuickSettings = () => {
    saveToFirebase({ whatsappPhone: waPhone, exchangeRate: rate });
    alert("Parámetros actualizados.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* SELECTOR DE CLIENTE */}
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
          <div className="text-center py-20"><p className="text-sm text-slate-400 animate-pulse">Sincronizando base de datos...</p></div>
        ) : !config ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800"><p className="text-sm text-slate-500">Selecciona una plataforma para comenzar.</p></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* SECCIÓN COLUMNA IZQUIERDA (MÓDULOS Y EDICIÓN) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* CREAR MÓDULOS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h2 className="text-base font-bold text-white">🛠️ Añadir Nuevos Módulos</h2>
                <p className="text-xs text-slate-400">Inyecta una estructura en blanco a la página para luego personalizarla.</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <button onClick={handleAddHero} className="bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group">
                    <span className="block text-sm font-bold text-white group-hover:text-blue-400">🖼️ Insertar Portada Informativa</span>
                  </button>
                  <button onClick={handleAddCatalog} className="bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800/80 p-4 rounded-xl text-left transition-all group">
                    <span className="block text-sm font-bold text-white group-hover:text-emerald-400">🛍️ Inicializar Catálogo Modular</span>
                  </button>
                </div>
              </div>

              {/* LISTA DE MÓDULOS INSTALADOS Y GESTOR DE CONTENIDO */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <div>
                  <h2 className="text-base font-bold text-white">📋 Características y Módulos Instalados</h2>
                  <p className="text-xs text-slate-400 mt-1">Haz clic en "Editar Contenido" para modificar textos, imágenes y precios a tu gusto.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {(!config.blocks || config.blocks.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl"><p className="text-xs text-slate-500 italic">Lienzo en blanco.</p></div>
                  ) : (
                    config.blocks.map((b, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{b.type === 'tarjetas' ? '🛍️' : '🖼️'}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white capitalize">{b.type === 'tarjetas' ? 'Catálogo Web Dinámico' : 'Portada Informativa'}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{b.title || 'Sin título'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleStartEditing(idx, b)} className="bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                              ✏️ Editar Contenido
                            </button>
                            <button onClick={() => handleDeleteBlock(idx)} className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                              Quitar
                            </button>
                          </div>
                        </div>

                        {/* 👇 FORMULARIO DE EDICIÓN EXCLUSIVO DESPLEGABLE */}
                        {editingBlockIdx === idx && tempBlockData && (
                          <div className="border-t border-slate-800/80 pt-4 mt-2 space-y-4 text-xs bg-slate-900/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center"><h3 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Editor del Bloque</h3></div>
                            
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">Título Principal</label>
                              <input type="text" value={tempBlockData.title || ''} onChange={(e) => setTempBlockData({...tempBlockData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                            </div>

                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">Subtítulo / Descripción</label>
                              <textarea rows="2" value={tempBlockData.subtitle || ''} onChange={(e) => setTempBlockData({...tempBlockData, subtitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                            </div>

                            {/* Campos específicos según el tipo de bloque */}
                            {tempBlockData.type === 'hero' && (
                              <div>
                                <label className="block text-slate-400 mb-1 font-medium">URL de la Imagen de Fondo/Banner</label>
                                <input type="text" placeholder="https://ejemplo.com/imagen.jpg" value={tempBlockData.imageUrl || ''} onChange={(e) => setTempBlockData({...tempBlockData, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                              </div>
                            )}

                            {tempBlockData.type === 'tarjetas' && (
                              <div className="space-y-4 border-t border-slate-800 pt-3">
                                <div className="flex justify-between items-center">
                                  <label className="block text-slate-300 font-bold uppercase text-[10px]">Productos / Servicios del Catálogo</label>
                                  <button type="button" onClick={handleAddCatalogItem} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[10px]">➕ Añadir Item</button>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                  {tempBlockData.items?.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 relative">
                                      <div className="absolute top-2 right-2">
                                        <button type="button" onClick={() => handleDeleteCatalogItem(itemIdx)} className="text-rose-400 hover:text-rose-500 font-bold text-[10px]">Eliminar</button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[10px] text-slate-500">Nombre</label>
                                          <input type="text" value={item.title || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white" />
                                        </div>
                                        <div>
                                          <label className="text-[10px] text-slate-500">Precio ($)</label>
                                          <input type="text" value={item.price || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'price', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white" />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[10px] text-slate-500">Stock</label>
                                          <input type="text" value={item.stock || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'stock', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white" />
                                        </div>
                                        <div>
                                          <label className="text-[10px] text-slate-500">URL Imagen</label>
                                          <input type="text" value={item.imageUrl || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'imageUrl', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-500">Descripción Corta</label>
                                        <input type="text" value={item.description || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'description', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2 justify-end">
                              <button type="button" onClick={() => setEditingBlockIdx(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg transition-all">Cancelar</button>
                              <button type="button" onClick={handleSaveBlockChanges} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10">💾 Actualizar Bloque</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PANEL PRIVADO */}
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

            {/* COLUMNA DERECHA (SWITCHES) */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                <h2 className="text-base font-bold text-white">💎 Habilidades Comerciales</h2>
                
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Sistema de Pedidos</label>
                      <span className="text-[11px] text-slate-400 block">Enciende el botón "+ Carrito" en la web.</span>
                    </div>
                    <button onClick={() => handleToggleFeature('sistemaPedidos')} className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.sistemaPedidos ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.sistemaPedidos ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-4">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Control de Inventario</label>
                      <span className="text-[11px] text-slate-400 block">Bloquea ventas si el stock llega a cero.</span>
                    </div>
                    <button onClick={() => handleToggleFeature('inventario')} className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.inventario ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.inventario ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 pb-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white block">Tasa de Cambio Extra</label>
                      <span className="text-[11px] text-slate-400 block">Muestra precios paralelos en Bolívares.</span>
                    </div>
                    <button onClick={() => handleToggleFeature('tasaCambio')} className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${config.features?.tasaCambio ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.features?.tasaCambio ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

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