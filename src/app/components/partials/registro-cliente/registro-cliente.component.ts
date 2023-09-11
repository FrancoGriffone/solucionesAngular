import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent implements OnInit {

  value: any

  calleSeleccionada: any | undefined;

  calles: any | undefined;

  localidades: any

  datos: any //PARA VOLCAR LOS DATOS DEL CLIENTE

  nuevoDocNro: any //PARA EL DNI DE ALGUIEN NO REGISTRADO

  //FORMULARIO PARA CARGAR EL CLIENTE
  profileForm = new FormGroup({
    docNro: new FormControl(this.route.snapshot.paramMap.get('doc') || ''),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    direccion: new FormControl(''),
    numero: new FormControl(''),
    pisoDpto: new FormControl(''),
    telefono: new FormControl(''),
    observaciones: new FormControl(''),
  });

  constructor(private api: ApiService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    //TOMAMOS EL DNI PARA CARGAR LA DATA DEL CLIENTE SI FIGURA EN EL SISTEMA
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.nuevoDocNro = usuarioDoc //PASAMOS EL DOCUMENTO PARA VISUALIZARLO SI NO EXISTE EN EL SISTEMA

    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

    let obtenerCalles = this.api.calles()
    let obtenerLocalidades = this.api.localidades()
    let cargarCliente = this.api.cargarCliente(usuarioDoc)
    
    forkJoin([obtenerCalles, obtenerLocalidades, cargarCliente])
    .subscribe(results => {
      this.calles = results[0]
      this.localidades = results[1]
      this.datos = results[2]

      this.datos = this.datos[0]
      //SI EXISTE EL CLIENTE, LO CARGAMOS EN EL FORMULARIO
      this.profileForm.patchValue({
        nombre:this.datos?.nombres,
        apellido: this.datos?.apellidos,
        direccion: this.datos?.direccion,
        telefono: this.datos?.telefonos,
        observaciones: this.datos?.observaciones
      })
    })
  }

  //CREAR NUEVO CLIENTE
  nuevoCliente(){
    let doc: string = this.route.snapshot.paramMap.get('doc') || ''
    let cliente = {
      id: this.datos.id,
      DocNro: doc,
      Apellidos:this.profileForm.value.apellido,
      Nombres:this.profileForm.value.nombre,
      Telefono1:this.profileForm.value.telefono,
      Observaciones:this.profileForm.value.observaciones,
      IdCalle: parseInt(this.calleSeleccionada?.id), //PASA EL ID DE LA CALLE EN TYPE number PORQUE ES COMO LO PIDE LA API
      CalleNro: this.profileForm.value.numero,
      PisoDpto:this.profileForm.value.pisoDpto,
    }
    console.log(cliente)
    //SI NO ESTA REGISTRADO, SE PASA A LA API PARA NUEVOS CLIENTES
    if(this.datos == undefined){
      this.toastrSvc.success('Nuevo cliente cargado con éxito')
      this.api.nuevoCliente(cliente).subscribe((data) => {
          console.log(data)
      })
    } else {
      //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
      this.toastrSvc.info('Cliente actualizado con éxito')
      this.api.actualizarCliente(cliente).subscribe((data) => {
          console.log(data)
      })
    }

    //CON LOS DATOS DEL DNI Y LOCAL, SE VA A SELECCIONAR QUE TIPO DE RECLAMO VAMOS
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    this.router.navigate([local + "/cliente/", doc, "selectorReclamo"]);
  }
}
