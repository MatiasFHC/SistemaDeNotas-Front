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
  selector: 'app-add-note',
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
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css'
})
export class AddNoteComponent {
  RegistrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService, 
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.RegistrationForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(4)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]], 
    });
  }

  addNota() {
    if (this.RegistrationForm.valid) {
      this.notasService.addNota(this.RegistrationForm.value).subscribe(
        response => {
          this.snackBar.open('Registrado exitosamente', 'Cerrar', { duration: 3000 });
          this.RegistrationForm.reset();
          this.router.navigate(['/main']);
        },
        error => {
          this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }

  cancelar() {
    this.router.navigate(['/main']);
  }

  // Método para ajustar el tamaño del textarea
  adjustHeight(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight) + 'px';
  }
}