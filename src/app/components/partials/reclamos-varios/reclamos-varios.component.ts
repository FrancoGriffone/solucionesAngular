import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as dayjs from 'dayjs';
import { catchError, forkJoin, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-reclamos-varios',
  templateUrl: './reclamos-varios.component.html',
  styleUrls: ['./reclamos-varios.component.scss']
})
export class ReclamosVariosComponent implements OnInit {

  //VARIABLES

  loadingComponent: boolean = true

  idEmp: any

  datos: any //PARA VOLCAR LOS DATOS DEL DNI

  datosReclamo: any //PARA VOLCAR LOS DATOS DEL RECLAMO
  
  opciones: any

  //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
  fecha = dayjs().format('DD-MM-YYYY')

  //FORMULARIO PARA RECLAMOS VARIOS
  profileForm = new FormGroup({
    fecha: new FormControl(this.fecha, Validators.required),
    motivo: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    cerrado: new FormControl(''),
    solucion: new FormControl(''),
    reclamo: new FormControl('')
  });

//<---------------------------------------------------------------------------------------------------->

  constructor(
    private api: ApiService, 
    private route: ActivatedRoute, 
    public loaderService: LoaderService, 
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadingComponent = false

    //VERIFICAMOS LOCAL
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'Tate') {
      this.idEmp = 'T'
    } else if (local == 'Kilroy') {
      this.idEmp = 'K'
    } else if (local == 'KilroyKids') {
      this.idEmp = 'N'
    } else if (local == 'TateExpress') {
      this.idEmp = 'E'
    } else if (local == 'KitExpress') {
      this.idEmp = 'M'
    } else {
      this.idEmp = 'T'
    }

    //VERIFICA DATOS DEL DNI
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''

    //VERIFICA DATOS DEL RECLAMO
    let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''

    let listarReclamo = this.api.listarReclamoInd(numReclamo)
    let tipoSolucion = this.api.opciones()
    let cargarCliente = this.api.cargarCliente(usuarioDoc)

    //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
    if (numReclamo != ''){
    //BAJAMOS DATOS DEL CLIENTE, SOLUCIONES Y DEL RECLAMO EN CUESTIÓN
    forkJoin([listarReclamo, tipoSolucion, cargarCliente]).pipe(catchError((errors: HttpErrorResponse)=>{
      Swal.fire({
        title: '¡Error!',
        text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      this.loadingComponent = true
      return throwError(errors);
    })).subscribe( results =>{
      this.datosReclamo = results[0]
      this.opciones = results[1]
      this.datos = results[2]

      this.datosReclamo = this.datosReclamo[0] //TOMAMOS EL ARRAY QUE TRAE Y LO VOLCAMOS

      this.datos = this.datos[0] //VOLCAMOS LOS DATOS DEL CLIENTE

      let estado = this.opciones.find((x: any) => x?.estado == this.datosReclamo.estado)

      //SI EXISTE EL RECLAMO SE VUELCAN LOS DATOS
      this.profileForm.patchValue({
        fecha: dayjs(this.datosReclamo?.fecha).format('DD-MM-YYYY'),
        estado: estado?.id.toString(), //LLEGA COMO NUMBER, HAY QUE PASARLO A STRING PARA QUE SE PUEDA VER
        motivo: this.datosReclamo?.motivo,
        observaciones: this.datosReclamo?.observaciones,
        cerrado: this.datosReclamo?.cerrado,
        solucion: this.datosReclamo?.solucion,
        reclamo: this.datosReclamo?.reclamo
      })
    })
    this.loadingComponent = true
    } else {
      //SINO, BAJAMOS LOS DATOS DEL CLIENTE Y DE LAS SOLUCIONES
      forkJoin([tipoSolucion, cargarCliente]).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        this.loadingComponent = true
        return throwError(errors);
      })).subscribe( results =>{
        this.opciones = results[0]
        this.datos = results[1]

        this.datos = this.datos[0] //VOLCAMOS LOS DATOS DEL CLIENTE

        this.loadingComponent = true
      })
    }
  }
  
//<---------------------------------------------------------------------------------------------------->

  //BOTON PARA GRABAR RECLAMO
  onSubmit() {
    let reclamo = {
      Id: this.datosReclamo?.id,
      IdCliente: this.datos.id,
      Fecha: dayjs().format('YYYY-MM-DD'),
      IdEmp: this.idEmp,
      IdSolTipo: 7,
      IdSolEstado: parseInt(this.profileForm.value.estado),
      Motivo: this.profileForm.value.motivo,
      Observaciones: this.profileForm.value.observaciones,
      Solucion: this.profileForm.value.solucion,
    }
    console.log(reclamo)

    if(this.datosReclamo == undefined){
      this.api.nuevoReclamo(reclamo).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return throwError(errors);
      })).subscribe((data) => {
        let i: any = data
        if(i.ok == false) {
          this.toastrSvc.error(`Ocurrió un error. ${i.msg}`)
        } else {
          this.toastrSvc.success('Nuevo reclamo creado con éxito')
        }
      })
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
      this.api.editarReclamo(reclamo).pipe(catchError((errors: HttpErrorResponse)=>{
        Swal.fire({
          title: '¡Error!',
          text: 'La conexión a internet es muy débil o el servidor está experimentando problemas. Verifica el estado de tu red o ponte en contacto con quien está a cargo del servidor',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return throwError(errors);
      })).subscribe((data) => {
        console.log(data)
        this.toastrSvc.info('Reclamo actualizado con éxito')
      })
    }
  }
}
