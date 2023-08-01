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

  dateToday: number = Date.now()

  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void {}

  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  datos: any

  onSubmit() {
    let dataUser = this.profileForm.value.datos;
    this.api.listarReclamoInd(dataUser).subscribe((data)=>{
      //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
      if (Object.keys(data).length == 1){
              this.datos = data
              //this.datos[0].docNro SIRVE PARA SOLO VER EL DNI
              this.router.navigate(["cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
            } else {
              alert("El reclamo que está intentando ingresar no existe, por favor verifique los datos colocados")
            }
      })
    }
  
  inSubmit() {
    console.log(this.profileForm.value.eleccion);
    let usuarioDoc = this.profileForm.value.datos;
    this.api.cargarCliente(usuarioDoc).subscribe((data)=>{
      //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
      if (Object.keys(data).length == 1){
        this.router.navigate(["legajo/", usuarioDoc])
      } else {
        this.router.navigate(["cliente/", usuarioDoc])
      }
    })
  }
}
//NOTA, LOS BOTONES VAN CAMBIANDO PORQUE SE ESTA CONFIGURANDO CUANDO SE ENTRA A UN RECLAMO. MOMENTANEAMENTE SE ESTA USANDO EL
//DE LOS RECLAMOS, PERO LA IDEA ES QUE A FUTURO SEA UN SOLO BOTON QUE DETECTE SI ES DNI O RECLAMO

//if (tipo == 'DNI') {
//   this.api.cargarCliente(usuarioDoc).subscribe((data)=>{
//     //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
//     if (Object.keys(data).length == 1){
//       this.router.navigate(["legajo/", usuarioDoc])
//     } else {
//       this.router.navigate(["cliente/", usuarioDoc])
//     }
//   })
// } else {
  // this.api.cargarReclamo(dataUsuario).subscribe((data)=>{
  //   if (Object.keys(data).length == 1){
      //       this.router.navigate(["reclamo/", dataUsuario])
      //     } else {
      //       alert("El reclamo que está intentando ingresar no existe, por favor verifique los datos colocados")
      //     }
//   })
// }