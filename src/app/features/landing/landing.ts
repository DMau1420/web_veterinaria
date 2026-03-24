import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {}
