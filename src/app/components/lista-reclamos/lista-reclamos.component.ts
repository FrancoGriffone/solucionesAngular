import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, DomLayoutType } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as dayjs from 'dayjs'
import { AgGridReclamosComponent } from '../partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
})
export class ListaReclamosComponent implements OnInit {

  //VARIABLES

  loadingComponent: boolean = true

  desde: any = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  hasta: any = dayjs().format('YYYY-MM-DD')

  public domLayout: DomLayoutType = 'autoHeight';

    //AG GRID
    colDefs: ColDef[] = [
      {field: 'empresa', headerName: 'Empresa', width: 120, suppressAutoSize: true, suppressSizeToFit: true},
      {field: 'reclamo', headerName: 'Reclamo', width: 120, suppressAutoSize: true, suppressSizeToFit: true,  cellRenderer: AgGridReclamosComponent},
      {field: 'fecha', headerName: 'Fecha', width: 120, suppressAutoSize: true, suppressSizeToFit: true, valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
      //valueFormatter SIRVE PARA MODIFICAR EL STRING QUE LLEGA COMO FECHA
      {field: 'apellidos', headerName: 'Apellidos'},
      {field: 'nombres', headerName: 'Nombres'},
      {field: 'prodCodBar', headerName: 'Código de barras'},
      {field: 'prodDescripcion', headerName: 'Descripción'},
      {field: 'tipo', headerName: 'Decisión'},
      {field: 'estado', headerName: 'Estado'},
      {field: 'taller', headerName: 'Taller'},
      {field: 'observaciones', headerName: 'Observaciones'},
      {field: 'solucion', headerName: 'Solución'}
    ];
    rowData: any = []; //FILAS AG GRID

    gridOptions = {
      defaultColDef:{
        resizable: true,
        sortable: true,
        floatingFilter: true,
        filter: 'agSetColumnFilter',
      }
    }

    //FORMULARIO CON LAS FECHAS EN LAS CUALES SE VA A BUSCAR
    profileForm = new FormGroup({
      desde: new FormControl(this.desde, Validators.required),
      hasta: new FormControl(this.hasta, Validators.required)
    })

    private gridApi: any;
    private gridColumnApi: any;

  //<------------------------------------------------------------------------------------------------------------->

  constructor(private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loadingComponent = false

    //OBJETO PARA QUE TOME LA API
    let inicio = {
      "desde": this.desde,
      "hasta": this.hasta,
    }
    console.log(this.rowData)
    //SI EXISTEN RECLAMOS EN EL LAPSO DE ESE TIEMPO, LOS MUESTRA AL INICIAR EL COMPONENTE
      this.api.listarReclamos(inicio).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        this.loadingComponent = true
        return throwError(errors);
      })).subscribe(data =>{
        setTimeout(()=>{
          this.rowData = data
          console.log(this.rowData)
        })
      })
      this.loadingComponent = true
  }

//<------------------------------------------------------------------------------------------------------------->

  //ON GRID READY
  onGridReady(params: any){
    this.gridApi = params.api
    this.autoSizeAll(false)
  }

  //AJUSTAR TAMAÑO AG GRID A PANTALLA
  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getColumns()!.forEach((column: { getId: () => string; }) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  //BOTON PARA BUSCAR RECLAMOS ENTRE DOS FECHAS
  onSubmit(){
    this.api.listarReclamos(this.profileForm.value).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return throwError(errors);
    })).subscribe(data =>{
      setTimeout(()=>{
        this.rowData = data
      })
    })
  }
}
