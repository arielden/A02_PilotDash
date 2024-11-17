import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import AppSidebar from './components/AppSidebar';
import AssemblyTree from './components/AssemblyTree';
import DashboardCards from './components/DashboardCards';

function App() {
  // Estado para manejar el toggle de la sidebar
  const [isSidebarToggled, setIsSidebarToggled] = useState(
    localStorage.getItem('sb|sidebar-toggle') === 'true'
  );

  // useEffect para aplicar la clase en el body al cargar el componente
  useEffect(() => {
    if (isSidebarToggled) {
      document.body.classList.add('sb-sidenav-toggled');
    } else {
      document.body.classList.remove('sb-sidenav-toggled');
    }
    // Guardar el estado en localStorage cada vez que cambie
    localStorage.setItem('sb|sidebar-toggle', isSidebarToggled);
  }, [isSidebarToggled]);

  // Función para manejar el clic en el botón de toggle
  const handleSidebarToggle = () => {
    setIsSidebarToggled((prevState) => !prevState);
  };

  return (
    <Router>
      <div id="layoutSidenav">
        <AppNavbar onToggleSidebar={handleSidebarToggle} />
        <div id="layoutSidenav_content">
          <AppSidebar />
          <main className="container my-4">
            <Routes>
              <Route path="/" element={<DashboardCards />} />
              <Route path="/assemblies" element={<AssemblyTree />} />
              {/* Agrega más rutas según sea necesario */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
