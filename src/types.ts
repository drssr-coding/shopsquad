import { Timestamp } from 'firebase/firestore';

export interface Party {
  id: string;
  title: string;
  date: Timestamp;
  location: string;
  organizer: string;
  organizerId: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}