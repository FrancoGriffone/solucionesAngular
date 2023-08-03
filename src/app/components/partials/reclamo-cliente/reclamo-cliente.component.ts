import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-reclamo-cliente',
  templateUrl: './reclamo-cliente.component.html',
  styleUrls: ['./reclamo-cliente.component.scss'],
})
export class ReclamoClienteComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  datos: any //PARA DNI
  datosReclamo: any //PARA RECLAMO
  pagadoTaller: number = 0 //PARA EL TILDE DE TALLER, DADO QUE LLEGA COMO STRING "Sí" O "No"
  fechaReclamo: string = "" //PARA FECHA DE RECLAMO
  fechaComprado: string = "" //PARA FECHA DE COMPRA DEL PRODUCTO
  fechaPrometido: string = "" //PARA FECHA DE PROMETIDO DIA

  //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
  fecha = new Date().toISOString().substring(0,10)
  disabled: boolean = true;

  ngOnInit(): void {
    //VERIFICA DATOS DEL DNI
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //console.log(usuarioDoc)
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]
    });
    //VERIFICA DATOS DEL RECLAMO
    let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''
    this.api.listarReclamoInd(numReclamo).subscribe((data) => { 
      this.datosReclamo = data
      this.datosReclamo = this.datosReclamo[0] //TOMAMOS EL ARRAY QUE TRAE Y LO VOLCAMOS

      //PARA TRAER EL STRING DE LA FECHA SE TOMARON INDIVIDUALMENTE PARA APLICAR UN SLICE
      this.fechaReclamo = this.datosReclamo.fecha //FECHA DE RECLAMO
      this.fechaComprado = this.datosReclamo.fechaCompra //FECHA COMPRADO
      this.fechaPrometido = this.datosReclamo.prometidoDia //FECHA PROMETIDO DIA

      //EL PAGADO DEL TALLER LLEGA COMO SÍ O NO, LO PASAMOS A BOOLEANO PARA QUE TOME EL TILDE.
      //SI ESTA PAGADO, CAMBIA A 1, SINO SIGUE EL 0
      if (this.datosReclamo.pagado == 'Sí') {
        this.pagadoTaller = 1
      }
      this.profileForm.patchValue({
        codigoBarras: this.datosReclamo.prodCodBar,
        fecha: this.fechaReclamo.slice(0,-9),
        fechaCompra: this.fechaComprado.slice(0,-9),
        ticket: this.datosReclamo.ticket,
        monto: this.datosReclamo.importe,
        tipo: this.datosReclamo.tipo,
        estado: this.datosReclamo.estado,
        prometidoDia: this.fechaPrometido.slice(0,-9),
        motivo: this.datosReclamo.motivo,
        observaciones: this.datosReclamo.solucion,
        taller: this.datosReclamo.taller,
        importe: this.datosReclamo.costo,
        pagado: this.pagadoTaller,
        ncred: this.datosReclamo.ncred,
        cerrado: this.datosReclamo.cerrado,
        descripcion: this.datosReclamo.prodDescripcion
      })
    })
  }

  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
    fecha: new FormControl({value: this.fecha, disabled: this.disabled}, Validators.required),
    fechaCompra: new FormControl(''),
    ticket: new FormControl(''),
    monto: new FormControl(''),
    tipo: new FormControl('', Validators.required),
    estado: new FormControl(''),
    prometidoDia: new FormControl(''),
    motivo: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    taller: new FormControl(''),
    importe: new FormControl(''),
    pagado: new FormControl(''),
    ncred: new FormControl(''),
    cerrado: new FormControl(''),
    prodDescripcion: new FormControl('')
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
