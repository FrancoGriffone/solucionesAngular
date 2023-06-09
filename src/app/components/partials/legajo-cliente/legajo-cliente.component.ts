import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-legajo-cliente',
  templateUrl: './legajo-cliente.component.html',
  styleUrls: ['./legajo-cliente.component.scss'],
})
export class LegajoClienteComponent implements OnInit {

  datos: any
  listaReclamos: any

  //AG GRID
  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamo', width: 75},
    {field: 'prodCodBar', headerName: 'Código de barras', width: 110},
    {field: 'prodDescripcion', headerName: 'Descripción', width: 200},
    {field: 'motivo', headerName: 'Motivo', width: 300},
    {field: 'estado', headerName: 'Estado', width: 100},
    {field: 'solucion', headerName: 'Observaciones', width: 300},
  ];
  rowData: any = [];
  
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //console.log(usuarioDoc)
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]
    });
    this.api.listaReclamosCliente(usuarioDoc).subscribe((data) => {
      this.rowData = data
    });
  }


  onSubmit() {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate(["cliente/", usuarioDoc]);
  }
}
