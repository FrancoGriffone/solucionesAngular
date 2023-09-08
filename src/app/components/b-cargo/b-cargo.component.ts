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

  //LINKS BOLETAS DE CARGO
  bcargo1: string = "http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecABC_det&rs:Command%20=%20Render&IdEmp="
  bcargo2: string = "&Fecha="
  idEmp: string = ""
  bcargoFecha: string = "" 
  link: string = ""

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
    // const api = this.gridApi!;
    // setPrinterFriendly(api);
    setTimeout(function () {
      print();
      // setNormal(api);
    }, 2000);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.fecha = "2023-09-05"
    let datos = {
      'idLocal': this.idEmp,
      'fechaDia': this.fecha
    }
    this.api.obtenerBoletaCargo(datos).subscribe((data)=>{
      this.rowData = data
    })
  }
}

function setPrinterFriendly(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>('#myGrid')! as any;
  eGridDiv.style.width = '';
  eGridDiv.style.height = '';
  api?.setDomLayout('print');
}
function setNormal(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>('#myGrid')! as any;
  eGridDiv.style.width = '100%';
  eGridDiv.style.height = '200px';
  api?.setDomLayout();
}