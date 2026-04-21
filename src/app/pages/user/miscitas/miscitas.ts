import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';

@Component({
  selector: 'app-miscitas',
  imports: [RouterModule, SidebarUser, FormsModule, CommonModule],
  templateUrl: './miscitas.html'
})
export class MisCitas implements OnInit {
  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth();
  anioActual = this.fechaActual.getFullYear();
  diaSeleccionado = this.fechaActual.getDate();

  diasDelMes: number[] = [];
  espaciosVacios: number[] = [];
  nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  misCitas: any[] = [];
  
  mostrarModal = false;
  nuevaCita = { mascota: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' };

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

  generarCitasDePrueba() {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const anio = this.anioActual;
    const diaHoy = this.fechaActual.getDate().toString().padStart(2, '0');
    const diaManana = (this.fechaActual.getDate() + 1).toString().padStart(2, '0');
    
    this.misCitas = [
      { id: 1, mascota: 'Michi', fecha: `${anio}-${mesStr}-05`, hora: '10:00', motivo: 'Vacunación', estado: 'Pendiente' },
      { id: 2, mascota: 'Firulais', fecha: `${anio}-${mesStr}-${diaHoy}`, hora: '11:30', motivo: 'Revisión general', estado: 'Confirmada' },
      { id: 3, mascota: 'Michi', fecha: `${anio}-${mesStr}-${diaManana}`, hora: '14:00', motivo: 'Consulta por alergia', estado: 'Confirmada' }
    ];
  }

  abrirModal() {
    this.mostrarModal = true;
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
    this.nuevaCita = { mascota: '', fecha: `${this.anioActual}-${mesStr}-${diaStr}`, hora: '', motivo: '', estado: 'Pendiente' };
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCita() {
    const nuevoId = this.misCitas.length > 0 ? Math.max(...this.misCitas.map(c => c.id)) + 1 : 1;
    this.misCitas.push({ id: nuevoId, ...this.nuevaCita });
    this.cerrarModal();
  }

  cancelarCita(id: number) {
    if(confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.misCitas = this.misCitas.filter(c => c.id !== id);
    }
  }

  // Navegación
  mesAnterior() {
    if (this.mesActual === 0) { this.mesActual = 11; this.anioActual--; } 
    else { this.mesActual--; }
    this.diaSeleccionado = 1;
    this.generarCalendario();
  }

  mesSiguiente() {
    if (this.mesActual === 11) { this.mesActual = 0; this.anioActual++; } 
    else { this.mesActual++; }
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

  // Helpers para la vista
  tieneCitas(dia: number): boolean {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const diaStr = dia.toString().padStart(2, '0');
    const fechaBusqueda = `${this.anioActual}-${mesStr}-${diaStr}`;
    return this.misCitas.some(c => c.fecha === fechaBusqueda);
  }

  get citasDelDia() {
    const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
    const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
    const fechaBusqueda = `${this.anioActual}-${mesStr}-${diaStr}`;
    return this.misCitas.filter(c => c.fecha === fechaBusqueda);
  }
}