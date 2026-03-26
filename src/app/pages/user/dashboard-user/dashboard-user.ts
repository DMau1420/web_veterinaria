import { Component } from '@angular/core';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-user',
  imports: [SidebarUser, FormsModule, CommonModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css',
})
export class DashboardUser {
  mascotas: any[] = [
    { id: 1, nombre: 'Michi', especie: 'Gato', raza: 'Mestizo', edad: 3, proximaVacuna: '15 Oct 2023', peso: '4.5 kg', icono: '🐱', colorBg: 'bg-orange-100' },
    { id: 2, nombre: 'Firulais', especie: 'Perro', raza: 'Labrador', edad: 5, proximaVacuna: '10 Nov 2023', peso: '22.0 kg', icono: '🐶', colorBg: 'bg-sky-100' }
  ];

  citas: any[] = [
    { id: 1, mascota: 'Michi', fecha: '2023-11-10', hora: '10:00 AM', motivo: 'Vacunación Anual', estado: 'Pendiente', diaNumero: '10' }
  ];

  // Control para el Modal de Mascotas
  mostrarModalMascota = false;
  nuevaMascota: any = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };

  // Control para el Modal de Citas
  mostrarModalCita = false;
  nuevaCita: any = { mascota: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente', diaNumero: '' };
  modoEdicionCita = false;
  citaEnEdicionId: number | null = null;

  // --- Funciones Mascota ---
  abrirModalMascota() { 
    this.mostrarModalMascota = true; 
  }
  
  cerrarModalMascota() { 
    this.mostrarModalMascota = false; 
  }

  guardarMascota() {
    const id = this.mascotas.length ? Math.max(...this.mascotas.map(m => m.id)) + 1 : 1;
    
    // Autocompletar ícono visual dependiendo la especie elegida
    if (this.nuevaMascota.especie === 'Gato') {
      this.nuevaMascota.icono = '🐱';
      this.nuevaMascota.colorBg = 'bg-orange-100';
    } else if (this.nuevaMascota.especie === 'Perro') {
      this.nuevaMascota.icono = '🐶';
      this.nuevaMascota.colorBg = 'bg-sky-100';
    } else {
      this.nuevaMascota.icono = '🐾';
      this.nuevaMascota.colorBg = 'bg-slate-100';
    }

    this.mascotas.push({ id, ...this.nuevaMascota });
    this.cerrarModalMascota();
    // Limpiar el formulario
    this.nuevaMascota = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };
  }

  // --- Funciones Cita ---
  abrirModalCita(cita?: any) { 
    this.mostrarModalCita = true; 
    if (cita) {
      this.modoEdicionCita = true;
      this.citaEnEdicionId = cita.id;
      this.nuevaCita = { ...cita };
    } else {
      this.modoEdicionCita = false;
      this.citaEnEdicionId = null;
      this.nuevaCita = { mascota: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente', diaNumero: '' };
    }
  }

  cerrarModalCita() { 
    this.mostrarModalCita = false; 
  }

  guardarCita() {
    // Obtenemos solo el día visual de la fecha ingresada para que se vea en el círculo amarrillo
    const fechaObj = new Date(this.nuevaCita.fecha + 'T00:00:00'); 
    const diaNumero = !isNaN(fechaObj.getDate()) ? fechaObj.getDate().toString() : '--';
    
    if (this.modoEdicionCita && this.citaEnEdicionId !== null) {
      const index = this.citas.findIndex(c => c.id === this.citaEnEdicionId);
      if (index !== -1) {
        this.citas[index] = { ...this.nuevaCita, id: this.citaEnEdicionId, diaNumero };
      }
    } else {
      const id = this.citas.length ? Math.max(...this.citas.map(c => c.id)) + 1 : 1;
      this.citas.push({ id, ...this.nuevaCita, diaNumero });
    }
    this.cerrarModalCita();
  }

  cancelarCita(id: number) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.citas = this.citas.filter(c => c.id !== id);
    }
  }
}
