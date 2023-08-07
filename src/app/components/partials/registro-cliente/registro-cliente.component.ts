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

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  datos: any //PARA VOLCAR LOS DATOS DEL CLIENTE

  //FORMULARIO PARA CARGAR EL CLIENTE
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

  ngOnInit(): void {
    //TOMAMOS EL DNI PARA CARGAR LA DATA DEL CLIENTE SI FIGURA EN EL SISTEMA
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.api.cargarCliente(usuarioDoc).subscribe((data) => {
      this.datos = data
      this.datos = this.datos[0]

      //SI EXISTE EL CLIENTE, LO CARGAMOS EN EL FORMULARIO
      this.profileForm.patchValue({
        nombre:this.datos?.nombres,
        apellido: this.datos?.apellidos,
        domicilio: this.datos?.direccion,
        pisoDpto: this.datos?.pisoDpto,
        localidad: this.datos?.localidad,
        codigoPostal: this.datos?.codigoPostal,
        telefono: this.datos?.telefonos,
        observaciones: this.datos?.observaciones
      })
    });
  }

  //CON LOS DATOS DEL DNI, SE VA A SELECCIONAR QUE TIPO DE RECLAMO VAMOS
  onSubmit() {
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate([local + "/cliente/", usuarioDoc, "selectorReclamo"]);
  }
}
