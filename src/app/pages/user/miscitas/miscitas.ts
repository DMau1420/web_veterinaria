import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';
import { GetCitas } from '../../../services/get-citas';

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
  mascotas: any[] = [];
  usuarioActivoId: number | null = null;

  usuarioNombre = 'Cargando...';
  usuarioIniciales = 'U';
  
  mostrarModal = false;
  nuevaCita: any = { mascota_id: null, fecha: '', hora: '', motivo: '', estado: 'Pendiente' };
  modoEdicion = false;
  citaEnEdicionId: number | null = null;

  constructor(private citasService: GetCitas, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario_activo');
    if (usuarioStr) {
      const usuarioActivo = JSON.parse(usuarioStr);
      this.usuarioActivoId = usuarioActivo.id;
      this.usuarioNombre = `${usuarioActivo.nombre} ${usuarioActivo.apellidos || ''}`.trim();
      this.usuarioIniciales = (usuarioActivo.nombre.charAt(0) + (usuarioActivo.apellidos ? usuarioActivo.apellidos.charAt(0) : '')).toUpperCase();
    }
    this.generarCalendario();
    this.cargarDatos();
  }

  generarCalendario() {
    const primerDiaDelMes = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnElMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    
    // Ajustamos el offset para que el Lunes sea el primer día de la columna
    const inicioOffset = primerDiaDelMes === 0 ? 6 : primerDiaDelMes - 1;
    
    this.espaciosVacios = Array.from({length: inicioOffset}, (_, i) => i);
    this.diasDelMes = Array.from({length: diasEnElMes}, (_, i) => i + 1);
  }

  cargarDatos() {
    if (!this.usuarioActivoId) return;

    this.citasService.getMascotas().subscribe({
      next: (mascotasData: any) => {
        this.mascotas = mascotasData.filter((m: any) => Number(m.usuario_id) === Number(this.usuarioActivoId));
        
        this.citasService.getCitas().subscribe({
          next: (citasData: any) => {
            this.misCitas = citasData
              .filter((c: any) => Number(c.usuario_id) === Number(this.usuarioActivoId))
              .map((c: any) => {
                const pet = this.mascotas.find(m => m.id === c.mascota_id);
                
                let horaStr = c.hora ? String(c.hora) : '--:--';
                if (horaStr.includes(':')) {
                  horaStr = horaStr.split(':').slice(0, 2).join(':');
                } else if (!isNaN(Number(horaStr))) {
                  const totalSeconds = Number(horaStr);
                  const hours = Math.floor(totalSeconds / 3600);
                  const minutes = Math.floor((totalSeconds % 3600) / 60);
                  horaStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }

                return {
                  ...c,
                  mascota: pet ? pet.nombre : 'Desconocida',
                  hora: horaStr
                };
              });
            this.cdr.detectChanges();
          },
          error: (err: any) => console.error('Error al cargar citas:', err)
        });
      },
      error: (err: any) => console.error('Error al cargar mascotas:', err)
    });
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
      const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
      const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
      this.nuevaCita = { mascota_id: null, fecha: `${this.anioActual}-${mesStr}-${diaStr}`, hora: '', motivo: '', estado: 'Pendiente' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCita() {
    if (!this.usuarioActivoId) return;
    
    const payload = {
      mascota_id: Number(this.nuevaCita.mascota_id),
      usuario_id: this.usuarioActivoId,
      fecha: this.nuevaCita.fecha,
      hora: this.nuevaCita.hora,
      motivo: this.nuevaCita.motivo,
      estado: this.nuevaCita.estado
    };

    const peticion = (this.modoEdicion && this.citaEnEdicionId !== null) 
      ? this.citasService.actualizarCita(this.citaEnEdicionId, payload)
      : this.citasService.crearCita(payload);

    peticion.subscribe({
      next: () => {
        this.cargarDatos(); // Refrescamos desde backend para asegurar exactitud
        this.cerrarModal();
      },
      error: (err: any) => console.error('Error al guardar cita:', err)
    });
  }

  cancelarCita(id: number) {
    if(confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.citasService.eliminarCita(id).subscribe({
        next: () => {
          this.misCitas = this.misCitas.filter(c => c.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al cancelar cita:', err)
      });
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