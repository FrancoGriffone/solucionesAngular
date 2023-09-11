import { Component, OnInit } from '@angular/core';
import { ColDef, DomLayoutType, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { AgGridReclamosComponent } from '../partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';

@Component({
  selector: 'app-reclamos-en-reparacion',
  templateUrl: './reclamos-en-reparacion.component.html',
  styleUrls: ['./reclamos-en-reparacion.component.scss']
})
export class ReclamosEnReparacionComponent implements OnInit {

  public domLayout: DomLayoutType = 'autoHeight';

  talleres: any;

  tallerSeleccionado: any;

  //AG GRID
  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamo', width: 85, cellRenderer: AgGridReclamosComponent},
    {field: 'fecha', headerName: 'Fecha', width: 90, resizable: true, sortable: true, filter: true, valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
    //valueFormatter + fecha.slice SIRVE PARA ACORTAR EL STRING QUE LLEGA COMO FECHA
    //params.data.fecha.slice(0,-9)
    {field: 'nombres', headerName: 'Nombres', width: 100},
    {field: 'apellidos', headerName: 'Apellidos', width: 100},
    {field: 'prodCodBar', headerName: 'Código de barras', width: 150},
    {field: 'prodDescripcion', headerName: 'Descripción', width: 150},
    {field: 'motivo', headerName: 'Motivo', width: 300},
  ];
  rowData!: any //FILAS AG GRID

  private gridApi!: GridApi;

  gridOptions = {
    defaultColDef:{
      resizable: true,
      sortable: true,
      unSortIcon: true,
      filter: true,
    }
  }

  constructor(private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.api.talleres().subscribe((data)=>{
      this.talleres = data
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.api.obtenerReclamosEnReparacion(0).subscribe((data)=>{
      this.rowData = data
    })
  }

  //BOTON PARA EXPORTAR LA LISTA INVISIBLE A UN EXCEL
  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  buscar(){
    this.api.obtenerReclamosEnReparacion(this.tallerSeleccionado?.id).subscribe((data)=>{
      this.rowData = data
    })
  }
}
