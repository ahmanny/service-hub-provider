import API from "@/lib/axios";



export async function fetchDashboardData() {
    const { data } = await API.get(`/provider/dashboard-data`);
    return data;
}

export async function toggleAvailability() {
    const { data } = await API.patch("/provider/toggle-availability");
    return data;
}