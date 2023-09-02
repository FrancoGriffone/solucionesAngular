import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import * as dayjs from 'dayjs'


@Component({
  selector: 'app-b-cargo',
  templateUrl: './b-cargo.component.html',
  styleUrls: ['./b-cargo.component.scss'],
})
export class BCargoComponent implements OnInit {

  //LINKS BOLETAS DE CARGO
  bcargo1: string = "http://192.168.0.111/ReportServer/Pages/ReportViewer.aspx?%2fReclamos%2fInfRecABC_det&rs:Command%20=%20Render&IdEmp="
  bcargo2: string = "&Fecha="
  idEmp: string = ""
  bcargoFecha: string = "" 
  link: string = ""
  linkBCargo: SafeResourceUrl = ""

  //FECHA DE BUSQUEDA
  fecha: any = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  //FORM CONTROL SOBRE LA FECHA
  date = new FormControl(this.fecha);

  constructor(private route: ActivatedRoute, private api: ApiService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

    //COMPLETAMOS EL STRING VACIO CON LA FECHA
    this.bcargoFecha = this.date.value
    
    //DEPENDE EL LOCAL, DA UNA LETRA (CADA UNA CORRESPONDE AL PARAMETRO QUE SE NECESITA SEGUN EL REPORTE)
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'Tate') {
      this.idEmp = 'T'
    } else if (local == 'Kilroy') {
      this.idEmp = 'K'
    } else if (local == 'KilroyKids') {
      this.idEmp = 'N'
    } else if (local == 'TateExpress') {
      this.idEmp = 'E'
    } else if (local == 'KitExpress') {
      this.idEmp = 'M'
    } else {
      this.idEmp = 'T'
    }

    //ARMAMOS UN STRING CON = 1ERAPARTE LINK REPORTE + ID EMPRESA (LA LETRA) + 2DAPARTE LINK REPORTE + FECHA 
    this.link  = this.bcargo1 + this.idEmp + this.bcargo2 + this.bcargoFecha

    this.linkBCargo = this.sanitizer.bypassSecurityTrustResourceUrl(this.link)
  }

  onSubmit() {
    //COMPLETAMOS EL STRING VACIO CON LA FECHA
    this.bcargoFecha = this.date.value
    //ARMAMOS UN STRING CON = 1ERAPARTE LINK REPORTE + ID EMPRESA (LA LETRA) + 2DAPARTE LINK REPORTE + FECHA 
    this.link  = this.bcargo1 + this.idEmp + this.bcargo2 + this.bcargoFecha
    //PASA EL LINK
    this.linkBCargo = this.sanitizer.bypassSecurityTrustResourceUrl(this.link)
  }

  //BOTON PARA IR AL REPORTE
  imprimir(){
    window.open(this.link, '_blank')
  }
}
