import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { AboutSectionComponent } from '../components/about-section/about-section.component';
import { MapSectionComponent } from '../components/map-section/map-section.component';
import { OpinionsSectionComponent } from '../components/opinions-section/opinions-section.component';
import { SectionComponent } from '../../../shared/components/section/section.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    MapSectionComponent,
    OpinionsSectionComponent,
    SectionComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <main>
      <app-hero-section></app-hero-section>

      <app-section id="about" variant="light">
        <app-about-section></app-about-section>
      </app-section>

      <app-opinions-section></app-opinions-section>

      <app-map-section></app-map-section>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .section-title { margin-bottom: 1rem; }
    .section-desc { max-width: 600px; margin: 0 auto 4rem; opacity: 0.8; }
  `]
})
export class LandingPageComponent {}
