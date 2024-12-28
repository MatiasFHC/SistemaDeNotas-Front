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
}
