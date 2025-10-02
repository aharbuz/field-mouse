export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  anchor: Point;
  angle: number;
  length: number;
}

export interface VectorFieldConfig {
  gridSpacing: number;
  keepOutRadius: number;
  maxVectorLength: number;
  influenceRange: number;
  vectorColor: string;
  vectorOpacity: number;
  backgroundColor: string;
}
