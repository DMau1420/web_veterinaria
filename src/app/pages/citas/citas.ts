import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarAdmin } from '../../components/sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-citas',
  imports: [RouterModule, SidebarAdmin, FormsModule],
  templateUrl: './citas.html'
})
export class Citas implements OnInit {
  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth();
  anioActual = this.fechaActual.getFullYear();
  diaSeleccionado = this.fechaActual.getDate();

  diasDelMes: number[] = [];
  espaciosVacios: number[] = [];
  nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  listaCitas: any[] = [];

  mostrarModal = false;
  nuevaCita = { paciente: '', dueno: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' };
  modoEdicion = false;
  citaEnEdicionId: number | null = null;

  ngOnInit() {
    this.generarCalendario();
    this.generarCitasDePrueba();
  }

  generarCalendario() {
    const primerDiaDelMes = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnElMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    
    // Ajustamos el offset para que el Lunes sea el primer día de la columna
    const inicioOffset = primerDiaDelMes === 0 ? 6 : primerDiaDelMes - 1;
    
    this.espaciosVacios = Array.from({length: inicioOffset}, (_, i) => i);
    this.diasDelMes = Array.from({length: diasEnElMes}, (_, i) => i + 1);
  }

  // Generamos citas de prueba con fechas dinámicas relativas al mes actual
  generarCitasDePrueba() {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const anio = this.anioActual;
    const diaHoy = this.fechaActual.getDate().toString().padStart(2, '0');
    const diaManana = (this.fechaActual.getDate() + 1).toString().padStart(2, '0');
    
    this.listaCitas = [
      { id: 101, paciente: 'Michi', dueno: 'Carlos Pérez', fecha: `${anio}-${mesStr}-05`, hora: '10:00', motivo: 'Vacunación', estado: 'Pendiente' },
      { id: 102, paciente: 'Firulais', dueno: 'Ana Gómez', fecha: `${anio}-${mesStr}-${diaHoy}`, hora: '11:30', motivo: 'Revisión general', estado: 'Confirmada' },
      { id: 103, paciente: 'Copo', dueno: 'Luis Martínez', fecha: `${anio}-${mesStr}-${diaHoy}`, hora: '09:00', motivo: 'Corte de uñas', estado: 'Pendiente' },
      { id: 104, paciente: 'Max', dueno: 'Andrea Loria', fecha: `${anio}-${mesStr}-${diaManana}`, hora: '14:00', motivo: 'Consulta por alergia', estado: 'Confirmada' },
      { id: 105, paciente: 'Nemo', dueno: 'Sofía Castro', fecha: `${anio}-${mesStr}-25`, hora: '16:00', motivo: 'Revisión', estado: 'Cancelada' }
    ];
  }

  abrirModal(cita?: any) {
    this.mostrarModal = true;
    if (cita) {
      this.modoEdicion = true;
      this.citaEnEdicionId = cita.id;
      this.nuevaCita = { ...cita };
    } else {
      this.modoEdicion = false;
      this.citaEnEdicionId = null;
      // Pre-llenar la fecha con el día que actualmente está seleccionado
      const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
      const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
      this.nuevaCita = { paciente: '', dueno: '', fecha: `${this.anioActual}-${mesStr}-${diaStr}`, hora: '', motivo: '', estado: 'Pendiente' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCita() {
    if (this.modoEdicion && this.citaEnEdicionId !== null) {
      const index = this.listaCitas.findIndex(c => c.id === this.citaEnEdicionId);
      if (index !== -1) {
        this.listaCitas[index] = { ...this.nuevaCita, id: this.citaEnEdicionId };
      }
    } else {
      const nuevoId = this.listaCitas.length > 0 ? Math.max(...this.listaCitas.map(c => c.id)) + 1 : 101;
      this.listaCitas.push({ id: nuevoId, ...this.nuevaCita });
    }
    this.cerrarModal();
  }

  cancelarCita(id: number) {
    this.listaCitas = this.listaCitas.filter(c => c.id !== id);
  }

  // --- Navegación del Calendario ---
  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.diaSeleccionado = 1;
    this.generarCalendario();
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.diaSeleccionado = 1;
    this.generarCalendario();
  }

  irAHoy() {
    this.fechaActual = new Date();
    this.mesActual = this.fechaActual.getMonth();
    this.anioActual = this.fechaActual.getFullYear();
    this.diaSeleccionado = this.fechaActual.getDate();
    this.generarCalendario();
  }

  seleccionarDia(dia: number) {
    this.diaSeleccionado = dia;
  }

  // --- Filtros Dinámicos ---
  tieneCitas(dia: number): boolean {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const diaStr = dia.toString().padStart(2, '0');
    const fechaBusqueda = `${this.anioActual}-${mesStr}-${diaStr}`;
    return this.listaCitas.some(c => c.fecha === fechaBusqueda);
  }

  get citasDelDia() {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
    const fechaBusqueda = `${this.anioActual}-${mesStr}-${diaStr}`;
    return this.listaCitas.filter(c => c.fecha === fechaBusqueda);
  }
}