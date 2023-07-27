import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.scss'],
})
export class ListaReclamosComponent implements OnInit {

    //AG GRID
    colDefs: ColDef[] = [
      {field: 'reclamo', headerName: 'Reclamo', width: 75, resizable: true},
      {field: 'prodCodBar', headerName: 'Código de barras', width: 110, resizable: true},
      {field: 'prodDescripcion', headerName: 'Descripción', width: 200, resizable: true},
      {field: 'motivo', headerName: 'Motivo', width: 300, resizable: true},
      {field: 'estado', headerName: 'Estado', width: 100, resizable: true},
      {field: 'solucion', headerName: 'Observaciones', width: 300, resizable: true},
    ];
    rowData: any = [];

    profileForm = new FormGroup({
      inicio: new FormControl('', Validators.required),
      final: new FormControl('', Validators.required)
    })

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  onSubmit(){
    console.log(this.profileForm.value.inicio + " " + this.profileForm.value.final)
    this.api.listarReclamos(this.profileForm.value.inicio, this.profileForm.value.final).subscribe(data =>{
      console.log(data)
    })
  }
}
