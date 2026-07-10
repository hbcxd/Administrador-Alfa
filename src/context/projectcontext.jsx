import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const ProjectContext = createContext();

// Configuración visual por defecto si la base de datos está vacía
const defaultMasterSettings = {
  brandName: 'panel maestro',
  brandSubtitle: 'Centro de Control',
  logoUrl: '',
  bgColor: '#0f172a',
  surfaceColor: '#1e293b',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  textColor: '#f1f5f9',
  mutedColor: '#64748b',
  borderRadius: '16px',
  sidebarPosition: 'left'
};

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [masterSettings, setMasterSettings] = useState(defaultMasterSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escuchar plataformas hijas
    const q = query(collection(db, "plataformas"), orderBy("createdAt", "desc"));
    const unsubscribeProjects = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(docs);
      setLoading(false);
    });

    // 2. Escuchar la configuración visual del propio Panel Maestro
    const masterDocRef = doc(db, "config_sistema", "panel_maestro");
    const unsubscribeMaster = onSnapshot(masterDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMasterSettings({ ...defaultMasterSettings, ...docSnap.data() });
      } else {
        // Si nunca se ha guardado, creamos el documento inicial
        setDoc(masterDocRef, defaultMasterSettings);
      }
    });

    return () => {
      unsubscribeProjects();
      unsubscribeMaster();
    };
  }, []);

  // Guardar nueva plataforma con un objeto de apariencia vacío por defecto
  const addProject = async (name, firebaseConfigString) => {
    try {
      await addDoc(collection(db, "plataformas"), {
        name,
        config: firebaseConfigString,
        createdAt: new Date().toISOString(),
        appearance: {
          primaryColor: '#3b82f6',
          bgColor: '#0f172a',
          surfaceColor: '#1e293b',
          textColor: '#ffffff'
        }
      });
    } catch (error) {
      console.error("Error al añadir plataforma:", error);
    }
  };

  // Guardar cambios técnicos o visuales de una plataforma hija
  const updateProject = async (id, updatedFields) => {
    try {
      const docRef = doc(db, "plataformas", id);
      await updateDoc(docRef, {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error al actualizar plataforma:", error);
    }
  };

  // Guardar la personalización visual de TU propia plataforma
  const updateMasterSettings = async (newSettings) => {
    try {
      const masterDocRef = doc(db, "config_sistema", "panel_maestro");
      await setDoc(masterDocRef, newSettings, { merge: true });
    } catch (error) {
      console.error("Error al guardar diseño maestro:", error);
    }
  };

  const selectProject = (proj) => setActiveProject(proj);

  return (
    <ProjectContext.Provider value={{ 
      projects, activeProject, masterSettings, selectProject, addProject, updateProject, updateMasterSettings, loading 
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
