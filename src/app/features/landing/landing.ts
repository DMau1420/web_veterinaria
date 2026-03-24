import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  constructor(private router: Router){}
    onLogin() {
    this.router.navigate(['/login']);  
  }
}
