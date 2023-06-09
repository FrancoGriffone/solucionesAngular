import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void {}

  profileForm = new FormGroup({
    eleccion: new FormControl('', Validators.required),
    datos: new FormControl('', Validators.required),
  });

  onSubmit() {
    console.log(this.profileForm.value.datos);
    let usuarioDoc = this.profileForm.value.datos;
    this.api.cargarCliente(usuarioDoc).subscribe((data)=>{
      console.log(Object.keys(data).length)
      if (Object.keys(data).length == 1){
        this.router.navigate(["legajo/", usuarioDoc])
      } else {
        this.router.navigate(["cliente/", usuarioDoc])
      }
    })
  }
}
