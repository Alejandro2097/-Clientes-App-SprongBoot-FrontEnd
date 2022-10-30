import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { api } from 'src/app/backend/config';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint:string = `${api}/facturas`;
  constructor(private http: HttpClient) { }
  getFactura(id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }

  createFactura(factura:Factura):Observable<any>{
    return this.http.post<any>(this.urlEndPoint,factura).pipe(
      catchError(e=>{
        if(e.status!=401 && e.error.mensaje){
          console.log(e.error.mensaje)
          //this.router.navigate(['/facturas']);
        }
        return throwError(e);
      })
    );
  }
}
