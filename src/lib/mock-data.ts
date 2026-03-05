import { Restaurant, Category, Product } from '../types';

export const mockCategories: Category[] = [
    { id: 'cat_01', restaurantId: 'rest_01', name: 'Dürüm & Ekmek Arası', orderIndex: 1 },
    { id: 'cat_02', restaurantId: 'rest_01', name: 'Porsiyon & İskender', orderIndex: 2 },
    { id: 'cat_03', restaurantId: 'rest_01', name: 'Yan Ürünler & Atıştırmalıklar', orderIndex: 3 },
    { id: 'cat_04', restaurantId: 'rest_01', name: 'İçecekler & Tatlı', orderIndex: 4 },
];

export const mockProducts: Product[] = [
    // ── Dürüm & Ekmek Arası ──────────────────────────────────
    {
        id: 'prod_01',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Et Döner Dürüm (100g)',
        description: 'Lavaş, özel sos, turşu ve patates ile.',
        price: 240,
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
        orderIndex: 1,
        variations: [],
    },
    {
        id: 'prod_02',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Tombik Et Döner',
        description: 'Susamlı pofuduk ekmek arası döner lezzeti.',
        price: 250,
        imageUrl: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&q=80&w=800',
        orderIndex: 2,
        variations: [],
    },
    {
        id: 'prod_03',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Tavuk Döner Dürüm (120g)',
        description: 'Hatay usulü sos, sarımsaklı mayonez ve turşu.',
        price: 160,
        imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=800',
        orderIndex: 3,
        variations: [],
    },
    {
        id: 'prod_04',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Zurna Tavuk Dürüm (70cm)',
        description: 'Ekstra bol malzeme ve çift lavaş.',
        price: 210,
        imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800',
        orderIndex: 4,
        variations: [],
    },

    // ── Porsiyon & İskender ───────────────────────────────────
    {
        id: 'prod_05',
        restaurantId: 'rest_01',
        categoryId: 'cat_02',
        name: 'Porsiyon Et Döner',
        description: 'Pilav üstü, közlenmiş biber ve domates eşliğinde.',
        price: 320,
        imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800',
        orderIndex: 1,
        variations: [],
    },
    {
        id: 'prod_06',
        restaurantId: 'rest_01',
        categoryId: 'cat_02',
        name: 'Tereyağlı İskender',
        description: 'Özel pide, bol tereyağı ve buz gibi yoğurt ile.',
        price: 380,
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
        orderIndex: 2,
        variations: [],
    },
    {
        id: 'prod_07',
        restaurantId: 'rest_01',
        categoryId: 'cat_02',
        name: 'Pilav Üstü Tavuk Döner',
        description: 'Şehriyeli pirinç pilavı üzerinde lezzet şöleni.',
        price: 220,
        imageUrl: 'https://images.unsplash.com/photo-1587489936080-a5a8b3683c81?auto=format&fit=crop&q=80&w=800',
        orderIndex: 3,
        variations: [],
    },

    // ── Yan Ürünler & Atıştırmalıklar ────────────────────────
    {
        id: 'prod_08',
        restaurantId: 'rest_01',
        categoryId: 'cat_03',
        name: 'Parmak Patates (Büyük)',
        description: 'Baharatlı veya sade seçenekleriyle.',
        price: 85,
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
        orderIndex: 1,
        variations: [
            {
                id: 'var_08',
                name: 'Seçenek',
                isRequired: false,
                options: [
                    { id: 'opt_08a', name: 'Sade', priceDelta: 0 },
                    { id: 'opt_08b', name: 'Baharatlı', priceDelta: 0 },
                ],
            }
        ],
    },
    {
        id: 'prod_09',
        restaurantId: 'rest_01',
        categoryId: 'cat_03',
        name: 'İçli Köfte (Adet)',
        description: 'Haşlama veya kızartma seçenekli, el açması.',
        price: 60,
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
        orderIndex: 2,
        variations: [
            {
                id: 'var_09',
                name: 'Pişirme',
                isRequired: false,
                options: [
                    { id: 'opt_09a', name: 'Haşlama', priceDelta: 0 },
                    { id: 'opt_09b', name: 'Kızartma', priceDelta: 0 },
                ],
            }
        ],
    },

    // ── İçecekler & Tatlı ─────────────────────────────────────
    {
        id: 'prod_10',
        restaurantId: 'rest_01',
        categoryId: 'cat_04',
        name: 'Yayık Ayran',
        description: 'Köpüklü, el yapımı doğal ayran.',
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&q=80&w=800',
        orderIndex: 1,
        variations: [],
    },
    {
        id: 'prod_11',
        restaurantId: 'rest_01',
        categoryId: 'cat_04',
        name: 'Kutu Meşrubatlar',
        description: 'Cola, Fanta, Sprite, Fuse Tea.',
        price: 55,
        imageUrl: 'https://images.unsplash.com/photo-1581098365948-6a5a912a7a66?auto=format&fit=crop&q=80&w=800',
        orderIndex: 2,
        variations: [
            {
                id: 'var_11',
                name: 'Çeşit',
                isRequired: true,
                options: [
                    { id: 'opt_11a', name: 'Cola', priceDelta: 0 },
                    { id: 'opt_11b', name: 'Fanta', priceDelta: 0 },
                    { id: 'opt_11c', name: 'Sprite', priceDelta: 0 },
                    { id: 'opt_11d', name: 'Fuse Tea', priceDelta: 0 },
                ],
            }
        ],
    },
    {
        id: 'prod_12',
        restaurantId: 'rest_01',
        categoryId: 'cat_04',
        name: 'Fırın Sütlaç',
        description: 'Yanık üstü ve bol fındık parçacıklı.',
        price: 90,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
        orderIndex: 3,
        variations: [],
    },
];

export const mockRestaurant: Restaurant = {
    id: 'rest_01',
    slug: 'donerin-ustasi',
    name: 'Dönerin Ustası',
    whatsappNumber: '+905551234567',
    minOrderAmount: 150,
    businessHours: {
        open: '10:00',
        close: '22:00',
        isOpenNow: true,
    },
    categories: mockCategories,
    products: mockProducts,
};
