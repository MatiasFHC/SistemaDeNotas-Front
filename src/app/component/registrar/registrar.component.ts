import { Component} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {
  registerForm: FormGroup;

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
    });     
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
          this.snackBar.open('Error al registrar el usuario', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }

  cancelar() {
    this.router.navigate(['/login']);
  }
}