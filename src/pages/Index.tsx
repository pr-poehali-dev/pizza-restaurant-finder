import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MenuItem {
  id: number;
  name: string;
  type: 'pizza' | 'sushi' | 'roll';
  image: string;
  rating: number;
  restaurants: string[];
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  image: string;
  reviews: number;
  coordinates: [number, number];
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Маргарита',
    type: 'pizza',
    image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg',
    rating: 4.8,
    restaurants: ['Додо Пицца', 'Папа Джонс', 'Dominos', 'Il Патио']
  },
  {
    id: 2,
    name: 'Пепперони',
    type: 'pizza',
    image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg',
    rating: 4.9,
    restaurants: ['Додо Пицца', 'Папа Джонс', 'Telepizza', 'Pizza Hut']
  },
  {
    id: 3,
    name: 'Четыре сыра',
    type: 'pizza',
    image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg',
    rating: 4.7,
    restaurants: ['Il Патио', 'Sbarro', 'Папа Джонс', 'Dominos']
  },
  {
    id: 4,
    name: 'Филадельфия',
    type: 'roll',
    image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg',
    rating: 4.9,
    restaurants: ['Тануки', 'Якитория', 'Суши Wok', 'Планета Суши']
  },
  {
    id: 5,
    name: 'Калифорния',
    type: 'roll',
    image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg',
    rating: 4.8,
    restaurants: ['Тануки', 'Суши Wok', 'Якитория', 'Евразия']
  },
  {
    id: 6,
    name: 'Нигири с лососем',
    type: 'sushi',
    image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg',
    rating: 4.9,
    restaurants: ['Тануки', 'Якитория', 'Планета Суши', 'Евразия']
  },
];

const topRestaurants: Restaurant[] = [
  { id: 1, name: 'Додо Пицца', cuisine: 'Пицца', rating: 4.9, address: 'ул. Ленина, 45', image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg', reviews: 1250, coordinates: [55.7558, 37.6173] },
  { id: 2, name: 'Тануки', cuisine: 'Японская', rating: 4.8, address: 'пр. Мира, 12', image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg', reviews: 980, coordinates: [55.7689, 37.6342] },
  { id: 3, name: 'Папа Джонс', cuisine: 'Пицца', rating: 4.7, address: 'ул. Советская, 78', image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg', reviews: 856, coordinates: [55.7512, 37.5987] },
  { id: 4, name: 'Якитория', cuisine: 'Японская', rating: 4.8, address: 'ул. Гагарина, 23', image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg', reviews: 742, coordinates: [55.7423, 37.6156] },
  { id: 5, name: 'Il Патио', cuisine: 'Итальянская', rating: 4.6, address: 'пр. Победы, 90', image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg', reviews: 623, coordinates: [55.7634, 37.6289] },
  { id: 6, name: 'Суши Wok', cuisine: 'Паназиатская', rating: 4.5, address: 'ул. Пушкина, 34', image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg', reviews: 589, coordinates: [55.7598, 37.6045] },
  { id: 7, name: 'Dominos', cuisine: 'Пицца', rating: 4.5, address: 'ул. Кирова, 56', image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg', reviews: 512, coordinates: [55.7487, 37.6234] },
  { id: 8, name: 'Планета Суши', cuisine: 'Японская', rating: 4.4, address: 'пр. Ленина, 102', image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg', reviews: 478, coordinates: [55.7712, 37.6112] },
  { id: 9, name: 'Pizza Hut', cuisine: 'Пицца', rating: 4.3, address: 'ул. Маркса, 67', image: '/img/e123155b-f983-41c6-ac67-bd42e75b21c1.jpg', reviews: 401, coordinates: [55.7456, 37.6389] },
  { id: 10, name: 'Евразия', cuisine: 'Паназиатская', rating: 4.2, address: 'ул. Чехова, 89', image: '/img/ccefbed8-6cc7-4460-9eec-d5be8c01fbdc.jpg', reviews: 356, coordinates: [55.7667, 37.5923] },
];

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'pizza' | 'sushi' | 'roll'>('all');
  const [activeTab, setActiveTab] = useState('catalog');

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredItems = selectedType === 'all'
    ? menuItems
    : menuItems.filter(item => item.type === selectedType);

  const favoriteItems = menuItems.filter(item => favorites.includes(item.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍕</div>
              <h1 className="text-2xl font-bold text-foreground">Pizza & Sushi Finder</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Heart" size={24} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="MapPin" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white h-auto p-2 rounded-2xl shadow-sm">
            <TabsTrigger value="catalog" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="UtensilsCrossed" size={18} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="rating" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Star" size={18} className="mr-2" />
              Рейтинг
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Store" size={18} className="mr-2" />
              Заведения
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Map" size={18} className="mr-2" />
              Карта
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Heart" size={18} className="mr-2" />
              Избранное
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => setSelectedType('all')}
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className="rounded-full"
              >
                Все
              </Button>
              <Button
                onClick={() => setSelectedType('pizza')}
                variant={selectedType === 'pizza' ? 'default' : 'outline'}
                className="rounded-full"
              >
                🍕 Пицца
              </Button>
              <Button
                onClick={() => setSelectedType('sushi')}
                variant={selectedType === 'sushi' ? 'default' : 'outline'}
                className="rounded-full"
              >
                🍣 Суши
              </Button>
              <Button
                onClick={() => setSelectedType('roll')}
                variant={selectedType === 'roll' ? 'default' : 'outline'}
                className="rounded-full"
              >
                🍱 Роллы
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 rounded-full shadow-lg"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Icon
                        name="Heart"
                        size={20}
                        className={favorites.includes(item.id) ? 'fill-red-500 text-red-500' : ''}
                      />
                    </Button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={18} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{item.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Есть в заведениях:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.restaurants.slice(0, 3).map((restaurant, idx) => (
                          <Badge key={idx} variant="secondary" className="rounded-full">
                            {restaurant}
                          </Badge>
                        ))}
                        {item.restaurants.length > 3 && (
                          <Badge variant="outline" className="rounded-full">
                            +{item.restaurants.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rating" className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 mb-6">
              <h2 className="text-3xl font-bold mb-2">Топ-10 заведений</h2>
              <p className="text-muted-foreground">Лучшие пиццерии и суши-бары по версии пользователей</p>
            </div>

            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-6 p-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine} • {restaurant.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Icon name="MessageSquare" size={16} />
                          <span>{restaurant.reviews} отзывов</span>
                        </div>
                      </div>
                    </div>

                    <Button className="rounded-full px-6">
                      Смотреть
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topRestaurants.map(restaurant => (
                <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={18} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Icon name="MapPin" size={16} />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button className="flex-1 rounded-full">Меню</Button>
                      <Button variant="outline" className="flex-1 rounded-full">
                        <Icon name="Phone" size={16} className="mr-2" />
                        Позвонить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Все заведения на карте</h2>
              <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-border">
                <MapContainer
                  center={[55.7558, 37.6173]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {topRestaurants.map(restaurant => (
                    <Marker key={restaurant.id} position={restaurant.coordinates}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Icon name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{restaurant.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{restaurant.address}</p>
                          <Button size="sm" className="w-full rounded-full" onClick={() => setActiveTab('restaurants')}>
                            Подробнее
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favoriteItems.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="Heart" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Нет избранных блюд</h3>
                <p className="text-muted-foreground mb-6">Добавьте блюда в избранное, чтобы быстро их находить</p>
                <Button onClick={() => setActiveTab('catalog')} className="rounded-full px-8">
                  Перейти к каталогу
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteItems.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 right-3 rounded-full shadow-lg"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Icon name="Heart" size={20} className="fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={18} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{item.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">Есть в заведениях:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.restaurants.slice(0, 3).map((restaurant, idx) => (
                            <Badge key={idx} variant="secondary" className="rounded-full">
                              {restaurant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;