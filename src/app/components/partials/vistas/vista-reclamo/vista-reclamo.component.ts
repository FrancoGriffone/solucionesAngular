import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-vista-reclamo',
  templateUrl: './vista-reclamo.component.html',
  styleUrls: ['./vista-reclamo.component.scss']
})
export class VistaReclamoComponent implements OnInit {

  value: any

  datos: any

  local: any

  prometidoDia: any

  fechaCompra: any

  ticket: any

  fechaReclamo: any

  opciones: any

  opcion: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<VistaReclamoComponent>, 
    private api: ApiService, 
    private router: Router,
    public loaderService: LoaderService) {}

  ngOnInit(): void {
    let buscarReclamo = this.api.listarReclamoInd(this.data)
    let opciones = this.api.opciones()

    forkJoin([buscarReclamo, opciones])
    .subscribe(results => {
      this.datos = results[0]
      console.log(this.datos)

      this.opciones = results[1]

      this.local = this.datos[0]?.empresa 
      this.fechaReclamo = dayjs(this.datos[0]?.fecha).format('DD-MM-YYYY')
      this.fechaCompra = dayjs(this.datos[0]?.fechaCompra).format('DD-MM-YYYY')
      this.prometidoDia = dayjs(this.datos[0]?.prometidoDia).format('DD-MM-YYYY')

      this.idTipo()
      if (this.datos[0]?.ticket == 1){
        this.ticket = 'Sí'
      } else {
        this.ticket = 'No'
      }
    })
  }

  idTipo(){
    let estado = this.datos[0].estado
    this.opcion = this.opciones.find((x: any) => x?.estado == estado)
  }

  irReclamo(){
    this.api.listarReclamoInd(this.data).subscribe((data)=>{
      this.datos = data
      this.local = this.datos[0]?.empresa //PARA TOMAR LA EMPRESA
      this.local = this.local?.split(" ").join("") //PARA QUITAR LOS ESPACIOS EN BLANCO AL STRING DE LA EMPRESA
      //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
      if (Object.keys(data).length == 1){
        //SI NO TIENE DNI, SIGNIFICA QUE EL RECLAMO ES INTERNO
        if (this.datos[0].docNro == null) {
          this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
          this.router.navigate([this.local + "/reclamointerno/" + this.data])
        } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
          else if (this.datos[0].tipoRec == 'Atención al Cliente') {
            this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
            this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + this.data])
        } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
          else {
            this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
            this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/reclamo/" + this.data])
        }
      }
      this.dialogRef.close({}); 
    })
  }
}
