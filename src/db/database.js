import Dexie from 'dexie'

export const db = new Dexie('SistemaLogistico')

// Definir esquema de la base de datos
db.version(1).stores({
  categorias: 'idCategoria, nombre',
  productos: 'idProducto, codigo, nombre, idCategoria, stockActual',
  empresa: 'idEmpresa, nombre',
  proveedores: 'idProveedor, nombre',
  clientes: 'idCliente, nombre',
  pedidos: 'idPedido, idEmpresa, idProveedor, fecha, estado',
  detallePedidos: 'idDetalle, idPedido, idProducto, [idPedido+idProducto]',
  ventas: 'idVenta, fecha, idCliente',
  detalleVentas: 'idDetalleVenta, idVenta, idProducto, [idVenta+idProducto]',
  historialMovimientos: 'idMovimiento, fecha, tipoMovimiento, idProducto, idReferencia',
  configuracion: 'clave, categoria, activo'
})

// Constantes del sistema
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  RECIBIDO: 'recibido',
  CANCELADO: 'cancelado'
}

export const TIPOS_MOVIMIENTO = {
  INGRESO: 'ingreso',
  SALIDA: 'salida',
  AJUSTE: 'ajuste'
}

export const TIPOS_REFERENCIA = {
  PEDIDO: 'pedido',
  VENTA: 'venta',
  AJUSTE: 'ajuste'
}

export const ESTADOS_VENTA = {
  PENDIENTE: 'pendiente',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
}

export const ESTADOS_ENTIDAD = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
}
