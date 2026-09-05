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

export interface WarningInfoTranslations {
  prefix: string;
  linkText: string;
  suffix: string;
  popup: RulesPopupTranslations;
}

export interface ReservationTranslations {
  introTitle: string;
  introDesc: string;
  startBtn: string;
  verificationTitle: string;
  verificationDesc: string;
  noEmailPrefix: string;
  noEmailSuffix: string;
  resendBtn: string;
  backBtn: string;
  nextBtn: string;
  sendBtn: string;
  step1Title: string;
  selectPitch: string;
  pitchPriceLabel: string;
  currency: string;
  selectDates: string;
  selectPitchFirst: string;
  disabledDatesHint: string;
  invalidDateRange: string;
  priceTooltip: string;
  suggestedPrice: string;
  step2Title: string;
  firstname: string;
  lastname: string;
  email: string;
  areaCode: string;
  phone: string;
  registration: string;
  validation: ValidationTranslations;
  warningInfo: WarningInfoTranslations;
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
        see: 'Zobcz',
        seeFullGallery: 'Zobacz całą galerie',
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
      introTitle: 'Tu możesz dokonać rezerwacji',
      introDesc:
        'Poniżej znajduje się mapa naszego obiektu. Kliknij przycisk **Przejdź do rezerwacji** aby wypełnić formularz',
      startBtn: 'Przejdź do rezerwacji',
      verificationTitle: 'Weryfikacja',
      verificationDesc:
        'Na podany adres został wysłany mail weryfikacyjny, po autoryzacji rezerwacja zostanie zapisana',
      noEmailPrefix: 'Nie dostałeś maila? Odczekaj',
      noEmailSuffix: 'sekund i spróbuj ponownie',
      resendBtn: 'Wyślij ponownie',
      backBtn: 'Cofnij',
      nextBtn: 'Kontynuuj',
      sendBtn: 'Wyślij',
      step1Title: 'Podaj parcele i czas pobytu',
      selectPitch: 'Wybierz parcele',
      pitchPriceLabel: 'cena za dobe:',
      currency: 'zł',
      selectDates: 'Wybierz termin',
      selectPitchFirst: 'Najpierw wybierz parcele',
      disabledDatesHint: 'Wyszarzona data oznacza że parcela jest niedostępna',
      invalidDateRange: 'Wybierz poprawny zakres dat',
      priceTooltip:
        'Przedstawiona cena jest tylko ceną poglądową, na poziomie rezerwacji online nie uiszczasz żadnych opłat, zostaną one pobrane dopiero na miejscu przy kasie',
      suggestedPrice: 'Sugerowana cena:',
      step2Title: 'Podaj swoje dane',
      firstname: 'Imię',
      lastname: 'Nazwisko',
      email: 'Email',
      phone: 'Numer telefonu',
      registration: 'Rejestracja',
      validation: {
        pitchRequired: 'Wybór parceli jest wymagany',
        checkinRequired: 'Wybierz datę przyjazdu',
        checkoutRequired: 'Wybierz datę wyjazdu',
        requiredField: 'To pole jest wymagane',
        invalidEmail: 'Podaj poprawny adres email',
        invalidPhoneNumber: 'Podaj poprawny numer telefonu',
      },
      areaCode: 'Numer kierunkowy',
      warningInfo: {
        prefix: "Klikając 'Wyślij' akceptujesz",
        linkText: 'regulamin prywatności oraz regulamin firmy',
        suffix: '© 2026 Camper Park Stary Folwark',
        popup: {
          title: 'Regulamin',
          body: 'Treść regulaminu prywatności oraz regulaminu firmy zostanie uzupełniona.',
          close: 'Zamknij',
        },
      },
    },
    error: {
      serverError: 'Wystąpił błąd, spróbuj ponownie później',
      loading: 'Ładowanie...',
      reservationError1: 'Wystąpił błąd',
      reservationError2:
        'W tej chwili nie jesteśmy wstanie przetworzyć tego żadania, jeżeli problem nie ustąpi zadzwoń do nas bezpośrednio!',
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
      introTitle: 'Here you can make a reservation',
      introDesc:
        'Below is a map of our campsite. Click the **Proceed to reservation** button to fill out the form',
      startBtn: 'Proceed to reservation',
      verificationTitle: 'Verification',
      verificationDesc:
        'A verification email has been sent to the address provided. The reservation will be saved after authorization',
      noEmailPrefix: "Didn't receive the email? Wait",
      noEmailSuffix: 'seconds and try again',
      resendBtn: 'Resend',
      backBtn: 'Back',
      nextBtn: 'Continue',
      sendBtn: 'Send',
      step1Title: 'Select pitch and stay duration',
      selectPitch: 'Select pitch',
      pitchPriceLabel: 'price per night:',
      currency: 'PLN',
      selectDates: 'Select dates',
      selectPitchFirst: 'First select a pitch',
      disabledDatesHint: 'Grayed out date means the pitch is occupied',
      invalidDateRange: 'Select a valid date range',
      priceTooltip:
        'The price shown is only an estimate, you do not pay anything online during reservation, payment will be collected at the reception desk',
      suggestedPrice: 'Suggested price:',
      step2Title: 'Enter your details',
      firstname: 'First name',
      lastname: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      registration: 'License plate',
      validation: {
        pitchRequired: 'Pitch selection is required',
        checkinRequired: 'Select check-in date',
        checkoutRequired: 'Select check-out date',
        requiredField: 'This field is required',
        invalidEmail: 'Provide a valid email address',
        invalidPhoneNumber: 'Provide a valid phone number.',
      },
      areaCode: 'Area code',
      warningInfo: {
        prefix: "By clicking 'Send' you accept the",
        linkText: 'privacy policy and company rules',
        suffix: '© 2026 Camper Park Stary Folwark',
        popup: {
          title: 'Rules',
          body: 'The privacy policy and company rules content will be provided here.',
          close: 'Close',
        },
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
