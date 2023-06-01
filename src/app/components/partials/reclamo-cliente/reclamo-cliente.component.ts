import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reclamo-cliente',
  templateUrl: './reclamo-cliente.component.html',
  styleUrls: ['./reclamo-cliente.component.scss'],
})
export class ReclamoClienteComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
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
