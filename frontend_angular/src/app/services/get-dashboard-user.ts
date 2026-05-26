import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDashboardUser {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getMascotas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mascotas`);
  }

  getCitas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas`);
  }

  crearMascota(mascotaData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/mascotas`, mascotaData);
  }

  actualizarMascota(id: number, mascotaData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/mascotas/${id}`, mascotaData);
  }

  eliminarMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/mascotas/${id}`);
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
