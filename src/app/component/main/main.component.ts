import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Notas } from '../../model/Notas';
import { NotasService } from '../../service/notas.service';

@Component({
  selector: 'app-main',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  notas: Notas[] = [];

  constructor(
    private notasService: NotasService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getNotas();
  }

  getNotas(){
    this.notasService.getNotas().subscribe(
      (data: Notas[]) => {
        this.notas = data
      }, 
      (error) => {
        console.error('Error al cargar las notas', error)
      }
    );
  }

  
  CerrarSesion(): void {
    // Limpiar todo el sessionStorage
    sessionStorage.clear();

    // Navegar al inicio de sesión
    this.router.navigate(['/login']); 
  }

  AgregarNota(): void {
    this.router.navigate(['/register-note']); 
  }
}
