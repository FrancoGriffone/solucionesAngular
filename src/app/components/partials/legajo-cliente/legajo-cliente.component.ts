import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ColDef, DomLayoutType, GridApi } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import { ApiService } from 'src/app/service/api.service';
import { AgGridReclamosComponent } from '../vistas/ag-grid-reclamos/ag-grid-reclamos.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { catchError, forkJoin, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-legajo-cliente',
  templateUrl: './legajo-cliente.component.html',
  styleUrls: ['./legajo-cliente.component.scss'],
})
export class LegajoClienteComponent implements OnInit {

  //VARIABLES

  loadingComponent: boolean = true

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
    {field: 'empresa', headerName: 'Empresa'},
    {field: 'reclamo', headerName: 'Reclamos', width: 120, suppressAutoSize: true, suppressSizeToFit: true, cellRenderer: AgGridReclamosComponent},
    {field: 'fecha', headerName: 'Fecha', valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
    {field: 'prodCodBar', headerName: 'Código de barras'},
    {field: 'prodDescripcion', headerName: 'Descripción'},
    {field: 'motivo', headerName: 'Motivo'},
    {field: 'estado', headerName: 'Estado'},
    {field: 'solucion', headerName: 'Solución'},
    {field: 'observaciones', headerName: 'Observaciones'},
  ];
  
  rowData: any = []; //FILAS AG GRID
  private gridApi!: GridApi;
  private gridColumnApi: any;


  gridOptions = {
    defaultColDef:{
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agSetColumnFilter',
    }
  }
 
//<------------------------------------------------------------------------------------------------------->  
  
  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loadingComponent = false

    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''

    //APIS
    let cliente = this.api.cargarCliente(usuarioDoc)
    let reclamos = this.api.listaReclamosCliente(usuarioDoc)

    forkJoin([cliente, reclamos]).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      return throwError(errors);
    })).subscribe( results => {
      this.datos = results[0]
      this.rowData = results[1]

      //BAJAMOS LOS DATOS
      this.datos = this.datos[0]

      this.loadingComponent = true
    })
  }

//<------------------------------------------------------------------------------------------------------->  

  //ON GRID READY
  onGridReady(params: any){
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
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

  //TOMAR EL NUMERO DE DOCUMENTO Y VA A LOS DATOS DEL CLIENTE, ES UN PASO POR SI HAY QUE ACTUALIZARLOS
  onSubmit() {
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate([local + "/cliente/", usuarioDoc]);
  }
}
