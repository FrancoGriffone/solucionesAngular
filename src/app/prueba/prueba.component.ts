import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  profileForm = new FormGroup({
    codigoBarras: new FormControl(''),
    seccion: new FormControl(''),
    estado: new FormControl(''),
    motivo: new FormControl(''),
    observaciones: new FormControl(''),
    taller: new FormControl(''),
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
