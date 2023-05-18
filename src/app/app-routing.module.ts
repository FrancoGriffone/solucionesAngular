import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { BCargoComponent } from './components/b-cargo/b-cargo.component';
import { ReclamoInternoComponent } from './components/reclamo-interno/reclamo-interno.component';

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
    path: 'bcargo',
    component: BCargoComponent,
  },
  {
    path: 'reclamointerno',
    component: ReclamoInternoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
