export type ReservationStatus = 'EXPIRED' | 'ACTIVE' | 'COMING' | 'UNVERIFIED' | 'VERIFIED';

export interface CamperPlaceTypeDTO {
  id?: number;
  typeName: string;
  price: number;
}

export interface CamperPlaceDTO {
  id: number;
  index: string;
  camperPlaceType: CamperPlaceTypeDTO;
  price: number;
}

export interface GuestDTO {
  id?: number;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phoneNumber: string | null;
  carRegistration: string | null;
  country: string | null;
}

export interface ReservationDTO {
  id?: number;
  checkin: string | null;
  checkout: string | null;
  camperPlace: CamperPlaceDTO | null;
  guest: GuestDTO | null;
  price?: number;
  paid: boolean;
  reservationStatus?: ReservationStatus;
}
