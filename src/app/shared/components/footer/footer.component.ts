import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="contact" aria-labelledby="footer-contact">
      <div class="container">
        <div class="grid grid-3">
          <div class="footer__col">
            <h2 class="footer__title" id="footer-contact">CAMPER PARK STARY FOLWARK</h2>
            <p class="footer__text">{{ ts.t.footer.tagline }}</p>
          </div>

          <div class="footer__col">
            <h3 class="footer__subtitle">{{ ts.t.footer.contact }}</h3>
            <ul class="footer__list">
              <li>Stary Folwark 55C, 16-402 Suwałki</li>
              <li>Tel:
                <ul><a href="tel:+48662666450" class="footer__link">+48 662 666 450</a></ul>
                <ul><a href="tel:+48502024282" class="footer__link">+48 502 024 282</a></ul>
                <ul><a href="tel:+48608816587" class="footer__link">+48 608 816 587</a></ul>
              </li>
              <li>Email: <a href="mailto:camperpark.sfolwark@gmail.com" class="footer__link">camperpark.sfolwark@gmail.com</a></li>
            </ul>
          </div>

          <div class="footer__col">
            <h3 class="footer__subtitle">{{ ts.t.footer.socials }}</h3>
            <nav class="footer__socials" aria-label="Media społecznościowe">
              <a href="https://www.facebook.com/p/Camper-Park-Stary-Folwark-100089541787101/" class="footer__link" aria-label="Odwiedź nasz profil na Facebooku">Facebook</a>
              <a href="https://www.instagram.com/camper_park_stary_folwark/" class="footer__link" aria-label="Odwiedź nasz profil na Instagramie">Instagram</a>
            </nav>
          </div>
        </div>

        <div class="footer__bottom">
          <p>&copy; 2026 {{ ts.t.footer.rights }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-bg-footer);
      color: var(--color-text-light);
      padding: var(--spacing-xl) 0 var(--spacing-md);

      &__title {
        color: var(--color-accent-gold);
        letter-spacing: 2px;
        margin-bottom: 1rem;
      }

      &__subtitle {
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
        color: var(--color-text-muted);
      }

      &__text {
        font-size: 0.95rem;
        opacity: 0.8;
      }

      &__list {
        font-size: 0.95rem;
        li { margin-bottom: 0.75rem; opacity: 0.8; }
      }

      &__socials {
        display: flex;
        gap: 1.5rem;
      }

      &__link {
        font-size: 0.95rem;
        opacity: 0.8;
        &:hover { opacity: 1; color: var(--color-accent-gold); }
      }

      &__bottom {
        margin-top: var(--spacing-xl);
        padding-top: var(--spacing-md);
        border-top: 1px solid rgba(255,255,255,0.05);
        text-align: center;
        font-size: 0.8rem;
        opacity: 0.5;
      }
    }
  `]
})
export class FooterComponent {
  ts = inject(TranslationService);
}
