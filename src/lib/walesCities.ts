// Welsh cities with accurate SVG coordinates (viewBox 0 0 100 100)
// Coordinates are normalized to fit the stylized Wales map shape

export interface WelshCity {
  name: string;
  x: number;
  y: number;
  region: 'north' | 'mid' | 'south';
}

export const welshCities: WelshCity[] = [
  // North Wales
  { name: "Wrexham", x: 72, y: 18, region: 'north' },
  { name: "Bangor", x: 38, y: 12, region: 'north' },
  { name: "Llandudno", x: 48, y: 15, region: 'north' },
  { name: "Rhyl", x: 55, y: 13, region: 'north' },
  { name: "Colwyn Bay", x: 52, y: 14, region: 'north' },
  
  // Mid Wales
  { name: "Aberystwyth", x: 32, y: 48, region: 'mid' },
  { name: "Newtown", x: 55, y: 42, region: 'mid' },
  { name: "Welshpool", x: 62, y: 38, region: 'mid' },
  
  // South Wales
  { name: "Cardiff", x: 68, y: 82, region: 'south' },
  { name: "Swansea", x: 38, y: 78, region: 'south' },
  { name: "Newport", x: 76, y: 80, region: 'south' },
  { name: "Bridgend", x: 52, y: 80, region: 'south' },
  { name: "Neath", x: 42, y: 76, region: 'south' },
  { name: "Port Talbot", x: 45, y: 78, region: 'south' },
  { name: "Merthyr Tydfil", x: 58, y: 72, region: 'south' },
  { name: "Caerphilly", x: 65, y: 78, region: 'south' },
  { name: "Barry", x: 62, y: 85, region: 'south' },
];

// More detailed and accurate Wales SVG path
export const walesPath = `
  M 45 5 
  Q 35 8, 32 12
  L 28 18
  Q 25 22, 28 28
  L 32 35
  Q 28 42, 25 50
  L 22 58
  Q 20 65, 25 72
  L 30 78
  Q 35 85, 45 88
  L 55 90
  Q 65 92, 75 88
  L 80 82
  Q 82 75, 80 68
  L 78 60
  Q 80 52, 78 45
  L 75 38
  Q 78 30, 76 22
  L 72 15
  Q 68 10, 60 8
  L 50 6
  Z
`;

// County/region boundaries for subtle visual separation
export const regionPaths = {
  north: "M 28 18 Q 45 20, 72 18 L 75 30 Q 55 35, 32 35 Z",
  mid: "M 32 35 Q 55 35, 75 30 L 78 60 Q 50 65, 25 58 Z",
  south: "M 25 58 Q 50 65, 78 60 L 80 82 Q 60 90, 30 78 Z",
};
