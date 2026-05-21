export interface Style {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  color: string;
}

export const STYLES: Style[] = [
  {
    id: 'renaissance',
    label: 'Renaissance',
    emoji: '🖼️',
    color: '#8B4513',
    prompt:
      'renaissance oil painting style, classical portrait, rich warm colors, dramatic chiaroscuro lighting, ornate gold frame, royal pet portrait, highly detailed oil on canvas, Rembrandt Caravaggio style',
  },
  {
    id: 'ukiyoe',
    label: 'Ukiyo-e',
    emoji: '🎋',
    color: '#2C5F2D',
    prompt:
      'traditional Japanese ukiyo-e woodblock print style, flat colors, bold black outlines, wave and nature patterns, Hokusai Hiroshige style, vintage Japanese art, delicate lines',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    emoji: '🤖',
    color: '#FF007F',
    prompt:
      'cyberpunk style, neon purple and blue lights, futuristic city background, glowing cybernetic details, synthwave aesthetic, dark moody atmosphere, digital art, blade runner style',
  },
  {
    id: 'popart',
    label: 'Pop Art',
    emoji: '🎨',
    color: '#FF4500',
    prompt:
      'pop art style, Andy Warhol inspired, bold saturated primary colors, halftone dot patterns, comic book style, vibrant graphic design, Lichtenstein style, screen print effect',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    emoji: '🖌️',
    color: '#87CEEB',
    prompt:
      'watercolor painting style, soft flowing brush strokes, gentle pastel colors, artistic dreamy atmosphere, handmade paper texture, delicate washes, impressionistic pet portrait',
  },
];
