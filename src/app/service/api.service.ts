import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clienteInterface } from '../models/cliente.interface';
import { listaReclamosClienteInterface } from '../models/listaReclamosCliente.interface';
import { listaReclamosInterface } from '../models/listaReclamos.interface';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { nuevoClienteInterface } from '../models/nuevoClienteInterface';
import { NuevoReclamoInterface } from '../models/nuevoReclamoInterface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private POST_CLIENTE = 'http://192.168.0.9:100/api/clientes/nuevo';

  private PUT_CLIENTE = 'http://192.168.0.9:100/api/clientes/editar';

  private GET_CLIENTE = 'http://192.168.0.9:100/api/reclamos/buscarcliente/';

  private GET_RECLAMOS_CLIENTE =
    'http://192.168.0.9:100/api/reclamos/buscarreclamos/';

  private POST_RECLAMO = 'http://192.168.0.9:100/api/reclamos/nuevo'

  private PUT_RECLAMO = 'http://192.168.0.9:100/api/reclamos/editar'

  private GET_RECLAMO_INDIVIDUAL = 'http://192.168.0.9:100/api/reclamos/listarreclamos/';

  private POST_LISTA_RECLAMOS =
    'http://192.168.0.9:100/api/reclamos/listarreclamos';

  private GET_PRODUCTO = 'http://192.168.0.9:100/api/reclamos/productos/';

  constructor(private http: HttpClient) {}

  //SERVICE PARA CAMBIO DE LOCAL
  private cambioLocal = new Subject<any>()

  enviarCambio(cambio: string){
    this.cambioLocal.next(cambio)
  }

  recibirCambio(): Observable<any>{
    return this.cambioLocal.asObservable()
  }

  //SERVICE PARA OBTENER PRODUCTO
  cargarProducto(prod: any) {
    const url = this.GET_PRODUCTO + prod;
    return this.http.get(url, {responseType: 'text'})
  }

  //SERVICE PARA LOS RECLAMOS Y CLIENTES
  nuevoCliente(cliente: Object): Observable<nuevoClienteInterface> {
    const url = this.POST_CLIENTE;
    return this.http.post<nuevoClienteInterface>(url, cliente)
  }
  actualizarCliente(cliente: Object): Observable<nuevoClienteInterface> {
    const url = this.PUT_CLIENTE;
    return this.http.put<nuevoClienteInterface>(url, cliente)
  }

  cargarCliente(id: string) {
    const url = this.GET_CLIENTE + id;
    return this.http.get<clienteInterface>(url);
  }

  listaReclamosCliente(id: string) {
    const url = this.GET_RECLAMOS_CLIENTE + id;
    return this.http.get<listaReclamosClienteInterface>(url);
  }

  nuevoReclamo(reclamo: Object): Observable<NuevoReclamoInterface> {
    const url = this.POST_RECLAMO;
    return this.http.post<NuevoReclamoInterface>(url, reclamo)
  }

  editarReclamo(reclamo: Object): Observable<NuevoReclamoInterface> {
    const url = this.PUT_RECLAMO;
    return this.http.put<NuevoReclamoInterface>(url, reclamo)
  }

  listarReclamoInd(id: string) {
    const url = this.GET_RECLAMO_INDIVIDUAL + id;
    return this.http.get<listaReclamosClienteInterface>(url)
  }

  listarReclamos(fecha: Object): Observable<listaReclamosInterface> {
    const url = this.POST_LISTA_RECLAMOS;
    return this.http.post<listaReclamosInterface>(url, fecha)
  }
}
