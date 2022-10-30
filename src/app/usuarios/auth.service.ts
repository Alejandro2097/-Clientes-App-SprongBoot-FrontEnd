import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { urlBackEnd } from '../backend/config';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;
  

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario')!=null){
      this._usuario= JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    
    return new Usuario();
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token')!=null){
      return sessionStorage.getItem('token');
    }
    return null;
  }

  login(usuario: Usuario): Observable<any>{
    const urlEndPoint = `${urlBackEnd}/oauth/token`;

    const credenciales = btoa('angularapp'+':'+'12345');//credenciales encriptadas en base64

    const httpHeaders = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  logout(): void{    
    this._token = null;
    this._usuario = null;
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }

  guardarUsuario(access_token: string):void{
    let payload = this.obtenerDatosToken(access_token);
      //posicion 0 del token son los header
      //posicion 1 del token son los datos de la seccion del usuario o PAYLOAD
      //posicion 2 del token es la firma
      //atob es para descodificar el base64
      //JSON.parse transforma el string devuelto por atob en un JSON
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellidos;
    this._usuario.email = payload.email;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(access_token: string):void{
    this._token = access_token;
    sessionStorage.setItem('token',this._token);
  }

  obtenerDatosToken(access_token: string):any{
    if(access_token!=null)
      return JSON.parse(atob(access_token.split(".")[1]));
    return null;
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload!=null && payload.user_name && payload.user_name.length>0)
      return true;
    return false;
  }

  public hasRole(role: string): boolean{
    return this.usuario.roles.indexOf(role)>=0;
  }

}
