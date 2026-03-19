import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../core/directives/reveal-on-scroll.directive';

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
    <section class="opinions" id="opinions">
      <div class="container">
        <div class="opinions__header text-center" appRevealOnScroll>
          <span class="subtitle">OPINIE NASZYCH GOŚCI</span>
          <h2 class="title">Co mówią o nas w Google?</h2>
          <div class="google-rating">
            <span class="rating-score">4.9</span>
            <div class="stars">
              <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
            </div>
            <span class="reviews-count">(120+ opinii)</span>
          </div>
        </div>

        <div class="opinions__grid grid grid-3">
          @for (opinion of opinions; track $index) {
            <div class="opinion-card" appRevealOnScroll>
              <div class="opinion-card__header">
                <div class="opinion-card__author-info">
                  <span class="opinion-card__author">{{ opinion.author }}</span>
                  <span class="opinion-card__date">{{ opinion.date }}</span>
                </div>
                <div class="opinion-card__stars">
                  @for (star of [1,2,3,4,5]; track star) {
                    <span class="star" [class.star--filled]="star <= opinion.rating">★</span>
                  }
                </div>
              </div>
              <p class="opinion-card__text">"{{ opinion.text }}"</p>
            </div>
          }
        </div>

        <div class="opinions__cta text-center" appRevealOnScroll>
          <a href="https://www.google.com/maps" target="_blank" class="btn-outline">ZOBACZ WSZYSTKIE OPINIE</a>
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
  opinions: Opinion[] = [
    {
      author: "Marek Kowalski",
      rating: 5,
      date: "2 tygodnie temu",
      text: "Cudowne miejsce na odpoczynek. Cisza, spokój i niesamowity widok na jezioro Wigry. Infrastruktura na najwyższym poziomie."
    },
    {
      author: "Anna Nowak",
      rating: 5,
      date: "miesiąc temu",
      text: "Najlepszy camper park na jakim byliśmy w Polsce. Bardzo czyste sanitariaty i miła obsługa. Na pewno wrócimy!"
    },
    {
      author: "Piotr Zieliński",
      rating: 5,
      date: "2 miesiące temu",
      text: "Świetna lokalizacja dla fanów wycieczek rowerowych. Parcele są przestronne i dobrze przygotowane pod cięższe kampery."
    }
  ];
}
