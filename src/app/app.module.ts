import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NabvarComponent } from './components/nabvar/nabvar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BCargoComponent } from './components/b-cargo/b-cargo.component';
import { ReclamoInternoComponent } from './components/reclamo-interno/reclamo-interno.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ListaReclamosComponent } from './components/lista-reclamos/lista-reclamos.component';
import { RegistroClienteComponent } from './components/partials/registro-cliente/registro-cliente.component'
import { ReclamoClienteComponent } from './components/partials/reclamo-cliente/reclamo-cliente.component';
import { LegajoClienteComponent } from './components/partials/legajo-cliente/legajo-cliente.component';
import { ReclamosVariosComponent } from './components/partials/reclamos-varios/reclamos-varios.component';
import { SelecTipoReclamoComponent } from './components/partials/selec-tipo-reclamo/selec-tipo-reclamo.component';
import {NgxPrintModule} from 'ngx-print';

import { BuscadorComponent } from './components/buscador/buscador.component';
//Para el form es necesario importar esto
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Material UI
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {MatDialogModule} from '@angular/material/dialog';

//Prime NG
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';


//AG GRID
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';

import { InterceptorService } from './service/loader/interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ReclamosEnReparacionComponent } from './components/reclamos-en-reparacion/reclamos-en-reparacion.component';
import { VistaReclamoComponent } from './components/partials/vistas/vista-reclamo/vista-reclamo.component';
import { AgGridReclamosComponent } from './components/partials/vistas/ag-grid-reclamos/ag-grid-reclamos.component';




@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    InicioComponent,
    BCargoComponent,
    ReclamoInternoComponent,
    PageNotFoundComponent,
    ListaReclamosComponent,
    RegistroClienteComponent,
    ReclamoClienteComponent,
    LegajoClienteComponent,
    ReclamosVariosComponent,
    SelecTipoReclamoComponent,
    BuscadorComponent,
    ReclamosEnReparacionComponent,
    VistaReclamoComponent,
    AgGridReclamosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule,
    AgGridModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    SelectButtonModule,
    DropdownModule,
    InputTextModule,
    NgxPrintModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
