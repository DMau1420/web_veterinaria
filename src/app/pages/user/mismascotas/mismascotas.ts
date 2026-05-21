import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SidebarUser } from '../../../components/sidebar-user/sidebar-user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetMascotas } from '../../../services/get-mascotas';

@Component({
  selector: 'app-mismascotas',
  imports: [SidebarUser, CommonModule, FormsModule],
  templateUrl: './mismascotas.html',
  styleUrl: './mismascotas.css',
})
export class Mismascotas implements OnInit {
  mascotas: any[] = [];
  citas: any[] = [];
  usuarioActivoId: number | null = null;

  mascotaSeleccionada: any | null = null;
  citasDeLaMascota: any[] = [];

  // Control para el Modal de Mascotas
  mostrarModalMascota = false;
  nuevaMascota: any = { nombre: '', especie: 'Perro', raza: '', edad: null, proximaVacuna: '', peso: '', icono: '', colorBg: '' };
  imagenSeleccionada: File | null = null;
  modoEdicionMascota = false;
  mascotaEnEdicionId: number | null = null;

  constructor(private mascotasService: GetMascotas, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario_activo');
    if (usuarioStr) {
      const usuarioActivo = JSON.parse(usuarioStr);
      this.usuarioActivoId = usuarioActivo.id;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.usuarioActivoId) return;

    this.mascotasService.getMascotas().subscribe({
      next: (mascotasData: any) => {
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
        
        this.cdr.detectChanges();
        this.cargarCitas();
      },
      error: (err: any) => console.error('Error al cargar mascotas:', err)
    });
  }

  cargarCitas() {
    if (!this.usuarioActivoId) return;

    this.mascotasService.getCitas().subscribe({
      next: (citasData: any) => {
        this.citas = citasData
          .filter((c: any) => Number(c.usuario_id) === Number(this.usuarioActivoId))
          .map((c: any) => {
            let horaStr = c.hora ? String(c.hora) : '--:--';
            if (horaStr.includes(':')) {
              horaStr = horaStr.split(':').slice(0, 2).join(':');
            } else if (!isNaN(Number(horaStr))) {
              const totalSeconds = Number(horaStr);
              const hours = Math.floor(totalSeconds / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);
              horaStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            return { ...c, hora: horaStr };
          });
        // Si hay una mascota seleccionada actualmente, recargamos su historial
        if (this.mascotaSeleccionada) {
          this.seleccionarMascota(this.mascotaSeleccionada);
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar citas:', err)
    });
  }

  seleccionarMascota(mascota: any) {
    this.mascotaSeleccionada = mascota;
    this.citasDeLaMascota = this.citas
      .filter(cita => Number(cita.mascota_id) === Number(mascota.id))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    this.cdr.detectChanges();
  }

  cerrarDetalles() {
    this.mascotaSeleccionada = null;
  }

  // --- Funciones Mascota (Modales) ---
  abrirModalMascota(mascota?: any) { 
    this.mostrarModalMascota = true; 
    this.imagenSeleccionada = null;
    
    if (mascota) {
      this.modoEdicionMascota = true;
      this.mascotaEnEdicionId = mascota.id;
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
    const file: File = event.target?.files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  guardarMascota() {
    const formData = new FormData();
    if (!this.usuarioActivoId) return;

    formData.append('usuario_id', this.usuarioActivoId.toString()); 
    formData.append('nombre', this.nuevaMascota.nombre);
    formData.append('especie', this.nuevaMascota.especie);
    
    if (this.nuevaMascota.raza) formData.append('raza', this.nuevaMascota.raza);
    if (this.nuevaMascota.edad) formData.append('edad', this.nuevaMascota.edad.toString());
    if (this.nuevaMascota.proximaVacuna) formData.append('proxima_vacuna', this.nuevaMascota.proximaVacuna);
    
    if (this.nuevaMascota.peso) {
      const pesoLimpio = parseFloat(this.nuevaMascota.peso.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(pesoLimpio)) {
        formData.append('peso', pesoLimpio.toString());
      }
    }

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    this.cerrarModalMascota();
    
    // Para reflejar los cambios visuales, delegamos la recarga completa a cargarDatos()
    if (this.modoEdicionMascota && this.mascotaEnEdicionId !== null) {
      this.mascotasService.actualizarMascota(this.mascotaEnEdicionId, formData).subscribe({
        next: () => this.cargarDatos(), // Refrescar vista
        error: (error: any) => console.error('Error al actualizar mascota:', error)
      });
    } else {
      this.mascotasService.crearMascota(formData).subscribe({
        next: () => this.cargarDatos(), // Refrescar vista
        error: (error: any) => console.error('Error al registrar mascota:', error)
      });
    }
  }

  eliminarMascota() {
    if (!this.mascotaEnEdicionId) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.')) {
      this.mascotasService.eliminarMascota(this.mascotaEnEdicionId).subscribe({
        next: () => {
          this.cerrarModalMascota();
          // Si la mascota eliminada estaba seleccionada en detalles, lo cerramos
          if (this.mascotaSeleccionada?.id === this.mascotaEnEdicionId) {
            this.cerrarDetalles();
          }
          this.cargarDatos(); // Refrescar vista
        },
        error: (err: any) => console.error('Error al eliminar:', err)
      });
    }
  }
}
