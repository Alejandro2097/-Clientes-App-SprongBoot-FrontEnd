import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, throwError, map } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe} from '@angular/common';
import { Region } from './region';
import { api} from '../backend/config';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = `${api}/clientes`;
  
  constructor(private http: HttpClient, private router: Router) { }
  

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint+"/page/"+page).pipe(
      map((response: any)=>{       
        (response.content as Cliente[]).map(cliente=>{
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt,'dd/MM/YYYY','en-US');          
          let dataPipe = new DatePipe('es'); //es fue registrado en app module         
          //cliente.createAt = dataPipe.transform(cliente.createAt,'EEEE dd, MMMM YYYY');
          return cliente;
        });
        return response;
      }
      )
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente).pipe(
      catchError(e=>{
        if(e.error.mensaje)
          console.log(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError(e=>{
        if(e.status != 401 && e.error.mensaje){
          console.log(e.error.mensaje);
          this.router.navigate(['/clientes']);        
        }
        return throwError(e);
      })
    );
  }

  update(cliente:Cliente): Observable<any>{//otra forma de pasar url similar al ejemplo de getCliente
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
      catchError(e=>{
        if(e.error.mensaje)
          console.log(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError(e=>{
        this.router.navigate(['/clientes']);
        if(e.error.mensaje)
          console.log(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint+"/regiones");
  }

}
