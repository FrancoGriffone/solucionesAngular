import { Component, OnInit } from '@angular/core';
import { ColDef, DomLayoutType, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { AgGridReclamosComponent } from '../partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';
import { catchError, forkJoin, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reclamos-en-reparacion',
  templateUrl: './reclamos-en-reparacion.component.html',
  styleUrls: ['./reclamos-en-reparacion.component.scss']
})
export class ReclamosEnReparacionComponent implements OnInit {

  //VARIABLES

  loadingComponent: boolean = true

  public domLayout: DomLayoutType = 'autoHeight';

  talleres: any; //LISTA DE TALLERES

  tallerSeleccionado: any; //TALLER PARA EL DROPDOWN

  //AG GRID
  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamo', width: 120, suppressAutoSize: true, suppressSizeToFit: true, cellRenderer: AgGridReclamosComponent},
    {field: 'fecha', headerName: 'Fecha', resizable: true, sortable: true, filter: true, valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
    {field: 'nombres', headerName: 'Nombres'},
    {field: 'apellidos', headerName: 'Apellidos'},
    {field: 'prodCodBar', headerName: 'Código de barras'},
    {field: 'prodDescripcion', headerName: 'Descripción'},
    {field: 'motivo', headerName: 'Motivo'},
  ];

  rowData!: any //FILAS AG GRID

  private gridApi!: GridApi;

  gridOptions = {
    defaultColDef:{
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agSetColumnFilter',
    }
  }

//<------------------------------------------------------------------------------------------------------->

  constructor(private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loadingComponent = false 

    let talleres = this.api.talleres()
    let reclamosPrimerTaller = this.api.obtenerReclamosEnReparacion(0) //EL 0 VA PARA QUE BUSQUE EL PRIMERO

    forkJoin([talleres, reclamosPrimerTaller]).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      //SI HAY ERROR EL LOADER SE DESACTIVA
      return throwError(errors);
    })).subscribe(results => {
      //BAJAMOS LOS DATOS DE LOS TALLERES Y DE LOS RECLAMOS EN REPARACIÓN DEL PRIMERO EN LA LISTA
      this.talleres = results[0]
      this.rowData = results[1]
      this.loadingComponent = true
    })
  }

//<------------------------------------------------------------------------------------------------------->

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.sizeToFit()
  }

  //AJUSTAR TAMAÑO AG GRID A PANTALLA
  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  //BOTON PARA EXPORTAR LA LISTA INVISIBLE A UN EXCEL
  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  //CAMBIAR DE TALLER
  buscar(){
    this.api.obtenerReclamosEnReparacion(this.tallerSeleccionado?.id).subscribe((data)=>{
      this.rowData = data
    })
  }
}
