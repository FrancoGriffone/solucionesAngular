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

  datosReclamo: any //PARA RECLAMO
  pagadoTaller: number = 0 //PARA EL TILDE DE TALLER, DADO QUE LLEGA COMO STRING "Sí" O "No"
  fechaReclamo: string = "" //PARA FECHA DE RECLAMO

   //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
   fecha = new Date().toISOString().substring(0,10)
   disabled: boolean = true;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
     //VERIFICA DATOS DEL RECLAMO
     let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''
     this.api.listarReclamoInd(numReclamo).subscribe((data) => { 
       this.datosReclamo = data
       this.datosReclamo = this.datosReclamo[0] //TOMAMOS EL ARRAY QUE TRAE Y LO VOLCAMOS
 
       //PARA TRAER EL STRING DE LA FECHA SE TOMARON INDIVIDUALMENTE PARA APLICAR UN SLICE
       this.fechaReclamo = this.datosReclamo.fecha //FECHA DE RECLAMO
 
       //EL PAGADO DEL TALLER LLEGA COMO SÍ O NO, LO PASAMOS A BOOLEANO PARA QUE TOME EL TILDE.
       //SI ESTA PAGADO, CAMBIA A 1, SINO SIGUE EL 0
       if (this.datosReclamo.pagado == 'Sí') {
         this.pagadoTaller = 1
       }
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
         descripcion: this.datosReclamo.prodDescripcion
       })
     })
  }
  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
    seccion: new FormControl(''),
    fecha: new FormControl({value: this.fecha}, Validators.required),
    estado: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    taller: new FormControl(''),
    importe: new FormControl(''),
    pagado: new FormControl(''),
    cerrado: new FormControl(''),
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
