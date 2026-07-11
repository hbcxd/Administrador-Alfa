import React, { useEffect, useState } from 'react';
import { db } from './config/firebase'; 
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';

// 💡 BANCO DE PLANTILLAS DE SERVICIOS PRECONFIGURADOS
const PLANTILLAS_SERVICIOS = {
  barberia: [
    { title: 'Corte de Cabello Premium', description: 'Lavado, asesoría de imagen, corte a gusto y acabado con producto.', price: '10', imageUrl: '', stock: '99' },
    { title: 'Arreglo de Barba Tradicional', description: 'Diseño de barba, ritual de toalla caliente y perfilado con navaja.', price: '8', imageUrl: '', stock: '99' },
    { title: 'Combo Spartano', description: 'Corte de cabello completo + Barba con exfoliación facial incluida.', price: '15', imageUrl: '', stock: '99' }
  ],
  reposteria: [
    { title: 'Marquesa de Chocolate', description: 'Deliciosa marquesa cremosa con capas de galleta María y chocolate premium.', price: '5', imageUrl: '', stock: '20' },
    { title: 'Marquesa Pie de Limón', description: 'Combinación perfecta de crema cítrica de limón, galletas y merengue.', price: '5', imageUrl: '', stock: '20' },
    { title: 'Marquesa Pie de Parchita', description: 'Sabor tropical intenso con pulpa de parchita y base crujiente.', price: '5', imageUrl: '', stock: '20' }
  ],
  perfumeria: [
    { title: 'Fragancia Masculina EP', description: 'Esencia concentrada de alta duración con notas amaderadas y frescas.', price: '25', imageUrl: '', stock: '15' },
    { title: 'Fragancia Femenina EP', description: 'Aroma dulce y floral con excelente fijación ideal para el día a día.', price: '25', imageUrl: '', stock: '15' }
  ],
  desarrollo: [
    { title: 'Plataforma Web Básica', description: 'Landing page informativa con catálogo visual e integración a WhatsApp.', price: '150', imageUrl: '', stock: '1' },
    { title: 'Sistema E-commerce Pro', description: 'Sitio web con pasarela, control de inventario y panel administrativo privado.', price: '350', imageUrl: '', stock: '1' }
  ]
};

export default function AdminPlataforma() {
  const [platformsList, setPlatformsList] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Estados de configuración general
  const [waPhone, setWaPhone] = useState('');
  const [rate, setRate] = useState('');

  // Estados para la gestión de usuarios locales
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [editingUserIdx, setEditingUserIdx] = useState(null);

  // Estados del editor en vivo para bloques
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
        if (list.length > 0) setSelectedPlatformId(list[0].id);
      } catch (error) {
        console.error("Error al cargar plataformas:", error);
      }
    };
    fetchPlatforms();
  }, []);

  // 2. ESCUCHAR CAMBIOS EN FIRESTORE EN TIEMPO REAL
  useEffect(() => {
    if (!selectedPlatformId) return;

    setLoadingConfig(true);
    setEditingBlockIdx(null);
    setEditingUserIdx(null);
    const docRef = doc(db, 'plataformas', selectedPlatformId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig(data);
        setWaPhone(data.whatsappPhone || '');
        setRate(data.exchangeRate || '');
      }
      setLoadingConfig(false);
    }, (error) => {
      console.error("Error al conectar:", error);
      setLoadingConfig(false);
    });

    return () => unsubscribe();
  }, [selectedPlatformId]);

  // Guardar cambios en Firebase
  const saveToFirebase = async (updatedFields) => {
    if (!selectedPlatformId) return;
    try {
      const docRef = doc(db, 'plataformas', selectedPlatformId);
      await updateDoc(docRef, updatedFields);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al sincronizar con la base de datos.");
    }
  };

  // --- GESTIÓN DE USUARIOS (CREAR, EDITAR, ELIMINAR) ---
  const handleAddOrUpdateUser = (e) => {
    e.preventDefault();
    if (!newUserUser || !newUserPass) return;

    const currentUsers = config.users || [];
    let updatedUsers = [...currentUsers];

    if (editingUserIdx !== null) {
      // Editar usuario existente
      updatedUsers[editingUserIdx] = { usuario: newUserUser, contrasena: newUserPass };
      setEditingUserIdx(null);
    } else {
      // Añadir nuevo usuario
      if (currentUsers.some(u => u.usuario.toLowerCase() === newUserUser.toLowerCase())) {
        alert("Este nombre de usuario ya existe en esta página.");
        return;
      }
      updatedUsers.push({ usuario: newUserUser, contrasena: newUserPass });
    }

    saveToFirebase({ users: updatedUsers });
    setNewUserUser('');
    setNewUserPass('');
  };

  const handleEditUserSetup = (idx, userObj) => {
    setEditingUserIdx(idx);
    setNewUserUser(userObj.usuario);
    setNewUserPass(userObj.contrasena);
  };

  const handleDeleteUser = (idx) => {
    if (!window.confirm("¿Seguro que deseas eliminar los accesos de este usuario?")) return;
    const currentUsers = config.users || [];
    const updatedUsers = currentUsers.filter((_, i) => i !== idx);
    saveToFirebase({ users: updatedUsers });
  };

  const handleToggleLockFeature = (featureKey) => {
    const currentLocks = config.lockedFeatures || {};
    saveToFirebase({
      lockedFeatures: {
        ...currentLocks,
        [featureKey]: !currentLocks[featureKey]
      }
    });
  };

  // --- INYECTOR DE PLANTILLAS DE SERVICIOS ---
  const handleInjectTemplate = (categoryKey) => {
    if (!tempBlockData) return;
    const itemsToInject = PLANTILLAS_SERVICIOS[categoryKey] || [];
    const currentItems = tempBlockData.items || [];
    
    setTempBlockData({
      ...tempBlockData,
      items: [...currentItems, ...JSON.parse(JSON.stringify(itemsToInject))]
    });
  };

  // --- ENRUTADOR DEL EDITOR EN VIVO DE BLOQUES ---
  const handleStartEditing = (index, block) => {
    setEditingBlockIdx(index);
    setTempBlockData(JSON.parse(JSON.stringify(block)));
  };

  const handleSaveBlockChanges = () => {
    const updatedBlocks = [...config.blocks];
    updatedBlocks[editingBlockIdx] = tempBlockData;
    saveToFirebase({ blocks: updatedBlocks });
    setEditingBlockIdx(null);
    alert("Bloque actualizado con éxito.");
  };

  const handleUpdateItemField = (itemIdx, field, value) => {
    const updatedItems = [...tempBlockData.items];
    updatedItems[itemIdx][field] = value;
    setTempBlockData({ ...tempBlockData, items: updatedItems });
  };

  // --- ACCIONES GENERALES ---
  const handleAddBlock = (type) => {
    const currentBlocks = config.blocks || [];
    if (type === 'tarjetas' && currentBlocks.some(b => b.type === 'tarjetas')) {
      alert("Esta página ya cuenta con un catálogo modular activo.");
      return;
    }
    const newBlock = type === 'hero' 
      ? { type: 'hero', title: 'Nueva Portada Informativa', subtitle: 'Descripción breve de la marca.', imageUrl: '' }
      : { type: 'tarjetas', title: 'Catálogo de Servicios', subtitle: 'Pide directamente a WhatsApp.', items: [] };
    
    saveToFirebase({ blocks: [...currentBlocks, newBlock] });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-10">
        
        {/* SELECTOR DE CLIENTE (TOTALMENTE RESPONSIVO) */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="space-y-0.5">
            <h1 className="text-lg md:text-xl font-bold text-white">EP Web • Consola Suprema</h1>
            <p className="text-xs text-slate-400">Control maestro de módulos, usuarios y candados del sistema.</p>
          </div>
          <div className="w-full sm:w-64 space-y-1">
            <select 
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs md:text-sm text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
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
          <div className="text-center py-20"><p className="text-xs md:text-sm text-slate-400 animate-pulse">Sincronizando base de datos...</p></div>
        ) : !config ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800"><p className="text-sm text-slate-500">Selecciona una plataforma para comenzar.</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* COLUMNA IZQUIERDA Y CENTRAL: CONTENIDO Y USUARIOS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* COMPONENTE NUEVO: GESTOR MULTIUSUARIO AVANZADO */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-white">👥 Personal Autorizado ({config.users?.length || 0})</h2>
                    <p className="text-[11px] text-slate-400">Controla quién entra y define el comportamiento de sus cuentas.</p>
                  </div>
                  
                  {/* SELECTOR DE ENTORNO (COMPARTIDO VS ASILADO) */}
                  <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0">
                    <button 
                      onClick={() => saveToFirebase({ userVisibilityScope: 'shared' })}
                      className={`text-[10px] font-bold px-2 py-1.5 rounded transition-all flex-1 sm:flex-none whitespace-nowrap ${(!config.userVisibilityScope || config.userVisibilityScope === 'shared') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Mismo Panel
                    </button>
                    <button 
                      onClick={() => saveToFirebase({ userVisibilityScope: 'isolated' })}
                      className={`text-[10px] font-bold px-2 py-1.5 rounded transition-all flex-1 sm:flex-none whitespace-nowrap ${(config.userVisibilityScope === 'isolated') ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Panel Privado Individual
                    </button>
                  </div>
                </div>

                {/* FORMULARIO DE ACCESOS */}
                <form onSubmit={handleAddOrUpdateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nombre de Usuario</label>
                    <input type="text" required placeholder="ej: victor_styles" value={newUserUser} onChange={(e) => setNewUserUser(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Contraseña de Acceso</label>
                    <input type="text" required placeholder="ej: clave123" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <button type="submit" className={`w-full font-bold py-2 rounded-lg transition-all text-white ${editingUserIdx !== null ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                    {editingUserIdx !== null ? '✏️ Aplicar Edición' : '➕ Conceder Acceso'}
                  </button>
                </form>

                {/* TABLA / LISTA DE USUARIOS ACTIVOS */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(!config.users || config.users.length === 0) ? (
                    <p className="text-center py-2 text-[11px] text-slate-500 italic">Esta página web hija no tiene usuarios vinculados. Está pública.</p>
                  ) : (
                    config.users.map((u, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800/60 p-2.5 rounded-lg flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="font-semibold text-slate-200">{u.usuario}</span>
                          <span className="text-slate-600 text-[11px]">({u.contrasena})</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditUserSetup(idx, u)} className="text-amber-400 hover:text-amber-300 font-medium text-[11px]">Editar</button>
                          <button onClick={() => handleDeleteUser(idx)} className="text-rose-400 hover:text-rose-500 font-medium text-[11px]">Quitar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RE-DISEÑO: CARACTERÍSTICAS Y MÓDULOS INSTALADOS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-lg">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-white">📋 Módulos Estructurales Instalados</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Gestiona el diseño y contenido multimedia de cada sección.</p>
                </div>

                <div className="space-y-3">
                  {(!config.blocks || config.blocks.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl"><p className="text-[11px] text-slate-500 italic">Lienzo estructural vacío.</p></div>
                  ) : (
                    config.blocks.map((b, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 md:p-4 space-y-3 shadow-inner">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{b.type === 'tarjetas' ? '🛍️' : '🖼️'}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white capitalize">{b.type === 'tarjetas' ? 'Catálogo Dinámico' : 'Portada Informativa'}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{b.title || 'Sin título asignado'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button onClick={() => handleStartEditing(idx, b)} className="bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex-1 sm:flex-none text-center">
                              ✏️ Contenido
                            </button>
                            <button onClick={() => { const cb = config.blocks.filter((_, i) => i !== idx); if (editingBlockIdx === idx) setEditingBlockIdx(null); saveToFirebase({ blocks: cb }); }} className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex-1 sm:flex-none text-center">
                              Quitar
                            </button>
                          </div>
                        </div>

                        {/* SUB-FORMULARIO RESPONSIVO CON INTEGRACIÓN DE SERVICIOS */}
                        {editingBlockIdx === idx && tempBlockData && (
                          <div className="border-t border-slate-800 pt-4 mt-2 space-y-4 text-xs bg-slate-900/40 p-3 rounded-lg">
                            <h3 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Editor Avanzado de Sección</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-slate-400 mb-1 font-medium">Título de la Sección</label>
                                <input type="text" value={tempBlockData.title || ''} onChange={(e) => setTempBlockData({...tempBlockData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                              </div>
                              <div>
                                <label className="block text-slate-400 mb-1 font-medium">Subtítulo / Eslogan</label>
                                <input type="text" value={tempBlockData.subtitle || ''} onChange={(e) => setTempBlockData({...tempBlockData, subtitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                              </div>
                            </div>

                            {tempBlockData.type === 'hero' && (
                              <div>
                                <label className="block text-slate-400 mb-1 font-medium">URL de Imagen (Banner)</label>
                                <input type="text" placeholder="https://..." value={tempBlockData.imageUrl || ''} onChange={(e) => setTempBlockData({...tempBlockData, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                              </div>
                            )}

                            {/* 🚀 NUEVA INTERFAZ DE GRUPO DE SERVICIOS PROPIOS Y PRECONFIGURADOS */}
                            {tempBlockData.type === 'tarjetas' && (
                              <div className="space-y-4 border-t border-slate-800 pt-3">
                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                                  <label className="block text-amber-400 font-bold uppercase text-[9px] tracking-widest">⚡ Inyección Rápida de Tus Servicios</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <button type="button" onClick={() => handleInjectTemplate('barberia')} className="bg-slate-900 hover:bg-slate-800 text-[10px] py-1.5 px-2 rounded font-medium border border-slate-800 text-left">💈 Barbería</button>
                                    <button type="button" onClick={() => handleInjectTemplate('reposteria')} className="bg-slate-900 hover:bg-slate-800 text-[10px] py-1.5 px-2 rounded font-medium border border-slate-800 text-left">🍰 Repostería</button>
                                    <button type="button" onClick={() => handleInjectTemplate('perfumeria')} className="bg-slate-900 hover:bg-slate-800 text-[10px] py-1.5 px-2 rounded font-medium border border-slate-800 text-left">🧪 Perfumes</button>
                                    <button type="button" onClick={() => handleInjectTemplate('desarrollo')} className="bg-slate-900 hover:bg-slate-800 text-[10px] py-1.5 px-2 rounded font-medium border border-slate-800 text-left">🌐 Apps / Web</button>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <label className="text-slate-300 font-bold uppercase text-[10px]">Items cargados en este grupo ({tempBlockData.items?.length || 0})</label>
                                  <button type="button" onClick={() => setTempBlockData({...tempBlockData, items: [...(tempBlockData.items || []), { title: 'Nuevo Servicio', description: '', price: '0', imageUrl: '', stock: '1' }]})} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded text-[10px]">＋ Vacío</button>
                                </div>

                                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                                  {tempBlockData.items?.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 relative">
                                      <button type="button" onClick={() => setTempBlockData({ ...tempBlockData, items: tempBlockData.items.filter((_, i) => i !== itemIdx) })} className="absolute top-2 right-2 text-rose-400 hover:text-rose-500 text-[10px] font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">Remover</button>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-[10px] text-slate-500">Nombre del Servicio / Producto</label>
                                          <input type="text" value={item.title || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-[11px]" />
                                        </div>
                                        <div>
                                          <label className="text-[10px] text-slate-500">Precio ($)</label>
                                          <input type="text" value={item.price || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'price', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-[11px]" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-slate-500">Descripción Comercial</label>
                                        <input type="text" value={item.description || ''} onChange={(e) => handleUpdateItemField(itemIdx, 'description', e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-[11px]" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2 justify-end">
                              <button type="button" onClick={() => setEditingBlockIdx(null)} className="bg-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-lg">Cancelar</button>
                              <button type="button" onClick={handleSaveBlockChanges} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-md">💾 Guardar Cambios</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* INYECTORES DIRECTOS */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={() => handleAddBlock('hero')} className="bg-slate-800 hover:bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-xs font-bold text-center text-blue-400 transition-all">🖼️ Insertar Portada</button>
                  <button onClick={() => handleAddBlock('tarjetas')} className="bg-slate-800 hover:bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-xs font-bold text-center text-emerald-400 transition-all">🛍️ Añadir Catálogo</button>
                </div>
              </div>

            </div>

            {/* COLUMNA DERECHA: INTERRUPTORES Y CONTROL DE CANDADOS */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-6 shadow-lg">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-white">🔒 Control de Acceso y Candados</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Define qué secciones requerirán el login obligatorio del usuario local.</p>
                </div>
                
                <div className="space-y-4">
                  {/* CANDADO: SISTEMA DE PEDIDOS */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-3">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        Pedidos {config.lockedFeatures?.sistemaPedidos ? '🔒' : '🔓'}
                      </label>
                      <span className="text-[11px] text-slate-500 block">Restringe el carrito a usuarios logueados.</span>
                    </div>
                    <button onClick={() => handleToggleLockFeature('sistemaPedidos')} className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none ${config.lockedFeatures?.sistemaPedidos ? 'bg-amber-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.lockedFeatures?.sistemaPedidos ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* CANDADO: INVENTARIO */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-3">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        Inventario {config.lockedFeatures?.inventario ? '🔒' : '🔓'}
                      </label>
                      <span className="text-[11px] text-slate-500 block">Exige contraseña para modificar stock.</span>
                    </div>
                    <button onClick={() => handleToggleLockFeature('inventario')} className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none ${config.lockedFeatures?.inventario ? 'bg-amber-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.lockedFeatures?.inventario ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* CANDADO: CATÁLOGO COMPLETO */}
                  <div className="flex items-start justify-between gap-4 pb-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        Catálogo Completo {config.lockedFeatures?.catalog ? '🔒' : '🔓'}
                      </label>
                      <span className="text-[11px] text-slate-500 block">Oculta todos los precios si no se inicia sesión.</span>
                    </div>
                    <button onClick={() => handleToggleLockFeature('catalog')} className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:outline-none ${config.lockedFeatures?.catalog ? 'bg-amber-500' : 'bg-slate-700'}`}>
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${config.lockedFeatures?.catalog ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* VARIABLES OPERATIVAS GENERALES */}
                <div className="border-t border-slate-800 pt-4 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Enlace Integrado WhatsApp</label>
                    <input type="text" placeholder="Ej: 584121234567" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tasa Referencial de Cambio (Bs.)</label>
                    <input type="number" step="0.01" placeholder="Ej: 45.50" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none" />
                  </div>
                  <button onClick={() => { saveToFirebase({ whatsappPhone: waPhone, exchangeRate: rate }); alert("Variables actualizadas."); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg border border-slate-700 transition-all">
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