import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';


@Component({
  selector: 'app-reclamos-varios',
  templateUrl: './reclamos-varios.component.html',
  styleUrls: ['./reclamos-varios.component.scss']
})
export class ReclamosVariosComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  datos: any
  datosReclamo: any
  
  fechaReclamo: any

  fecha = new Date().toISOString().substring(0,10)

  disabled: boolean = true;

  ngOnInit(): void {
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

      this.profileForm.patchValue({
        fecha: this.fechaReclamo.slice(0,-9),
        estado: this.datosReclamo.estado,
        motivo: this.datosReclamo.motivo,
        observaciones: this.datosReclamo.solucion,
        cerrado: this.datosReclamo.cerrado,
        solucion: this.datosReclamo.observaciones
      })
    })
  }

  profileForm = new FormGroup({
    fecha: new FormControl({value: this.fecha}, Validators.required),
    motivo: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    cerrado: new FormControl(''),
    solucion: new FormControl('')
  });
  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
