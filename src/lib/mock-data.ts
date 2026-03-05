import { Restaurant, Category, Product } from '../types';

export const mockCategories: Category[] = [
    { id: 'cat_01', restaurantId: 'rest_01', name: 'Kebaplar', orderIndex: 1 },
    { id: 'cat_02', restaurantId: 'rest_01', name: 'Yan Ürünler', orderIndex: 2 },
    { id: 'cat_03', restaurantId: 'rest_01', name: 'İçecekler', orderIndex: 3 },
];

export const mockProducts: Product[] = [
    {
        id: 'prod_01',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Adana Kebap',
        description: 'Zırh kıyması ile özenle hazırlanmış acılı Adana kebap, közlenmiş biber ve domates ile.',
        price: 240,
        imageUrl: 'https://images.unsplash.com/photo-1644485573420-7243ccefcbc6?auto=format&fit=crop&q=80&w=800',
        orderIndex: 1,
        variations: [
            {
                id: 'var_01',
                name: 'Porsiyon',
                isRequired: true,
                options: [
                    { id: 'opt_01', name: '1 Porsiyon', priceDelta: 0 },
                    { id: 'opt_02', name: '1.5 Porsiyon', priceDelta: 100 },
                ],
            },
            {
                id: 'var_02',
                name: 'Ekstra Durum',
                isRequired: false,
                options: [
                    { id: 'opt_03', name: 'Lavaş Arası', priceDelta: 20 },
                    { id: 'opt_04', name: 'Açık Ekmek', priceDelta: 10 },
                ],
            }
        ],
    },
    {
        id: 'prod_02',
        restaurantId: 'rest_01',
        categoryId: 'cat_01',
        name: 'Urfa Kebap',
        description: 'Acısız Şanlıurfa usulü kebap.',
        price: 240,
        orderIndex: 2,
        variations: [
            {
                id: 'var_03',
                name: 'Porsiyon',
                isRequired: true,
                options: [
                    { id: 'opt_05', name: '1 Porsiyon', priceDelta: 0 },
                    { id: 'opt_06', name: '1.5 Porsiyon', priceDelta: 100 },
                ],
            }
        ]
    },
    {
        id: 'prod_03',
        restaurantId: 'rest_01',
        categoryId: 'cat_02',
        name: 'Çiğ Köfte',
        description: 'Özel baharatlarla yoğurulmuş etsiz çiğ köfte dürümlük (250gr).',
        price: 80,
        orderIndex: 1,
        variations: []
    },
    {
        id: 'prod_04',
        restaurantId: 'rest_01',
        categoryId: 'cat_03',
        name: 'Ayran',
        price: 30,
        orderIndex: 1,
        variations: [
            {
                id: 'var_04',
                name: 'Boyut',
                isRequired: true,
                options: [
                    { id: 'opt_07', name: 'Küçük', priceDelta: 0 },
                    { id: 'opt_08', name: 'Büyük', priceDelta: 15 },
                ],
            }
        ]
    },
    {
        id: 'prod_05',
        restaurantId: 'rest_01',
        categoryId: 'cat_03',
        name: 'Kutu Kola',
        price: 45,
        orderIndex: 2,
        variations: []
    }
];

export const mockRestaurant: Restaurant = {
    id: 'rest_01',
    slug: 'ahmetin-yeri',
    name: 'Ahmet\'in Yeri',
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
