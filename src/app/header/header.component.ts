import {Component} from '@angular/core'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{
  title: string = 'App Angular';

  constructor(public authService: AuthService, //public para produccion
     private router:Router){}

  logout():void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', username+', ha cerrado sesion con exito!', 'success');
    this.router.navigate(['/login']);
    
  }
}
