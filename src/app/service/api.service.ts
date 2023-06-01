import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { clienteInterface } from '../models/cliente.interface';
import { listaReclamosClienteInterface } from '../models/listaReclamosCliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private GET_CLIENTE = 'http://192.168.0.9:100/api/reclamos/buscarcliente/';

  private GET_RECLAMOS_CLIENTE =
    'http://192.168.0.9:100/api/reclamos/buscarreclamos/';

  private GET_LISTA_RECLAMOS =
    'http://192.168.0.9:100/api/reclamos/listarreclamos';

  constructor(private http: HttpClient) {}

  cargarCliente(id: string): Observable<clienteInterface> {
    let url = this.GET_CLIENTE + id;
    return this.http.get<clienteInterface>(url);
  }

  listaReclamosCliente(id: string): Observable<listaReclamosClienteInterface> {
    const url = this.GET_RECLAMOS_CLIENTE + id;
    return this.http.get<listaReclamosClienteInterface>(url);
  }

  //   listarReclamos() {
  //     const url = this.GET_LISTA_RECLAMOS;
  //     return this.http
  //          .get<ListaReclamosI>(url)
  //            .pipe(
  //              map((resp) => {
  //                console.log(resp);
  //                return resp;
  //                }
  //              )
  //            );
  //   }
}
