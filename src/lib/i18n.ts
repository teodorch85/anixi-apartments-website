export type Lang = 'en' | 'el';
export const LANGS: Lang[] = ['en', 'el'];

/** A text stored in both languages. If one language is empty, the other one is shown. */
export type T = { en: string; el: string };

export function t(value: T | string | undefined, lang: Lang): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const other: Lang = lang === 'el' ? 'en' : 'el';
  return value[lang]?.trim() ? value[lang] : (value[other] ?? '');
}

/** '/about/' -> '/el/about/' for Greek. */
export function href(path: string, lang: Lang): string {
  const p = path.startsWith('/') ? path : '/' + path;
  return lang === 'el' ? '/el' + p : p;
}

/** Fixed interface words (menu, buttons). Page texts live in src/data and are edited in the CMS. */
export const UI = {
  home: { en: 'Home', el: 'Αρχική' },
  rooms: { en: 'Rooms', el: 'Δωμάτια' },
  upTo2: { en: 'Up to two persons', el: 'Έως δύο άτομα' },
  upTo3: { en: 'Up to three persons', el: 'Έως τρία άτομα' },
  upTo4: { en: 'Up to four persons', el: 'Έως τέσσερα άτομα' },
  about: { en: 'About Us', el: 'Σχετικά' },
  gallery: { en: 'Gallery', el: 'Φωτογραφίες' },
  services: { en: 'Services', el: 'Υπηρεσίες' },
  pool: { en: 'Swimming Pool', el: 'Πισίνα' },
  restaurant: { en: 'Restaurant & Pool Bar', el: 'Εστιατόριο & Pool Bar' },
  prices: { en: 'Prices', el: 'Τιμές' },
  offers: { en: 'Offers', el: 'Προσφορές' },
  contact: { en: 'Contact Us', el: 'Επικοινωνία' },
  location: { en: 'Location', el: 'Τοποθεσία' },
  distances: { en: 'Distances', el: 'Αποστάσεις' },
  directions: { en: 'Directions in Google Maps', el: 'Οδηγίες στο Google Maps' },
  openInMaps: { en: 'Open in Google Maps', el: 'Άνοιγμα στο Google Maps' },
  book: { en: 'Book Now', el: 'Κράτηση' },
  menu: { en: 'Menu', el: 'Μενού' },
  allRooms: { en: 'All rooms', el: 'Όλα τα δωμάτια' },
  viewDetails: { en: 'View details', el: 'Λεπτομέρειες' },
  upToGuests: { en: 'Up to {n} guests', el: 'Έως {n} άτομα' },
  amenities: { en: 'Amenities', el: 'Παροχές' },
  renovated: { en: 'Renovated', el: 'Ανακαινισμένο' },
  photos: { en: 'Photos', el: 'Φωτογραφίες' },
  allPhotos: { en: 'All photos', el: 'Όλες' },
  bookDirect: { en: 'Book directly with us', el: 'Κάντε κράτηση απευθείας' },
  bookDirectText: {
    en: 'No booking engines, no commissions – contact the owners directly by phone or e-mail with your dates and number of guests.',
    el: 'Χωρίς μεσάζοντες και προμήθειες – επικοινωνήστε απευθείας μαζί μας τηλεφωνικά ή με e-mail, με τις ημερομηνίες και τον αριθμό ατόμων.',
  },
  callUs: { en: 'Call us', el: 'Τηλεφωνήστε μας' },
  call: { en: 'Call', el: 'Κλήση' },
  availability: { en: 'Availability', el: 'Διαθεσιμότητα' },
  emailUs: { en: 'E-mail us', el: 'Στείλτε e-mail' },
  address: { en: 'Address', el: 'Διεύθυνση' },
  phone: { en: 'Phone', el: 'Τηλέφωνο' },
  email: { en: 'E-mail', el: 'E-mail' },
  name: { en: 'Name', el: 'Όνομα' },
  message: { en: 'Message', el: 'Μήνυμα' },
  arrival: { en: 'Arrival', el: 'Άφιξη' },
  departure: { en: 'Departure', el: 'Αναχώρηση' },
  formNote: {
    en: 'Pressing “Send” opens your e-mail app with the message ready to send.',
    el: 'Πατώντας «Αποστολή» ανοίγει η εφαρμογή e-mail σας με το μήνυμα έτοιμο.',
  },
  enquirySubject: { en: 'Website enquiry', el: 'Ερώτηση από την ιστοσελίδα' },
  checkAvailability: { en: 'Check availability', el: 'Ζητήστε διαθεσιμότητα' },
  reqText: {
    en: 'Tell us your dates and number of guests and we will reply with availability. For any other question, just write your message.',
    el: 'Γράψτε μας ημερομηνίες και αριθμό ατόμων και θα σας απαντήσουμε για τη διαθεσιμότητα. Για οποιαδήποτε άλλη ερώτηση, γράψτε απλώς το μήνυμά σας.',
  },
  adults: { en: 'Adults', el: 'Ενήλικες' },
  children: { en: 'Children', el: 'Παιδιά' },
  roomPref: { en: 'Room', el: 'Δωμάτιο' },
  anyRoom: { en: 'Any room', el: 'Οποιοδήποτε' },
  phoneOptional: { en: 'Phone (optional)', el: 'Τηλέφωνο (προαιρετικό)' },
  reqSend: { en: 'Send request', el: 'Αποστολή αιτήματος' },
  reqSending: { en: 'Sending…', el: 'Αποστολή…' },
  reqSent: {
    en: 'Thank you! Your request has been sent. We will reply to your e-mail as soon as possible.',
    el: 'Ευχαριστούμε! Το αίτημά σας στάλθηκε. Θα σας απαντήσουμε στο e-mail σας το συντομότερο.',
  },
  reqError: {
    en: 'Sorry, the request could not be sent. Please e-mail us directly:',
    el: 'Δυστυχώς το αίτημα δεν στάλθηκε. Στείλτε μας απευθείας e-mail:',
  },
  reqDatesInvalid: { en: 'Please choose a departure date after the arrival date.', el: 'Επιλέξτε ημερομηνία αναχώρησης μετά την άφιξη.' },
  reqNights: { en: '{n} night(s)', el: '{n} διανυκτέρευση/εις' },
  reqSubject: { en: 'Availability request', el: 'Αίτημα διαθεσιμότητας' },
  reqNote: {
    en: 'This is a request, not a booking – nothing is charged. We will confirm availability by e-mail.',
    el: 'Είναι αίτημα, όχι κράτηση – δεν γίνεται καμία χρέωση. Θα σας επιβεβαιώσουμε τη διαθεσιμότητα με e-mail.',
  },
  period: { en: 'Period', el: 'Περίοδος' },
  otherRooms: { en: 'Other rooms', el: 'Άλλα δωμάτια' },
  foodReviews: { en: 'What our guests say about the food', el: 'Τι λένε οι επισκέπτες για την κουζίνα μας' },
  readReviews: { en: 'Read more reviews on', el: 'Περισσότερες κριτικές στο' },
  rights: { en: 'All Rights Reserved.', el: 'Με επιφύλαξη παντός δικαιώματος.' },
  privacy: { en: 'Privacy Policy', el: 'Πολιτική απορρήτου' },
  notFound: { en: 'Page not found', el: 'Η σελίδα δεν βρέθηκε' },
  notFoundText: { en: 'The page you are looking for does not exist.', el: 'Η σελίδα που ψάχνετε δεν υπάρχει.' },
  backHome: { en: 'Back to the home page', el: 'Επιστροφή στην αρχική' },
  close: { en: 'Close', el: 'Κλείσιμο' },
  prev: { en: 'Previous', el: 'Προηγούμενο' },
  next: { en: 'Next', el: 'Επόμενο' },
} satisfies Record<string, T>;

export function ui(key: keyof typeof UI, lang: Lang, vars: Record<string, string | number> = {}): string {
  let s = UI[key][lang];
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
