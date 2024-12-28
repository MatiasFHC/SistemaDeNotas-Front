import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NotasService } from '../../service/notas.service';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    MatLabel,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatCard
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  token: string | null = null;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  Login() {
    if (this.loginForm.valid) {
      this.notasService.loginUser(this.loginForm.value).subscribe(
        response => {
          if (response.jwttoken) {
            //almacena el token en la variable token
            this.token = response.jwttoken;
            //almacena el token en el servicio en el sessionStorage
            this.notasService.setToken(response.jwttoken); 
            //redirige a la pagina principal "main"
            this.router.navigate(['/main']);
            //muestra un mensaje de inicio de sesion exitoso
            this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
          } else {
            this.snackBar.open('Error al obtener el token', 'Cerrar', { duration: 3000 });
          }
        },
        error => {
          this.snackBar.open('Nombre o contraseña incorrecta, intentalo de nuevo', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }
}
