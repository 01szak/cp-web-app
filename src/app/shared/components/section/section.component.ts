import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="'section--' + variant" [id]="id">
      <div class="container">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [`
    section {
      padding: var(--spacing-lg) 0;
      
      @media (min-width: 768px) {
        padding: var(--spacing-xl) 0;
      }
    }
    
    .section--light { background-color: var(--color-bg-light); }
    .section--soft { background-color: var(--color-bg-light-soft); }
    .section--dark { 
      background-color: var(--color-bg-section-dark); 
      color: var(--color-text-light);
      
      ::ng-deep h2 { color: var(--color-text-light); }
    }
  `]
})
export class SectionComponent {
  @Input() variant: 'light' | 'soft' | 'dark' = 'light';
  @Input() id: string = '';
}
