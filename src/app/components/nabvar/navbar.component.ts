import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApiService } from 'src/app/service/api.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  //ANIMACION PARA EL DESPLEGABLE DE LOS LOCALES
  animations: [
    trigger('animacion', [
      transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('200ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)', opacity: 1}),
        animate('200ms', style({transform: 'translateX(100%)', opacity: 0}))
      ])
    ]),
  ], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit  {

  //SELECCIONAMOS ELEMENTOS DEL DOM PARA LA BARRA LATERAL
  @ViewChild('menuBoton') menuBtn!: ElementRef;
  @ViewChild('sidemenu') sideMenu!: ElementRef;

  verLocales: boolean = false

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
    } else if (local == 'Volca') {
      this.cambioLocal = 'Volca'
    } else {
      this.router.navigate(["Tate/home"])
      this.cambioLocal = 'Tate'
    }
  }

  //FUNCIONES PARA CAMBIO DE LOCAL
  cambioTate(){
    this.cambioLocal = 'Tate'
    this.router.navigate([this.cambioLocal + '/home'])

    //DEJO COMENTADA UN MODO PARA QUE AL PRESIONAR SOBRE UN LOCAL, TE DEJE EN EL COMPONENTE CAMBIANDO SOLO LA PARTE DEL LOCAL
    //CREO QUE EVITA PROBLEMAS EL QUE TE VUELVA AL HOME, POR LO QUE POR EL MOMENTO NO SE USA

    // let currentUrl = this.router.url; 
    // let newUrl = currentUrl.replace(/\/[^\/]*\//, '/' + this.cambioLocal + '/');
    // this.router.navigateByUrl(newUrl)

    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=T'    
  }
  cambioExpress(){
    this.cambioLocal = 'TateExpress'
    this.router.navigate([this.cambioLocal + '/home'])
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=E'
  }
  cambioKilroy(){
    this.cambioLocal = 'Kilroy'
    this.router.navigate([this.cambioLocal + '/home'])
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=K'  
  }
  cambioKit(){
    this.cambioLocal = 'KitExpress'
    this.router.navigate([this.cambioLocal + '/home'])
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=M'
  }
  cambioKids(){
    this.cambioLocal = 'KilroyKids'
    this.router.navigate([this.cambioLocal + '/home'])
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=N'
  }
  cambioVolca(){
    this.cambioLocal = 'Volca'
    this.router.navigate([this.cambioLocal + '/home'])
    this.reclamosAReparacion = 'http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecARep&rs:Command=Render&IdEmp=V'
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

  //AL CLICKEAR, CAMBIA LAS CLASES
  ngAfterViewInit() {
    this.menuBtn.nativeElement.addEventListener('click', () => {
      this.sideMenu.nativeElement.classList.toggle('menu-expanded');
      this.sideMenu.nativeElement.classList.toggle('menu-collapsed');
    });
  }
}
