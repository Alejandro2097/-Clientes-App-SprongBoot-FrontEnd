import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturasService } from './services/facturas.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {
  titulo:string = "Nueva Factura";
  factura:Factura = new Factura();

  autocompleteControl: FormControl = new FormControl('');
  productos: string[] = ['Mesa', 'Silla', 'Laptop'];
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private facturaService:FacturasService,
    private router:Router) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params=>{
      let clienteId = +params.get('clienteId');//+ para convertir a numero,
      // 'clienteId' porque asi se recibe el paramentro en la url declarada en app.module.ts
      this.clienteService.getCliente(clienteId).subscribe(cliente=>this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string'?value:value.nombre),
      mergeMap(value => value? this._filter(value || ''):[]),
    );
  }  

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?:Producto):string | undefined{
    return producto? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent):void{
    let producto = event.option.value as Producto;
    console.log(producto);
    
    let flag:boolean=false;
    this.factura.items.forEach(i =>{
      if(i.producto.id == producto.id){
        i.cantidad = +i.cantidad+1;   
        flag = true;           
      }        
    });

    if(!flag){
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }   

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number,event:any):void{
    let cantidad = event.target.value as number;
    if(cantidad == 0){
      return this.eliminarItem(id);      
    }    
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
        if(item.producto.id === id){
            item.cantidad = cantidad;
        }
        return item;
      }
    );    
  }

  eliminarItem(id:number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=>item.producto.id!==id);
  }

  crearFactura():void{
    console.log(this.factura);
    this.facturaService.createFactura(this.factura).subscribe(factura=>{
      Swal.fire("Factura creada","Factura creada con exito", "success");
      this.router.navigate(['/clientes']);
    });
  }

  
}
