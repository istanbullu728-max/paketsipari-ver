import { Restaurant } from "@/types";

export function isRestaurantOpen(restaurant: Restaurant): boolean {
    if (restaurant.businessHours.isManualClosed) {
        return false;
    }

    const now = new Date();
    // Get time in Turkey (UTC+3) or local time if preferred. 
    // For simplicity, we'll use the browser's local time as per most PWA requirements.
    const dayNames = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi'];
    const currentDayKey = dayNames[now.getDay()];
    const dayConfig = restaurant.businessHours.days[currentDayKey];

    if (!dayConfig || dayConfig.isClosed) {
        return false;
    }

    const [currentHour, currentMinute] = [now.getHours(), now.getMinutes()];
    const [openHour, openMinute] = dayConfig.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayConfig.close.split(':').map(Number);

    const currentTimeTotal = currentHour * 60 + currentMinute;
    const openTimeTotal = openHour * 60 + openMinute;
    let closeTimeTotal = closeHour * 60 + closeMinute;

    // Handle cases where restaurant closes after midnight (e.g., 10:00 to 02:00)
    if (closeTimeTotal <= openTimeTotal) {
        closeTimeTotal += 24 * 60;
    }

    return currentTimeTotal >= openTimeTotal && currentTimeTotal < closeTimeTotal;
}

export function getNextOpeningTime(restaurant: Restaurant): string {
    const now = new Date();
    const dayNamesEn = ['pazar', 'pazartesi', 'sali', 'carsamba', 'persembe', 'cuma', 'cumartesi'];
    const dayNamesTr = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + i);
        const dayKey = dayNamesEn[nextDate.getDay()];
        const dayConfig = restaurant.businessHours.days[dayKey];

        if (dayConfig && !dayConfig.isClosed) {
            if (i === 0) {
                // Today, check if open time is in the future
                const [openHour, openMinute] = dayConfig.open.split(':').map(Number);
                if (openHour * 60 + openMinute > now.getHours() * 60 + now.getMinutes()) {
                    return `Bugün ${dayConfig.open}'da açılıyor`;
                }
            } else {
                return `${dayNamesTr[nextDate.getDay()]} günü ${dayConfig.open}'da açılıyor`;
            }
        }
    }

    return "Şu an hizmet vermiyor";
}
