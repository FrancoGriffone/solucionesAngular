import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, DomLayoutType } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as dayjs from 'dayjs'
import { AgGridReclamosComponent } from '../partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
})
export class ListaReclamosComponent implements OnInit {

  public domLayout: DomLayoutType = 'autoHeight';

  desde: any = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  hasta: any = dayjs().format('YYYY-MM-DD')

    //AG GRID
    colDefs: ColDef[] = [
      {field: 'empresa', headerName: 'Empresa', width: 100},
      {field: 'reclamo', headerName: 'Reclamo', width: 75,  cellRenderer: AgGridReclamosComponent},
      {field: 'fecha', headerName: 'Fecha', width: 100, valueFormatter: params => dayjs(params.data.fecha).format('DD/MM/YYYY')},
      //valueFormatter SIRVE PARA MODIFICAR EL STRING QUE LLEGA COMO FECHA
      {field: 'apellidos', headerName: 'Apellidos', width: 100},
      {field: 'nombres', headerName: 'Nombres', width: 100},
      {field: 'prodCodBar', headerName: 'Código de barras', width: 150},
      {field: 'prodDescripcion', headerName: 'Descripción', width: 300},
      {field: 'tipo', headerName: 'Decisión', width: 100},
      {field: 'estado', headerName: 'Estado', width: 100},
      {field: 'taller', headerName: 'Taller', width: 100},
      {field: 'observaciones', headerName: 'Observaciones', width: 300},
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

    //FORMULARIO CON LAS FECHAS EN LAS CUALES SE VA A BUSCAR
    profileForm = new FormGroup({
      desde: new FormControl(this.desde, Validators.required),
      hasta: new FormControl(this.hasta, Validators.required)
    })

  constructor(private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

    //OBJETO PARA QUE TOME LA API
    let inicio = {
      "desde": this.desde,
      "hasta": this.hasta,
    }

    //SI EXISTEN RECLAMOS EN EL LAPSO DE ESE TIEMPO, LOS MUESTRA AL INICIAR EL COMPONENTE
      this.api.listarReclamos(inicio).subscribe(data =>{
        setTimeout(()=>{
          this.rowData = data
        })
      })
  }

  //BOTON PARA BUSCAR RECLAMOS ENTRE DOS FECHAS
  onSubmit(){
    this.api.listarReclamos(this.profileForm.value).subscribe(data =>{
      setTimeout(()=>{
        this.rowData = data
      })
    })
  }
}
