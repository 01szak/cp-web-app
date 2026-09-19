export interface CamperPlaceTypeDTO {
  id: number;
  typeName: string;
  price: number;
}

export interface CamperPlaceDTO {
  id: number;
  index: string;
  type: CamperPlaceTypeDTO;
  price: number;
}

export interface GuestDTO {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phoneNumber: string | null;
  carRegistration: string | null;
  country: string | null;
}

export interface ReservationDTO {
  checkin: string | null;
  checkout: string | null;
  camperPlace: CamperPlaceDTO | null;
  guest: GuestDTO | null;
  paid: false | null;
}
