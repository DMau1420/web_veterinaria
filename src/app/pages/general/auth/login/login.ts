import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router){}

  onLogin() {
    if (this.email === 'admin' && this.password === '1234') {
      this.router.navigate(['/dashboard']);  
    } else if(this.email === 'mau' || this.password === '1234'){
      this.router.navigate(['/dashboard-user']);  
    }else {
      this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo';
      this.email = '';
      this.password = '';
    }
  }
}
