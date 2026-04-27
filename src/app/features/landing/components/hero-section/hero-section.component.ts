import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero__static-img"></div>
      <div class="container hero__content">
        <h1 class="hero__title">{{ ts.t.hero.title }}<br><span>{{ ts.t.hero.subtitle }}</span></h1>
        <p class="hero__tagline">{{ ts.t.hero.tagline }}</p>
        <div class="hero__actions">
          <button class="btn-primary" (click)="scrollTo('about')">{{ ts.t.hero.cta }}</button>
        </div>
      </div>

      <div class="hero__scroll-indicator" (click)="scrollTo('about')">
        <div class="mouse"></div>
        <span>{{ ts.t.hero.scroll }}</span>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      color: white;
      overflow: hidden;

      &__static-img {
        position: absolute;
        inset: 0;
        background-image: url("/gallery/puste-parcele-lot-ptaka.webp");
        background-size: cover;
        background-position: center;
      }

      &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
      }

      &__content {
        position: relative;
        z-index: 1;
        max-width: 800px;
        animation: fadeIn 1.2s ease-out;
      }

      &__title {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        line-height: 1.1;
        color: white;

        @media (min-width: 768px) {
          font-size: 5rem;
        }

        span {
          color: var(--color-accent-gold);
        }
      }

      &__tagline {
        font-size: 1.25rem;
        margin-bottom: 2.5rem;
        max-width: 600px;
        opacity: 0.9;
      }

      &__scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;

        &:hover { opacity: 1; }

        span { font-size: 0.7rem; letter-spacing: 2px; }
      }
    }

    .mouse {
      width: 20px;
      height: 35px;
      border: 2px solid white;
      border-radius: 10px;
      position: relative;
      &::before {
        content: '';
        width: 2px;
        height: 6px;
        background: white;
        position: absolute;
        left: 50%;
        top: 6px;
        transform: translateX(-50%);
        animation: scrollWheel 2s infinite;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scrollWheel {
      0% { transform: translate(-50%, 0); opacity: 1; }
      100% { transform: translate(-50%, 15px); opacity: 0; }
    }
  `]
})
export class HeroSectionComponent {
  ts = inject(TranslationService);

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
