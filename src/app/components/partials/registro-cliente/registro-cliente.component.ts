import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, throwError } from 'rxjs';
import { LoaderService } from 'src/app/service/loader/loader.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent implements OnInit {

  loadingComponent: boolean = true

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
    private toastrSvc: ToastrService,
    public loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loadingComponent = false

    //TOMAMOS EL DNI PARA CARGAR LA DATA DEL CLIENTE SI FIGURA EN EL SISTEMA
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.nuevoDocNro = usuarioDoc //PASAMOS EL DOCUMENTO PARA VISUALIZARLO SI NO EXISTE EN EL SISTEMA

    let obtenerCalles = this.api.calles()
    let obtenerLocalidades = this.api.localidades()
    let cargarCliente = this.api.cargarCliente(usuarioDoc)
    
    forkJoin([obtenerCalles, obtenerLocalidades, cargarCliente]).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      return throwError(errors);
    })).subscribe(results => {
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
      this.loadingComponent = true
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
      this.api.nuevoCliente(cliente).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return throwError(errors);
      })).subscribe((data) => {
        let i: any = data
        if(i.ok == true){
          this.toastrSvc.success('Nuevo cliente cargado con éxito')
        } else {
          this.toastrSvc.error(`Ocurrió un error. ${i.msg}`)
        }
      })
    } else {
      //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
      this.api.actualizarCliente(cliente).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return throwError(errors);
      })).subscribe((data) => {
        let i: any = data
        if(i.ok == true){
          this.toastrSvc.info('Cliente actualizado con éxito')
        } else {
          this.toastrSvc.error(`Ocurrió un error. ${i.msg}`)
        }
      })
    }

    //CON LOS DATOS DEL DNI Y LOCAL, SE VA A SELECCIONAR QUE TIPO DE RECLAMO VAMOS
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    this.router.navigate([local + "/cliente/", doc, "selectorReclamo"]);
  }
}
