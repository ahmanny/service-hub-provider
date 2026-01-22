// stores/onboarding.store.ts
import { ServiceType } from '@/constants/services';
import { IAvailabilityDay } from '@/types/provider.types';
import { create } from 'zustand';

export interface SelectedService {
  name: string;
  value: string;
  price: number;
}

interface OnboardingState {
  // Step 1: Identity
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;

  // Step 2: Service Info
  serviceType: ServiceType;

  // Step 3: services and price 
  selectedServices: SelectedService[] | null;

  shopAddress: {
    label: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
  } | null,
  offersHomeService: boolean,
  offersShopVisit: boolean,

  serviceArea: {
    formattedAddress: string
    center: {
      latitude: number,
      longitude: number
    }
  } | null

  radiusKm: number;

  availability: IAvailabilityDay[] | null,
  avgServiceTime: number | null

  verification: {
    idUrl: string,
    selfieUrl: string
  } | null


  // Actions
  updateFields: (fields: Partial<Omit<OnboardingState, 'updateFields' | 'reset'>>) => void;
  reset: () => void;
}

const initialState: Omit<OnboardingState, 'updateFields' | 'reset'> = {
  firstName: '',
  lastName: '',
  email: '',
  profilePicture: '',
  bio: '',

  serviceType: "barber",
  selectedServices: null,

  shopAddress: null,
  offersHomeService: false,
  offersShopVisit: false,

  serviceArea: null,
  radiusKm: 2,

  availability: null,
  avgServiceTime: null,

  verification: null

};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  updateFields: (fields) =>
    set((state) => ({
      ...state,
      ...fields
    })),

  reset: () => set(initialState),
}));