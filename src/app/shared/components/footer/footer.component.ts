import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="contact">
      <div class="container">
        <div class="grid grid-3">
          <div class="footer__col">
            <h3 class="footer__title">STARY FOLWARK</h3>
            <p class="footer__text">Twoja oaza spokoju nad jeziorem Wigry. Nowoczesny camper park z tradycyjną gościnnością.</p>
          </div>
          
          <div class="footer__col">
            <h4 class="footer__subtitle">KONTAKT</h4>
            <ul class="footer__list">
              <li>Stary Folwark 50, 16-402 Suwałki</li>
              <li>Tel: +48 123 456 789</li>
              <li>Email: kontakt@staryfolwark.pl</li>
            </ul>
          </div>

          <div class="footer__col">
            <h4 class="footer__subtitle">SOCIAL MEDIA</h4>
            <div class="footer__socials">
              <a href="#" class="footer__link">Facebook</a>
              <a href="#" class="footer__link">Instagram</a>
            </div>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p>&copy; 2026 Camper Park Stary Folwark. Wszelkie prawa zastrzeżone.</p>
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
export class FooterComponent {}
