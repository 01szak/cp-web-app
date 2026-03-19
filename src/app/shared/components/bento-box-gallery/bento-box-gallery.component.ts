import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BentoPhoto {
  url: string;
  alt: string;
  title?: string;
}

@Component({
  selector: 'app-bento-box-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="masonry-grid">
      @for (photo of photos; track $index) {
        <div class="masonry-item">
          <div class="masonry-item__content">
            <img [src]="photo.url" [alt]="photo.alt" class="masonry-item__img">
            <div class="masonry-item__overlay">
              <span class="masonry-item__title" *ngIf="photo.title">{{ photo.title }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .masonry-grid {
      columns: 1;
      column-gap: 24px;
      width: 100%;
      
      @media (min-width: 640px) { columns: 2; }
      @media (min-width: 1024px) { columns: 3; }
      @media (min-width: 1440px) { columns: 4; }
    }

    .masonry-item {
      break-inside: avoid;
      margin-bottom: 24px;
      border-radius: 20px;
      overflow: hidden;
      background: transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);

      &__content {
        width: 100%;
        position: relative;
        line-height: 0; /* Remove space under image */
      }

      &__img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain; /* Scale to fit exactly */
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        z-index: 10;

        .masonry-item__img {
          transform: scale(1.05);
        }

        .masonry-item__overlay {
          opacity: 1;
        }
      }

      &__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%);
        display: flex;
        align-items: flex-end;
        padding: 24px;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
      }

      &__title {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.5px;
        line-height: 1.2;
      }
    }
  `]
})
export class BentoBoxGalleryComponent {
  @Input({ required: true }) photos: BentoPhoto[] = [];
}
