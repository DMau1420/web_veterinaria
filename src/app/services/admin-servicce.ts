import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminServicce {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // ==========================================
  // SERVICIOS PARA USUARIOS
  // ==========================================
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`);
  }

  crearUsuario(usuarioData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuarioData);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  // ==========================================
  // SERVICIOS PARA MASCOTAS
  // ==========================================
  contarMascotas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/contar_mascotas`);
  }

  getMascotas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mascotas`);
  }

  crearMascota(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/mascotas`, formData);
  }

  actualizarMascota(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/mascotas/${id}`, formData);
  }

  eliminarMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/mascotas/${id}`);
  }

  // ==========================================
  // SERVICIOS PARA CITAS
  // ==========================================
  getCitas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas`);
  }

  crearCita(citaData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/citas`, citaData);
  }

  actualizarCita(id: number, citaData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/citas/${id}`, citaData);
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/citas/${id}`);
  }
}
