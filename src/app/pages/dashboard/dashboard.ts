import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { SidebarAdmin } from "../../components/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, SidebarAdmin],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('pacientesChart') pacientesChart!: ElementRef;
  @ViewChild('citasChart') citasChart!: ElementRef;
  @ViewChild('clientesChart') clientesChart!: ElementRef;

  ngAfterViewInit() {
    this.crearGraficaPacientes();
    this.crearGraficaCitas();
    this.crearGraficaClientes();
  }

  crearGraficaPacientes() {
    new Chart(this.pacientesChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{ label: 'Pacientes Activos', data: [90, 105, 110, 108, 115, 124], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true, tension: 0.4 }]
      }
    });
  }

  crearGraficaCitas() {
    new Chart(this.citasChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm'],
        datasets: [{ label: 'Citas Hoy', data: [1, 2, 0, 3, 1, 1], backgroundColor: '#a855f7', borderRadius: 4 }]
      }
    });
  }

  crearGraficaClientes() {
    new Chart(this.clientesChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Perros', 'Gatos', 'Aves', 'Otros'],
        datasets: [{ data: [8, 4, 2, 1], backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#f97316'] }]
      }
    });
  }
}
