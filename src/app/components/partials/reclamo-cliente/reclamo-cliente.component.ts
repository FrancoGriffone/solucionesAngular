import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';

@Component({
  selector: 'app-reclamo-cliente',
  templateUrl: './reclamo-cliente.component.html',
  styleUrls: ['./reclamo-cliente.component.scss'],
})
export class ReclamoClienteComponent implements OnInit {

  idEmp: any
  
  talleres: any

  talleresActivos: any[] = []

  soluciones: any

  opciones: any

  tipo: any

  estado: any

  producto: any //PARA VOLCAR LA DESCRIPCION DEL PRODUCTO

  datos: any //PARA VOLCAR LOS DATOS DEL DNI

  datosReclamo: any //PARA VOLCAR LOS DATOS DEL RECLAMO

  pagadoTaller: number = 0 //PARA EL TILDE DE TALLER, DADO QUE LLEGA COMO STRING "Sí" O "No"

  //LOS DOS SON PARA LA FECHA FIJA EN EL FORMCONTROL
  fecha = dayjs().format('DD/MM/YYYY')
  disabled: boolean = true;

  fechaCompra = dayjs().format('YYYY-MM-DD')
  fechaPrometido = dayjs().add(2, 'days').format('YYYY-MM-DD')

  //FORMULARIO PARA RECLAMO INTERNO
  profileForm = new FormGroup({
    codigoBarras: new FormControl('', Validators.required),
    fecha: new FormControl(this.fecha, Validators.required),
    fechaCompra: new FormControl(this.fechaCompra),
    ticket: new FormControl(''),
    monto: new FormControl(''),
    tipo: new FormControl('', Validators.required),
    estado: new FormControl(''),
    prometidoDia: new FormControl(this.fechaPrometido),
    motivo: new FormControl('', Validators.required),
    observaciones: new FormControl(''),
    taller: new FormControl(''),
    importe: new FormControl(''),
    pagado: new FormControl(''),
    ncred: new FormControl(''),
    cerrado: new FormControl(''),
    reclamo: new FormControl('')
  });  


  constructor(private api: ApiService, 
    private route: ActivatedRoute, 
    public loaderService: LoaderService, 
    private toastrSvc: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
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

    //VERIFICA DATOS DEL DNI
    let usuarioDoc: string = this.route.snapshot.paramMap.get('doc') || ''
    //VERIFICA DATOS DEL RECLAMO
    let numReclamo: string = this.route.snapshot.paramMap.get('id') || ''

    this.api.envioComponentes('SI') //ENVIA AL BUSCADOR OTRO STRING PARA HABILITARLO

    let listarReclamo = this.api.listarReclamoInd(numReclamo)
    let cargarCliente = this.api.cargarCliente(usuarioDoc)
    let talleres = this.api.talleres()
    let tipoSolucion = this.api.opciones() //OPCIONES DENTRO DE LA SOLUCIÓN (EJEMPLO, A REPARACIÓN)
    let solucion = this.api.tiposSolucion() //OPCIONES GENERALES (EJEMPLO, TALLER - BOLETA DE CARGO - FUERA DE GARANTÍA - ETC)

    //EL IF ESTE ES IMPORTANTISIMO, SINO BUSCA EL ULTIMO RECLAMO EN LA LISTA
    if (numReclamo != ''){
      forkJoin([listarReclamo, cargarCliente, talleres, tipoSolucion, solucion])
      .subscribe( results => {
        this.datosReclamo = results[0]
        this.datos = results[1]
        this.talleres = results[2]
        this.opciones = results[3]
        this.soluciones = results[4]

        console.log(this.datosReclamo)

        this.talleres.forEach((taller: any) => {
          if (taller.desactivado != true) {
            this.talleresActivos.push(taller)
          }
        });

        //SI EL RECLAMO EXISTE, PERMITE APARECER A LA DESCRIPCION DEL PRODUCTO
        this.api.cargarProducto(this.datosReclamo[0].prodCodBar).subscribe((data)=>{
          this.producto = data
        })

        //EL PAGADO DEL TALLER LLEGA COMO SÍ O NO, LO PASAMOS A BOOLEANO PARA QUE TOME EL TILDE.
        //SI ESTA PAGADO, CAMBIA A 1, SINO SIGUE EL 0
        if (this.datosReclamo[0].pagado == 'Sí') {
          this.pagadoTaller = 1
        }

        let taller = this.talleres.find((x: any) => x?.taller == this.datosReclamo[0].taller)

        if (this.datosReclamo?.[0].tipo == 'NC / Baja Stock') {
          //LOS ESTADOS DE "Cambio Directo" Y "Boleta de Cargo" SE ENCUENTRAN AMBOS EN 'NC / Baja Stock'
            this.tipo = this.opciones.find((x: any) => x?.estado == this.datosReclamo[0].estado)
          } else {
            this.tipo = this.soluciones.find((x: any) => x?.tipo == this.datosReclamo[0].tipo)            
          }
        
        if (this.datosReclamo?.[0].tipo == 'Reparación'){
          this.estado = this.opciones.find((x: any) => x?.estado == this.datosReclamo[0].estado)
        }  

       //SI EXISTE EL RECLAMO SE VUELCAN LOS DATOS
       this.profileForm.patchValue({
          codigoBarras: this.datosReclamo?.[0].prodCodBar,
          fecha: dayjs(this.datosReclamo?.[0].fecha).format('DD/MM/YYYY'),
          fechaCompra: dayjs(this.datosReclamo?.[0].fechaCompra).format('YYYY-MM-DD'),
          ticket: this.datosReclamo?.[0].ticket,
          monto: this.datosReclamo?.[0].importe,
          tipo: this.tipo?.id.toString(), //LLEGA COMO NUMBER, HAY QUE PASARLO A STRING PARA QUE SE PUEDA VER
          estado: this.estado?.id.toString(), //LLEGA COMO NUMBER, HAY QUE PASARLO A STRING PARA QUE SE PUEDA VER
          prometidoDia: dayjs(this.datosReclamo?.[0].prometidoDia).format('YYYY-MM-DD'),
          motivo: this.datosReclamo?.[0].motivo,
          observaciones: this.datosReclamo?.[0].solucion,
          taller: taller?.id.toString(), //LLEGA COMO NUMBER, HAY QUE PASARLO A STRING PARA QUE SE PUEDA VER
          importe: this.datosReclamo?.[0].costo,
          pagado: this.pagadoTaller,
          ncred: this.datosReclamo?.[0].ncred,
          cerrado: this.datosReclamo?.[0].cerrado,
          descripcion: this.datosReclamo?.[0].prodDescripcion,
          reclamo: this.datosReclamo?.[0].reclamo
        })
    })
  } else {
    forkJoin([talleres, tipoSolucion, solucion, cargarCliente])
    .subscribe( results => {
      this.talleres = results[0]
      this.opciones = results[1]
      this.soluciones = results[2]
      this.datos = results[3]

      this.talleres.forEach((taller: any) => {
        if (taller.desactivado != true) {
          this.talleresActivos.push(taller)
        }
      });
    })
  }
}

  //CAMBIAR DESCRIPCION DEL PRODUCTO
  onChange(){
    let codigo = this.profileForm.value.codigoBarras
    this.api.cargarProducto(codigo).subscribe((data)=>{
      this.producto = data
    })
  }

  //BOTON PARA GRABAR RECLAMO
  onSubmit() {
    let tipo = ''
    let estado = ''

    if(this.profileForm.value.tipo == '6' || this.profileForm.value.tipo == '21'){
      let opc = this.opciones.find((x: any) => x?.id == this.profileForm.value.tipo)
      tipo = opc.idTipo
      estado = this.profileForm.value.tipo
    } else if (this.profileForm.value.tipo == '2') {
      tipo = this.profileForm.value.tipo
      estado = this.profileForm.value.estado
    } else {
      tipo = this.profileForm.value.tipo
    }

    if (this.profileForm.value.importe == ''){
      this.profileForm.value.importe = 0
    }

    if (this.profileForm.value.ticket == ''){
      this.profileForm.value.ticket = false
    }

    if (this.profileForm.value.pagado == ''){
      this.profileForm.value.pagado = false
    }

    let reclamo = {
      Id: this.datosReclamo?.[0].id,
      IdCliente: this.datos?.[0].id,
      ProdCodBar: this.profileForm.value.codigoBarras,
      ProdDescripcion: this.producto,
      Ticket: this.profileForm.value.ticket,
      Fecha: dayjs().format('YYYY-MM-DD'),
      FechaCompra: this.profileForm.value.fechaCompra,
      PrometidoDia: this.profileForm.value.prometidoDia,
      IdEmp: this.idEmp,
      IdSolTipo: parseInt(tipo),
      IdSolEstado: parseInt(estado),
      Motivo: this.profileForm.value.motivo,
      Solucion: this.profileForm.value.observaciones,
      Observaciones: this.profileForm.value.solucion,
      IdTaller: parseInt(this.profileForm.value.taller),
      Ncred:this.profileForm.value.ncred,
      Costo: this.profileForm.value.importe,
      Pagado: this.profileForm.value.pagado, 
    }
    console.log(reclamo)

    if(this.datosReclamo == undefined){
      this.toastrSvc.success('Nuevo reclamo creado con éxito')
      this.api.nuevoReclamo(reclamo).subscribe((data) => {
        console.log(data)
      })
      // this.router.navigate([this.route.snapshot.paramMap.get('local') + "/cliente/", this.route.snapshot.paramMap.get('doc'), "/reclamo/"]);
    } else {
    //SI YA ESTA REGISTRADO, SE ACTUALIZA CON OTRA API
    this.toastrSvc.info('Reclamo actualizado con éxito')
      this.api.editarReclamo(reclamo).subscribe((data) => {
        console.log(data)
      })
      console.log('ENTRANDO EN RECLAMO EXISTENTE')
    }
  }
}
