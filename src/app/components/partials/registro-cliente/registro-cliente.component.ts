import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent implements OnInit {

  datos: any
  user: any

  profileForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    domicilio: new FormControl(''),
    pisoDpto: new FormControl(''),
    localidad: new FormControl(''),
    codigoPostal: new FormControl(''),
    telefono: new FormControl(''),
    observaciones: new FormControl(''),
  });

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //console.log(usuarioDoc)
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.user = this.datos
      this.datos = this.datos[0]
      console.log(this.datos);
      this.profileForm.patchValue({
        nombre:this.datos.nombres,
        apellido: this.datos.apellidos,
        domicilio: this.datos.direccion,
        pisoDpto: this.datos.pisoDpto,
        localidad: this.datos.localidad,
        codigoPostal: this.datos.codigoPostal,
        telefono: this.datos.telefonos,
        observaciones: this.datos.observaciones
      })
    });
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate(["cliente/", usuarioDoc, "selectorReclamo"]);
  }
}
