import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-map-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="map-section" id="location" aria-labelledby="location-title">
      <div class="container">
        <div class="map-header text-center" appRevealOnScroll>
          <span class="subtitle">{{ ts.t.location.subtitle }}</span>
          <h2 class="title" id="location-title">{{ ts.t.location.title }}</h2>
          <p class="description">
            Stary Folwark 55 c, 16-402 Suwałki<br>
            <strong>{{ ts.t.location.description }}</strong>
          </p>
        </div>

        <div class="map-container" appRevealOnScroll>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2340.7822640734776!2d23.0807038!3d54.0776046!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e0fd98c90cd77f%3A0xfe359f9345eee0b2!2sCamper%20Park%20Stary%20Folwark!5e0!3m2!1spl!2spl!4v1776804857276!5m2!1spl!2spl"
            width="100%"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            title="Mapa Google z lokalizacją Camper Park Stary Folwark"
            aria-label="Interaktywna mapa Google przedstawiająca lokalizację pola kempingowego"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <div class="location-details grid grid-3" appRevealOnScroll>
          <article class="detail-item">
            <h3 class="detail-title">{{ ts.t.location.gps }}</h3>
            <p>54.0845° N, 23.0583° E</p>
          </article>
          <article class="detail-item">
            <h3 class="detail-title">{{ ts.t.location.distance }}</h3>
            <p>Suwałki: 12 km<br>Augustów: 40 km</p>
          </article>
          <article class="detail-item">
            <h3 class="detail-title">{{ ts.t.location.attractions }}</h3>
            <p>Jezioro Wigry: 0 m<br>Klasztor Kamedułów: 5 km</p>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .map-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-bg-light);
    }

    .map-header {
      margin-bottom: var(--spacing-lg);

      .subtitle {
        color: var(--color-accent-gold);
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 0.8rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      .description {
        opacity: 0.8;
        font-size: 1.1rem;
      }
    }

    .map-container {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin-bottom: var(--spacing-lg);
      background: #eee;
    }

    .location-details {
      margin-top: var(--spacing-lg);
      text-align: center;
    }

    .detail-item {
      padding: var(--spacing-md);
      background: white;
      border-radius: 8px;
      border: 1px solid var(--color-bg-light-soft);
      transition: var(--transition-smooth);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border-color: var(--color-accent-gold);
      }
    }

    .detail-title {
      color: var(--color-bg-main);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      letter-spacing: 1px;
    }
  `]
})
export class MapSectionComponent {
  ts = inject(TranslationService);
}
