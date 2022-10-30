import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
    id:number;
    descripcion:string;
    observacion:string;
    createAt:string;
    cliente:Cliente;
    precioTotal:number;
    items:ItemFactura[] = [];

    getTotal():number{
        let total:number = 0;
        this.items.forEach((item:ItemFactura)=>{total+=+item.calcularImporte()});
        return total;
    }
}
