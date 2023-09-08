export interface ReclamosAReparacionInterface {
    id:              number;
    reclamo:         number;
    fecha:           Date;
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
    cantidad:        number;
    seccion:         null;
}