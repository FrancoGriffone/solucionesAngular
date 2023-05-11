import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reclamo-interno',
  templateUrl: './reclamo-interno.component.html',
  styleUrls: ['./reclamo-interno.component.scss'],
})
export class ReclamoInternoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  profileForm = new FormGroup({
    codigoBarras: new FormControl(''),
    seccion: new FormControl(''),
    estado: new FormControl(''),
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
