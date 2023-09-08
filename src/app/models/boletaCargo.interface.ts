export interface BoletasCargoInterface {
    id:              number;
    reclamo:         number;
    fecha:           Date;
    fechaSol:        Date;
    motivo:          string;
    prodCodBar:      string;
    prodDescripcion: string;
    prometidoDia:    Date;
    taller:          string;
    empresa:         string;
    idSec:           null;
    costo:           number;
    idEmp:           string;
    idTipo:          number;
    proveedor:       string;
    artProv:         string;
    ncred:           string;
    nroTransferInt:  null;
    cantidad:        number;
}