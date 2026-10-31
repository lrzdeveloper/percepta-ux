import { pathToFileURL } from 'node:url';
import { realpathSync } from 'node:fs';

export function normalizeHex(value) {
  if (typeof value !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    throw new Error('Use an opaque sRGB color in #RGB or #RRGGBB format. Resolve transparency and CSS variables first.');
  }
  const hex = value.trim().slice(1);
  return `#${(hex.length === 3 ? [...hex].map(char => char + char).join('') : hex).toUpperCase()}`;
}

function luminance(hex) {
  const channels = [1, 3, 5].map(index => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function measureContrast(foreground, background) {
  const first = normalizeHex(foreground);
  const second = normalizeHex(background);
  const a = luminance(first);
  const b = luminance(second);
  return {
    foreground: first,
    background: second,
    colorSpace: 'sRGB',
    ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
    scope: 'Arithmetic for two opaque input colors; rendering and conformance are not inspected.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write('Usage: node contrast.mjs "#foreground" "#background"\nFormats: #RGB or #RRGGBB, opaque sRGB only.\nExample: node contrast.mjs "#777777" "#FFFFFF"\nReturns JSON with an unrounded ratio; no rendering or conformance inspection.\nExit codes: 0 = result or help; 2 = invalid input, no measurement.\nNo files or network access.\n');
  } else {
    try {
      if (args.length !== 2) throw new Error('Provide exactly two opaque hex colors. Use --help for usage.');
      process.stdout.write(`${JSON.stringify(measureContrast(...args), null, 2)}\n`);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 2;
    }
  }
}
