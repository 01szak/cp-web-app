import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoCollageComponent, CollagePhoto } from '../../../../shared/components/photo-collage/photo-collage.component';
import { BentoBoxGalleryComponent, BentoPhoto } from '../../../../shared/components/bento-box-gallery/bento-box-gallery.component';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, PhotoCollageComponent, BentoBoxGalleryComponent, RevealOnScrollDirective],
  template: `
    <div class="about" [class.content-blurred]="showFullBento">
      <div class="grid grid-2 about__header">
        <div appRevealOnScroll>
          <span class="about__subtitle">NASZA HISTORIA</span>
          <h2 class="about__title">Komfortowy wypoczynek blisko natury</h2>
        </div>
        <div appRevealOnScroll class="about__text">
          <p>Camper Park Stary Folwark to miejsce stworzone z pasji do podróżowania i miłości do Suwalszczyzny. Położony tuż nad brzegiem jeziora Wigry, oferuje idealne warunki dla miłośników caravaningu szukających spokoju i nowoczesnych udogodnień.</p>
          <p>Nasza infrastruktura obejmuje utwardzone stanowiska, przyłącza prądu i wody, a także nowoczesne zaplecze sanitarne, zapewniając standard, którego oczekuje współczesny podróżnik.</p>
        </div>
      </div>

      <div class="collage-preview">
        <app-photo-collage
          [photos]="collagePhotos"
          [showButton]="false"
          (photoClicked)="toggleGallery(true)">
        </app-photo-collage>
        <div class="about__actions" appRevealOnScroll>
          <button class="btn-show-more" (click)="toggleGallery(true)">
            ZOBACZ PEŁNĄ GALERIĘ
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Bento Gallery Overlay -->
    @if (showFullBento) {
      <div class="bento-overlay" [class.active]="showFullBento">
        <div class="bento-overlay__backdrop" (click)="toggleGallery(false)"></div>

        <div class="bento-overlay__content container">
          <div class="gallery-header">
            <div class="gallery-header__text">
              <h3 class="gallery-title">Galeria Stary Folwark</h3>
              <p class="gallery-subtitle">Każde zdjęcie to inna historia</p>
            </div>
            <button class="btn-close-gallery" (click)="toggleGallery(false)">
              <span>ZAMKNIJ</span>
              <span class="close-icon">✕</span>
            </button>
          </div>

          <div class="bento-scroll-area">
            <app-bento-box-gallery [photos]="allGalleryPhotos"></app-bento-box-gallery>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .about {
      transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s ease;

      &.content-blurred {
        filter: blur(15px) brightness(0.8);
        transform: scale(0.98);
        pointer-events: none;
      }

      &__header {
        margin-bottom: var(--spacing-xl);
        align-items: center;
      }

      &__subtitle {
        color: var(--color-accent-gold);
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 0.8rem;
        display: block;
        margin-bottom: 1rem;
      }

      &__text {
        p { margin-bottom: 1.5rem; font-size: 1.1rem; opacity: 0.9; }
      }

      &__actions {
        text-align: center;
        margin-top: 3rem;
      }
    }

    /* Fullscreen Overlay Styles */
    .bento-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      animation: fadeInOverlay 0.5s forwards cubic-bezier(0.4, 0, 0.2, 1);

      &__backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 10, 0.7);
        backdrop-filter: blur(5px);
      }

      &__content {
        position: relative;
        width: 100%;
        max-width: 1400px;
        height: 90vh;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 50px 100px rgba(0,0,0,0.4);
        padding: 2.5rem;
      }
    }

    .bento-scroll-area {
      flex: 1;
      overflow-y: auto;
      padding-right: 1rem;

      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    }

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;

      &__text { text-align: left; }
    }

    .gallery-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      margin: 0;
      color: var(--color-bg-main);
    }

    .gallery-subtitle {
      color: var(--color-accent-gold);
      font-weight: 600;
      letter-spacing: 1px;
      margin-top: 0.5rem;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .btn-close-gallery {
      background: var(--color-bg-main);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      transition: all 0.3s ease;

      &:hover {
        background: var(--color-accent-gold);
        transform: scale(1.05);
      }

      .close-icon { font-size: 1.2rem; }
    }

    .btn-show-more {
      background: var(--color-bg-main);
      color: white;
      border: none;
      padding: 1.2rem 2.5rem;
      border-radius: 50px;
      font-weight: 700;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);

      &:hover {
        background: var(--color-accent-gold);
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        .btn-icon { transform: translateX(5px); }
      }

      .btn-icon { transition: transform 0.3s ease; }
    }

    @keyframes fadeInOverlay {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .bento-overlay { padding: 1rem; }
      .bento-overlay__content { padding: 1.5rem; height: 95vh; }
      .gallery-title { font-size: 1.8rem; }
      .btn-close-gallery span:first-child { display: none; }
    }
  `]
})
export class AboutSectionComponent {
  showFullBento = false;

  toggleGallery(show: boolean) {
    this.showFullBento = show;
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  collagePhotos: CollagePhoto[] = [
    {
      url: 'about/ognisko.jpeg',
      alt: 'Wieczorne ognisko',
      title: 'Wspólne Ogniska'
    },
    {
      url: 'gallery/lerzak.jpeg',
      alt: 'Lerzak',
      title: 'Relaks'
    },
    { url: 'gallery/main-page-photo1.jpg',
      alt: 'Camper Park z lotu ptaka',
      title: 'Lokalizacja'
    },
    {
      url: 'about/parcele.jpeg',
      alt: 'Przestronne parcele',
      title: 'Nasze Parcele'
    },
    {
      url: 'gallery/zima-drzewa-2.jpeg',
      alt: 'las',
      title: 'Zimowa Atomosfera'
    },
    { url: 'gallery/gallery1.jpg',
      alt: 'Widok panoramiczny',
      title: 'Nasz Park'
    },
  ];

  allGalleryPhotos: BentoPhoto[] = [
    { url: 'gallery/gallery1.jpg', alt: 'Widok panoramiczny', title: 'Nasz Park' },
    { url: 'gallery/hamak.jpeg', alt: 'Relaks na hamaku', title: 'Strefa ciszy' },
    { url: 'gallery/main-page-photo1.jpg', alt: 'Camper Park z lotu ptaka', title: 'Lokalizacja' },
    { url: 'gallery/main-page-photo2.jpg', alt: 'Wieczorna atmosfera', title: 'Klimat' },
    { url: 'gallery/main-page-photo3.jpg', alt: 'Przyroda Suwalszczyzny', title: 'Natura' },
    { url: 'gallery/ognisko.jpeg', alt: 'Wspólne biesiadowanie', title: 'Integracja' },
    { url: 'gallery/parcele.jpeg', alt: 'Twoje miejsce na ziemi', title: 'Komfort' },
    { url: 'gallery/camperpark-noc.jpg', alt: 'Wieczór', title: 'Wieczory' },
    { url: 'gallery/jezioro-i-krzesla.jpg', alt: 'Jezioro', title: 'Widok Na Jezioro' },
    { url: 'gallery/zima-drzewa.jpeg', alt: 'Zima', title: 'Zima' },
    { url: 'gallery/zima-drzewa-2.jpeg', alt: 'las', title: 'Zimowa Atomosfera' },
    { url: 'gallery/lerzak.jpeg', alt: 'Lerzak', title: 'Relaks' },
  ];
}
