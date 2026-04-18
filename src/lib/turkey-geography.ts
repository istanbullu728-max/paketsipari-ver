
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

const API_BASE = "https://api.turkiyeapi.dev/v1";

export async function getProvinces(): Promise<Province[]> {
    try {
        const res = await fetch(`${API_BASE}/provinces?limit=100`);
        const { data } = await res.json();
        return (data || [])
            .map((p: any) => ({ id: p.id, name: p.name }))
            .sort((a: Province, b: Province) => a.name.localeCompare(b.name, 'tr'));
    } catch (e) {
        console.error("Failed to fetch provinces", e);
        return [];
    }
}

export async function getDistricts(provinceId: number): Promise<District[]> {
    try {
        const res = await fetch(`${API_BASE}/districts?provinceId=${provinceId}&limit=200`);
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

export async function getNeighborhoods(districtId: number): Promise<Neighborhood[]> {
    try {
        const res = await fetch(`${API_BASE}/neighborhoods?districtId=${districtId}&limit=2000`);
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
