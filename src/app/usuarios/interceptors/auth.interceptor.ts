import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError(error=>{
        if(error.status == 401){//401 no autorizado
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);      
        }
        if(error.status == 403){//403 prohibido
          Swal.fire('Acceso restringido',this.authService.usuario.username+ ', su cuenta no tiene acceso a este recurso','warning');
          this.router.navigate(['/clientes']);        
        }
        return throwError(error);
      })
    ); 
  }
}