import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-reclamos-varios',
  templateUrl: './reclamos-varios.component.html',
  styleUrls: ['./reclamos-varios.component.scss']
})
export class ReclamosVariosComponent implements OnInit {
  constructor() {}

  fecha = new Date().toISOString().substring(0,10)

  disabled: boolean = true;

  ngOnInit(): void {}

  profileForm = new FormGroup({
    fecha: new FormControl({value: this.fecha, disabled: this.disabled}, Validators.required),
    motivo: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
  });
  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
  }
}
