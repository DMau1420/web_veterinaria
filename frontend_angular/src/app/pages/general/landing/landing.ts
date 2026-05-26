import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Navbar, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  constructor(private router: Router){}
    onLogin() {
    this.router.navigate(['/login']);  
  }
}
