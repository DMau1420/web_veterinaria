 import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarAdmin } from '../../../components/sidebar-admin/sidebar-admin';
import { AdminServicce } from '../../../services/admin-servicce';

@Component({
  selector: 'app-citas-admin',
  imports: [RouterModule, SidebarAdmin, FormsModule, CommonModule],
  templateUrl: './citas-admin.html'
})
export class CitasAdmin implements OnInit {
  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth();
  anioActual = this.fechaActual.getFullYear();
  diaSeleccionado = this.fechaActual.getDate();

  diasDelMes: number[] = [];
  espaciosVacios: number[] = [];
  nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  listaCitas: any[] = [];
  usuarios: any[] = [];
  mascotas: any[] = [];
  mascotasFiltradas: any[] = [];

  mostrarModal = false;
  nuevaCita: any = { paciente: '', dueno: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' };
  modoEdicion = false;
  citaEnEdicionId: number | null = null;

  constructor(private adminService: AdminServicce, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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
    this.adminService.getMascotas().subscribe(mascotas => {
      this.mascotas = mascotas; // Guardamos para el dropmenu

      this.adminService.getUsuarios().subscribe(usuarios => {
        this.usuarios = usuarios.filter((u: any) => u.rol === 'USER'); // Filtramos solo clientes

        this.adminService.getCitas().subscribe(citas => {
          this.listaCitas = citas.map((c: any) => {
            const mascota = mascotas.find((m: any) => m.id === c.mascota_id);
            const usuario = usuarios.find((u: any) => u.id === c.usuario_id);

            let horaStr = c.hora ? String(c.hora) : '--:--';
            if (horaStr.includes(':')) {
              horaStr = horaStr.split(':').slice(0, 2).join(':');
            } else if (!isNaN(Number(horaStr))) {
              const totalSecs = Number(horaStr);
              horaStr = `${Math.floor(totalSecs / 3600).toString().padStart(2, '0')}:${Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0')}`;
            }

            return {
              ...c,
              paciente: mascota ? mascota.nombre : 'Desconocida',
              dueno: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Desconocido',
              hora: horaStr
            };
          });
          this.cdr.detectChanges();
        });
      });
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
      // Pre-llenar la fecha con el día que actualmente está seleccionado
      const mesStr = (this.mesActual + 1).toString().padStart(2, '0');
      const diaStr = this.diaSeleccionado.toString().padStart(2, '0');
      this.nuevaCita = { usuario_id: null, mascota_id: null, fecha: `${this.anioActual}-${mesStr}-${diaStr}`, hora: '', motivo: '', estado: 'Pendiente' };
      this.mascotasFiltradas = [];
    }
  }

  onUsuarioSeleccionado() {
    if (this.nuevaCita.usuario_id) {
      // Filtramos las mascotas para que solo aparezcan las que pertenezcan a este usuario
      this.mascotasFiltradas = this.mascotas.filter(m => Number(m.usuario_id) === Number(this.nuevaCita.usuario_id));
    } else {
      this.mascotasFiltradas = [];
    }
    this.nuevaCita.mascota_id = null; // Reiniciar selección de mascota
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCita() {
    if (this.modoEdicion && this.citaEnEdicionId !== null) {
      const payload = {
        mascota_id: this.nuevaCita.mascota_id,
        usuario_id: this.nuevaCita.usuario_id,
        fecha: this.nuevaCita.fecha,
        hora: this.nuevaCita.hora,
        motivo: this.nuevaCita.motivo,
        estado: this.nuevaCita.estado
      };

      this.adminService.actualizarCita(this.citaEnEdicionId, payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarModal();
        },
        error: (err: any) => console.error('Error al actualizar cita:', err)
      });
    } else {
      // Lógica para registrar nueva cita
      const payload = {
        mascota_id: Number(this.nuevaCita.mascota_id),
        usuario_id: Number(this.nuevaCita.usuario_id),
        fecha: this.nuevaCita.fecha,
        hora: this.nuevaCita.hora,
        motivo: this.nuevaCita.motivo,
        estado: 'Pendiente'
      };

      this.adminService.crearCita(payload).subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarModal();
        },
        error: (err: any) => console.error('Error al agendar nueva cita:', err)
      });
    }
  }

  cancelarCita(id: number) {
    if (confirm('¿Estás seguro de cancelar o eliminar esta cita?')) {
      this.adminService.eliminarCita(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err: any) => console.error('Error al eliminar cita:', err)
      });
    }
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