import React from 'react';
import { Link } from 'react-router-dom';

const AppSidebar = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <Link className="nav-link" to="/">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Dashboard
            </Link>
            <Link className="nav-link" to="/assemblies">
              <div className="sb-nav-link-icon"><i className="fas fa-box"></i></div>
              Assemblies
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppSidebar;
