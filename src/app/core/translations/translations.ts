export interface NavTranslations {
  about: string;
  opinions: string;
  location: string;
  gallery: string;
  contact: string;
  book: string;
  home: string;
}

export interface HeroTranslations {
  title: string;
  subtitle: string;
  tagline: string;
  cta: string;
  scroll: string;
}

export interface AboutTranslations {
  subtitle: string;
  title: string;
  text1: string;
  text2: string;
  cta: string;
  galleryTitle: string;
  gallerySubtitle: string;
  close: string;
  photoGallery: PhotoGallery;
}

export interface PhotoGallery {
  see: string,
  seeFullGallery: string
}

export interface OpinionItem {
  author: string;
  date: string;
  text: string;
}

export interface OpinionsTranslations {
  subtitle: string;
  title: string;
  ratingLabel: string;
  reviewsCount: string;
  cta: string;
  list: OpinionItem[];
}

export interface LocationTranslations {
  subtitle: string;
  title: string;
  description: string;
  gps: string;
  distance: string;
  attractions: string;
}

export interface FooterTranslations {
  tagline: string;
  contact: string;
  socials: string;
  rights: string;
}

export interface GalleryLabels {
  bonfire: string;
  relax: string;
  location: string;
  pitches: string;
  winter: string;
  park: string;
  silence: string;
  climate: string;
  nature: string;
  integration: string;
  comfort: string;
  evenings: string;
  lake: string;
  standard: string;
  facilities: string;
  sanitary: string;
  caravaning: string;
  space: string;
  winterBonfire: string;
  main: string;
}

export interface GalleryTranslations {
  titles: GalleryLabels;
  alts: GalleryLabels;
}

export interface ValidationTranslations {
  pitchRequired: string;
  checkinRequired: string;
  checkoutRequired: string;
  requiredField: string;
  invalidEmail: string;
  invalidPhoneNumber: string;
}

export interface RulesPopupTranslations {
  title: string;
  body: string;
  close: string;
}

export interface PluralForms {
  one: string;
  few: string;
  many: string;
}

export interface ReservationTranslations {
  eyebrow: string;
  pageTitle: string;
  startDesc: string;
  startBtn: string;
  pitchTypesTitle: string;
  fromPrice: string;
  perNight: string;
  currency: string;
  mapTitle: string;
  mapZoom: string;
  mapHint: string;
  mapAlt: string;
  close: string;
  steps: { stay: string; guest: string; confirm: string };
  stepLabel: string;
  stepOf: string;
  nextLabel: string;
  datesTitle: string;
  datesHintStart: string;
  datesHintEnd: string;
  prevMonth: string;
  nextMonth: string;
  legendStay: string;
  legendFull: string;
  datesField: string;
  datesPlaceholder: string;
  change: string;
  showFreePitches: string;
  pitchesTitle: string;
  pitchesTitleShort: string;
  freeCountLabel: string;
  freeCountOf: string;
  filterAll: string;
  filterLabel: string;
  pitchLabel: string;
  showAllPitches: string;
  takenInRange: string;
  noFreePitches: string;
  noFreeDays: string;
  seeOnMap: string;
  mapShort: string;
  selectPitchHint: string;
  summaryTitle: string;
  checkin: string;
  checkout: string;
  pitch: string;
  term: string;
  nightsLabel: string;
  estimatedPrice: string;
  paymentInfo: string;
  nights: PluralForms;
  guestTitle: string;
  guestDesc: string;
  firstname: string;
  lastname: string;
  email: string;
  areaCode: string;
  phone: string;
  registration: string;
  registrationPlaceholder: string;
  consentPrefix: string;
  consentRules: string;
  consentAnd: string;
  consentPrivacy: string;
  backBtn: string;
  nextBtn: string;
  nextToGuest: string;
  sendBtn: string;
  retryBtn: string;
  sending: string;
  sentTitle: string;
  sentPrefix: string;
  sentSuffix: string;
  sentSpam: string;
  resendBtn: string;
  resendIn: string;
  fixEmail: string;
  verifyLoading: string;
  verifySuccessTitle: string;
  verifySuccessDesc: string;
  validation: ValidationTranslations;
  rulesPopup: RulesPopupTranslations;
}

export interface ErrorTranslations {
  serverError: string;
  loading: string;
  reservationError1: string,
  reservationError2: string,

}

export interface TranslationSchema {
  nav: NavTranslations;
  hero: HeroTranslations;
  about: AboutTranslations;
  opinions: OpinionsTranslations;
  location: LocationTranslations;
  footer: FooterTranslations;
  gallery: GalleryTranslations;
  reservation: ReservationTranslations;
  error: ErrorTranslations;
}

export const TRANSLATIONS: Record<'pl' | 'en', TranslationSchema> = {
  pl: {
    nav: {
      about: 'O NAS',
      opinions: 'OPINIE',
      location: 'DOJAZD',
      gallery: 'GALERIA',
      contact: 'KONTAKT',
      book: 'ZAREZERWUJ',
      home: 'STRONA GŁÓWNA',
    },
    hero: {
      title: 'Camper Park',
      subtitle: 'Stary Folwark',
      tagline:
        'Twój wymarzony przystanek na Suwalszczyźnie. Odpocznij nad jeziorem Wigry w sercu natury.',
      cta: 'ODKRYJ STARY FOLWARK',
      scroll: 'PRZEWIŃ',
    },
    about: {
      subtitle: 'POZNAJ NASZ CAMPING',
      title: 'Komfortowy caravaning nad Jeziorem Wigry',
      text1:
        'Camper Park Stary Folwark to nowoczesne pole kamperowe stworzone z pasji do podróżowania. Nasza lokalizacja w otulinie Wigierskiego Parku Narodowego sprawia, że jesteśmy idealną bazą wypadową dla osób szukających ciszy, spokoju i bezpośredniego kontaktu z przyrodą Suwalszczyzny.',
      text2:
        'Oferujemy przestronne, utwardzone parcele dla kamperów i przyczep z pełnym dostępem do prądu. Nasz obiekt to nie tylko nocleg, to profesjonalne zaplecze sanitarne, strefa relaksu i miejsce, gdzie każdy pasjonat caravaningu poczuje się jak w domu.',
      cta: 'ZOBACZ PEŁNĄ GALERIĘ',
      galleryTitle: 'Galeria Stary Folwark',
      gallerySubtitle: 'Każde zdjęcie to inna historia',
      close: 'ZAMKNIJ',
      photoGallery: {
        see: 'Zobacz',
        seeFullGallery: 'Zobacz całą galerię',
      },
    },
    opinions: {
      subtitle: 'OPINIE NASZYCH GOŚCI',
      title: 'Dlaczego warto wybrać nasz camping?',
      ratingLabel: 'Średnia ocena 4.9 na 5 gwiazdek na podstawie ponad 120 opinii w Google',
      reviewsCount: '(120+ opinii Google)',
      cta: 'PRZECZYTAJ WSZYSTKIE OPINIE',
      list: [
        {
          author: 'Majid Ershad',
          date: '6 miesięcy temu',
          text: 'Absolutnie uwielbialiśmy nasz pobyt! Lokalizacja jest zachwycająca – cicha, spokojna i otoczona naturą. Widok na jezioro jest naprawdę wyjątkowy. Toalety i prysznice są pięknie zaprojektowane i nieskazitelnie czyste, a parking ma idealną wielkość i jest bardzo wygodny. Dziękujemy za tak relaksujące i niezapomniane wrażenia!',
        },
        {
          author: 'Mariusz Adams',
          date: '4 tygodnie temu',
          text: 'Co tu dużo mówić trzeba tu być, słowami nie da się tego opisać PRZEPIĘKNIE miejsce, sanitariat, obsługa, właścicielka po prostu MAGIA, Dziękujemy i pozdrawiamy',
        },
        {
          author: 'Bernhard Kils',
          date: '6 miesięcy temu',
          text: 'Piękny kemping tuż nad jeziorem! Wszystko na najwyższym poziomie! Doskonałe zaplecze sanitarne ze wszystkim, czego potrzebujesz. Bardzo przyjazny i pomocny właściciel! Gorąco polecam!',
        },
      ],
    },
    location: {
      subtitle: 'LOKALIZACJA I DOJAZD',
      title: 'Gdzie znajduje się nasz Camper Park?',
      description: 'Serce Wigierskiego Parku Narodowego',
      gps: 'Współrzędne GPS',
      distance: 'Odległość',
      attractions: 'Atrakcje w pobliżu',
    },
    footer: {
      tagline:
        'Twoja oaza spokoju nad jeziorem Wigry. Nowoczesne pole kamperowe z tradycyjną podlaską gościnnością.',
      contact: 'KONTAKT I ADRES',
      socials: 'OBSERWUJ NAS',
      rights: 'Camper Park Stary Folwark - Camping nad Wigrami. Wszelkie prawa zastrzeżone.',
    },
    gallery: {
      titles: {
        bonfire: 'Wspólne Ogniska',
        relax: 'Relaks',
        location: 'Lokalizacja',
        pitches: 'Nasze Parcele',
        winter: 'Zimowa Atmosfera',
        park: 'Nasz Park',
        silence: 'Strefa ciszy',
        climate: 'Klimat',
        nature: 'Natura',
        integration: 'Integracja',
        comfort: 'Komfort',
        evenings: 'Wieczory',
        lake: 'Widok Na Jezioro',
        standard: 'Standard',
        facilities: 'Udogodnienia',
        sanitary: 'Sanitariaty',
        caravaning: 'Caravaning',
        space: 'Przestrzeń',
        winterBonfire: 'Zimowy klimat',
        main: 'Stary Folwark',
      },
      alts: {
        bonfire: 'Wieczorne ognisko',
        relax: 'Relaks na leżaku',
        location: 'Camper Park z lotu ptaka',
        pitches: 'Przestronne parcele',
        winter: 'Las w zimowej szacie',
        park: 'Widok panoramiczny na park',
        silence: 'Relaks na hamaku',
        climate: 'Wieczorna atmosfera',
        nature: 'Przyroda Suwalszczyzny',
        integration: 'Wspólne biesiadowanie',
        comfort: 'Twoje miejsce na ziemi',
        evenings: 'Wieczór na campingu',
        lake: 'Jezioro Wigry o poranku',
        standard: 'Nowoczesne łazienki',
        facilities: 'Czystość i komfort w łazienkach',
        sanitary: 'Zaplecze sanitarne',
        caravaning: 'Nasze parcele z bliska',
        space: 'Plan pola z drona',
        winterBonfire: 'Ognisko w zimowej scenerii',
        main: 'Widok główny na Stary Folwark',
      },
    },
    reservation: {
      eyebrow: 'REZERWACJA ONLINE',
      pageTitle: 'Zarezerwuj parcelę',
      startDesc:
        'Wybierz termin, a pokażemy wolne w nim parcele. Potem podaj dane kontaktowe i potwierdź rezerwację linkiem z maila. Online nic nie płacisz.',
      startBtn: 'Rozpocznij rezerwację',
      pitchTypesTitle: 'Rodzaje parcel',
      fromPrice: 'od',
      perNight: '/ doba',
      currency: 'zł',
      mapTitle: 'Mapa kempingu',
      mapZoom: 'Powiększ mapę',
      mapHint: 'Kliknij mapę, żeby zobaczyć ją w pełnym rozmiarze z legendą.',
      mapAlt: 'Mapa Camper Park Stary Folwark z numerami parcel, recepcją, sanitariatami i wjazdem',
      close: 'Zamknij',
      steps: { stay: 'Termin i parcela', guest: 'Twoje dane', confirm: 'Potwierdzenie' },
      stepLabel: 'Krok',
      stepOf: 'z',
      nextLabel: 'Dalej:',
      datesTitle: 'Kiedy przyjeżdżasz?',
      datesHintStart: 'Wybierz dzień przyjazdu',
      datesHintEnd: 'Teraz wybierz dzień wyjazdu',
      prevMonth: 'Poprzedni miesiąc',
      nextMonth: 'Następny miesiąc',
      legendStay: 'Twój pobyt',
      legendFull: 'Brak wolnych parcel',
      datesField: 'Termin pobytu',
      datesPlaceholder: 'Wybierz termin',
      change: 'Zmień',
      showFreePitches: 'Pokaż wolne parcele',
      pitchesTitle: 'Wolne parcele w tym terminie',
      pitchesTitleShort: 'Wolne parcele',
      freeCountLabel: 'Wolnych parcel:',
      freeCountOf: 'z',
      filterAll: 'Wszystkie',
      filterLabel: 'Rodzaj parceli',
      pitchLabel: 'Parcela',
      showAllPitches: 'Pokaż wszystkie',
      takenInRange: 'Zajęte w tym terminie:',
      noFreePitches: 'W tym terminie nie ma wolnych parcel. Wybierz inny termin.',
      noFreeDays: 'Nie udało się wczytać dostępności parcel.',
      seeOnMap: 'Zobacz położenie na mapie',
      mapShort: 'Mapa',
      selectPitchHint: 'Wybierz parcelę, aby przejść dalej',
      summaryTitle: 'Twoja rezerwacja',
      checkin: 'Przyjazd',
      checkout: 'Wyjazd',
      pitch: 'Parcela',
      term: 'Termin',
      nightsLabel: 'Liczba nocy',
      estimatedPrice: 'Szacowana cena',
      paymentInfo: 'Online nic nie płacisz. Opłatę pobieramy na miejscu, w recepcji.',
      nights: { one: 'noc', few: 'noce', many: 'nocy' },
      guestTitle: 'Twoje dane',
      guestDesc: 'Na podany email wyślemy link do potwierdzenia rezerwacji.',
      firstname: 'Imię',
      lastname: 'Nazwisko',
      email: 'Email',
      areaCode: 'Kierunkowy',
      phone: 'Telefon',
      registration: 'Numer rejestracyjny',
      registrationPlaceholder: 'np. BSU 12345',
      consentPrefix: 'Wysyłając rezerwację, akceptujesz',
      consentRules: 'regulamin kempingu',
      consentAnd: 'i',
      consentPrivacy: 'politykę prywatności',
      backBtn: 'Wstecz',
      nextBtn: 'Dalej',
      nextToGuest: 'Dalej: Twoje dane',
      sendBtn: 'Wyślij rezerwację',
      retryBtn: 'Spróbuj ponownie',
      sending: 'Wysyłamy rezerwację…',
      sentTitle: 'Sprawdź swoją skrzynkę',
      sentPrefix: 'Wysłaliśmy link potwierdzający na',
      sentSuffix: 'Kliknij go, a rezerwacja zostanie zapisana.',
      sentSpam: 'Nie widzisz maila? Sprawdź folder spam.',
      resendBtn: 'Wyślij ponownie',
      resendIn: 'Wyślij ponownie za',
      fixEmail: 'Popraw adres email',
      verifyLoading: 'Potwierdzamy rezerwację…',
      verifySuccessTitle: 'Rezerwacja potwierdzona',
      verifySuccessDesc: 'Wszystko gotowe. Nie możemy się doczekać Twojego przyjazdu!',
      validation: {
        pitchRequired: 'Wybór parceli jest wymagany',
        checkinRequired: 'Wybierz datę przyjazdu',
        checkoutRequired: 'Wybierz datę wyjazdu',
        requiredField: 'To pole jest wymagane',
        invalidEmail: 'Podaj poprawny adres email, np. jan@example.com',
        invalidPhoneNumber: 'Podaj poprawny numer telefonu',
      },
      rulesPopup: {
        title: 'Regulamin',
        body: 'Treść regulaminu prywatności oraz regulaminu firmy zostanie uzupełniona.',
        close: 'Zamknij',
      },
    },
    error: {
      serverError: 'Wystąpił błąd, spróbuj ponownie później',
      loading: 'Ładowanie...',
      reservationError1: 'Wystąpił błąd',
      reservationError2:
        'W tej chwili nie jesteśmy w stanie przetworzyć tego żądania, jeżeli problem nie ustąpi zadzwoń do nas bezpośrednio!',
    },
  },
  en: {
    nav: {
      about: 'ABOUT US',
      opinions: 'REVIEWS',
      location: 'LOCATION',
      gallery: 'GALLERY',
      contact: 'CONTACT',
      book: 'BOOK NOW',
      home: 'HOME',
    },
    hero: {
      title: 'Camper Park',
      subtitle: 'Stary Folwark',
      tagline: 'Your dream stopover in Suwalszczyzna. Relax by Lake Wigry in the heart of nature.',
      cta: 'DISCOVER STARY FOLWARK',
      scroll: 'SCROLL',
    },
    about: {
      subtitle: 'DISCOVER OUR CAMPING',
      title: 'Comfortable Caravanning by Lake Wigry',
      text1:
        'Camper Park Stary Folwark is a modern camper site created out of passion for travel. Our location in the buffer zone of the Wigry National Park makes us an ideal base for those seeking silence, peace, and direct contact with the nature of Suwalszczyzna.',
      text2:
        'We offer spacious, hardened pitches for campers and trailers with full access to electricity. Our facility is not just a place to stay; it is professional sanitary facilities, a relaxation zone, and a place where every caravanning enthusiast will feel at home.',
      cta: 'SEE FULL GALLERY',
      galleryTitle: 'Stary Folwark Gallery',
      gallerySubtitle: 'Every photo tells a different story',
      close: 'CLOSE',
      photoGallery: {
        see: 'see',
        seeFullGallery: 'See full gallery',
      },
    },
    opinions: {
      subtitle: 'GUEST REVIEWS',
      title: 'Why choose our camping?',
      ratingLabel: 'Average rating 4.9 out of 5 stars based on over 120 Google reviews',
      reviewsCount: '(120+ Google reviews)',
      cta: 'READ ALL REVIEWS',
      list: [
        {
          author: 'Majid Ershad',
          date: '6 months ago',
          text: 'We absolutely loved our stay here! The location is stunning — quiet, peaceful, and surrounded by nature. The lake view is truly one of a kind. The toilets and showers are beautifully designed and spotless, and the parking area is just the right size and very convenient. Thank you for such a relaxing and unforgettable experience!',
        },
        {
          author: 'Mariusz Adams',
          date: '4 weeks ago',
          text: 'What more can I say, you have to be here, words cannot express it. BEAUTIFUL place, toilets, service, owner - simply MAGIC. Thank you and best regards.',
        },
        {
          author: 'Bernhard Kils',
          date: '6 months ago',
          text: 'A beautiful campsite right on the lake! Everything is top-notch! Excellent sanitary facilities with everything you need. Very friendly and helpful owner! Highly recommended!',
        },
      ],
    },
    location: {
      subtitle: 'LOCATION & DIRECTIONS',
      title: 'Where is our Camper Park located?',
      description: 'The heart of Wigry National Park',
      gps: 'GPS Coordinates',
      distance: 'Distance',
      attractions: 'Nearby Attractions',
    },
    footer: {
      tagline:
        'Your oasis of peace by Lake Wigry. A modern camper site with traditional Podlasie hospitality.',
      contact: 'CONTACT & ADDRESS',
      socials: 'FOLLOW US',
      rights: 'Camper Park Stary Folwark. All rights reserved.',
    },
    gallery: {
      titles: {
        bonfire: 'Common Bonfires',
        relax: 'Relaxation',
        location: 'Location',
        pitches: 'Our Pitches',
        winter: 'Winter Atmosphere',
        park: 'Our Park',
        silence: 'Silence Zone',
        climate: 'Climate',
        nature: 'Nature',
        integration: 'Integration',
        comfort: 'Comfort',
        evenings: 'Evenings',
        lake: 'Lake View',
        standard: 'Standard',
        facilities: 'Facilities',
        sanitary: 'Sanitary',
        caravaning: 'Caravanning',
        space: 'Space',
        winterBonfire: 'Winter Vibe',
        main: 'Stary Folwark',
      },
      alts: {
        bonfire: 'Evening bonfire',
        relax: 'Relaxing on a sunbed',
        location: "Camper Park from a bird's eye view",
        pitches: 'Spacious pitches',
        winter: 'Forest in winter scenery',
        park: 'Panoramic view of the park',
        silence: 'Relaxing on a hammock',
        climate: 'Evening atmosphere',
        nature: 'Nature of Suwalszczyzna',
        integration: 'Dining together',
        comfort: 'Your place on earth',
        evenings: 'Evening at the campsite',
        lake: 'Lake Wigry in the morning',
        standard: 'Modern bathrooms',
        facilities: 'Cleanliness and comfort in bathrooms',
        sanitary: 'Sanitary facilities',
        caravaning: 'Our pitches up close',
        space: 'Pitch plan from a drone',
        winterBonfire: 'Bonfire in winter scenery',
        main: 'Main view of Stary Folwark',
      },
    },
    reservation: {
      eyebrow: 'ONLINE BOOKING',
      pageTitle: 'Book a pitch',
      startDesc:
        "Pick your dates and we'll show the pitches free at that time. Then enter your contact details and confirm the booking with the link we email you. You pay nothing online.",
      startBtn: 'Start booking',
      pitchTypesTitle: 'Pitch types',
      fromPrice: 'from',
      perNight: '/ night',
      currency: 'PLN',
      mapTitle: 'Campsite map',
      mapZoom: 'Enlarge map',
      mapHint: 'Click the map to see it full size with the legend.',
      mapAlt: 'Map of Camper Park Stary Folwark with pitch numbers, reception, sanitary facilities and the entrance',
      close: 'Close',
      steps: { stay: 'Dates and pitch', guest: 'Your details', confirm: 'Confirmation' },
      stepLabel: 'Step',
      stepOf: 'of',
      nextLabel: 'Next:',
      datesTitle: 'When are you arriving?',
      datesHintStart: 'Pick your arrival day',
      datesHintEnd: 'Now pick your departure day',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
      legendStay: 'Your stay',
      legendFull: 'No free pitches',
      datesField: 'Dates of stay',
      datesPlaceholder: 'Pick dates',
      change: 'Change',
      showFreePitches: 'Show free pitches',
      pitchesTitle: 'Pitches free on these dates',
      pitchesTitleShort: 'Free pitches',
      freeCountLabel: 'Free pitches:',
      freeCountOf: 'of',
      filterAll: 'All',
      filterLabel: 'Pitch type',
      pitchLabel: 'Pitch',
      showAllPitches: 'Show all',
      takenInRange: 'Taken on these dates:',
      noFreePitches: 'There are no free pitches on these dates. Pick other dates.',
      noFreeDays: 'Could not load pitch availability.',
      seeOnMap: 'See locations on the map',
      mapShort: 'Map',
      selectPitchHint: 'Pick a pitch to continue',
      summaryTitle: 'Your booking',
      checkin: 'Arrival',
      checkout: 'Departure',
      pitch: 'Pitch',
      term: 'Dates',
      nightsLabel: 'Nights',
      estimatedPrice: 'Estimated price',
      paymentInfo: 'You pay nothing online. Payment is taken on site, at reception.',
      nights: { one: 'night', few: 'nights', many: 'nights' },
      guestTitle: 'Your details',
      guestDesc: "We'll send a link to confirm the booking to this email.",
      firstname: 'First name',
      lastname: 'Last name',
      email: 'Email',
      areaCode: 'Code',
      phone: 'Phone',
      registration: 'Licence plate',
      registrationPlaceholder: 'e.g. BSU 12345',
      consentPrefix: 'By sending the booking you accept the',
      consentRules: 'campsite rules',
      consentAnd: 'and',
      consentPrivacy: 'privacy policy',
      backBtn: 'Back',
      nextBtn: 'Next',
      nextToGuest: 'Next: Your details',
      sendBtn: 'Send booking',
      retryBtn: 'Try again',
      sending: 'Sending your booking…',
      sentTitle: 'Check your inbox',
      sentPrefix: "We've sent a confirmation link to",
      sentSuffix: 'Click it and the booking will be saved.',
      sentSpam: "Can't see the email? Check your spam folder.",
      resendBtn: 'Resend',
      resendIn: 'Resend in',
      fixEmail: 'Correct email address',
      verifyLoading: 'Confirming your booking…',
      verifySuccessTitle: 'Booking confirmed',
      verifySuccessDesc: "All set. We can't wait for your arrival!",
      validation: {
        pitchRequired: 'Pitch selection is required',
        checkinRequired: 'Select check-in date',
        checkoutRequired: 'Select check-out date',
        requiredField: 'This field is required',
        invalidEmail: 'Enter a valid email address, e.g. jan@example.com',
        invalidPhoneNumber: 'Enter a valid phone number',
      },
      rulesPopup: {
        title: 'Rules',
        body: 'The privacy policy and campsite rules will be added here.',
        close: 'Close',
      },
    },
    error: {
      serverError: 'Unexpected error occurred, try again later',
      loading: 'Loading...',
      reservationError1: 'Unexpected error occurred',
      reservationError2:
        'Right now we are not able to process your request, if this will happen again later call us directly!',
    },
  },
};
