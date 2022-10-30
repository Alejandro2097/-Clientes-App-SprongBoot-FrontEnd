import { Producto } from "./producto";

export class ItemFactura {
    id:number;
    cantidad:number=1;
    producto:Producto;
    importe:number;

    public calcularImporte():number{
        return this.cantidad*this.producto.precio;
    }
}
