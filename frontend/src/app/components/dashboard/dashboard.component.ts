import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  cards = [
    { title: 'Primary Card', bgClass: 'bg-primary' },
    { title: 'Warning Card', bgClass: 'bg-warning' },
    { title: 'Success Card', bgClass: 'bg-success' },
    { title: 'Danger Card', bgClass: 'bg-danger' },
  ];
}
