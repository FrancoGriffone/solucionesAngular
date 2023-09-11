import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  reclamosAReparacion: string = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=T'

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
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=T'    
  }
  cambioExpress(){
    this.cambioLocal = 'TateExpress'
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=E'
  }
  cambioKilroy(){
    this.cambioLocal = 'Kilroy'
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=K'  
  }
  cambioKit(){
    this.cambioLocal = 'KitExpress'
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=M'
  }
  cambioKids(){
    this.cambioLocal = 'KilroyKids'
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=N'
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
  reclamosEnReparacion() {
    this.router.navigate([this.cambioLocal + "/reclamosenreparacion"]);
  }
  bCargo() {
    this.router.navigate([this.cambioLocal + "/bcargo"]);
  }
}
