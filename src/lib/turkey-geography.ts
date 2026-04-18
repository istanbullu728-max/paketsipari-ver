
export interface Province {
    id: number;
    name: string;
}

export interface District {
    id: number;
    name: string;
}

export interface Neighborhood {
    id: number;
    name: string;
}

const API_BASE = "https://turkiyeapi.dev/api/v1";

export async function getProvinces(): Promise<Province[]> {
    try {
        const res = await fetch(`${API_BASE}/provinces`);
        const { data } = await res.json();
        return data.map((p: any) => ({ id: p.id, name: p.name }));
    } catch (e) {
        console.error("Failed to fetch provinces", e);
        return [];
    }
}

export async function getDistricts(provinceName: string): Promise<District[]> {
    try {
        const res = await fetch(`${API_BASE}/provinces?name=${encodeURIComponent(provinceName)}`);
        const { data } = await res.json();
        if (data && data[0] && data[0].districts) {
            return data[0].districts.map((d: any) => ({ id: d.id, name: d.name }));
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch districts", e);
        return [];
    }
}

export async function getNeighborhoods(provinceName: string, districtName: string): Promise<Neighborhood[]> {
    try {
        const res = await fetch(`${API_BASE}/provinces?name=${encodeURIComponent(provinceName)}&districts.name=${encodeURIComponent(districtName)}`);
        const { data } = await res.json();
        if (data && data[0]) {
            const district = data[0].districts.find((d: any) => d.name.toLowerCase() === districtName.toLowerCase());
            if (district && district.neighborhoods) {
                return district.neighborhoods.map((n: any) => ({ id: n.id, name: n.name }));
            }
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch neighborhoods", e);
        return [];
    }
}
