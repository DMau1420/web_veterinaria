import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetMascotas {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getMascotas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/mascotas`);
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

  getCitas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas`);
  }
}