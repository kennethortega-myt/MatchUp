export interface Country {
  name: string
  code: string
  cities: string[]
}

export const COUNTRIES: Country[] = [
  {
    name: 'Perú', code: 'PE',
    cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Puno', 'Ayacucho', 'Cajamarca', 'Chimbote', 'Sullana', 'Juliaca', 'Ica', 'Huánuco', 'Tarapoto', 'Tumbes', 'Pucallpa'],
  },
  {
    name: 'Colombia', code: 'CO',
    cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Ibagué', 'Pasto', 'Montería', 'Villavicencio', 'Neiva'],
  },
  {
    name: 'México', code: 'MX',
    cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Cancún', 'Mérida', 'Zapopan', 'San Luis Potosí', 'Aguascalientes', 'Hermosillo', 'Querétaro', 'Acapulco'],
  },
  {
    name: 'Argentina', code: 'AR',
    cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Posadas', 'Neuquén'],
  },
  {
    name: 'Chile', code: 'CL',
    cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique', 'Puerto Montt', 'Coquimbo', 'Osorno', 'Copiapó', 'Valdivia'],
  },
  {
    name: 'Ecuador', code: 'EC',
    cities: ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Portoviejo', 'Esmeraldas', 'Santo Domingo', 'Riobamba', 'Loja'],
  },
  {
    name: 'Bolivia', code: 'BO',
    cities: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Oruro', 'Potosí', 'Tarija', 'Beni', 'Trinidad'],
  },
  {
    name: 'Venezuela', code: 'VE',
    cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Mérida', 'Barcelona', 'Maturín', 'Cumaná', 'Petare'],
  },
  {
    name: 'Brasil', code: 'BR',
    cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  },
  {
    name: 'España', code: 'ES',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
  },
  {
    name: 'Estados Unidos', code: 'US',
    cities: ['Nueva York', 'Los Ángeles', 'Chicago', 'Houston', 'Miami', 'Dallas', 'San Francisco', 'Seattle', 'Boston', 'Washington D.C.'],
  },
  {
    name: 'Otro', code: 'OTHER',
    cities: ['Otra ciudad'],
  },
]

export function getCitiesForCountry(countryName: string): string[] {
  const c = COUNTRIES.find(c => c.name === countryName)
  return c ? c.cities : []
}
