import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../../core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.navbar--hidden]="isScrolledDown && !isMobileMenuOpen" [class.navbar--scrolled]="!isAtTop" role="navigation" aria-label="Menu główne">
      <div class="container navbar__container">
        <div class="navbar__logo">
          <a (click)="scrollTo('top')" style="cursor: pointer;">STARY FOLWARK</a>
        </div>

        <ul class="navbar__links" [class.navbar__links--active]="isMobileMenuOpen" [attr.aria-expanded]="isMobileMenuOpen">
          <li class="navbar__item"><a (click)="scrollTo('about')" class="navbar__link">{{ ts.t.nav.about }}</a></li>
          <li class="navbar__item"><a (click)="scrollTo('opinions')" class="navbar__link">{{ ts.t.nav.opinions }}</a></li>
          <li class="navbar__item"><a (click)="scrollTo('location')" class="navbar__link">{{ ts.t.nav.location }}</a></li>
          <li class="navbar__item"><a (click)="scrollTo('gallery')" class="navbar__link">{{ ts.t.nav.gallery }}</a></li>
          <li class="navbar__item"><a (click)="scrollTo('contact')" class="navbar__link">{{ ts.t.nav.contact }}</a></li>
          
          <li class="navbar__item navbar__language-switcher">
            <button (click)="ts.setLanguage('pl')" [class.active]="ts.currentLang() === 'pl'">PL</button>
            <span class="divider">|</span>
            <button (click)="ts.setLanguage('en')" [class.active]="ts.currentLang() === 'en'">EN</button>
          </li>

          <li class="navbar__item navbar__item--cta">
            <button class="btn-primary" (click)="scrollTo('contact')" aria-label="Zarezerwuj miejsce">{{ ts.t.nav.book }}</button>
          </li>
        </ul>

        <button 
          class="navbar__hamburger" 
          (click)="toggleMobileMenu()" 
          [class.navbar__hamburger--active]="isMobileMenuOpen"
          [attr.aria-label]="isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'"
          [attr.aria-controls]="'navbar-links'">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="navbar-overlay" [class.navbar-overlay--active]="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  ts = inject(TranslationService);
  isScrolledDown = false;
  isAtTop = true;
  isMobileMenuOpen = false;
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    this.isAtTop = st < 50;
    
    if (Math.abs(this.lastScrollTop - st) <= 5) return;

    this.isScrolledDown = st > this.lastScrollTop && st > 80;
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
    }
  }

  scrollTo(id: string) {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}
