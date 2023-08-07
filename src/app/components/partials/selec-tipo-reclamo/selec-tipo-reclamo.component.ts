import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-selec-tipo-reclamo',
  templateUrl: './selec-tipo-reclamo.component.html',
  styleUrls: ['./selec-tipo-reclamo.component.scss']
})
export class SelecTipoReclamoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  //RECLAMO DE MERCADERIA
  onSubmitMercaderia() {
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate([local + "/cliente/", usuarioDoc, "nuevoReclamoMercaderia"]);
  }

  //RECLAMO VARIOS
  onSubmitVarios() {
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    this.router.navigate([local + "/cliente/", usuarioDoc, "nuevoReclamoVarios"]);
  }
}
