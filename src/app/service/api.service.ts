import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clienteInterface } from '../models/cliente.interface';
import { listaReclamosClienteInterface } from '../models/listaReclamosCliente.interface';
import { listaReclamosInterface } from '../models/listaReclamos.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private GET_CLIENTE = 'http://192.168.0.9:100/api/reclamos/buscarcliente/';

  private GET_RECLAMOS_CLIENTE =
    'http://192.168.0.9:100/api/reclamos/buscarreclamos/';

  private POST_LISTA_RECLAMOS =
    'http://192.168.0.9:100/api/reclamos/listarreclamos';

  constructor(private http: HttpClient) {}

  cargarCliente(id: string) {
    const url = this.GET_CLIENTE + id;
    return this.http.get<clienteInterface>(url);
  }

  listaReclamosCliente(id: string) {
    const url = this.GET_RECLAMOS_CLIENTE + id;
    return this.http.get<listaReclamosClienteInterface>(url);
  }

  listarReclamos(desde: string, hasta: string): Observable<any> {
    const url = this.POST_LISTA_RECLAMOS + desde + hasta;
    return this.http.post(this.url + desde + hasta)
  }
}
