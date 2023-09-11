import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ColDef, DomLayoutType } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import { ApiService } from 'src/app/service/api.service';
import { AgGridReclamosComponent } from '../vistas/ag-grid-reclamos/ag-grid-reclamos.component';


@Component({
  selector: 'app-legajo-cliente',
  templateUrl: './legajo-cliente.component.html',
  styleUrls: ['./legajo-cliente.component.scss'],
})
export class LegajoClienteComponent implements OnInit {

  public domLayout: DomLayoutType = 'autoHeight';

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
    {field: 'empresa', headerName: 'Empresa', width: 75},
    {field: 'reclamo', headerName: 'Reclamos', width: 75, cellRenderer: AgGridReclamosComponent},
    {field: 'fecha', headerName: 'Fecha', width: 100, valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
    //valueFormatter + fecha.slice SIRVE PARA ACORTAR EL STRING QUE LLEGA COMO FECHA
    {field: 'prodCodBar', headerName: 'Código de barras', width: 110},
    {field: 'prodDescripcion', headerName: 'Descripción', width: 200},
    {field: 'motivo', headerName: 'Motivo', width: 300},
    {field: 'estado', headerName: 'Estado', width: 100},
    {field: 'solucion', headerName: 'Observaciones', width: 300},
  ];
  rowData: any = []; //FILAS AG GRID

  gridOptions = {
    defaultColDef:{
      resizable: true,
      sortable: true,
      unSortIcon: true,
      filter: true,
    }
  }
  
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

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
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate([local + "/cliente/", usuarioDoc]);
  }
}
