import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paketservis | Aracıya komisyon ödemeyi bırakın, 5 dakikada paket sipariş sitenizi kurun",
  description: "Aracı komisyonlar olmadan, kendi dijital menünü ve paket servis sistemini oluştur. WhatsApp siparişlerini anında yönet.",
  keywords: ["paket servis", "dijital menü", "qr kod menü", "komisyonsuz sipariş", "restoran yönetim", "whatsapp sipariş"],
};

export default function Home() {
  return <LandingPage />;
}
