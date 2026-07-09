import React, { useState } from 'react';
import { ProjectProvider } from './context/projectcontext';
import Sidebar from './components/sidebar';
import ProjectForm from './components/projectform';
import AppearanceForm from './components/appearanceform';
import ProjectManager from './components/projectmanager';
import Instructions from './components/instructions';
import LivePreview from './components/livepreview';

export default function App() {
  const [view, setView] = useState('config');

  return (
    <ProjectProvider>
      <div className="flex h-screen bg-brand-bg font-sans overflow-hidden text-slate-100">
        <Sidebar setView={setView} />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            {view === 'config' && <ProjectForm />}
            {view === 'appearance' && <AppearanceForm />}
            {view === 'manage' && <ProjectManager />}
            {view === 'instructions' && <Instructions />}
          </div>
          <div className="hidden lg:block w-[350px] bg-brand-surface/40 border-l border-slate-900 p-4">
            <LivePreview />
          </div>
        </main>
      </div>
    </ProjectProvider>
  );
}
