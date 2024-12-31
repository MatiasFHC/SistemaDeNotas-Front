import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notas } from '../../model/Notas';
import { NotasService } from '../../service/notas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Imagen } from '../../model/Imagen';

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
  imageUrl: string | undefined; // URL de la imagen cargada
  mostrarImagen: boolean = false; // Propiedad para controlar la visibilidad de la imagen
  imagenAmpliada: string | null = null;  // Almacena la URL de la imagen seleccionada
  imagenesArray: Imagen[] = [];  // Array para almacenar objetos con id y direccion
  idImagenAmppliada: number | undefined; // ID de la imagen ampliada

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notasService: NotasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      // Obtener los detalles de la nota
      this.notasService.getNotaPorID(id).subscribe(
        (notas) => {
          this.nota = notas[0];
          this.cargarImagenes(id); // Cargar la imagen asociada
        },
        (error) => {
          console.error('Error al cargar la nota', error);
        }
      );
    }
  }
  
  cargarImagenes(id: number) {
    const cachedImageUrls = sessionStorage.getItem('imagenes'); // Verificar si ya existen imágenes en el sessionStorage
    if (cachedImageUrls) {
      this.imagenesArray = JSON.parse(cachedImageUrls); // Usar las imágenes almacenadas en sessionStorage
    } else {
      // Si no están en sessionStorage, hacer la solicitud al backend
      this.notasService.getImagenPorNota(id).subscribe(
        (imagenes: any[]) => {
          if (imagenes && imagenes.length > 0) {
            console.log('Direcciones de imágenes obtenidas:', imagenes);

            // Mapear las direcciones y concatenarlas con la URL base del backend
          // Mapear las direcciones y concatenarlas con la URL base del backend, y agregar el id
          this.imagenesArray = imagenes.map((img) => ({
            id: img.id, // Asumimos que el backend devuelve el id de la imagen
            direccion: `https://sistemadenotas-back.onrender.com${img.direccion}`
          }));            sessionStorage.setItem('imagenes', JSON.stringify(this.imagenesArray)); // Guardar en sessionStorage
          }
        },
        (error) => {
          console.error('Error al cargar las imágenes', error);
        }
      );
    }
  }
  
  
  toggleImagen() {
    // Alterna el valor de mostrarImagen para mostrar/ocultar la imagen
    this.mostrarImagen = !this.mostrarImagen;
  }

  onFilesSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files.length > 0) {
      const id = +this.route.snapshot.paramMap.get('id')!; // Obtener el ID de la nota
      const files = Array.from(fileInput.files); // Convertir FileList a un array
  
      files.forEach((file) => {
        this.notasService.uploadImage(file, id).subscribe(
          (response: any) => {
            const nuevaImagen = {
              id: response.id, // Asumimos que el backend devuelve el id de la imagen
              direccion: `https://sistemadenotas-back.onrender.com${response.direccion}`
            };
  
            // Agregar el objeto de la imagen al array
            this.imagenesArray.push(nuevaImagen);
            sessionStorage.setItem('imagenes', JSON.stringify(this.imagenesArray)); // Guardar el array actualizado
            this.snackBar.open('Imagen cargada exitosamente', 'Cerrar', { duration: 3000 });
          },
          (error) => {
            this.snackBar.open('Error al cargar la imagen', 'Cerrar', { duration: 3000 });
          }
        );
      });
    }
  }
  
  
  Volver(): void {
    sessionStorage.removeItem('imagenes'); // Limpiar la imagen almacenada en sessionStorage
    this.router.navigate(['/main']);
  }


  Borrar(): void {
  const id = +this.route.snapshot.paramMap.get('id')!;

  // Primero, obtener las imágenes asociadas a la nota
  this.notasService.getImagenPorNota(id).subscribe(
    (imagenes: any[]) => {
      if (imagenes && imagenes.length > 0) {
        // Borrar cada imagen asociada
        imagenes.forEach((imagen) => {
          this.notasService.borrarImagen(imagen.id).subscribe(
            () => {
              console.log(`Imagen con ID ${imagen.id} eliminada correctamente`);
            },
            (error) => {
              console.error(`Error al eliminar imagen con ID ${imagen.id}`, error);
            }
          );
        });
      }

      // Ahora borrar la nota
      this.notasService.borrarNota(id).subscribe(
        () => {
          sessionStorage.removeItem('imagenes'); // Limpiar la imagen almacenada en sessionStorage
          this.router.navigate(['/main']);
          this.snackBar.open('Nota borrada exitosamente', 'Cerrar', { duration: 3000 });
        },
        (error) => {
          console.error('Error al borrar la nota', error);
        }
      );
    },
    (error) => {
      console.error('Error al obtener las imágenes de la nota', error);
    }
  );
}


  actualizarTitulo(nota: Notas) {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.notasService.putTitulo(nota, nota.titulo as string, id).subscribe(
      () => {},
      () => {}
    );
  }

  actualizarDescripcion(nota: Notas) {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.notasService.putDescripcion(nota, nota.descripcion as string, id).subscribe(
      () => {},
      () => {}
    );
  }

    // Método para abrir el modal de la imagen ampliada
  ampliarImagen(imagen: string, id: number): void {
      this.imagenAmpliada = imagen;
      this.idImagenAmppliada = id;
    }

    // Método para cerrar el modal de la imagen ampliada
  cerrarImagenAmpliada(): void {
      this.imagenAmpliada = null;
    }

  BorrarImagen(idBorrar: number): void {
      const id = +this.route.snapshot.paramMap.get('id')!;
      // Llamar al servicio para borrar la imagen
      this.notasService.borrarImagen(idBorrar).subscribe(
        () => {
          // Cierra le ventana de la imagen
          this.cerrarImagenAmpliada();
          // Eliminar la imagen del array de imágenes en el frontend
          this.imagenesArray = this.imagenesArray.filter(imagen => imagen.id !== idBorrar);
          // Actualizar el sessionStorage
          sessionStorage.setItem('imagenes', JSON.stringify(this.imagenesArray));
          // Recargar las imágenes restantes en el frontend
          this.snackBar.open('Imagen eliminada correctamente', 'Cerrar', { duration: 3000 });   
        },
        (error) => {
          this.snackBar.open('Error al borrar la imagen', 'Cerrar', { duration: 3000 });
        }
      );
      // Actualizar la lista de imágenes asociadas a la nota
      this.notasService.getNotaPorID(id).subscribe(
        (notas) => {
          this.nota = notas[0];
          this.cargarImagenes(id); // Cargar las imágenes asociadas actualizadas
        },
        (error) => {
          console.error('Error al cargar la nota', error);
        }
      );
    }
    
}