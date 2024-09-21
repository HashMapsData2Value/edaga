import { toSvg } from 'jdenticon';

// Deteriminsically generates an SVG image from the given address
export function generateSVGImage(address: string) {
  const svgIcon = toSvg(address, 100);
  return `data:image/svg+xml;base64,${btoa(svgIcon)}`;
}
