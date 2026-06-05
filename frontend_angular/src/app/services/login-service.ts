import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: { identificador: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + '/login', credenciales);
  }

  logout() {
    localStorage.removeItem('usuario_activo'); // Mata el token/sesión que mantiene al usuario activo
    this.router.navigate(['/login']); // Redirige automáticamente al inicio de sesión
  }
}
