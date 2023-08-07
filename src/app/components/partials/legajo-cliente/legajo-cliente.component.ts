import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';


@Component({
  selector: 'app-legajo-cliente',
  templateUrl: './legajo-cliente.component.html',
  styleUrls: ['./legajo-cliente.component.scss'],
})
export class LegajoClienteComponent implements OnInit {

  datos: any //PARA VOLCAR LOS DATOS DEL CLIENTE

  //FUNCION PARA DETECTAR DE QUE TIPO ES UN RECLAMO
  tipoReclamo(dataUser: any){
    if (this.datos[0].docNro == null) {
      this.router.navigate(["reclamointerno/" + dataUser])
    } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
      else if (this.datos[0].tipoRec == 'Atención al Cliente') {
      this.router.navigate(["cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + dataUser])
    } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
      else {
      this.router.navigate(["cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
    }
  }

  //AG GRID
  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamos', width: 75, resizable: true, sortable: true, filter: true,},
    {field: 'fecha', headerName: 'Fecha', width: 100, resizable: true, sortable: true, filter: true, valueFormatter: params => params.data.fecha.slice(0,-9)},
    //valueFormatter + fecha.slice SIRVE PARA ACORTAR EL STRING QUE LLEGA COMO FECHA
    {field: 'prodCodBar', headerName: 'Código de barras', width: 110, resizable: true, sortable: true, filter: true},
    {field: 'prodDescripcion', headerName: 'Descripción', width: 200, resizable: true, sortable: true, filter: true},
    {field: 'motivo', headerName: 'Motivo', width: 300, resizable: true, sortable: true, filter: true},
    {field: 'estado', headerName: 'Estado', width: 100, resizable: true, sortable: true, filter: true},
    {field: 'solucion', headerName: 'Observaciones', width: 300, resizable: true, sortable: true, filter: true},
  ];
  rowData: any = []; //FILAS AG GRID
  
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //SI EXISTE UN CLIENTE SE TOMAN LOS DATOS
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]
    });
    //SI EXISTE UN CLIENTE, SE TOMAN LOS RECLAMOS PARA AG GRID
    this.api.listaReclamosCliente(usuarioDoc).subscribe((data) => {
      this.rowData = data
    });
  }

  //TOMAR EL NUMERO DE DOCUMENTO Y VA A LOS DATOS DEL CLIENTE, ES UN PASO POR SI HAY QUE ACTUALIZARLOS
  onSubmit() {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate(["cliente/", usuarioDoc]);
  }
}
