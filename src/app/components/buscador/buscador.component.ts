import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {}

  local: string = "" //PARA DEFINIR EL LOCAL

  datos: any //SE USA PARA BAJAR LOS DATOS DE LAS API

  //FORMULARIO PARA SELECCIONAR ENTRE RECLAMO Y DNI + COLOCAR EL DATO
  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
    local: new FormControl('')
  });

  onSubmit(){
    let opcion = this.profileForm.value.eleccion
    let dataUser = this.profileForm.value.datos;
    let nuevoReclamo = this.profileForm.value.local || 'Tate' //SI NO SE ELIGE LOCAL, CAE EN TATE
    //SI LA OPCION ES DNI, LLEVA A LAS OPCIONES DE CLIENTE, YA SEA LEGAJO SI EXISTE EL CLIENTE O EL NUEVO CLIENTE
    if (opcion == 'DNI') {
      this.api.cargarCliente(dataUser).subscribe((data)=>{
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
        if (Object.keys(data).length == 1){
          this.api.enviarCambio(nuevoReclamo) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate([nuevoReclamo + '/legajo/', dataUser]);
          }); 
        } else {
            this.api.enviarCambio(nuevoReclamo) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate([nuevoReclamo + '/cliente/', dataUser])
          });
        }
      })
    } else {
      this.api.listarReclamoInd(dataUser).subscribe((data)=>{
        this.datos = data
        this.local = this.datos[0].empresa //PARA TOMAR LA EMPRESA
        this.local = this.local.split(" ").join("") //PARA QUITAR LOS ESPACIOS EN BLANCO AL STRING DE LA EMPRESA
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
        if (Object.keys(data).length == 1){
          //SI NO TIENE DNI, SIGNIFICA QUE EL RECLAMO ES INTERNO
          if (this.datos[0].docNro == null) {
            this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate([this.local + "/reclamointerno/" + dataUser])
            });
          } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
            else if (this.datos[0].tipoRec == 'Atención al Cliente') {
              this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + dataUser])
              });
          } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
            else {
              this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
              });
          }
        } //SI NO SE ENCONTRO EL NUMERO DE RECLAMO, SALE EL ALERT. NO ME GUSTA PERO MOMENTANEAMENTE RESUELVE EL PROBLEMA
          else {
            alert("El reclamo que está intentando ingresar no existe, por favor verifique los datos colocados")
          }
        })
    }
  }
}
