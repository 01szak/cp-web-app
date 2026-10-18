import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CamperPlaceDTO, CamperPlaceTypeDTO, ReservationDTO } from '../models/reservation.models';

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

  camperPlaceTypes() {
    return rxResource({
      stream: () => this.http.get<CamperPlaceTypeDTO[]>('/api/camperPlaceType'),
    });
  }

  /** Pitches free for the whole stay; idle until a stay is given. */
  campAvailability(stay: () => { checkin: string; checkout: string } | undefined) {
    return rxResource({
      params: stay,
      stream: ({ params }) =>
        this.http.get<CamperPlaceDTO[]>(
          `/api/camperPlace/available/${params.checkin}/${params.checkout}`,
        ),
    });
  }

  calculatedPrice(request: () => CalculatedPriceRequest) {
    return rxResource({
      params: request,
      stream: ({ params }) => {
        if (!params.cpId || !params.checkin || !params.checkout) return of(null);
        return this.http.get<number>(
          `/api/camperPlace/calcPrice/${params.cpId}/${params.checkin}/${params.checkout}`,
        );
      },
    });
  }

  verifyReservation(targetId: () => string | null) {
    return rxResource({
      stream: () => {
        const id = targetId();
        if (!id) return of(null);
        return this.http.post(`/api/web/reservation/verify/${id}`, null, { responseType: 'text' });
      },
    });
  }

  createReservation(request: () => ReservationDTO | null) {
    return rxResource({
      params: request,
      stream: ({ params }) => {
        if (!params) return of(null);
        return this.http.post('/api/web/reservation/init', params, { responseType: 'text' });
      },
    });
  }
}
