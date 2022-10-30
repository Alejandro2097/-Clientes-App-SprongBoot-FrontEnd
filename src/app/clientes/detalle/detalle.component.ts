import { HttpEventType} from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "PERFIL DEL CLIENTE";
  fotoSeleccionada: File;
  progreso: number = 0;
  constructor(private clienteService: ClienteService,
    public authService: AuthService, //public para produccion
    public modalService:ModalService, //public para produccion
    private facturaService: FacturasService) { }

  ngOnInit(): void {}

  seleccionarFoto(event) {
    this.progreso = 0;
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error de extensión: ', 'Debe seleccionar una foto con extensión válida', 'error');
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      if (this.fotoSeleccionada.type.indexOf('image') >= 0) {
        this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
          .subscribe(event => {
            if(event.type === HttpEventType.UploadProgress){
              this.progreso = Math.round((event.loaded/event.total)*100);
            }else if(event.type === HttpEventType.Response){
              let response: any = event.body;
              this.cliente = response.cliente as Cliente;
              this.modalService.notificarUpload.emit(this.cliente);
              Swal.fire('La foto se ha subido completamente', `La foto se ha subido con exito:${this.cliente.foto}`, 'success');
            }
            //this.cliente = cliente;
            
          });
      }

    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura:Factura):void{    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Seguro?',
      text: `¿Seguro desea eliminar la factura con folio ${factura.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(response => {
          this.cliente.facturas = this.cliente.facturas.filter(cli => cli !== factura)
          swalWithBootstrapButtons.fire(
            'Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          )
        });

      }
    })
  }
}
