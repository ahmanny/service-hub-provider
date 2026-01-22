import { create } from "zustand";

interface MapState {
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (coords: { latitude: number; longitude: number }) => void;
}

export const useMapStore = create<MapState>((set) => ({
  userLocation: null,
  setUserLocation: (coords) => set({ userLocation: coords }),
}));
