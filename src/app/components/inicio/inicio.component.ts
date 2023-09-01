import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/service/api.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    this.api.envioComponentes('NO') //ENVIA AL BUSCADOR OTRO STRING PARA DESHABILITARLO
  }

  local: string = "" //PARA DEFINIR EL LOCAL

  datos: any //SE USA PARA BAJAR LOS DATOS DE LAS API

  //FORMULARIO PARA SELECCIONAR ENTRE RECLAMO Y DNI + COLOCAR EL DATO
  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  onSubmit(){
    let opcion = this.profileForm.value.eleccion
    let dataUser = this.profileForm.value.datos;
    let localExistente = this.route.snapshot.paramMap.get('local') || ''
    //SI EXISTE DNI, LLEVA A LAS OPCIONES DE CLIENTE, YA SEA LEGAJO SI EXISTE EL CLIENTE O EL NUEVO CLIENTE
    if (opcion == 'DNI') {
      this.api.cargarCliente(dataUser).subscribe((data)=>{
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN CLIENTE, SINO VA A CARGAR EL NUEVO CLIENTE
        if (Object.keys(data).length == 1){
          this.router.navigate([localExistente + "/legajo/", dataUser])
        } else {
          this.router.navigate([localExistente + "/cliente/", dataUser])
        }
      })
    } else {
      this.api.listarReclamoInd(dataUser).subscribe((data)=>{
        this.datos = data
        this.local = this.datos[0]?.empresa //PARA TOMAR LA EMPRESA
        this.local = this.local?.split(" ").join("") //PARA QUITAR LOS ESPACIOS EN BLANCO AL STRING DE LA EMPRESA
        //SI EL LARGO DEL OBJETO ES IGUAL A 1 VA A LEGAJO PORQUE EXISTE UN RECLAMO, SINO SALE UN ALERT AVISANDO QUE NO EXISTE
        if (Object.keys(data).length == 1){
          //SI NO TIENE DNI, SIGNIFICA QUE EL RECLAMO ES INTERNO
          if (this.datos[0].docNro == null) {
            this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
            this.router.navigate([this.local + "/reclamointerno/" + dataUser])
          } //SI TIENE DNI, PERO EL TIPO DE RECLAMO ES ATENCION AL CLIENTE EL RECLAMO ES RECLAMO VARIOS
            else if (this.datos[0].tipoRec == 'Atención al Cliente') {
              this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
              this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/ReclamoVarios/" + dataUser])
          } //SI ES UN RECLAMO DE MERCADERIA DE CLIENTE
            else {
              this.api.enviarCambio(this.local) //ENVIA AL NABVAR EL NOMBRE DEL LOCAL
              this.router.navigate([this.local + "/cliente/" + this.datos[0].docNro + "/reclamo/" + dataUser])
          }
        } //SI NO SE ENCONTRO EL NUMERO DE RECLAMO
          else {
            //this.toastrSvc.error(`El reclamo ${dataUser} no existe, por favor verifique los datos colocados`)
            Swal.fire({
              title: 'Error!',
              text: `El reclamo ${dataUser} no existe, por favor verifique los datos colocados`,
              icon: 'error',
              confirmButtonText: 'Volver atrás'
            })
          }
        })
    }
  }
}
