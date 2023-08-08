export interface listaReclamosInterface {
  id:              number;
  reclamo:         number;
  fecha:           Date;
  fechaCompra:     Date;
  tipoDoc:         string;
  docNro:          string;
  apellidos:       string;
  nombres:         string;
  seccion:         null;
  prodCodBar:      string;
  prodDescripcion: string;
  cantidad:        number;
  motivo:          string;
  idEmp:           string;
  prometidoDia:    Date;
  turno:           string;
  importe:         number;
  solucion:        string;
  tipo:            string;
  estado:          string;
  fechaSol:        Date;
  costo:           number;
  taller:          string;
  observaciones:   string;
  pagado:          string;
  ticket:          number;
  ncred:           string;
  nroTransferInt:  null;
  idTipo:          number;
  tipoRec:         string;
  grupoRec:        string;
  cerrado:         string;
  expr1:           string;
  empresa:         string;
}
  