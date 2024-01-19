import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { VistaReclamoComponent } from '../vista-reclamo/vista-reclamo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ag-grid-reclamos',
  templateUrl: './ag-grid-reclamos.component.html',
  styleUrls: ['./ag-grid-reclamos.component.scss']
})
export class AgGridReclamosComponent implements OnInit {

  value: any

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  //AG INIT
  agInit(params: ICellRendererParams): void {
    this.value = params.value
  }

  onDialog(){
    setTimeout(() => {
      const dialogRef = this.dialog.open(VistaReclamoComponent,{
        data : this.value,
        maxHeight: '90vh'
      });
      dialogRef.afterClosed().subscribe(result => {});
    });
  }

}
