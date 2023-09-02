import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
})
export class ListaReclamosComponent implements OnInit {

  desde: any = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  hasta: any = dayjs().format('YYYY-MM-DD')

    //AG GRID
    colDefs: ColDef[] = [
      {field: 'empresa', headerName: 'Empresa', width: 100, resizable: true, filter: true},
      {field: 'reclamo', headerName: 'Reclamo', width: 75, resizable: true, sortable: true, filter: true},
      {field: 'fecha', headerName: 'Fecha', width: 100, resizable: true, sortable: true, filter: true, valueFormatter: params => params.data.fecha.slice(0,-9)},
      //valueFormatter + fecha.slice SIRVE PARA ACORTAR EL STRING QUE LLEGA COMO FECHA
      {field: 'apellidos', headerName: 'Apellidos', width: 100, resizable: true, sortable: true, filter: true},
      {field: 'nombres', headerName: 'Nombres', width: 100, resizable: true, sortable: true, filter: true},
      {field: 'prodCodBar', headerName: 'Código de barras', width: 150, resizable: true, filter: true},
      {field: 'prodDescripcion', headerName: 'Descripción', width: 300, resizable: true, filter: true},
      {field: 'tipo', headerName: 'Decisión', width: 100, resizable: true, filter: true},
      {field: 'estado', headerName: 'Estado', width: 100, resizable: true, filter: true},
      {field: 'taller', headerName: 'Taller', width: 100, resizable: true, filter: true},
      {field: 'observaciones', headerName: 'Observaciones', width: 300, resizable: true, filter: true},
    ];
    rowData: any = []; //FILAS AG GRID

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
