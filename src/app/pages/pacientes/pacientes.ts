import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarAdmin } from '../../components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-pacientes',
  imports: [RouterModule, SidebarAdmin, FormsModule],
  templateUrl: './pacientes.html'
})
export class Pacientes {
  // Datos arbitrarios de prueba
  listaPacientes = [
    { id: 1, nombre: 'Michi', especie: 'Gato', raza: 'Persa', dueno: 'Carlos Pérez', telefono: '555-0123', estado: 'Activo' },
    { id: 2, nombre: 'Firulais', especie: 'Perro', raza: 'Labrador', dueno: 'Ana Gómez', telefono: '555-0124', estado: 'Activo' },
    { id: 3, nombre: 'Copo', especie: 'Conejo', raza: 'Angora', dueno: 'Luis Martínez', telefono: '555-0125', estado: 'Inactivo' },
    { id: 4, nombre: 'Nemo', especie: 'Pez', raza: 'Payaso', dueno: 'Sofía Castro', telefono: '555-0126', estado: 'Activo' },
    { id: 5, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', dueno: 'Miguel Rojas', telefono: '555-0127', estado: 'Activo' },
    { id: 6, nombre: 'Max', especie: 'Perro', raza: 'Bulldog', dueno: 'Andrea Loria', telefono: '555-0128', estado: 'Activo' }
  ];

  mostrarModal = false;
  modoEdicion = false;
  pacienteEnEdicionId: number | null = null;
  nuevoPaciente = { nombre: '', especie: '', raza: '', dueno: '', telefono: '', estado: 'Activo' };

  abrirModal(paciente?: any) {
    this.mostrarModal = true;
    if (paciente) {
      this.modoEdicion = true;
      this.pacienteEnEdicionId = paciente.id;
      this.nuevoPaciente = { ...paciente };
    } else {
      this.modoEdicion = false;
      this.pacienteEnEdicionId = null;
      this.nuevoPaciente = { nombre: '', especie: '', raza: '', dueno: '', telefono: '', estado: 'Activo' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarPaciente() {
    if (this.modoEdicion && this.pacienteEnEdicionId !== null) {
      const index = this.listaPacientes.findIndex(p => p.id === this.pacienteEnEdicionId);
      if (index !== -1) {
        this.listaPacientes[index] = { ...this.nuevoPaciente, id: this.pacienteEnEdicionId };
      }
    } else {
      const nuevoId = this.listaPacientes.length > 0 ? Math.max(...this.listaPacientes.map(p => p.id)) + 1 : 1;
      this.listaPacientes.push({ id: nuevoId, ...this.nuevoPaciente });
    }
    this.cerrarModal();
  }

  eliminarPaciente(id: number) {
    this.listaPacientes = this.listaPacientes.filter(p => p.id !== id);
  }
}
