import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';
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

  cliente: boolean = false;

  onSubmit() {
    //console.log(this.profileForm.value);
    let usuarioDoc = this.profileForm.value.datos;
    this.api.cargarCliente(usuarioDoc).pipe(
      map((resp) => {
        return resp;
      })
    );
    // this.api.cargarCliente(usuarioDoc).subscribe((data) => {
    //   console.log(data);
    //   console.log(data.docNro); //UNDEFINED
    // });
    this.api.listaReclamosCliente(usuarioDoc).subscribe((data) => {
      console.log(data);
    });
  }
}
