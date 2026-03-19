import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar" [class.navbar--hidden]="isScrolledDown && !isMobileMenuOpen" [class.navbar--scrolled]="!isAtTop">
      <div class="container navbar__container">
        <div class="navbar__logo">
          <span>STARY FOLWARK</span>
        </div>

        <ul class="navbar__links" [class.navbar__links--active]="isMobileMenuOpen">
          <li class="navbar__item"><a (click)="scrollTo('about')" class="navbar__link">O NAS</a></li>
          <li class="navbar__item"><a (click)="scrollTo('opinions')" class="navbar__link">OPINIE</a></li>
          <li class="navbar__item"><a (click)="scrollTo('location')" class="navbar__link">DOJAZD</a></li>
          <li class="navbar__item"><a (click)="scrollTo('gallery')" class="navbar__link">GALERIA</a></li>
          <li class="navbar__item"><a (click)="scrollTo('contact')" class="navbar__link">KONTAKT</a></li>
          <li class="navbar__item navbar__item--cta">
            <button class="btn-primary" (click)="scrollTo('contact')">ZAREZERWUJ</button>
          </li>
        </ul>

        <button class="navbar__hamburger" (click)="toggleMobileMenu()" [class.navbar__hamburger--active]="isMobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="navbar-overlay" [class.navbar-overlay--active]="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
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
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  scrollTo(id: string) {
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
    
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}
