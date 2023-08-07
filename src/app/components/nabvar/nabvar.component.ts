import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.scss'],
})
export class NabvarComponent implements OnInit {

  private receptorCambio: Subscription //SUBSCRIPCION PARA RECIBIR EL CAMBIO DE LOCAL

  cambioLocal: any; //CAMBIO DE LOCAL

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    //ACA RECIBE EL NOMBRE DEL LOCAL PARA ACTUALIZARLO
    this.receptorCambio = this.api.recibirCambio().subscribe(data =>{
      this.cambioLocal = data
    })
  }

  ngOnInit(): void {
    //OPCIONES PARA CAMBIO DE LOCAL, HOY AL INICIO VUELVE SIEMPRE A TATE PORQUE LOS RUTEOS ESTAN HECHOS ASI
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'Tate') {
      this.cambioLocal = 'Tate'
    } else if (local == 'Kilroy') {
      this.cambioLocal = 'Kilroy'
    } else if (local == 'KilroyKids') {
      this.cambioLocal = 'KilroyKids'
    } else if (local == 'TateExpress') {
      this.cambioLocal = 'TateExpress'
    } else if (local == 'KitExpress') {
      this.cambioLocal = 'KitExpress'
    } else {
      this.router.navigate(["Tate/home"])
      this.cambioLocal = 'Tate'
    }
  }

  //FUNCIONES PARA CAMBIO DE LOCAL
  cambioTate(){
  this.cambioLocal = 'Tate'    
  }
  cambioExpress(){
    this.cambioLocal = 'TateExpress'
  }
  cambioKilroy(){
    this.cambioLocal = 'Kilroy'
  }
  cambioKit(){
    this.cambioLocal = 'KitExpress'
  }
  cambioKids(){
    this.cambioLocal = 'KilroyKids'
  }

  //FUNCIONES PARA CAMBIO DE COMPONENTE
  home() {
    this.router.navigate([this.cambioLocal + "/home"]);
  }
  listaReclamos() {
    this.router.navigate([this.cambioLocal + "/listareclamos"]);
  }
  reclamoInterno() {
    this.router.navigate([this.cambioLocal + "/reclamointerno"]);
  }
  reclamosAReparacion() {
    this.router.navigate([this.cambioLocal + "/reclamosareparacion"]);
  }
  reclamosEnReparacion() {
    this.router.navigate([this.cambioLocal + "/reclamosenreparacion"]);
  }
  bCargo() {
    this.router.navigate([this.cambioLocal + "/bcargo"]);
  }
}
