import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CamperPlaceDTO } from '../components/reservation-form/reservation-form';
import { ReservationDTO } from '../reservation-page/reservation-page.component';
import { WEB_APP_API_KEY } from '../../../core/tokens/api-config';

interface CalculatedPriceRequest {
  cpId: number | undefined;
  checkin: string | null;
  checkout: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ParceoService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = inject(WEB_APP_API_KEY);
  //TODO this should be taken from jenkins credentials
  private readonly orgId = '1';

  private headers() {
    return new HttpHeaders()
      .set('Accept', 'application/json')
      .set('X-org-id', this.orgId)
      .set('X-api-key', this.apiKey);
  }

  camperPlaces() {
    return rxResource({
      stream: () =>
        this.http.get<CamperPlaceDTO[]>('/api/camperPlace', { headers: this.headers() }),
    });
  }

  camperPlaceOccupancy(camperPlaceId: () => number | null) {
    return rxResource({
      params: camperPlaceId,
      stream: ({ params }) => {
        if (!params) return of([]);
        return this.http.get<string[]>(`/api/camperPlace/occupancy/${params}`, {
          headers: this.headers(),
        });
      },
    });
  }

  calculatedPrice(request: () => CalculatedPriceRequest) {
    return rxResource({
      params: request,
      stream: ({ params }) => {
        if (!params.cpId || !params.checkin || !params.checkout) return of('');
        return this.http.get<string>(
          `/api/camperPlace/calcPrice/${params.cpId}/${params.checkin}/${params.checkout}`,
          { headers: this.headers() },
        );
      },
    });
  }

  verifyReservation(targetId: () => string | null) {
    return rxResource({
      stream: () => {
        const id = targetId();
        if (!id) return of(null);
        return this.http.post(`/api/web/reservation/verify/${id}`, null, {
          headers: this.headers(),
        });
      },
    });
  }

  createReservation(request: () => ReservationDTO | null) {
    return rxResource({
      params: request,
      stream: ({ params }) => {
        if (!params) return of(null);
        return this.http.post('/api/web/reservation/init', params, {
          headers: this.headers(),
        });
      },
    });
  }
}
