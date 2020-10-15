const deliveryTypes = [
    {
        id: 1,
        description: 'Доставка Клаб - курьерская (Москва, Санкт-Петербург, Казань, Нижний-Новгород)',
        price: 350,
        shorty: "DostavkaClub",
        trackLink: 'home.courierexe.ru/90/tracking'
    },
    {
        id: 2,
        description: 'Сдек - курьерская по России',
        price: 500,
        shorty: "CDEK",
        trackLink: 'cdek.ru/tracking'
    },
    {
        id: 3,
        description: 'Сдек - до пункта выдачи по России',
        price: 400,
        shorty: "CDEK",
        trackLink: 'cdek.ru/tracking'
    },
    {
        id: 4,
        description: 'Почта России - по России',
        price: 500,
        shorty: "Почта",
        trackLink: 'pochta.ru/tracking'
    },
    {
        id: 5,
        description: 'Почта России - по миру',
        price: 1200,
        shorty: "Russian Post",
        trackLink: 'pochta.ru/tracking'
    },
    {
        id: 6,
        description: 'Самовывоз из нашего магазина',
        price: 0,
        shorty: "Самовывоз"
    },
]

export default deliveryTypes
