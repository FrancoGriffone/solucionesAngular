import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

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

  // FECHA + FUNCION PARA RESTAR UN DIA + SETEAR DIA OBTENIDO
  fecha = new Date()

  subtractDay(date: Date, day: number) {
    date.setDate(date.getDate() - day);
    return date;
  }

  fechaBusqueda: any = this.subtractDay(this.fecha, 1).toISOString().slice(0,-14)

  //FORM CONTROL SOBRE LA FECHA
  date = new FormControl(this.fechaBusqueda);

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO
    
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
  }
  
  //BOTON PARA IR AL REPORTE
  onSubmit() {
    //COMPLETAMOS EL STRING VACIO CON LA FECHA
    this.bcargoFecha = this.date.value
    //ARMAMOS UN STRING CON = 1ERAPARTE LINK REPORTE + ID EMPRESA (LA LETRA) + 2DAPARTE LINK REPORTE + FECHA 
    let linkBCargo: string = this.bcargo1 + this.idEmp + this.bcargo2 + this.bcargoFecha
    //ABRE EL LINK QUE ARMAMOS ANTES EN OTRA PESTAÑA
    window.open(linkBCargo, '_blank')
  }
}
