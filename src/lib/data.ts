import { existsSync } from 'node:fs';
import type { T } from './i18n';
import settingsJson from '../data/settings.json';
import homeJson from '../data/home.json';
import aboutJson from '../data/about.json';
import poolJson from '../data/pool.json';
import restaurantJson from '../data/restaurant.json';
import pricesJson from '../data/prices.json';
import offersJson from '../data/offers.json';
import galleryJson from '../data/gallery.json';
import reviewsJson from '../data/reviews.json';
import privacyJson from '../data/privacy.json';
import locationJson from '../data/location.json';

export type Room = {
  slug: string;
  number: string;
  type: 'studio' | 'apartment';
  name: T;
  guests: number;
  renovated: boolean;
  amenities: string[];
  description: T;
  availability: T;
  cover: string;
  photos: string[];
  order: number;
  hidden?: boolean;
};

/** Contact details + the 'advanced' group flattened for easy use in templates. */
export const settings = { ...settingsJson, ...settingsJson.advanced };
export const home = homeJson;
export const about = aboutJson;
export const pool = poolJson;
export const restaurant = restaurantJson;
export const prices = pricesJson;
export const offers = offersJson;
export const gallery = galleryJson;
export const reviews = reviewsJson;
export const privacy = privacyJson;
export const location = locationJson;

const roomFiles = import.meta.glob<Room>('../data/rooms/*.json', { eager: true, import: 'default' });

/** A photo deleted from the media library but still listed somewhere would show as a broken image – skip it. */
const exists = (url: string) => !url?.startsWith('/media/') || existsSync('public' + decodeURI(url));

export const rooms: Room[] = Object.values(roomFiles)
  .filter((r) => !r.hidden)
  .map((r) => {
    const photos = (r.photos ?? []).filter((p) => p && exists(p));
    const cover = r.cover && exists(r.cover) ? r.cover : (photos[0] ?? '');
    return { ...r, photos, cover };
  })
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** Addresses of pages linked from several places (old WordPress "-2" addresses redirect here, see public/_redirects). */
export const PATHS = { rooms: '/accommodations/', privacy: '/privacy-policy/' } as const;

export const roomGroups = [
  { slug: 'up-to-two-persons', guests: 2, key: 'upTo2' },
  { slug: 'up-to-three-persons', guests: 3, key: 'upTo3' },
  { slug: 'up-to-four-persons', guests: 4, key: 'upTo4' },
] as const;

/** Small version of an uploaded photo, generated at build time by scripts/thumbs.mjs. */
export function thumb(url: string, width: 480 | 960 = 480): string {
  if (import.meta.env.DEV || !url || !url.startsWith('/media/') || !/\.(jpe?g|png|webp)$/i.test(url)) return url;
  return `/_img/${width}${url.replace(/\.(jpe?g|png|webp)$/i, '.webp')}`;
}

export function telHref(number: string): string {
  return 'tel:' + number.replace(/[^\d+]/g, '');
}
