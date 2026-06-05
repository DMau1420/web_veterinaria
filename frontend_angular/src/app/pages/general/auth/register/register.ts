import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../../services/register.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'USER'
  };
  mensajeError: string = '';

  constructor(private router: Router, private registerService: RegisterService){}

  onRegister() {
    this.mensajeError = ''; // Limpiamos errores previos

    // Lógica para dividir nombre y apellidos
    const fullName = this.usuario.nombre.trim();
    const words = fullName.split(/\s+/);
    let nombreFinal = '';
    let apellidosFinal = '';

    if (words.length >= 4) {
      nombreFinal = words.slice(0, 2).join(' ');
      apellidosFinal = words.slice(2).join(' ');
    } else if (words.length >= 2) {
      nombreFinal = words[0];
      apellidosFinal = words.slice(1).join(' ');
    } else {
      nombreFinal = fullName; // Caso donde solo pongan 1 palabra
    }

    const payload = { ...this.usuario, nombre: nombreFinal, apellidos: apellidosFinal };

    this.registerService.registrarUsuario(payload).subscribe({
      next: (response: any) => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error al registrar:', error);
        this.mensajeError = error.error?.detail || 'Hubo un error al crear la cuenta. Intente nuevamente.';
      }
    });
  }
}
