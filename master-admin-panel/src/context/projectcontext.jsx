import React, { createContext, useState, useContext } from 'react';
// Se importan los SDKs necesarios instalados previamente vía npm
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { createClient } from '@supabase/supabase-js';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]); // Lista de todas las páginas registradas
  const [activeProject, setActiveProject] = useState(null); // Proyecto en edición actual
  const [currentInstances, setCurrentInstances] = useState({
    db: null,
    storage: null,
    supabaseClient: null
  });

  // Función para conectar y activar los servicios del proyecto seleccionado
  const selectProject = (project) => {
    setActiveProject(project);
    
    let dbInstance = null;
    let storageInstance = null;
    let supabaseInstance = null;

    // 1. Inicialización dinámica de Firebase para el proyecto seleccionado
    if (project.firebaseConfig) {
      const appName = project.id; // Usamos el ID del proyecto como nombre único de la instancia
      let fbApp;
      
      if (getApps().find(app => app.name === appName)) {
        fbApp = getApp(appName);
      } else {
        fbApp = initializeApp(project.firebaseConfig, appName);
      }
      
      dbInstance = getFirestore(fbApp);
      
      // Si eligió Firebase para las imágenes, inicializamos su Storage
      if (project.storageProvider === 'firebase') {
        storageInstance = getStorage(fbApp);
      }
    }

    // 2. Inicialización dinámica de Supabase si fue el proveedor elegido para imágenes
    if (project.storageProvider === 'supabase' && project.supabaseConfig) {
      supabaseInstance = createClient(
        project.supabaseConfig.url, 
        project.supabaseConfig.anonKey
      );
    }

    // Guardamos las instancias activas en el estado para usarlas en los formularios de edición
    setCurrentInstances({
      db: dbInstance,
      storage: storageInstance,
      supabaseClient: supabaseInstance
    });
  };

  const addProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      activeProject, 
      currentInstances, 
      addProject, 
      selectProject 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
