import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios } from '../model/Usuarios';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Login } from '../model/Login';
import { Notas } from '../model/Notas';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  public token: string | null = null;

  //private apiUrl = 'https://sistemadenotas-back.onrender.com'; // URL del backend (render)
  private apiUrl = 'http://localhost:8080'; // URL del backend

  
  constructor(private http: HttpClient) { }

     //metodo para registrar usuario
     addUsuario(usuarios: Usuarios): Observable<Usuarios> {
      return this.http.post<Usuarios>(`${this.apiUrl}/api/RegistroDeNuevoUsuario`, usuarios, { 
         headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
      } 

    //metodo para loguear usuario u organizacion
    loginUser(user: Login): Observable<{ jwttoken: string }> {
      return this.http.post<{ jwttoken: string }>(`${this.apiUrl}/authenticate`, user, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
     });
    }

    //metodo para almacenar token en sessionStorage
    setToken(token: string) {
      this.token = token;
      sessionStorage.setItem('token', token);
    }
  
    //metodo para obtener token de localsotrage
    getToken(): string | null {
      return sessionStorage.getItem('token');
    }

  //--------------------------------------------------------------------------------
  //metodos para obtener las partes del token (sub y rol)

  //metodo para obtener el nombre del usuario a apartir del token
  getUserNameByToken(){
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null; 
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub;
  }

  //--------------------------------------------------------------------------------
  //metodos para obtener las notas
  getNotas() {
    const token = sessionStorage.getItem('token'); 
    const username = this.getUserNameByToken();
    return this.http.get<any>(`${this.apiUrl}/api/VerNotas`, { 
      //se envia el nombre como parametro
      params: new HttpParams().set('username', username || ''), 
      //se envia el token como header
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
     });
  }

  // Método para obtener una nota por su ID
  getNotaPorID(id: number): Observable<any> {
    const token = sessionStorage.getItem('token'); // Obtener el token de sessionStorage
    return this.http.get<any>(`${this.apiUrl}/api/VerNotaPorID`, { 
      // Enviar el 'id' como parámetro
      params: new HttpParams().set('id', id.toString()),
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  //metodo para registrar una nota 
  addNota(nota: Notas): Observable<Notas> {
   const token = sessionStorage.getItem('token');
   const username = this.getUserNameByToken();
   return this.http.post<Notas>(`${this.apiUrl}/api/RegistrarNota`, nota, { 
    //se envia el nombre como parametro
    params: new HttpParams().set('username', username || ''), 
    //se envia el token como header
      headers: new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}` })
   });
 }

  //metodo para borrar una nota
  borrarNota(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.delete<any>(`${this.apiUrl}/api/BorrarNota`, { 
      // Enviar el 'id' como parámetro
      params: new HttpParams().set('id', id.toString()),
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  putTitulo(nota: Notas, titulo: string, id: number): Observable<Notas> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Notas>(`${this.apiUrl}/api/ActualizarTitulo`, nota, { 
      params: new HttpParams()
        .set('Id', id.toString())
        .set('titulo', titulo || ''),  
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  putDescripcion(nota: Notas, descripcion: string, id: number): Observable<Notas> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Notas>(`${this.apiUrl}/api/ActualizarDescripcion`, nota, { 
      params: new HttpParams()
        .set('Id', id.toString())
        .set('descripcion', descripcion || ''),  
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  uploadImage(file: File, notaid: number): Observable<any> {
    const token = sessionStorage.getItem('token'); // Obtener el token de la sesión
    const username = this.getUserNameByToken(); // Obtener el username desde el token
    // Crear un FormData para enviar el archivo y otros datos
    const formData = new FormData();
    formData.append('image', file); // Archivo de imagen
    formData.append('notaid', notaid.toString()); // ID de la nota como parámetro adicional
    // Configurar los encabezados
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Token de autorización
    });
    // Enviar la solicitud POST
    return this.http.post(`${this.apiUrl}/api/upload`, formData, { headers });
  }

  // Servicio para obtener la imagen por nota
  getImagenPorNota(notaid: number): Observable<any> {
    const token = sessionStorage.getItem('token');// Obtener el token de sessionStorage
    return this.http.get<any>(`${this.apiUrl}/api/VerImagen`, {
      params: new HttpParams().set('notaid', notaid.toString()), 
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  //metodo para borrar una nota
  borrarImagen(id: number): Observable<any> {
      const token = sessionStorage.getItem('token');
      return this.http.delete<any>(`${this.apiUrl}/api/BorrarImagen`, { 
        // Enviar el 'id' como parámetro
        params: new HttpParams().set('id', id.toString()),
        // Enviar el token en el encabezado para la autenticación
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      });
  }

  //metodo para obtener el id maximo de las imagenes
  getMaximoIdImagen(): Observable<any> {
    const token = sessionStorage.getItem('token');// Obtener el token de sessionStorage
    return this.http.get<any>(`${this.apiUrl}/api/imagenMaxima`, {
      // Enviar el token en el encabezado para la autenticación
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
