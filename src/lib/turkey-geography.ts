
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
        return data
            .map((p: any) => ({ id: p.id, name: p.name }))
            .sort((a: Province, b: Province) => a.name.localeCompare(b.name, 'tr'));
    } catch (e) {
        console.error("Failed to fetch provinces", e);
        return [];
    }
}

export async function getDistricts(provinceName: string): Promise<District[]> {
    try {
        const res = await fetch(`${API_BASE}/districts?province=${encodeURIComponent(provinceName)}&limit=1000`);
        const { data } = await res.json();
        if (data) {
            return data
                .map((d: any) => ({ id: d.id, name: d.name }))
                .sort((a: District, b: District) => a.name.localeCompare(b.name, 'tr'));
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch districts", e);
        return [];
    }
}

export async function getNeighborhoods(provinceName: string, districtName: string): Promise<Neighborhood[]> {
    try {
        const res = await fetch(`${API_BASE}/neighborhoods?province=${encodeURIComponent(provinceName)}&district=${encodeURIComponent(districtName)}&limit=2000`);
        const { data } = await res.json();
        if (data) {
            return data
                .map((n: any) => ({ id: n.id, name: n.name }))
                .sort((a: Neighborhood, b: Neighborhood) => a.name.localeCompare(b.name, 'tr'));
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch neighborhoods", e);
        return [];
    }
}
