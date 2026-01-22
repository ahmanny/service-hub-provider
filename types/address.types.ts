export type UserAddressPayload = {
  label: "Home" | "Work" | "Other";
  formattedAddress: string;
  latitude: number;
  longitude: number;
};
