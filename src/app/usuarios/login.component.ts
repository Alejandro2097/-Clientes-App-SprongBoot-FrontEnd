import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = "Hacer Login";
  usuario: Usuario;
  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Ya autenticado','Hola '+this.authService.usuario.username + ', usted ya fue autenticado anteriormente','info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{  

    console.log(this.usuario);
    console.log('VERIFICACION');
    console.log('usuario '+this.usuario.username);
    console.log('password '+this.usuario.password);
    if (this.usuario.username == '' || this.usuario.apellido == '') {
      Swal.fire('Error de Login','Campo username o password vacio','error'); 
      return;     
    }

    this.authService.login(this.usuario).subscribe(response => {
      
      console.log(response);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      Swal.fire('Login', 'Hola '+usuario.username+' has iniciado seccion con exito!', 'success');
      //user_name usamos guion bajo porque es asi el atributo del payload al testar el token en jwt.io
      
      
    },err =>{
      if(err.status == 400){
        Swal.fire('Error de Login','Campo username o password incorrecto','error'); 
      }
    }
    );
  }

}
