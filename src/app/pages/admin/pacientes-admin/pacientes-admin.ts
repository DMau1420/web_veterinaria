import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarAdmin } from '../../../components/sidebar-admin/sidebar-admin';
import { AdminServicce } from '../../../services/admin-servicce';

@Component({
  selector: 'app-pacientes-admin',
  imports: [RouterModule, FormsModule, SidebarAdmin, CommonModule],
  templateUrl: './pacientes-admin.html'
})
export class PacientesAdmin implements OnInit {
  listaPacientes: any[] = [];
  listaUsuarios: any[] = [];

  // Modal de Pacientes
  mostrarModal = false;
  modoEdicion = false;
  pacienteEnEdicionId: number | null = null;
  nuevoPaciente: any = { nombre: '', especie: '', raza: '', usuario_id: null };

  // Modal de Dueños (Usuarios)
  mostrarModalUsuario = false;
  nuevoUsuario = { nombre: '', apellidos: '', email: '', telefono: '', password: '', rol: 'USER' };

  constructor(private adminService: AdminServicce, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.adminService.getUsuarios().subscribe(usuarios => {
      this.listaUsuarios = usuarios.filter((u: any) => u.rol === 'USER');
      this.adminService.getMascotas().subscribe(mascotas => {
        this.listaPacientes = mascotas.map((m: any) => {
          const dueno = usuarios.find((u: any) => u.id === m.usuario_id);
          return {
            ...m,
            raza: m.raza || 'No especificada',
            dueno: dueno ? `${dueno.nombre} ${dueno.apellidos || ''}`.trim() : 'Desconocido',
            telefono: dueno?.telefono || 'Sin teléfono',
            estado: 'Activo'
          };
        });
        this.cdr.detectChanges();
      });
    });
  }

  // --- MODAL PACIENTES ---
  abrirModal(paciente?: any) {
    this.mostrarModal = true;
    if (paciente) {
      this.modoEdicion = true;
      this.pacienteEnEdicionId = paciente.id;
      this.nuevoPaciente = { 
        nombre: paciente.nombre, especie: paciente.especie, raza: paciente.raza, 
        usuario_id: paciente.usuario_id 
      };
    } else {
      this.modoEdicion = false;
      this.pacienteEnEdicionId = null;
      this.nuevoPaciente = { nombre: '', especie: '', raza: '', usuario_id: null };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarPaciente() {
    const formData = new FormData();
    formData.append('nombre', this.nuevoPaciente.nombre);
    formData.append('especie', this.nuevoPaciente.especie);
    formData.append('raza', this.nuevoPaciente.raza);
    formData.append('usuario_id', this.nuevoPaciente.usuario_id);

    if (this.modoEdicion && this.pacienteEnEdicionId !== null) {
      this.adminService.actualizarMascota(this.pacienteEnEdicionId, formData).subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al actualizar paciente', err)
      });
    } else {
      this.adminService.crearMascota(formData).subscribe({
        next: () => {
          this.cargarDatos();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear paciente', err)
      });
    }
  }

  eliminarPaciente(id: number) {
    if (confirm('¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
      this.adminService.eliminarMascota(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => console.error('Error al eliminar paciente', err)
      });
    }
  }

  // --- MODAL USUARIOS (DUEÑOS) ---
  abrirModalUsuario() {
    this.mostrarModalUsuario = true;
    this.nuevoUsuario = { nombre: '', apellidos: '', email: '', telefono: '', password: '', rol: 'USER' };
  }

  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
  }

  guardarUsuario() {
    this.adminService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarDatos();
        this.cerrarModalUsuario();
      },
      error: (err) => alert('Error al crear el dueño: ' + (err.error?.detail || 'Error desconocido'))
    });
  }
}
