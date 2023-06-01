import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { buscarInterface } from 'src/app/models/buscar.interface';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  // buscar(form: buscarInterface) {
  //   this.api.cargarCliente(form).subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
    //console.log(this.profileForm.value.eleccion);
    let usuarioId = this.profileForm.value.datos;
    this.api.cargarCliente(usuarioId).subscribe((data) => {
      console.log(data);
    });
    this.api.listaReclamosCliente(usuarioId).subscribe((data) => {
      console.log(data);
    });
  }
}
