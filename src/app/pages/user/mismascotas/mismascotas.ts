import { Component } from '@angular/core';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mismascotas',
  imports: [SidebarUser, CommonModule, FormsModule],
  templateUrl: './mismascotas.html',
  styleUrl: './mismascotas.css',
})
export class Mismascotas {
  mascotas: any[] = [
    { id: 1, nombre: 'Michi', especie: 'Gato', raza: 'Mestizo', edad: 3, proximaVacuna: '15 Oct 2023', peso: '4.5 kg', icono: '🐱', colorBg: 'bg-orange-100' },
    { id: 2, nombre: 'Firulais', especie: 'Perro', raza: 'Labrador', edad: 5, proximaVacuna: '10 Nov 2023', peso: '22.0 kg', icono: '🐶', colorBg: 'bg-sky-100' }
  ];

  citas: any[] = [
    { id: 1, mascota: 'Michi', fecha: '2023-11-10', hora: '10:00 AM', motivo: 'Vacunación Anual', estado: 'Pendiente' },
    { id: 2, mascota: 'Firulais', fecha: '2023-10-25', hora: '03:00 PM', motivo: 'Revisión de herida', estado: 'Completada' },
    { id: 3, mascota: 'Michi', fecha: '2023-09-01', hora: '09:30 AM', motivo: 'Desparasitación', estado: 'Completada' }
  ];

  mascotaSeleccionada: any | null = null;
  citasDeLaMascota: any[] = [];

  seleccionarMascota(mascota: any) {
    this.mascotaSeleccionada = mascota;
    this.citasDeLaMascota = this.citas
      .filter(cita => cita.mascota === mascota.nombre)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // Ordenar por fecha descendente
  }

  cerrarDetalles() {
    this.mascotaSeleccionada = null;
  }
}
