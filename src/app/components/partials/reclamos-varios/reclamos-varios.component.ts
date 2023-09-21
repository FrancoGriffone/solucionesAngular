import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import * as dayjs from 'dayjs';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-reclamos-varios',
  templateUrl: './reclamos-varios.component.html',
  styleUrls: ['./reclamos-varios.component.scss']
})
export class ReclamosVariosComponent implements OnInit {

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

  constructor(
    private api: ApiService, 
    private route: ActivatedRoute, 
    public loaderService: LoaderService, 
    private toastrSvc: ToastrService
  ) {}

  ngOnInit(): void {
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

    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

    //VERIFICA DATOS DEL RECLAMO
    let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''

    let listarReclamo = this.api.listarReclamoInd(numReclamo)
    let tipoSolucion = this.api.opciones()
    let cargarCliente = this.api.cargarCliente(usuarioDoc)

    //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
    if (numReclamo != ''){
    forkJoin([listarReclamo, tipoSolucion, cargarCliente])
    .subscribe( results =>{
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
    }
  }
  
  //BOTON PARA GRABAR RECLAMO
  onSubmit() {
    let reclamo = {
      Id: this.datosReclamo?.id,
      IdCliente: this.datos?.id,
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
      this.toastrSvc.success('Nuevo reclamo creado con éxito')
      this.api.nuevoReclamo(reclamo).subscribe((data) => {
        console.log(data)
      })
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
    this.toastrSvc.info('Reclamo actualizado con éxito')
      this.api.editarReclamo(reclamo).subscribe((data) => {
        console.log(data)
      })
    }
  }
}
