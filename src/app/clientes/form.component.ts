import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Region } from './region';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente(); //public para produccion
  public regiones: Region[];
  public titulo:string = "Crear Cliente";
  constructor(private clienteService: ClienteService, 
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones=>this.regiones=regiones);
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>this.cliente=cliente)
      }
    })
  }

  public create():void{
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente nuevo',`Cliente ${json.cliente.nombre} creado con éxito`,'success')
    }
    )
  }

  public update():void{
    this.clienteService.update(this.cliente).subscribe(
      json=>{
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente actualizado',`Cliente ${json.cliente.nombre} actualizado con éxito`,'success')
      }
    )
  }

  public compararRegion(a:Region, b:Region): boolean{
    if(a==undefined && b==undefined)
      return true;
    return a==null || b==null?false: a.id === b.id;
  }


}
