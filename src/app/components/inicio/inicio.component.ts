import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void {}

  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  datos: any

  onSubmit(){
    let opcion = this.profileForm.value.eleccion
    let dataUser = this.profileForm.value.datos;
    if (opcion == 'DNI') {
      this.api.cargarCliente(dataUser).subscribe((data)=>{
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
        if (Object.keys(data).length == 1){
          this.router.navigate(["legajo/", dataUser])
        } else {
          this.router.navigate(["cliente/", dataUser])
        }
      })
    } else {
      this.api.listarReclamoInd(dataUser).subscribe((data)=>{
        this.datos = data
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
        if (Object.keys(data).length == 1){
          if (this.datos[0].docNro == null) {
            this.router.navigate(["reclamointerno/" + dataUser])
          } else if (this.datos[0].tipoRec == 'Atención al Cliente') {
            this.router.navigate(["cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + dataUser])
          } else {
            this.router.navigate(["cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
          }
        } else {
          alert("El reclamo que está intentando ingresar no existe, por favor verifique los datos colocados")
          }
        })
    }
  }
}
