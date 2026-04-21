import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';
import { TranslationService } from '../../../../core/services/translation.service';

interface Opinion {
  author: string;
  rating: number;
  text: string;
  date: string;
}

@Component({
  selector: 'app-opinions-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="opinions" id="opinions" aria-labelledby="opinions-title">
      <div class="container">
        <div class="opinions__header text-center" appRevealOnScroll>
          <span class="subtitle">{{ ts.t.opinions.subtitle }}</span>
          <h2 class="title" id="opinions-title">{{ ts.t.opinions.title }}</h2>
          <div class="google-rating" [attr.aria-label]="ts.t.opinions.ratingLabel">
            <span class="rating-score" aria-hidden="true">4.9</span>
            <div class="stars" role="img" aria-label="5 gwiazdek">
              <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
            </div>
            <span class="reviews-count">{{ ts.t.opinions.reviewsCount }}</span>
          </div>
        </div>

        <div class="opinions__grid grid grid-3">
          @for (opinion of opinions; track $index) {
            <article class="opinion-card" appRevealOnScroll>
              <div class="opinion-card__header">
                <div class="opinion-card__author-info">
                  <span class="opinion-card__author">{{ opinion.author }}</span>
                  <time [attr.datetime]="opinion.date" class="opinion-card__date">{{ opinion.date }}</time>
                </div>
                <div class="opinion-card__stars" role="img" [attr.aria-label]="opinion.rating + ' na 5 gwiazdek'">
                  @for (star of [1,2,3,4,5]; track star) {
                    <span class="star" [class.star--filled]="star <= opinion.rating" aria-hidden="true">★</span>
                  }
                </div>
              </div>
              <blockquote class="opinion-card__text">
                <p>"{{ opinion.text }}"</p>
              </blockquote>
            </article>
          }
        </div>

        <div class="opinions__cta text-center" appRevealOnScroll>
          <a href="https://www.google.com/maps" target="_blank" rel="noopener" class="btn-outline">{{ ts.t.opinions.cta }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .opinions {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-bg-light-soft);
      
      &__header { margin-bottom: var(--spacing-lg); }
    }

    .subtitle {
      color: var(--color-accent-gold);
      font-weight: 700;
      letter-spacing: 2px;
      font-size: 0.8rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .google-rating {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1rem;
      
      .rating-score { font-size: 1.5rem; font-weight: 700; color: var(--color-text-dark); }
      .stars { color: #fbbc04; font-size: 1.25rem; }
      .reviews-count { color: var(--color-text-muted); font-size: 0.9rem; }
    }

    .opinion-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      }

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
      }

      &__author { font-weight: 700; display: block; color: var(--color-text-dark); }
      &__date { font-size: 0.8rem; color: var(--color-text-muted); }
      
      &__stars {
        color: #fbbc04;
        .star { opacity: 0.2; &--filled { opacity: 1; } }
      }

      &__text {
        font-style: italic;
        line-height: 1.6;
        color: var(--color-text-dark);
        opacity: 0.9;
        font-size: 0.95rem;
      }
    }

    .opinions__cta { margin-top: var(--spacing-lg); }

    .btn-outline {
      display: inline-block;
      padding: 0.75rem 2rem;
      border: 2px solid var(--color-accent-gold);
      color: var(--color-accent-gold);
      font-weight: 700;
      border-radius: 4px;
      transition: var(--transition-smooth);
      
      &:hover {
        background: var(--color-accent-gold);
        color: white;
      }
    }
  `]
})
export class OpinionsSectionComponent {
  ts = inject(TranslationService);

  get opinions(): Opinion[] {
    return this.ts.t.opinions.list.map((o: any) => ({
      ...o,
      rating: 5 // Default rating if not in translation or keep it as is
    }));
  }
}
