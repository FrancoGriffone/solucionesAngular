import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-reclamo-interno',
  templateUrl: './reclamo-interno.component.html',
  styleUrls: ['./reclamo-interno.component.scss'],
})
export class ReclamoInternoComponent implements OnInit {

  idEmp: any

  talleres: any

  talleresActivos: any[] = []

  opciones: any

  producto: any //PARA VOLCAR LA DESCRIPCION DEL PRODUCTO

  datosReclamo: any //PARA VOLCAR LOS DATOS DEL RECLAMO

  pagadoTaller: number = 0 //PARA EL TILDE DE TALLER, DADO QUE LLEGA COMO STRING "Sí" O "No"

  //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
  fecha = dayjs().format('DD/MM/YYYY')
  disabled: boolean = true;

  //FORMULARIO PARA RECLAMO INTERNO
  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
    seccion: new FormControl(''),
    fecha: new FormControl(this.fecha, Validators.required),
    estado: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    taller: new FormControl('', Validators.required),
    importe: new FormControl(''),
    pagado: new FormControl(''),
    cerrado: new FormControl(''),
    reclamo: new FormControl(''),
  });

  constructor(private api: ApiService,
    public route: ActivatedRoute, 
    public loaderService: LoaderService, 
    private toastrSvc: ToastrService) {}

  ngOnInit(): void {
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
     //VERIFICA DATOS DEL RECLAMO
     let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''

     this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

     let listarReclamo = this.api.listarReclamoInd(numReclamo)
     let talleres = this.api.talleres()
     let tipoSolucion = this.api.opciones()

    //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
    if (numReclamo != ''){
    forkJoin([listarReclamo, talleres, tipoSolucion])
    .subscribe( results => {
      this.datosReclamo = results[0]
      this.talleres = results[1]
      this.opciones = results[2]

      this.talleres.forEach((taller: any) => {
        if (taller.desactivado != true) {
          this.talleresActivos.push(taller)
        }
      });

        //SI EL RECLAMO EXISTE, PERMITE APARECER A LA DESCRIPCION DEL PRODUCTO
        this.api.cargarProducto(this.datosReclamo[0].prodCodBar).subscribe((data)=>{
          this.producto = data
        })

        if (this.datosReclamo.pagado == 'Sí') {
          this.pagadoTaller = 1
        }

        let opcion = this.opciones.find((x: any) => x?.estado == this.datosReclamo[0].estado)

        let taller = this.talleres.find((x: any) => x?.taller == this.datosReclamo[0].taller)

        this.profileForm.patchValue({
          codigoBarras: this.datosReclamo[0].prodCodBar,
          seccion: this.datosReclamo[0].seccion,
          fecha: dayjs(this.datosReclamo[0].fecha).format('DD/MM/YYYY'),
          estado: opcion.id.toString(), //OPCIONES LAS LEE COMO STRING
          motivo: this.datosReclamo[0].motivo,
          observaciones: this.datosReclamo[0].solucion,
          taller: taller.id.toString(), //OPCIONES LAS LEE COMO STRING
          importe: this.datosReclamo[0].costo,
          pagado: this.pagadoTaller,
          cerrado: this.datosReclamo[0].cerrado,
          descripcion: this.datosReclamo[0].prodDescripcion,
          reclamo: this.datosReclamo[0].reclamo
        })
    })
    } else {
      forkJoin([talleres, tipoSolucion])
      .subscribe( results => {
        this.talleres = results[0]
        this.opciones = results[1]

        this.talleres.forEach((taller: any) => {
          if (taller.desactivado != true) {
            this.talleresActivos.push(taller)
          }
        });
      })
    }
  }

  //CAMBIAR DESCRIPCION DEL PRODUCTO
  onChange(){
    let codigo = this.profileForm.value.codigoBarras
    this.api.cargarProducto(codigo).subscribe((data)=>{
      this.producto = data
    })
  }

  //BOTON PARA GRABAR
  onSubmit() {
    let reclamo = {
      ProdCodBar: this.profileForm.value.codigoBarras,
      ProdDescripcion: this.producto,
      IdSec: this.profileForm.value.seccion, //HAY QUE PARSEARLO parseInt PARA VOLVERLO NUMBER Y COMPARARLO CON LA API DE SECCIONES 
      Fecha: this.profileForm.value.fecha,
      IdSolEstado: parseInt(this.profileForm.value.estado),
      Motivo: this.profileForm.value.motivo,
      Solucion: this.profileForm.value.observaciones,
      Observaciones: this.profileForm.value.solucion,
      IdTaller: parseInt(this.profileForm.value.taller),
      Costo: this.profileForm.value.importe,
      Pagado: this.profileForm.value.pagado,
      IdEmp: this.idEmp 
    }
    console.log(reclamo)
    if(this.datosReclamo == undefined){
      this.toastrSvc.success('Nuevo reclamo creado con éxito')
      // this.api.nuevoReclamo(reclamo).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN NUEVO RECLAMO')
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
    this.toastrSvc.info('Reclamo actualizado con éxito')
      // this.api.editarReclamo(reclamo).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN RECLAMO EXISTENTE')
    }
  }
}


