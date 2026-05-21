import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetDashboardUser } from '../../../services/get-dashboard-user';

@Component({
  selector: 'app-dashboard-user',
  imports: [SidebarUser, FormsModule, CommonModule],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css',
})
export class DashboardUser implements OnInit {
  mascotas: any[] = [];
  citas: any[] = [];

  usuarioNombre = 'Cargando...';
  usuarioIniciales = 'U';
  usuarioActivoId: number | null = null;

  // Control para el Modal de Mascotas
  mostrarModalMascota = false;
  nuevaMascota: any = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };
  imagenSeleccionada: File | null = null;
  modoEdicionMascota = false;
  mascotaEnEdicionId: number | null = null;

  // Control para el Modal de Citas
  mostrarModalCita = false;
  nuevaCita: any = { mascota_id: null, fecha: '', hora: '', motivo: '', estado: 'Pendiente', diaNumero: '' };
  modoEdicionCita = false;
  citaEnEdicionId: number | null = null;

  constructor(
    private dashboardService: GetDashboardUser,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario_activo');
    if (usuarioStr) {
      const usuarioActivo = JSON.parse(usuarioStr);
      this.usuarioActivoId = usuarioActivo.id;
      this.usuarioNombre = `${usuarioActivo.nombre} ${usuarioActivo.apellidos || ''}`.trim();
      this.usuarioIniciales = (usuarioActivo.nombre.charAt(0) + (usuarioActivo.apellidos ? usuarioActivo.apellidos.charAt(0) : '')).toUpperCase();
    }
    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.usuarioActivoId) return;

    this.dashboardService.getMascotas().subscribe({
      next: (mascotasData: any) => {
        // Filtramos para mostrar únicamente las de este usuario
        this.mascotas = mascotasData
          .filter((m: any) => Number(m.usuario_id) === Number(this.usuarioActivoId))
          .map((m: any) => {
            let icono = '🐾';
            let colorBg = 'bg-slate-100';
            if (m.especie?.toLowerCase() === 'gato') {
              icono = '🐱'; colorBg = 'bg-orange-100';
            } else if (m.especie?.toLowerCase() === 'perro') {
              icono = '🐶'; colorBg = 'bg-sky-100';
            }
            return {
              id: m.id, nombre: m.nombre, especie: m.especie, raza: m.raza, edad: m.edad,
              proximaVacuna: m.proxima_vacuna, peso: m.peso ? `${m.peso} kg` : '--',
              icono: icono, colorBg: colorBg,
              imagenUrl: m.imagen ? `http://127.0.0.1:8000/${m.imagen}` : null
            };
          });
        
        this.cdr.detectChanges(); // Forzamos a Angular a actualizar la vista
        this.cargarCitas();
      },
      error: (err: any) => console.error('Error al cargar mascotas:', err)
    });
  }

  cargarCitas() {
    if (!this.usuarioActivoId) return;

    this.dashboardService.getCitas().subscribe({
      next: (citasData: any) => {
        // Fecha de hoy a medianoche (para poder comparar solo los días)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Filtramos para mostrar únicamente las de este usuario y que sean futuras o del día actual
        this.citas = citasData
          .filter((c: any) => {
            const fechaCita = new Date(c.fecha + 'T00:00:00');
            return Number(c.usuario_id) === Number(this.usuarioActivoId) && fechaCita >= hoy;
          })
          .map((c: any) => {
            const pet = this.mascotas.find(m => m.id === c.mascota_id);
            const fechaObj = new Date(c.fecha + 'T00:00:00'); 
            const diaNumero = !isNaN(fechaObj.getDate()) ? fechaObj.getDate().toString() : '--';
            return {
              id: c.id, mascota: pet ? pet.nombre : 'Desconocida', mascota_id: c.mascota_id, fecha: c.fecha,
              hora: c.hora, motivo: c.motivo, estado: c.estado, diaNumero: diaNumero
            };
          });
          
        this.cdr.detectChanges(); // Forzamos a Angular a actualizar la vista
      },
      error: (err: any) => console.error('Error al cargar citas:', err)
    });
  }

  // --- Funciones Mascota ---
  abrirModalMascota(mascota?: any) { 
    this.mostrarModalMascota = true; 
    this.imagenSeleccionada = null;
    
    if (mascota) {
      this.modoEdicionMascota = true;
      this.mascotaEnEdicionId = mascota.id;
      
      // Extraemos solo el número del peso para ponerlo en el input limpiamente
      let pesoLimpio = '';
      if (mascota.peso && mascota.peso !== '-- kg') {
        pesoLimpio = mascota.peso.replace(/[^0-9.]/g, '');
      }
      
      this.nuevaMascota = {
        nombre: mascota.nombre, especie: mascota.especie, raza: mascota.raza || '',
        edad: mascota.edad || null, proximaVacuna: mascota.proximaVacuna || '', peso: pesoLimpio
      };
    } else {
      this.modoEdicionMascota = false;
      this.mascotaEnEdicionId = null;
      this.nuevaMascota = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };
    }
  }
  
  cerrarModalMascota() { 
    this.mostrarModalMascota = false; 
  }

  onFileSelected(event: any) {
    const file: File = event.target?.files?.[0]; // Previene error si el target no tiene files
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  guardarMascota() {
    // Usamos FormData porque la API espera datos de formulario (Form) y un archivo (File)
    const formData = new FormData();
    
    // Obtenemos el usuario activo del LocalStorage
    const usuarioStr = localStorage.getItem('usuario_activo');
    if (!usuarioStr) {
      alert('Error: No se encontró la sesión del usuario. Por favor inicie sesión nuevamente.');
      return;
    }
    const usuarioActivo = JSON.parse(usuarioStr);

    // Agregamos el ID dinámico
    formData.append('usuario_id', usuarioActivo.id.toString()); 
    formData.append('nombre', this.nuevaMascota.nombre);
    formData.append('especie', this.nuevaMascota.especie);
    
    if (this.nuevaMascota.raza) formData.append('raza', this.nuevaMascota.raza);
    if (this.nuevaMascota.edad) formData.append('edad', this.nuevaMascota.edad.toString());
    
    // Limpiamos el campo peso por si el usuario escribió "kg" (ej. "4.5 kg"). FastAPI espera un float.
    if (this.nuevaMascota.peso) {
      const pesoLimpio = parseFloat(this.nuevaMascota.peso.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(pesoLimpio)) {
        formData.append('peso', pesoLimpio.toString());
      }
    }

    if (this.imagenSeleccionada) {
      // Es importante incluir el nombre del archivo para que FastAPI lo reconozca como UploadFile
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    // 1. Cerramos el modal de inmediato al hacer clic para evitar envíos duplicados
    this.cerrarModalMascota();

    // 2. Clonamos los datos actuales del formulario antes de que se limpie
    const mascotaVisual = { ...this.nuevaMascota };
    const previewUrl = this.imagenSeleccionada ? URL.createObjectURL(this.imagenSeleccionada) : null;

    if (this.modoEdicionMascota && this.mascotaEnEdicionId !== null) {
      this.dashboardService.actualizarMascota(this.mascotaEnEdicionId, formData).subscribe({
        next: () => {
          const index = this.mascotas.findIndex(m => m.id === this.mascotaEnEdicionId);
          if (index !== -1) {
            const currentMascota = this.mascotas[index];
            const icono = mascotaVisual.especie === 'Gato' ? '🐱' : (mascotaVisual.especie === 'Perro' ? '🐶' : '🐾');
            const colorBg = mascotaVisual.especie === 'Gato' ? 'bg-orange-100' : (mascotaVisual.especie === 'Perro' ? 'bg-sky-100' : 'bg-slate-100');
            
            this.mascotas[index] = {
              ...currentMascota, ...mascotaVisual, icono, colorBg,
              peso: mascotaVisual.peso ? `${mascotaVisual.peso} kg` : '--',
              imagenUrl: previewUrl || currentMascota.imagenUrl // Conserva la imagen vieja si no se sube otra
            };
            this.mascotas = [...this.mascotas]; // Refrescar visualmente
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al actualizar mascota:', error);
          alert('Hubo un error al actualizar la mascota');
        }
      });
    } else {
      this.dashboardService.crearMascota(formData).subscribe({
        next: (response: any) => {
          const nuevoId = response.id;
          const icono = mascotaVisual.especie === 'Gato' ? '🐱' : (mascotaVisual.especie === 'Perro' ? '🐶' : '🐾');
          const colorBg = mascotaVisual.especie === 'Gato' ? 'bg-orange-100' : (mascotaVisual.especie === 'Perro' ? 'bg-sky-100' : 'bg-slate-100');
          
          this.mascotas = [...this.mascotas, { id: nuevoId, ...mascotaVisual, icono, colorBg, peso: mascotaVisual.peso ? `${mascotaVisual.peso} kg` : '--', imagenUrl: previewUrl }];
          
          this.nuevaMascota = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };
          this.imagenSeleccionada = null;
          
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al registrar mascota:', error);
          alert('Hubo un error al registrar la mascota');
        }
      });
    }
  }

  eliminarMascota() {
    if (!this.mascotaEnEdicionId) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.')) {
      this.dashboardService.eliminarMascota(this.mascotaEnEdicionId).subscribe({
        next: () => {
          this.mascotas = this.mascotas.filter(m => m.id !== this.mascotaEnEdicionId);
          this.cerrarModalMascota();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la mascota de la base de datos.');
        }
      });
    }
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
      this.nuevaCita = { mascota_id: null, fecha: '', hora: '', motivo: '', estado: 'Pendiente', diaNumero: '' };
    }
  }

  cerrarModalCita() { 
    this.mostrarModalCita = false; 
  }

  guardarCita() {
    const usuarioStr = localStorage.getItem('usuario_activo');
    if (!usuarioStr) {
      alert('Error: No se encontró la sesión del usuario.');
      return;
    }
    const usuarioActivo = JSON.parse(usuarioStr);

    const payload = {
      mascota_id: Number(this.nuevaCita.mascota_id),
      usuario_id: usuarioActivo.id,
      fecha: this.nuevaCita.fecha,
      hora: this.nuevaCita.hora,
      motivo: this.nuevaCita.motivo,
      estado: this.nuevaCita.estado
    };

    if (this.modoEdicionCita && this.citaEnEdicionId !== null) {
      this.dashboardService.actualizarCita(this.citaEnEdicionId, payload).subscribe({
        next: () => {
          this.cargarCitas(); // Refrescamos desde backend
          this.cerrarModalCita();
        },
        error: (err: any) => console.error('Error al actualizar cita:', err)
      });
    } else {
      this.dashboardService.crearCita(payload).subscribe({
        next: () => {
          this.cargarCitas(); // Refrescamos desde backend
          this.cerrarModalCita();
        },
        error: (err: any) => console.error('Error al registrar cita:', err)
      });
    }
  }

  cancelarCita(id: number) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.dashboardService.eliminarCita(id).subscribe({
        next: () => {
          // Quitamos visualmente la cita eliminada sin volver a consultar al servidor
          this.citas = this.citas.filter(c => c.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error al eliminar cita:', err)
      });
    }
  }
}
