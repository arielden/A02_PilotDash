import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  sidebarVisible = true;

  ngOnInit(): void {
    const savedState = localStorage.getItem('sb|sidebar-toggle');
    this.sidebarVisible = savedState === 'true'; // Si no está definido, por defecto es true
    this.updateBodyClass();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Cambiar el estado
    localStorage.setItem('sb|sidebar-toggle', String(this.sidebarVisible)); // Guardar el estado en localStorage
    this.updateBodyClass();
  }
  
  private updateBodyClass() {
    // Agregar o eliminar la clase 'sb-sidenav-toggled' en el body
    if (this.sidebarVisible) {
      document.body.classList.remove('sb-sidenav-toggled');
    } else {
      document.body.classList.add('sb-sidenav-toggled');
    }
  }
  
}
