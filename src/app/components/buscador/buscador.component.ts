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

  ngOnInit(): void {
  }

  datos: any //SE USA PARA BAJAR LOS DATOS DE LAS API

  //FORMULARIO PARA SELECCIONAR ENTRE RECLAMO Y DNI + COLOCAR EL DATO
  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  onSubmit(){
    let opcion = this.profileForm.value.eleccion
    let dataUser = this.profileForm.value.datos;
    //SI EXISTE DNI, LLEVA A LAS OPCIONES DE CLIENTE, YA SEA LEGAJO SI EXISTE EL CLIENTE O EL NUEVO CLIENTE
    if (opcion == 'DNI') {
      this.api.cargarCliente(dataUser).subscribe((data)=>{
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
        if (Object.keys(data).length == 1){
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['legajo/', dataUser], {skipLocationChange: true});
          }); 
        } else {
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(["cliente/", dataUser])
          });
        }
      })
    } else {
      this.api.listarReclamoInd(dataUser).subscribe((data)=>{
        this.datos = data
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
        if (Object.keys(data).length == 1){
          //SI NO TIENE DNI, SIGNIFICA QUE EL RECLAMO ES INTERNO
          if (this.datos[0].docNro == null) {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(["reclamointerno/" + dataUser])
            });
          } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
            else if (this.datos[0].tipoRec == 'Atención al Cliente') {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(["cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + dataUser])
            });
          } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
            else {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigate(["cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
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
