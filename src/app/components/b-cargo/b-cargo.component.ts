import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import * as dayjs from 'dayjs'
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';


@Component({
  selector: 'app-b-cargo',
  templateUrl: './b-cargo.component.html',
  styleUrls: ['./b-cargo.component.scss'],
})
export class BCargoComponent implements OnInit {

  visible: boolean = false;

  idEmp: string = ""

  //FECHA DE BUSQUEDA
  fecha: any = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  //FORM CONTROL SOBRE LA FECHA
  date = new FormControl(this.fecha);

  colDefs: ColDef[] = [
    {field: 'reclamo', headerName: 'Reclamo', width: 75},
    {field: 'prodCodBar', headerName: 'Código', width: 125},
    {field: 'prodDescripcion', headerName: 'Descripción'},
    {field: 'ncred', headerName: 'Nota de Crédito', width: 75},
    {field: 'motivo', headerName: 'Motivo', width: 500},
  ];

  public rowData!: any;

  private gridApi!: GridApi;

  gridOptions = {
    defaultColDef:{
      resizable: true,
      sortable: true,
      unSortIcon: true,
      filter: true,
    }
  }

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO
    
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
  }

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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.fecha = this.fecha
    let datos = {
      'idLocal': this.idEmp,
      'fechaDia': this.fecha
    }
    this.api.obtenerBoletaCargo(datos).subscribe((data)=>{
      this.rowData = data
    })
  }
}