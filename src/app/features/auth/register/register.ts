import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  constructor(private router: Router){}
  onRegister() {
    this.router.navigate(['/dashboard']);  
  }
}
