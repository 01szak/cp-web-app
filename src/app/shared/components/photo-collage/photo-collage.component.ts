import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../core/directives/reveal-on-scroll.directive';

export interface CollagePhoto {
  url: string;
  alt: string;
  title?: string;
}

@Component({
  selector: 'app-photo-collage',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <div class="collage-wrapper">
      <div class="collage-masonry" appRevealOnScroll>
        @for (photo of photos; track $index) {
          <div class="collage-item" (click)="onPhotoClick()">
            <div class="collage-item__content">
              <img [src]="photo.url" [alt]="photo.alt" class="collage-item__img">
              <div class="collage-item__overlay">
                <span class="collage-item__zoom-icon">ZOBACZ</span>
              </div>
            </div>
          </div>
        }
      </div>
      
      <div class="collage-actions" *ngIf="showButton">
        <button class="btn-gallery" (click)="onPhotoClick()">
          ZOBACZ PEŁNĄ GALERIĘ
        </button>
      </div>
    </div>
  `,
  styles: [`
    .collage-wrapper { width: 100%; position: relative; }

    .collage-masonry {
      columns: 1;
      column-gap: 16px;
      
      @media (min-width: 768px) {
        columns: 3;
        column-gap: 20px;
      }
    }

    .collage-item {
      break-inside: avoid;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background: transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);

      @media (min-width: 768px) {
        margin-bottom: 20px;
      }

      &__content {
        width: 100%;
        position: relative;
        line-height: 0;
      }

      &__img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        z-index: 2;

        .collage-item__img { transform: scale(1.05); }
        .collage-item__overlay { opacity: 1; }
      }

      &__overlay {
        position: absolute;
        inset: 0;
        background: rgba(42, 51, 27, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &__zoom-icon {
        color: white;
        border: 1px solid rgba(255,255,255,0.7);
        padding: 0.5rem 1rem;
        border-radius: 30px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(4px);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 1px;
        font-weight: 600;
      }
    }

    .collage-actions {
      text-align: center;
      margin-top: 3rem;
    }

    .btn-gallery {
      background: var(--color-bg-main);
      color: white;
      border: none;
      padding: 1.1rem 2.2rem;
      border-radius: 50px;
      font-weight: 700;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover { background: var(--color-accent-gold); transform: translateY(-2px); }
    }
  `]
})
export class PhotoCollageComponent {
  @Input({ required: true }) photos: CollagePhoto[] = [];
  @Input() showButton = true;
  @Output() photoClicked = new EventEmitter<void>();

  onPhotoClick() {
    this.photoClicked.emit();
  }
}
