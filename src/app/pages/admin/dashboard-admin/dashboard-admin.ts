import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { SidebarAdmin } from "../../../components/sidebar-admin/sidebar-admin";
import { AdminServicce } from '../../../services/admin-servicce';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterModule, SidebarAdmin, CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements AfterViewInit, OnInit {
  @ViewChild('pacientesChart') pacientesChart!: ElementRef;
  @ViewChild('citasChart') citasChart!: ElementRef;
  @ViewChild('clientesChart') clientesChart!: ElementRef;

  // Instancias de Chart.js
  chartPacientes: any;
  chartCitas: any;
  chartClientes: any;

  datosPacientesMeses: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datosCitasHoy: number[] = [0, 0, 0, 0, 0, 0];
  datosEspecies: any = {};
  viewInitialized = false;

  // Variables para los cuadros de resumen (KPIs)
  totalPacientes: number = 0;
  pacientesMesActual: number = 0;

  citasHoy: number = 0;
  citasPendientesHoy: number = 0;

  clientesNuevosMes: number = 0;
  porcentajeClientesNuevos: number = 0;

  proximasCitas: any[] = [];

  constructor(
    private adminService: AdminServicce,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarMetricas();
  }

  cargarMetricas() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Formato 'YYYY-MM-DD' para comparar con la BD
    const todayStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    // Formato 'HH:MM' de la hora actual
    const actualHora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 1. Métricas de Pacientes Activos (Mascotas)
    this.adminService.contarMascotas().subscribe(res => {
      this.totalPacientes = res.total;
      this.pacientesMesActual = res.mes_actual;
      
      this.datosPacientesMeses = res.historico_meses || this.datosPacientesMeses;
      this.datosEspecies = res.especies || {};
      
      if (this.viewInitialized) {
        this.crearGraficaPacientes(this.datosPacientesMeses);
        this.crearGraficaClientes(this.datosEspecies);
      }
      this.cdr.detectChanges(); // Forzar actualización de la vista
    });

    // 2. Obtener Mascotas, Usuarios y Citas anidados para cargar tabla y métricas
    this.adminService.getMascotas().subscribe(mascotas => {
      this.adminService.getUsuarios().subscribe(usuarios => {
        
        // --- Métricas de Clientes Nuevos (Usuarios) ---
        const clientes = usuarios.filter((u: any) => u.rol === 'USER');
        const clientesMesActualArr = clientes.filter((u: any) => {
          if (!u.fecha_registro) return false;
          const d = new Date(u.fecha_registro);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        this.clientesNuevosMes = clientesMesActualArr.length;

        const clientesMesAnteriorArr = clientes.filter((u: any) => {
          if (!u.fecha_registro) return false;
          const d = new Date(u.fecha_registro);
          return d.getMonth() === previousMonth && d.getFullYear() === previousYear;
        });
        const countAnterior = clientesMesAnteriorArr.length;

        if (countAnterior === 0) {
          this.porcentajeClientesNuevos = this.clientesNuevosMes > 0 ? 100 : 0;
        } else {
          this.porcentajeClientesNuevos = Math.round(((this.clientesNuevosMes - countAnterior) / countAnterior) * 100);
        }

        this.adminService.getCitas().subscribe(citas => {
          // --- Métricas de Citas de Hoy y Pendientes ---
          const citasHoyArr = citas.filter((c: any) => c.fecha === todayStr);
          this.citasHoy = citasHoyArr.length;

          this.citasPendientesHoy = citasHoyArr.filter((c: any) => {
            if (c.estado !== 'Pendiente') return false;
            let citaHora = '00:00';
            if (c.hora) {
              const timeParts = String(c.hora).split(':');
              if (timeParts.length >= 2) citaHora = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
              else if (!isNaN(Number(c.hora))) { 
                const totalSecs = Number(c.hora);
                citaHora = `${Math.floor(totalSecs / 3600).toString().padStart(2, '0')}:${Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0')}`;
              }
            }
            return citaHora > actualHora;
          }).length;

          // Clasificar citas para la gráfica de barras de hoy
          const conteoCitas = [0, 0, 0, 0, 0, 0];
          citasHoyArr.forEach((c: any) => {
            let hour = 0;
            if (c.hora && String(c.hora).includes(':')) hour = parseInt(c.hora.split(':')[0], 10);
            else if (!isNaN(Number(c.hora))) hour = Math.floor(Number(c.hora) / 3600);
            
            if (hour >= 8 && hour < 10) conteoCitas[0]++;
            else if (hour >= 10 && hour < 12) conteoCitas[1]++;
            else if (hour >= 12 && hour < 14) conteoCitas[2]++;
            else if (hour >= 14 && hour < 16) conteoCitas[3]++;
            else if (hour >= 16 && hour < 18) conteoCitas[4]++;
            else if (hour >= 18) conteoCitas[5]++;
          });
          this.datosCitasHoy = conteoCitas;
          if (this.viewInitialized) this.crearGraficaCitas(this.datosCitasHoy);

          // --- Tabla de Próximas Citas de Hoy ---
          this.proximasCitas = citasHoyArr.map((c: any) => {
            const mascota = mascotas.find((m: any) => m.id === c.mascota_id);
            const usuario = usuarios.find((u: any) => u.id === c.usuario_id);

            let horaStr = c.hora ? String(c.hora) : '--:--';
            if (horaStr.includes(':')) horaStr = horaStr.split(':').slice(0, 2).join(':');
            else if (!isNaN(Number(horaStr))) {
              const totalSecs = Number(horaStr);
              horaStr = `${Math.floor(totalSecs / 3600).toString().padStart(2, '0')}:${Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0')}`;
            }

            let horaFormateada = horaStr;
            if (horaStr !== '--:--') {
              const [h, m] = horaStr.split(':');
              const H = parseInt(h, 10);
              const ampm = H >= 12 ? 'PM' : 'AM';
              const H12 = H % 12 || 12;
              horaFormateada = `${H12}:${m} ${ampm}`;
            }

            let imagenUrl = mascota?.imagen ? `http://127.0.0.1:8000/${mascota.imagen}` : null;
            let icono = '🐾';
            let colorBg = 'bg-slate-100 text-slate-600';
            if (mascota?.especie?.toLowerCase() === 'gato') { icono = '🐱'; colorBg = 'bg-orange-100 text-orange-600'; }
            else if (mascota?.especie?.toLowerCase() === 'perro') { icono = '🐶'; colorBg = 'bg-blue-100 text-blue-600'; }

            return {
              ...c,
              mascotaNombre: mascota ? mascota.nombre : 'Desconocida',
              imagenUrl,
              icono,
              colorBg,
              dueno: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Desconocido',
              horaFormateada,
              horaOriginal: horaStr
            };
          });

          this.proximasCitas.sort((a, b) => a.horaOriginal.localeCompare(b.horaOriginal));

          this.cdr.detectChanges();
        });
      });
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.crearGraficaPacientes(this.datosPacientesMeses);
    this.crearGraficaCitas(this.datosCitasHoy);
    this.crearGraficaClientes(this.datosEspecies);
  }

  crearGraficaPacientes(datos: number[]) {
    if (this.chartPacientes) this.chartPacientes.destroy();
    this.chartPacientes = new Chart(this.pacientesChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{ label: 'Pacientes Activos', data: datos, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true, tension: 0.4 }]
      }
    });
  }

  crearGraficaCitas(datos: number[]) {
    if (this.chartCitas) this.chartCitas.destroy();
    this.chartCitas = new Chart(this.citasChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm'],
        datasets: [{ label: 'Citas Hoy', data: datos, backgroundColor: '#a855f7', borderRadius: 4 }]
      }
    });
  }

  crearGraficaClientes(especies: any) {
    if (this.chartClientes) this.chartClientes.destroy();
    let labels = Object.keys(especies);
    let data = Object.values(especies) as number[];
    
    if (labels.length === 0) {
      labels = ['Sin datos'];
      data = [1];
    }

    this.chartClientes = new Chart(this.clientesChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{ data: data, backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#8b5cf6', '#ec4899'] }]
      }
    });
  }
}
