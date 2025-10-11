import { v4 as uuidv4 } from 'uuid'

// Generar ID único
export const generarId = () => uuidv4()

// Formatear fecha
export const formatearFecha = (timestamp) => {
  if (!timestamp) return ''
  const fecha = new Date(timestamp)
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Formatear fecha y hora
export const formatearFechaHora = (timestamp) => {
  if (!timestamp) return ''
  const fecha = new Date(timestamp)
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear moneda
export const formatearMoneda = (valor) => {
  if (valor === null || valor === undefined) return '0.00'
  return new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

// Obtener timestamp actual
export const obtenerTimestamp = () => Date.now()
