import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { catchError, forkJoin, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vista-reclamo',
  templateUrl: './vista-reclamo.component.html',
  styleUrls: ['./vista-reclamo.component.scss']
})
export class VistaReclamoComponent implements OnInit {

  loadingComponent: boolean = true

  datos: any

  local: any

  prometidoDia: any

  fechaCompra: any

  ticket: any

  fechaReclamo: any

  opciones: any

  opcion: any

  reclamoMercaderia: boolean = true

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<VistaReclamoComponent>, 
    private api: ApiService, 
    private router: Router) {}

  ngOnInit(): void {
    this.loadingComponent = false

    let buscarReclamo = this.api.listarReclamoInd(this.data)
    let opciones = this.api.opciones()

    forkJoin([buscarReclamo, opciones]).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      return throwError(errors);
    })).subscribe(results => {
      this.datos = results[0]
      console.log(this.datos)

      this.opciones = results[1]

      this.local = this.datos[0]?.empresa 
      this.fechaReclamo = dayjs(this.datos[0]?.fecha).format('DD-MM-YYYY')

      this.idTipo()

      if (this.datos[0]?.tipo == 'Sin Carta') {
        this.reclamoMercaderia = false
      } else {
        this.fechaCompra = dayjs(this.datos[0]?.fechaCompra).format('DD-MM-YYYY')
        this.prometidoDia = dayjs(this.datos[0]?.prometidoDia).format('DD-MM-YYYY')

        if (this.datos[0]?.ticket == 1){
          this.ticket = 'Sí'
        } else {
          this.ticket = 'No'
        }
      }
      this.loadingComponent = true
    })
  }

  idTipo(){
    let estado = this.datos[0].estado
    this.opcion = this.opciones.find((x: any) => x?.estado == estado)
  }

  irReclamo(){
    this.api.listarReclamoInd(this.data).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return throwError(errors);
    })).subscribe((data)=>{
      this.datos = data
      this.local = this.datos[0]?.empresa //PARA TOMAR LA EMPRESA
      this.local = this.local?.split(" ").join("") //PARA QUITAR LOS ESPACIOS EN BLANCO AL STRING DE LA EMPRESA
      //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
      if (Object.keys(data).length == 1){
        //SI NO TIENE DNI, SIGNIFICA QUE EL RECLAMO ES INTERNO
        if (this.datos[0].docNro == null) {
          this.api.enviarCambio(this.local) //ENVIA AL NAVBAR EL NOMBRE DEL LOCAL
          this.router.navigate([this.local + "/reclamointerno/" + this.data])
        } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
          else if (this.datos[0].prodCodBar == null) {
            this.api.enviarCambio(this.local) //ENVIA AL NAVBAR EL NOMBRE DEL LOCAL
            this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + this.data])
        } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
          else {
            this.api.enviarCambio(this.local) //ENVIA AL NAVBAR EL NOMBRE DEL LOCAL
            this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/reclamo/" + this.data])
        }
      }
      this.dialogRef.close({}); 
    })
  }
}
