import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notas } from '../../model/Notas';
import { NotasService } from '../../service/notas.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-selected-note',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './selected-note.component.html',
  styleUrl: './selected-note.component.css'
})
export class SelectedNoteComponent implements OnInit {
  nota: Notas | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notasService: NotasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Obtener el id de la ruta
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.notasService.getNotaPorID(id).subscribe(
        (notas) => {
          // Accedemos al primer objeto del array, ya que la respuesta es un array
          this.nota = notas[0]; 
        },
        (error) => {
          console.error('Error al cargar la nota', error);
        }
      );
    }
  }

  Volver(): void {
    this.router.navigate(['/main']); 
  }

  Borrar(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.notasService.borrarNota(id).subscribe(
      () => {
        this.router.navigate(['/main']);
        this.snackBar.open('Nota borrada exitosamente', 'Cerrar', { duration: 3000 });
      },
      (error) => {
        console.error('Error al borrar la nota', error);
      }
    );
  }
}