import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escucha activa de la base de datos en la nube
  useEffect(() => {
    const q = query(collection(db, "plataformas"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Función para insertar una nueva plataforma hija
  const addProject = async (name, firebaseConfigString) => {
    try {
      await addDoc(collection(db, "plataformas"), {
        name,
        config: firebaseConfigString,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error al guardar en Firestore: ", error);
    }
  };

  const selectProject = (proj) => setActiveProject(proj);

  return (
    <ProjectContext.Provider value={{ projects, activeProject, selectProject, addProject, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
