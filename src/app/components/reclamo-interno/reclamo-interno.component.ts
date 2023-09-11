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

  talleres: any

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
    taller: new FormControl(''),
    importe: new FormControl(''),
    pagado: new FormControl(''),
    cerrado: new FormControl(''),
    reclamo: new FormControl(''),
  });

  constructor(private api: ApiService,
    private route: ActivatedRoute, 
    public loaderService: LoaderService, 
    private toastrSvc: ToastrService) {}

  ngOnInit(): void {
     //VERIFICA DATOS DEL RECLAMO
     let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''

     this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

     //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
     if (numReclamo != ''){
  
    let listarReclamo = this.api.listarReclamoInd(numReclamo)
    let talleres = this.api.talleres()
    let tipoSolucion = this.api.opciones()

    forkJoin([listarReclamo, talleres, tipoSolucion])
    .subscribe( results => {
      this.datosReclamo = results[0]
      this.talleres = results[1]
      this.opciones = results[2]

        //SI EL RECLAMO EXISTE, PERMITE APARECER A LA DESCRIPCION DEL PRODUCTO
        this.api.cargarProducto(this.datosReclamo[0].prodCodBar).subscribe((data)=>{
          this.producto = data
        })

        if (this.datosReclamo.pagado == 'Sí') {
          this.pagadoTaller = 1
        }
        this.profileForm.patchValue({
          codigoBarras: this.datosReclamo[0].prodCodBar,
          seccion: this.datosReclamo[0].seccion,
          fecha: dayjs(this.datosReclamo[0].fecha).format('DD/MM/YYYY'),
          estado: this.datosReclamo[0].estado,
          motivo: this.datosReclamo[0].motivo,
          observaciones: this.datosReclamo[0].solucion,
          taller: this.datosReclamo[0].taller,
          importe: this.datosReclamo[0].costo,
          pagado: this.pagadoTaller,
          cerrado: this.datosReclamo[0].cerrado,
          descripcion: this.datosReclamo[0].prodDescripcion,
          reclamo: this.datosReclamo[0].reclamo
        })
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
      Id: 126699,
      //IdTipo: 1, 
      //FechaCompra: "2023-08-05",
      IdCliente: 99697, 
      //ProdMarca: "",
      //ProdPrecio: 999, 
      //ProdFuv: "2023-08-05",
      //PrometidoDia: "2023-08-10",
      //IdTurno: 1, 
      //Importe: 100, 
      IdSolTipo: 1, 
      //Ncred: "",
      //FechaSol: "2023-08-07",
      //Observaciones: "Prueba",
      //IdOrigen: 1, 
      //IdBc: 1, 
      IdEmp: "T",
      //Cantidad: 1,
      //Ticket: false,
      //NroTransferInt: "",
      //IdOtr: 1, 
      //IdTipoMmv: 1, 
      //IdEmpleado: 1, 
      //Usado: false,
      //NroHojaLr: "789",
    }
    // let reclamo = {
    //   Id: this.datosReclamo?.id,
    //   ProdCodBar: this.profileForm.value.codigoBarras,
    //   ProdDescripcion: this.producto,
    //   IdSec: this.profileForm.value.seccion, 
    //   Fecha: this.profileForm.value.fecha,
    //   IdSolEstado: this.profileForm.value.estado,
    //   Motivo: this.profileForm.value.motivo,
    //   Solucion: this.profileForm.value.observaciones,
    //   IdTaller: this.profileForm.value.taller,
    //   Costo: this.profileForm.value.importe || 0,
    //   Pagado: this.profileForm.value.pagado || false
    // }
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


