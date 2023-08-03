import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.scss'],
})
export class NabvarComponent implements OnInit {

  cambioLocal: any; //CAMBIO DE LOCAL

  // currentRoute: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    //OPCIONES PARA CAMBIO DE LOCAL, HOY AL INICIO VUELVE SIEMPRE A TATE PORQUE LOS RUTEOS ESTAN HECHOS ASI
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'tate') {
      this.cambioLocal = 'tate'
    } else if (local == 'kilroy') {
      this.cambioLocal = 'kilroy'
    } else if (local == 'kilroykids') {
      this.cambioLocal = 'kilroykids'
    } else if (local == 'tateexpress') {
      this.cambioLocal = 'tateexpress'
    } else if (local == 'kitexpress') {
      this.cambioLocal = 'kitexpress'
    } else {
      this.router.navigate(["home/tate"])
      this.cambioLocal = 'tate'
    }
  }

  //FUNCION PARA CAMBIO DE LOCAL
  cambioTate(){
  this.cambioLocal = 'tate'    
  }
  cambioExpress(){
    this.cambioLocal = 'tateexpress'
  }
  cambioKilroy(){
    this.cambioLocal = 'kilroy'
  }
  cambioKit(){
    this.cambioLocal = 'kitexpress'
  }
  cambioKids(){
    this.cambioLocal = 'kilroykids'
  }
}
