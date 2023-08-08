import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';


@Component({
  selector: 'app-reclamos-varios',
  templateUrl: './reclamos-varios.component.html',
  styleUrls: ['./reclamos-varios.component.scss']
})
export class ReclamosVariosComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, public loaderService: LoaderService) {}

  datos: any //PARA VOLCAR LOS DATOS DEL DNI

  datosReclamo: any //PARA VOLCAR LOS DATOS DEL RECLAMO
  
  fechaReclamo: string = "" //PARA VOLCAR FECHA DE RECLAMO

  //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
  fecha = new Date().toISOString().substring(0,10)
  disabled: boolean = true;

  ngOnInit(): void {
    //VERIFICA DATOS DEL DNI
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]
    });

    //VERIFICA DATOS DEL RECLAMO
    let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''
    //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
    if (numReclamo != ''){

    this.api.listarReclamoInd(numReclamo).subscribe((data) => {
      setTimeout(()=>{ //ESTE TIMEOUT PERMITE CARGAR LOS DATOS SIN QUE LA PAGINA PAREZCA QUE SE TILDA MIENTRAS CARGA TODO 
      this.datosReclamo = data
      this.datosReclamo = this.datosReclamo[0] //TOMAMOS EL ARRAY QUE TRAE Y LO VOLCAMOS

      //PARA TRAER EL STRING DE LA FECHA SE TOMARON INDIVIDUALMENTE PARA APLICAR UN SLICE
      this.fechaReclamo = this.datosReclamo.fecha //FECHA DE RECLAMO

      //SI EXISTE EL RECLAMO SE VUELCAN LOS DATOS
      this.profileForm.patchValue({
        fecha: this.fechaReclamo.slice(0,-9),
        estado: this.datosReclamo.estado,
        motivo: this.datosReclamo.motivo,
        observaciones: this.datosReclamo.solucion,
        cerrado: this.datosReclamo.cerrado,
        solucion: this.datosReclamo.observaciones,
        reclamo: this.datosReclamo.reclamo
      })
    })
    })
  }
}

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
  
  //BOTON PARA GRABAR RECLAMO
  onSubmit() {
    if(this.datosReclamo == undefined){
      // this.api.nuevoReclamo(cliente).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN NUEVO RECLAMO')
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
      // this.api.editarReclamo(cliente).subscribe((data) => {
      //   console.log(data)
      // })
      console.log('ENTRANDO EN RECLAMO EXISTENTE')
    }
  }
}
