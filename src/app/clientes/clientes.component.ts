import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    public modalService:ModalService, //public para produccion
    public authService: AuthService) //public para produccion
    { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');//+convierte a number el string params.get('page')
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {this.clientes = (response.content as Cliente[]);
        this.paginador = response;
        }
        
      );
    }
    );

    this.modalService.notificarUpload.subscribe(cliente=>{
      this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }          
        return clienteOriginal;
      })
    })
  }

  confirmacionDelete(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Seguro?',
      text: "Esta operación no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La operación ha sido cancelada',
          'error'
        )
      }
    })
  }

  public delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Seguro?',
      text: `¿Seguro desea eliminar al cliente ${cliente.nombre} ${cliente.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          )
        });

      }
    })

  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
