import { Component, signal} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { NotasService } from '../../service/notas.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-registrar',
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    MatLabel,
    MatIconModule
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {
  registerForm: FormGroup;
  hide = signal(true);
  hideConfirm = signal(true);

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService, 
    private snackBar: MatSnackBar,
    private router: Router,
  )

  {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      enabled: [true],  // Establecer valor predeterminado a true
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
    }, { validators: this.passwordsMatch });
  }

  clickEvent(event: MouseEvent, isConfirm: boolean = false) {
    if (isConfirm) {
      this.hideConfirm.set(!this.hideConfirm());
    } else {
      this.hide.set(!this.hide());
    }
    event.stopPropagation();
  }

  passwordsMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  registrarUsuario() {
    if (this.registerForm.valid) {
      this.notasService.addUsuario(this.registerForm.value).subscribe(
        response => {
          this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', { duration: 3000 });
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error => {
          // Si el error es una respuesta 400, lo mostramos de manera específica
          if (error.status === 400) {
            this.snackBar.open(error.error, 'Cerrar', { duration: 3000 });  
          } else {
            this.snackBar.open('Error al registrar el usuario', 'Cerrar', { duration: 3000 });
          }
        }
      );
    }
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}