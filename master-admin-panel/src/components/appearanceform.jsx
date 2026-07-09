import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';
import { db as masterDb } from '../masterfirebase'; // Conexión a la nube maestra

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [currentInstances, setCurrentInstances] = useState({ db: null, storage: null, supabaseClient: null });
  
  // Estado global para los colores corporativos del panel maestro
  const [theme, setTheme] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    bg: '#020617',
    surface: '#0f172a'
  });

  // Cargar proyectos y colores desde la nube al iniciar el panel
  useEffect(() => {
    async function loadMasterData() {
      if (!masterDb) return;
      try {
        // 1. Descargar las plataformas guardadas
        const querySnapshot = await getDocs(collection(masterDb, 'master_projects'));
        const loadedProjects = [];
        querySnapshot.forEach((doc) => {
          loadedProjects.push({ ...doc.data(), id: doc.id });
        });
        setProjects(loadedProjects);

        // 2. Descargar los colores personalizados del panel
        const themeDoc = await getDoc(doc(masterDb, 'master_settings', 'appearance'));
        if (themeDoc.exists()) {
          const cloudTheme = themeDoc.data();
          setTheme(cloudTheme);
          
          // Inyectamos los colores de la nube en las variables de Tailwind
          document.documentElement.style.setProperty('--color-primary', cloudTheme.primary);
          document.documentElement.style.setProperty('--color-secondary', cloudTheme.secondary);
          document.documentElement.style.setProperty('--color-bg', cloudTheme.bg);
          document.documentElement.style.setProperty('--color-surface', cloudTheme.surface);
        }
      } catch (error) {
        console.error("Error al cargar datos desde la nube maestra:", error);
      }
    }
    loadMasterData();
  }, []);

  // Guardar un nuevo proyecto directamente en la nube maestra
  const addProject = async (projectData) => {
    try {
      const docRef = await addDoc(collection(masterDb, 'master_projects'), projectData);
      const newProjectWithId = { ...projectData, id: docRef.id };
      
      setProjects((prev) => [...prev, newProjectWithId]);
      return newProjectWithId;
    } catch (error) {
      console.error("Error al guardar plataforma en la nube:", error);
      alert("No se pudo guardar la plataforma en la nube maestra.");
    }
  };

  // Guardar los colores del panel en la nube maestra
  const updateThemeInCloud = async (newTheme) => {
    try {
      await setDoc(doc(masterDb, 'master_settings', 'appearance'), newTheme);
      setTheme(newTheme);
      
      // Aplicar cambios visuales inmediatos
      document.documentElement.style.setProperty('--color-primary', newTheme.primary);
      document.documentElement.style.setProperty('--color-secondary', newTheme.secondary);
      document.documentElement.style.setProperty('--color-bg', newTheme.bg);
      document.documentElement.style.setProperty('--color-surface', newTheme.surface);
    } catch (error) {
      console.error("Error al guardar el diseño en la nube:", error);
      alert("No se pudo guardar el tema visual.");
    }
  };

  // Conectar dinámicamente con los servicios del proyecto hijo seleccionado
  const selectProject = (project) => {
    setActiveProject(project);

    const app = initializeApp(project.firebaseConfig, project.id);
    const db = getFirestore(app);
    
    let storage = null;
    if (project.storageProvider === 'firebase' && project.firebaseConfig.storageBucket) {
      storage = getStorage(app);
    }

    let supabaseClient = null;
    if (project.storageProvider === 'supabase' && project.supabaseConfig) {
      supabaseClient = createClient(project.supabaseConfig.url, project.supabaseConfig.anonKey);
    }

    setCurrentInstances({ db, storage, supabaseClient });
  };

  return (
    <ProjectContext.Provider value={{ projects, activeProject, addProject, selectProject, currentInstances, theme, updateThemeInCloud }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
