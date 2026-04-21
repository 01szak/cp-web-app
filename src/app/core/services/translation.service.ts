import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TRANSLATIONS } from '../translations/translations';

export type Language = 'pl' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private platformId = inject(PLATFORM_ID);
  currentLang = signal<Language>('pl');
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
        this.currentLang.set(savedLang);
      }
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }

  get t() {
    return TRANSLATIONS[this.currentLang()];
  }
}
