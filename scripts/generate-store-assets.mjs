import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const sourceDir = resolve(root, 'store-assets', 'source');
const outputDir = resolve(root, 'store-assets', 'final');
const screenshotDir = resolve(outputDir, 'screenshots');
const videoSlideDir = resolve(outputDir, 'video-slides');
await mkdir(screenshotDir, { recursive: true });
await mkdir(videoSlideDir, { recursive: true });

// App Store Connect's 6.5-inch screenshot slot accepts 1284 × 2778.
const W = 1284;
const H = 2778;
const orange = '#FF6B35';
const ink = '#171717';
const muted = '#6E6A67';
const cream = '#FFF7F2';

const paths = {
  original: resolve(sourceDir, 'golden-original.png'),
  royal: resolve(sourceDir, 'golden-royal.png'),
  christmas: resolve(sourceDir, 'golden-christmas.png'),
  memorial: resolve(sourceDir, 'golden-memorial.png'),
};

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[character]);
}

function svg(width, height, body) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`);
}

function textSvg(lines, { width = W, height = 400, size = 82, color = ink, weight = 800, align = 'middle', lineHeight = 1.12 } = {}) {
  const x = align === 'middle' ? width / 2 : align === 'end' ? width : 0;
  const anchor = align === 'middle' ? 'middle' : align;
  const tspans = lines.map((line, index) =>
    `<tspan x="${x}" dy="${index === 0 ? size : size * lineHeight}">${escapeXml(line)}</tspan>`,
  ).join('');
  return svg(width, height,
    `<text x="${x}" y="0" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans}</text>`,
  );
}

async function roundedImage(path, width, height, radius = 52, fit = 'cover') {
  const image = await sharp(path).resize(width, height, { fit, position: 'centre' }).png().toBuffer();
  const mask = svg(width, height, `<rect width="${width}" height="${height}" rx="${radius}" fill="white"/>`);
  return sharp(image).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

function brand() {
  return svg(400, 72,
    `<rect width="400" height="72" rx="36" fill="${orange}"/>` +
    '<text x="200" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="white">PET PORTRAIT AI</text>',
  );
}

function label(text, width = 220, fill = '#FFFFFFE8', color = ink) {
  return svg(width, 58,
    `<rect width="${width}" height="58" rx="29" fill="${fill}"/>` +
    `<text x="${width / 2}" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="${color}">${escapeXml(text)}</text>`,
  );
}

async function baseCanvas(background = cream) {
  return sharp({ create: { width: W, height: H, channels: 4, background } });
}

async function screenshotOne() {
  const original = await roundedImage(paths.original, 540, 940);
  const royal = await roundedImage(paths.royal, 540, 940);
  const canvas = await baseCanvas();
  await canvas.composite([
    { input: brand(), left: 445, top: 128 },
    { input: textSvg(['One photo.', 'A lasting keepsake.'], { height: 300, size: 92 }), left: 0, top: 330 },
    { input: textSvg(['See your pet in meaningful new ways.'], { height: 90, size: 34, color: muted, weight: 500 }), left: 0, top: 590 },
    { input: original, left: 75, top: 760 },
    { input: royal, left: 675, top: 760 },
    { input: label('ORIGINAL'), left: 235, top: 1650 },
    { input: label('ROYAL PORTRAIT', 260, orange, 'white'), left: 815, top: 1650 },
    { input: textSvg(['24 designs for gifts,', 'celebrations, and memories'], { height: 220, size: 58 }), left: 0, top: 1900 },
    { input: label('1 FREE PREVIEW', 300, ink, 'white'), left: 495, top: 2310 },
  ]).png().toFile(resolve(screenshotDir, '01-one-photo-keepsake.png'));
}

async function screenshotTwo() {
  const royal = await roundedImage(paths.royal, 1050, 1330, 58);
  const canvas = await baseCanvas('#F6EEE8');
  await canvas.composite([
    { input: brand(), left: 445, top: 112 },
    { input: textSvg(['Meet their', 'royal side.'], { height: 280, size: 96 }), left: 0, top: 300 },
    { input: textSvg(['Identity-preserving portraits that still look like them.'], { height: 100, size: 32, color: muted, weight: 500 }), left: 0, top: 570 },
    { input: royal, left: 120, top: 735 },
    { input: textSvg(['Royal Portrait'], { height: 90, size: 52 }), left: 0, top: 2160 },
    { input: textSvg(['Choose a design. Adjust the style. Create in seconds.'], { height: 80, size: 30, color: muted, weight: 500 }), left: 0, top: 2250 },
    { input: label('CREATE YOURS', 290, orange, 'white'), left: 500, top: 2460 },
  ]).png().toFile(resolve(screenshotDir, '02-royal-portrait.png'));
}

async function screenshotThree() {
  const memorial = await roundedImage(paths.memorial, 1050, 1330, 58);
  const canvas = await baseCanvas('#FFF9F1');
  await canvas.composite([
    { input: brand(), left: 445, top: 112 },
    { input: textSvg(['Remember them', 'beautifully.'], { height: 280, size: 92 }), left: 0, top: 305 },
    { input: textSvg(['Gentle memorial designs made with care.'], { height: 90, size: 34, color: muted, weight: 500 }), left: 0, top: 575 },
    { input: memorial, left: 120, top: 735 },
    { input: textSvg(['Rainbow Memory'], { height: 90, size: 52 }), left: 0, top: 2160 },
    { input: textSvg(['A comforting, print-ready keepsake from one favorite photo.'], { height: 80, size: 29, color: muted, weight: 500 }), left: 0, top: 2250 },
    { input: label('MEMORIAL DESIGNS', 340, '#D78B45', 'white'), left: 475, top: 2460 },
  ]).png().toFile(resolve(screenshotDir, '03-memorial-keepsake.png'));
}

async function screenshotFour() {
  const christmas = await roundedImage(paths.christmas, 1050, 1330, 58);
  const canvas = await baseCanvas('#F3F7F2');
  await canvas.composite([
    { input: brand(), left: 445, top: 112 },
    { input: textSvg(['Make every', 'celebration theirs.'], { height: 280, size: 88 }), left: 0, top: 305 },
    { input: textSvg(['Birthdays, holidays, weddings, and more.'], { height: 90, size: 34, color: muted, weight: 500 }), left: 0, top: 575 },
    { input: christmas, left: 120, top: 735 },
    { input: textSvg(['Christmas Card'], { height: 90, size: 52 }), left: 0, top: 2160 },
    { input: textSvg(['Save it, share it, or turn it into a personalized gift.'], { height: 80, size: 29, color: muted, weight: 500 }), left: 0, top: 2250 },
    { input: label('SEASONAL DESIGNS', 350, '#2E7D56', 'white'), left: 470, top: 2460 },
  ]).png().toFile(resolve(screenshotDir, '04-seasonal-card.png'));
}

async function screenshotFive() {
  const royal = await roundedImage(paths.royal, 330, 420, 34);
  const memorial = await roundedImage(paths.memorial, 330, 420, 34);
  const christmas = await roundedImage(paths.christmas, 330, 420, 34);
  const tier = (title, subtitle, price, featured = false) => svg(1050, 184,
    `<rect x="2" y="2" width="1046" height="180" rx="34" fill="white" stroke="${featured ? orange : '#E8E1DC'}" stroke-width="${featured ? 5 : 2}"/>` +
    (featured ? `<rect x="710" y="-1" width="230" height="40" rx="20" fill="${orange}"/><text x="825" y="28" text-anchor="middle" font-family="Arial" font-size="18" font-weight="800" fill="white">MOST POPULAR</text>` : '') +
    `<text x="48" y="76" font-family="Arial" font-size="40" font-weight="800" fill="${ink}">${escapeXml(title)}</text>` +
    `<text x="48" y="128" font-family="Arial" font-size="26" font-weight="500" fill="${muted}">${escapeXml(subtitle)}</text>` +
    `<text x="990" y="105" text-anchor="end" font-family="Arial" font-size="46" font-weight="800" fill="${orange}">${escapeXml(price)}</text>`,
  );
  const canvas = await baseCanvas('#FFF7F2');
  await canvas.composite([
    { input: brand(), left: 445, top: 112 },
    { input: textSvg(['Try free.', 'Keep creating anytime.'], { height: 280, size: 84 }), left: 0, top: 295 },
    { input: textSvg(['One-time packs. No subscription. Credits never expire.'], { height: 90, size: 31, color: muted, weight: 500 }), left: 0, top: 555 },
    { input: royal, left: 90, top: 705 },
    { input: memorial, left: 480, top: 705 },
    { input: christmas, left: 870, top: 705 },
    { input: tier('10 Portraits', 'A small pack for one special moment', '$0.99'), left: 120, top: 1260 },
    { input: tier('30 Portraits', 'Try more occasions and choose favorites', '$1.99', true), left: 120, top: 1485 },
    { input: tier('60 Portraits', 'The best value for every celebration', '$2.99'), left: 120, top: 1710 },
    { input: label('1 FREE PREVIEW', 300, ink, 'white'), left: 495, top: 2110 },
    { input: textSvg(['Create something worth keeping.'], { height: 100, size: 48 }), left: 0, top: 2300 },
  ]).png().toFile(resolve(screenshotDir, '05-simple-pricing.png'));
}

await Promise.all([
  screenshotOne(),
  screenshotTwo(),
  screenshotThree(),
  screenshotFour(),
  screenshotFive(),
]);

const screenshots = [
  '01-one-photo-keepsake.png',
  '02-royal-portrait.png',
  '03-memorial-keepsake.png',
  '04-seasonal-card.png',
  '05-simple-pricing.png',
];
for (const [index, filename] of screenshots.entries()) {
  await sharp(resolve(screenshotDir, filename))
    .resize(1080, 1920, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(resolve(videoSlideDir, `${String(index + 1).padStart(2, '0')}.jpg`));
}

const featureBackground = svg(1024, 500,
  '<defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#FF6B35"/><stop offset="1" stop-color="#FFB18F"/></linearGradient></defs>' +
  '<rect width="1024" height="500" fill="url(#g)"/>' +
  '<text x="60" y="190" font-family="Arial" font-size="58" font-weight="900" fill="white">Their story.</text>' +
  '<text x="60" y="260" font-family="Arial" font-size="58" font-weight="900" fill="white">Your keepsake.</text>' +
  '<text x="60" y="320" font-family="Arial" font-size="24" font-weight="600" fill="#FFF7F2">24 meaningful pet portrait designs</text>',
);
const royalFeature = await roundedImage(paths.royal, 370, 370, 52);
await sharp(featureBackground)
  .composite([{ input: royalFeature, left: 620, top: 65 }])
  .png()
  .toFile(resolve(outputDir, 'google-play-feature-1024x500.png'));

console.log(`Generated ${screenshots.length} screenshots and video slides in ${outputDir}`);
