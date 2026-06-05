import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../../services/login-service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = ''; // Esta variable ahora almacenará tanto correos como teléfonos
  password = '';
  errorMessage = '';

  constructor(private router: Router, private loginService: LoginService){}

  onLogin() {
    this.errorMessage = ''; // Limpiamos errores previos

    this.loginService.login({ identificador: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        // Guardamos los datos del usuario activo en localStorage
        localStorage.setItem('usuario_activo', JSON.stringify(response.usuario));

        const rol = response.usuario?.rol;
        if (rol === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard-user']);
        }
      },
      error: (error: any) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.error?.detail || 'Credenciales incorrectas. Intenta de nuevo';
        this.password = ''; // Limpiar solo la contraseña por seguridad
      }
    });
  }
}
