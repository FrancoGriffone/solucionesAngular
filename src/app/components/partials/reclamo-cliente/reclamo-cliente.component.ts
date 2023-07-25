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

  datos: any

  fecha = new Date().toISOString().substring(0,10)

  disabled: boolean = true;

  ngOnInit(): void {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //console.log(usuarioDoc)
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]
    });
  }

  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
    fecha: new FormControl({value: this.fecha, disabled: this.disabled}, Validators.required),
    fechaCompra: new FormControl(''),
    ticket: new FormControl(''),
    monto: new FormControl(''),
    estado: new FormControl('', Validators.required),
    prometidoDia: new FormControl(''),
    motivo: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    taller: new FormControl(''),
    importe: new FormControl(''),
    pagado: new FormControl(''),
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
