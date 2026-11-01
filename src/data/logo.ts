/**
 * The Mindstor AI mark: 13 facets traced from the official logo (471 x 428 px source image).
 * This is the single source of truth. The nav logo, favicon, ticket art, the loading
 * screen and the hero all draw from these polygons.
 */
export type Pt = readonly [number, number];

export interface LogoFacet {
  /** Fill color sampled from the logo. */
  readonly color: string;
  /** Polygon corners in source-image pixels. */
  readonly points: readonly Pt[];
}

/** SVG viewBox that frames the brain mark (source-image pixels). */
export const LOGO_VIEWBOX = '52 18 364 306';

/** Centre of the brain in source-image pixels, used to centre the 3D version. */
export const LOGO_CENTER = { x: 234, y: 170.5 } as const;

/** Half the mark's width in source pixels (used for screen layout). */
export const LOGO_HALF_WIDTH_PX = 174;

export const LOGO: readonly LogoFacet[] = [
  { color: '#f15f5f', points: [[167, 24], [222, 27], [176, 72]] },
  { color: '#f48245', points: [[254, 24], [309, 26], [291, 76]] },
  { color: '#f56459', points: [[239, 28], [280, 83], [189, 83]] },
  { color: '#f6883a', points: [[320, 29], [402, 110], [302, 88]] },
  { color: '#f1407f', points: [[155, 32], [78, 108], [165, 86]] },
  { color: '#f64a72', points: [[182, 95], [280, 95], [227, 192]] },
  { color: '#cc38a0', points: [[150, 101], [60, 128], [84, 192], [138, 125]] },
  { color: '#dd3796', points: [[170, 101], [98, 189], [96, 200], [213, 198]] },
  { color: '#f6724b', points: [[307, 101], [408, 127], [357, 188]] },
  { color: '#f7506a', points: [[294, 103], [357, 198], [236, 198]] },
  { color: '#b23aaf', points: [[101, 212], [193, 213], [134, 239]] },
  { color: '#ec3d8c', points: [[231, 209], [314, 210], [228, 236]] },
  { color: '#aa35b9', points: [[216, 217], [136, 251], [140, 317], [211, 246]] },
];

/** Brand palette from the design system. */
export const BRAND = {
  pink: '#E12D9B',
  purple: '#AD32C0',
  brightPink: '#FF4770',
  coral: '#FD6055',
  orange: '#FE7045',
} as const;

export const BRAND_HEX: readonly number[] = [0xad32c0, 0xe12d9b, 0xff4770, 0xfd6055, 0xfe7045];
