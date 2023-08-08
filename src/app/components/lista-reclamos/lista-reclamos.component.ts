import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
})
export class ListaReclamosComponent implements OnInit {

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
      desde: new FormControl('', Validators.required),
      hasta: new FormControl('', Validators.required)
    })

  constructor(private api: ApiService, public loaderService: LoaderService) {}

  ngOnInit(): void {
    //TOMA LOS RECLAMOS DE 1 MES PARA ATRAS
    //FECHA DEL DIA
    let date = new Date()
    //FUNCION PARA RESTAR 1 MES
    function subtractMonths(date: Date, months: number) {
      date.setMonth(date.getMonth() - months);
      return date;
    }
    //FECHA DESDE SIN FORMATO
    let fechaDesde = subtractMonths(date, 1);
    //PARAMETROS DE FECHA | DESDE + HASTA COMO STRINGS
    let desde = fechaDesde.toISOString().slice(0,-14)
    let hasta = date.toISOString().slice(0,-14)
    //OBJETO PARA QUE TOME LA API
    let inicio = {
      "desde": desde,
      "hasta": hasta,
    }
    //SI EXISTEN RECLAMOS EN EL LAPSO DE ESE MES, LOS MUESTRA AL INICIAR EL COMPONENTE
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
