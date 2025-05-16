import React from 'react';
import { SystemProvider } from './context/SystemContext';
import Desktop from './components/Desktop';
import Login from './components/Login';
import { useSystem } from './context/SystemContext';

const AppContent = () => {
  const { state } = useSystem();
  return state.user ? <Desktop /> : <Login />;
};

function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}

export default App;