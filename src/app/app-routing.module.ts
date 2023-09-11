import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { BCargoComponent } from './components/b-cargo/b-cargo.component';
import { ReclamoInternoComponent } from './components/reclamo-interno/reclamo-interno.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ListaReclamosComponent } from './components/lista-reclamos/lista-reclamos.component';
import { RegistroClienteComponent } from './components/partials/registro-cliente/registro-cliente.component';
import { LegajoClienteComponent } from './components/partials/legajo-cliente/legajo-cliente.component';
import { SelecTipoReclamoComponent } from './components/partials/selec-tipo-reclamo/selec-tipo-reclamo.component';
import { ReclamoClienteComponent } from './components/partials/reclamo-cliente/reclamo-cliente.component';
import { ReclamosVariosComponent } from './components/partials/reclamos-varios/reclamos-varios.component';
import { ReclamosEnReparacionComponent } from './components/reclamos-en-reparacion/reclamos-en-reparacion.component';

const routes: Routes = [
  //LINK AL HOME
  {
    path: ':local/home',
    component: InicioComponent,
  },
  {
    path: '',
    redirectTo: ':local/home',
    pathMatch: 'full',
  },
  //LINK AL HOME DEPENDE EL LOCAL
  {
    path: ':local/home',
    component: InicioComponent,
  },
  //LINK A BOLETA DE CARGO
  {
    path: ':local/bcargo',
    component: BCargoComponent,
  },
  //LINK A NUEVO RECLAMO INTERNO
  {
    path: ':local/reclamointerno',
    component: ReclamoInternoComponent,
  },
  //LINK A RECLAMO INTERNO EXISTENTE
  {
    path: ':local/reclamointerno/:id',
    component: ReclamoInternoComponent,
  },
  //LINK A LISTA DE RECLAMOS
  {
    path: ':local/listareclamos',
    component: ListaReclamosComponent,
  },
  //LINK A CLIENTES EXISTENTES EN EL SISTEMA
  {
    path: ':local/cliente/:doc',
    component: RegistroClienteComponent,
  },
  //LINK A LEGAJO DE CLIENTE, PUEDE SER PARA CARGAR UNO NUEVO O ACTUALIZAR DATOS
  {
    path: ':local/legajo/:doc',
    component: LegajoClienteComponent,
  },
  //LINK A SELECCION DE RECLAMO, PUEDE SER MERCADERIA O VARIOS
  {
    path: ':local/cliente/:doc/selectorReclamo',
    component: SelecTipoReclamoComponent,
  },
  //LINK A RECLAMO DE MERCADERIA CLIENTES
  {
    path: ':local/cliente/:doc/nuevoReclamoMercaderia',
    component: ReclamoClienteComponent,
  },
  //LINK A RECLAMO VARIOS CLIENTES
  {
    path: ':local/cliente/:doc/nuevoReclamoVarios',
    component: ReclamosVariosComponent,
  },
  //LINK A RECLAMO VARIOS CLIENTES EXISTENTE
  {
    path: ':local/cliente/:doc/ReclamoVarios/:id',
    component: ReclamosVariosComponent,
  },
  //LINK A RECLAMO DE MERCADERIA CLIENTES
  {
    path: ':local/cliente/:doc/reclamo/:id',
    component: ReclamoClienteComponent,
  },
  //LINK A RECLAMOS EN REPARACION
  {
    path: ':local/reclamosenreparacion',
    component: ReclamosEnReparacionComponent,
  },
  //LINK CUANDO NO EXISTE LA URL COLOCADA
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
