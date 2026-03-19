import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-map-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <div class="map-section" id="location">
      <div class="container">
        <div class="map-header text-center" appRevealOnScroll>
          <span class="subtitle">DOJAZD</span>
          <h2 class="title">Jak do nas trafić?</h2>
          <p class="description">
            Stary Folwark 55 c, 16-402 Suwałki<br>
            Serce Wigierskiego Parku Narodowego
          </p>
        </div>

        <div class="map-container" appRevealOnScroll>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2346.8524391219844!2d23.0583713774844!3d54.084344123512385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e10266107f9103%3A0x286e11419796e62c!2sStary%20Folwark%2055C%2C%2016-402%20Stary%20Folwark!5e0!3m2!1spl!2spl!4v1710710000000!5m2!1spl!2spl" 
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <div class="location-details grid grid-3" appRevealOnScroll>
          <div class="detail-item">
            <h4 class="detail-title">Współrzędne GPS</h4>
            <p>54.0845° N, 23.0583° E</p>
          </div>
          <div class="detail-item">
            <h4 class="detail-title">Odległość</h4>
            <p>Suwałki: 12 km<br>Augustów: 40 km</p>
          </div>
          <div class="detail-item">
            <h4 class="detail-title">Otoczenie</h4>
            <p>Jezioro Wigry: 200 m<br>Klasztor Kamedułów: 5 km</p>
          </div>
        </div>
      </div>
    </div>
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
export class MapSectionComponent {}
