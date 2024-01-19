import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import * as dayjs from 'dayjs'
import { ColDef, DomLayoutType, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridReclamosComponent } from '../partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-b-cargo',
  templateUrl: './b-cargo.component.html',
  styleUrls: ['./b-cargo.component.scss'],
})
export class BCargoComponent implements OnInit {

  //VARIABLES

  loadingComponent: boolean = true

  public domLayout: DomLayoutType = 'autoHeight';

  @ViewChild('agGrid') agGrid!: AgGridAngular;

  visible: boolean = false;

  sizes!: any[];

  selectedSize: any = 'p-datatable-sm';

  idEmp: string = ""

  //FECHA DE BUSQUEDA
  fecha: any = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  //FORM CONTROL SOBRE LA FECHA
  date = new FormControl(this.fecha);

  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamo', width: 120, suppressAutoSize: true, suppressSizeToFit: true,  cellRenderer: AgGridReclamosComponent},
    {field: 'prodCodBar', headerName: 'Código'},
    {field: 'prodDescripcion', headerName: 'Descripción'},
    {field: 'ncred', headerName: 'Nota de Crédito'},
    {field: 'motivo', headerName: 'Motivo'},
  ];

  public rowData!: any;

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

  constructor(private route: ActivatedRoute, private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loadingComponent = false
    
    //DEPENDE EL LOCAL, DA UNA LETRA (CADA UNA CORRESPONDE AL PARAMETRO QUE SE NECESITA SEGUN EL REPORTE)
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'Tate') {
      this.idEmp = 'T'
    } else if (local == 'Kilroy') {
      this.idEmp = 'K'
    } else if (local == 'KilroyKids') {
      this.idEmp = 'N'
    } else if (local == 'TateExpress') {
      this.idEmp = 'E'
    } else if (local == 'KitExpress') {
      this.idEmp = 'M'
    } else {
      this.idEmp = 'T'
    }

    this.sizes = [
      { name: 'Pequeña', class: 'p-datatable-sm' },
      { name: 'Normal', class: '' }
    ];

    //BAJAMOS LOS DATOS DEL DÍA ANTERIOR PARA OBTENER LA LISTA
    this.fecha = this.fecha
    let datos = {
      'idLocal': this.idEmp,
      'fechaDia': this.fecha
    }
    this.api.obtenerBoletaCargo(datos).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      //SI HAY ERROR EL LOADER SE DESACTIVA
      return throwError(errors);
    })).subscribe((data)=>{
      this.rowData = data
    })
    this.loadingComponent = true
  }

//<------------------------------------------------------------------------------------------------------->

  onSubmit() {
    let datos = {
      'idLocal': this.idEmp,
      'fechaDia': this.date.value
    }
    this.api.obtenerBoletaCargo(datos).subscribe((data)=>{
      this.rowData = data
    })
  }

  onBtPrint() {
    this.visible = true;
  }

  //ON GRID READY
  onGridReady(params: any){
    this.gridApi = params.api
    this.sizeToFit()
  }

  //AJUSTAR TAMAÑO AG GRID A PANTALLA
  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }
}