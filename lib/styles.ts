export type StyleCategory = 'Featured' | 'Gifts' | 'Memories' | 'Seasonal' | 'Fun' | 'Art';

export interface Style {
  id: string;
  label: string;
  emoji: string;
  description: string;
  prompt: string;
  color: string;
  category: StyleCategory;
  featured?: boolean;
}

const style = (
  id: string,
  label: string,
  emoji: string,
  description: string,
  color: string,
  category: Exclude<StyleCategory, 'Featured'>,
  featured = false,
): Style => ({ id, label, emoji, description, prompt: description, color, category, featured });

export const STYLES: Style[] = [
  style('memorial_sunrise', 'Rainbow Memory', '🌈', 'A peaceful tribute in warm sunrise light', '#D78B45', 'Memories', true),
  style('birthday', 'Birthday Star', '🎂', 'A joyful birthday portrait made to share', '#E05D7B', 'Gifts', true),
  style('christmas', 'Christmas Card', '🎄', 'A cozy holiday card with festive lights', '#2E7D56', 'Seasonal', true),
  style('royal', 'Royal Portrait', '👑', 'A grand museum-worthy royal portrait', '#8B5A2B', 'Art', true),
  style('astronaut', 'Space Explorer', '🚀', 'Your pet on a cinematic moon mission', '#5266B2', 'Fun', true),
  style('watercolor', 'Watercolor', '🖌️', 'Soft handmade washes on textured paper', '#4F91B8', 'Art', true),
  style('valentine', 'Valentine', '💝', 'An elegant portrait with flowers and soft hearts', '#C64C76', 'Gifts'),
  style('graduation', 'Graduate', '🎓', 'A proud graduation portrait for a big day', '#384C83', 'Gifts'),
  style('wedding', 'Wedding Guest', '💍', 'A luminous formal portrait with ivory flowers', '#B18C78', 'Gifts'),
  style('profile_photo', 'Profile Photo', '📸', 'A clean studio portrait for profiles and avatars', '#526D82', 'Gifts'),
  style('phone_wallpaper', 'Phone Wallpaper', '📱', 'A vertical cinematic wallpaper composition', '#7467A8', 'Gifts'),
  style('memorial_stars', 'Forever in Stars', '✨', 'A serene tribute beneath a luminous night sky', '#47578F', 'Memories'),
  style('remembrance_frame', 'Remembrance', '🤍', 'A timeless printable portrait with soft florals', '#9A8175', 'Memories'),
  style('halloween', 'Halloween', '🎃', 'A playful costume portrait with warm pumpkins', '#C65D24', 'Seasonal'),
  style('new_year', 'New Year', '🎆', 'Gold confetti and midnight celebration lights', '#B58C2B', 'Seasonal'),
  style('superhero', 'Original Hero', '🦸', 'A bold original comic-book adventure', '#D4483F', 'Fun'),
  style('chef', 'Master Chef', '🧑‍🍳', 'A polished chef portrait in a warm kitchen', '#B4573D', 'Fun'),
  style('cowboy', 'Wild West', '🤠', 'A golden-hour western movie portrait', '#9A6338', 'Fun'),
  style('cyberpunk', 'Cyberpunk', '🤖', 'Neon light in a futuristic rainy city', '#B33DA7', 'Fun'),
  style('renaissance', 'Renaissance', '🖼️', 'Classical oil paint and dramatic soft light', '#7A4931', 'Art'),
  style('storybook', 'Storybook', '📚', 'A warm hand-painted storybook illustration', '#67915F', 'Art'),
  style('pop_art', 'Pop Art', '🎨', 'Bold color and graphic print textures', '#E05432', 'Art'),
  style('ukiyoe', 'Woodblock', '🎋', 'Elegant ink contours and handmade paper', '#2F6B54', 'Art'),
  style('noir', 'Film Noir', '🎞️', 'Classic monochrome cinema with dramatic light', '#555B64', 'Art'),
];

export const FEATURED_STYLES = STYLES.filter((item) => item.featured);
export const STYLE_CATEGORIES: StyleCategory[] = ['Featured', 'Gifts', 'Memories', 'Seasonal', 'Fun', 'Art'];

export function stylesForCategory(category: StyleCategory) {
  return category === 'Featured' ? FEATURED_STYLES : STYLES.filter((item) => item.category === category);
}
