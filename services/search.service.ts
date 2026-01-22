import API from "@/lib/axios";
import { IProviderProfile, SearchProvidersParams } from "@/types/provider.types";




export async function searchProviders({ serviceType, lat, lng }: SearchProvidersParams) {
    const params = new URLSearchParams({
        serviceType,
        lat: lat.toString(),
        lng: lng.toString(),
    });

    const { data } = await API
        .get(`/consumer/search/providers?${params.toString()}`);
    return data;
}

export async function getProviders({ serviceType, lat, lng }: SearchProvidersParams) {
    const params = new URLSearchParams({
        serviceType,
        lat: lat.toString(),
        lng: lng.toString(),
    });

    const { data } = await API
        .get(`/consumer/home/providers?${params.toString()}`);
    return data;
}



export async function fetchProviderDetailsForBooking({ providerId }: { providerId?: string }) {
    const { data } = await API
        .get(`/consumer/providers/${providerId}`);
    return data.provider as IProviderProfile;
}
