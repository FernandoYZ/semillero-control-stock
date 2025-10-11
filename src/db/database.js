import { Dexie } from 'dexie';

export const db = new Dexie('SistemaLogistico');

// Historial de Versiones. Dexie requiere que se mantengan las definiciones anteriores.

// Versión 1 - Esquema inicial
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
});

// Versión 2 - Sin cambios de esquema, solo para mantener la cadena de migración.
db.version(2).stores({
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
});


// Versión 3 - VERSIÓN CORREGIDA. Se añaden campos a 'empresa' sin alterar la llave primaria.
db.version(3).stores({
  categorias: 'idCategoria, nombre',
  productos: 'idProducto, codigo, nombre, idCategoria, stockActual',
  empresa: 'idEmpresa, nombre, rubro, nombreUsuario, infoCompartida', // PK original, campos nuevos añadidos
  proveedores: 'idProveedor, nombre',
  clientes: 'idCliente, nombre',
  pedidos: 'idPedido, idEmpresa, idProveedor, fecha, estado',
  detallePedidos: 'idDetalle, idPedido, idProducto, [idPedido+idProducto]',
  ventas: 'idVenta, fecha, idCliente',
  detalleVentas: 'idDetalleVenta, idVenta, idProducto, [idVenta+idProducto]',
  historialMovimientos: 'idMovimiento, fecha, tipoMovimiento, idProducto, idReferencia',
  configuracion: 'clave, categoria, activo'
});


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
