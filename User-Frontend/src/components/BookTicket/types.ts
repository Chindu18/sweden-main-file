export interface BookingData {
  name?: string;
  email?: string;
  phone?: string | number;
  date?: string;
  timing?: string;
  movieName?: string;
  seatNumbers?: number[];
  paymentStatus?: string;
  adult?: number;
  kids?: number;
  ticketType?: string;
  totalAmount?: number;
  totalSeats?: number;
  collectorType?: string;
  collectorId?: string;
}

export interface Show {
  date: string;
  time: string;
  prices: {
    online: { adult: number; kids: number };
    videoSpeed: { adult: number; kids: number };
    soder?: { adult: number; kids: number };
    others?: { adult: number; kids: number };
  };
}

export interface Movie {
  title: string;
  cast: { hero: string; heroine: string; villain: string; supportArtists: string[] };
  crew: { director: string; producer: string; musicDirector: string; cinematographer: string };
  photos: string[];
  shows: Show[];
  bookingOpenDays?: number;
}
