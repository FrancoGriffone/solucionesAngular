import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-reclamo-interno',
  templateUrl: './reclamo-interno.component.html',
  styleUrls: ['./reclamo-interno.component.scss'],
})
export class ReclamoInternoComponent implements OnInit {

  producto: any //PARA VOLCAR LA DESCRIPCION DEL PRODUCTO

  datosReclamo: any //PARA VOLCAR LOS DATOS DEL RECLAMO

  pagadoTaller: number = 0 //PARA EL TILDE DE TALLER, DADO QUE LLEGA COMO STRING "Sí" O "No"

  fechaReclamo: string = "" //PARA FECHA DE RECLAMO

   //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
   fecha = new Date().toISOString().substring(0,10)
   disabled: boolean = true;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
     //VERIFICA DATOS DEL RECLAMO
     let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''
     //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
     if (numReclamo != ''){
  
     this.api.listarReclamoInd(numReclamo).subscribe((data) => { 
       this.datosReclamo = data
       this.datosReclamo = this.datosReclamo[0] //TOMAMOS EL ARRAY QUE TRAE Y LO VOLCAMOS

        //SI EL RECLAMO EXISTE, PERMITE APARECER A LA DESCRIPCION DEL PRODUCTO
          this.api.cargarProducto(this.datosReclamo.prodCodBar).subscribe((data)=>{
          this.producto = data
        })
 
       //PARA TRAER EL STRING DE LA FECHA SE TOMARON INDIVIDUALMENTE PARA APLICAR UN SLICE
       this.fechaReclamo = this.datosReclamo.fecha 
 
       //EL PAGADO DEL TALLER LLEGA COMO SÍ O NO, LO PASAMOS A BOOLEANO PARA QUE TOME EL TILDE.
       //SI ESTA PAGADO, CAMBIA A 1, SINO SIGUE EL 0
       if (this.datosReclamo.pagado == 'Sí') {
         this.pagadoTaller = 1
       }

       //SI EXISTE EL RECLAMO SE VUELCAN LOS DATOS
       this.profileForm.patchValue({
         codigoBarras: this.datosReclamo.prodCodBar,
         seccion: this.datosReclamo.seccion,
         fecha: this.fechaReclamo.slice(0,-9),
         estado: this.datosReclamo.estado,
         motivo: this.datosReclamo.motivo,
         observaciones: this.datosReclamo.solucion,
         taller: this.datosReclamo.taller,
         importe: this.datosReclamo.costo,
         pagado: this.pagadoTaller,
         cerrado: this.datosReclamo.cerrado,
         descripcion: this.datosReclamo.prodDescripcion,
         reclamo: this.datosReclamo.reclamo
       })
     })
    }
  }

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
      // this.api.nuevoReclamo(reclamo).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN NUEVO RECLAMO')
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
      // this.api.editarReclamo(reclamo).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN RECLAMO EXISTENTE')
    }
  }
}


