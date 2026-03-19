import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryItem } from '../../models/gallery.model';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-card">
      <img [src]="item.imageUrl" [alt]="item.title" class="image-card__img">
      <div class="image-card__overlay">
        <h3 class="image-card__title">{{ item.title }}</h3>
        <p class="image-card__description">{{ item.description }}</p>
      </div>
    </div>
  `,
  styles: [`
    .image-card {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      aspect-ratio: 4/3;
      cursor: pointer;

      &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      &__overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 2rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        color: white;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s ease;
      }

      &__title {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: white;
      }

      &__description {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      &:hover {
        .image-card__img {
          transform: scale(1.1);
        }
        .image-card__overlay {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  `]
})
export class ImageCardComponent {
  @Input({ required: true }) item!: GalleryItem;
}
