import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
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
  
  onSubmit() {
    this.bcargoFecha = this.date.value
    let linkBCargo: string = this.bcargo1 + this.idEmp + this.bcargo2 + this.bcargoFecha
    window.open(linkBCargo, '_blank')
  }
}
