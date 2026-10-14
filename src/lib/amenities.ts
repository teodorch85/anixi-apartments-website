import type { T } from './i18n';

/** Amenity keys that can be ticked per room in the editor. */
export const AMENITIES: Record<string, { icon: string; label: T }> = {
  ac: { icon: 'ac', label: { en: 'Air-conditioned', el: 'Κλιματισμός' } },
  wifi: { icon: 'wifi', label: { en: 'Free Wi-Fi', el: 'Δωρεάν Wi-Fi' } },
  sea: { icon: 'sea', label: { en: 'Sea view', el: 'Θέα θάλασσα' } },
  kitchen: { icon: 'kitchen', label: { en: 'Kitchenette', el: 'Κουζινάκι' } },
  balcony: { icon: 'balcony', label: { en: 'Balcony', el: 'Μπαλκόνι' } },
  fridge: { icon: 'fridge', label: { en: 'Fridge', el: 'Ψυγείο' } },
  tv: { icon: 'tv', label: { en: 'TV', el: 'Τηλεόραση' } },
  safe: { icon: 'safe', label: { en: 'Safety box', el: 'Θυρίδα ασφαλείας' } },
  pool: { icon: 'pool', label: { en: 'Pool view', el: 'Θέα πισίνα' } },
};

/** Hotel features on the About page. */
export const FEATURE_ICONS = ['ac', 'pool', 'wifi', 'restaurant', 'breakfast', 'bar', 'adults', 'sea', 'kitchen', 'parking', 'star'];
