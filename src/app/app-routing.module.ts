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

const routes: Routes = [
  {
    path: 'home',
    component: InicioComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home/:local',
    component: InicioComponent,
  },
  {
    path: 'bcargo',
    component: BCargoComponent,
  },
  {
    path: 'reclamointerno',
    component: ReclamoInternoComponent,
  },
  {
    path: 'listareclamos',
    component: ListaReclamosComponent,
  },
  {
    path: 'cliente/:doc',
    component: RegistroClienteComponent,
  },
  {
    path: 'legajo/:doc',
    component: LegajoClienteComponent,
  },
  {
    path: 'cliente/:doc/selectorReclamo',
    component: SelecTipoReclamoComponent,
  },
  {
    path: 'cliente/:doc/nuevoReclamoMercaderia',
    component: ReclamoClienteComponent,
  },
  {
    path: 'cliente/:doc/nuevoReclamoVarios',
    component: ReclamosVariosComponent,
  },
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
