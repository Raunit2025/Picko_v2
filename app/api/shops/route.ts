import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FoodCourt from '@/lib/models/FoodCourt';

const foodCourtsData = [
  {
    id: 'bh1',
    name: 'BH-1 Food Court',
    tagline: 'Most popular on campus',
    emoji: '🏛️',
    badge: '🔥 Trending',
    badgeColor: 'bg-red-100 text-red-600',
    rating: 4.8,
    reviews: 124,
    distance: '2 min walk',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'dominos',
        name: "Domino's Pizza",
        emoji: '🍕',
        rating: 4.9,
        reviews: 320,
        timeLabel: '20-30 min',
        tag: 'Best Seller',
        coverImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'd1', category: 'Pizza', foodName: '🍕 Margherita Pizza', price: 199, rating: 4.8, description: 'Classic tomato base with loads of fresh mozzarella cheese and basil.' },
          { id: 'd2', category: 'Pizza', foodName: '🧀 Peppy Paneer', price: 249, rating: 4.9, description: 'Juicy paneer chunks with crisp capsicum and tangy tomato sauce.' },
          { id: 'd3', category: 'Pizza', foodName: '🍗 Chicken Dominator', price: 399, rating: 4.7, description: 'Loaded with grilled chicken, double pepper BBQ, and herb seasoning.' },
          { id: 'd4', category: 'Pizza', foodName: '🌶️ Overloaded', price: 349, rating: 4.8, description: 'Double cheese, jalapeños, mushrooms, and golden corn on a crispy base.' },
          { id: 'd5', category: 'Pizza', foodName: '🥦 Garden Fresh', price: 279, rating: 4.6, description: 'Loaded with fresh veggies — broccoli, olives, capsicum, and onion.' },
          { id: 'd6', category: 'Sides', foodName: '🥖 Garlic Breadsticks', price: 99, rating: 4.6, description: 'Freshly baked sticks brushed with garlic butter and Italian herbs.' },
          { id: 'd7', category: 'Sides', foodName: '🍗 Chicken Wings (6pc)', price: 189, rating: 4.7, description: 'Crispy BBQ-glazed chicken wings with ranch dip.' },
          { id: 'd8', category: 'Drinks', foodName: '🥤 Coke 500ml', price: 60, rating: 4.5, description: 'Ice-cold Coca-Cola to wash down your pizza.' },
        ]
      },
      {
        id: 'ccd',
        name: 'Café Coffee Day',
        emoji: '☕',
        rating: 4.6,
        reviews: 215,
        timeLabel: '10-15 min',
        tag: 'Quick Bites',
        coverImage: 'https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'c1', category: 'Coffee', foodName: '☕ Cappuccino', price: 130, rating: 4.9, description: 'Rich espresso with creamy steamed milk foam, the classic café choice.' },
          { id: 'c2', category: 'Coffee', foodName: '❄️ Cold Coffee', price: 150, rating: 4.8, description: 'Chilled blended coffee with milk and a drizzle of Belgian caramel.' },
          { id: 'c3', category: 'Coffee', foodName: '☁️ Dalgona Coffee', price: 165, rating: 4.7, description: 'Velvety whipped coffee foam over cold milk — the Instagram favourite.' },
          { id: 'c4', category: 'Snacks', foodName: '🥐 Vada Pav', price: 35, rating: 4.7, description: 'Spiced potato fritter in a toasted bun with green and tamarind chutneys.' },
          { id: 'c5', category: 'Snacks', foodName: '🥪 Club Sandwich', price: 120, rating: 4.6, description: 'Toasted multi-grain with veggies, cheese, and chipotle mayo sauce.' },
          { id: 'c6', category: 'Snacks', foodName: '🫓 Panini', price: 140, rating: 4.6, description: 'Grilled Italian flatbread with mozzarella, tomato, and pesto.' },
          { id: 'c7', category: 'Desserts', foodName: '🧁 Chocolate Muffin', price: 80, rating: 4.8, description: 'Moist dark chocolate muffin bursting with melty choco chips.' },
          { id: 'c8', category: 'Drinks', foodName: '🍋 Lemon Iced Tea', price: 90, rating: 4.5, description: 'Refreshing brew with real lemon zest and a hint of fresh mint.' },
        ]
      },
      {
        id: 'subway',
        name: 'Subway Express',
        emoji: '🥖',
        rating: 4.5,
        reviews: 178,
        timeLabel: '15-20 min',
        tag: 'Healthy Options',
        coverImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'sw1', category: 'Subs', foodName: '🥗 Veggie Delight Sub', price: 179, rating: 4.7, description: 'Packed with crunchy garden veggies in your choice of bread.' },
          { id: 'sw2', category: 'Subs', foodName: '🍗 Chicken Teriyaki Sub', price: 219, rating: 4.8, description: 'Tender chicken with sweet teriyaki sauce and fresh lettuce.' },
          { id: 'sw3', category: 'Subs', foodName: '🥩 Steak & Cheese Sub', price: 259, rating: 4.9, description: 'Tender strips of steak with melted cheese and sautéed peppers.' },
          { id: 'sw4', category: 'Subs', foodName: '🧆 Falafel Sub', price: 199, rating: 4.6, description: 'Crispy falafel balls with tahini sauce and pickled veggies.' },
          { id: 'sw5', category: 'Wraps', foodName: '🌯 Chicken Caesar Wrap', price: 189, rating: 4.7, description: 'Grilled chicken, romaine, parmesan and caesar dressing in a warm wrap.' },
          { id: 'sw6', category: 'Sides', foodName: '🍪 Choco Chip Cookie', price: 60, rating: 4.8, description: 'Freshly baked soft cookie loaded with chocolate chips.' },
        ]
      },
    ]
  },
  {
    id: 'central',
    name: 'Central Food Court',
    tagline: 'Variety you\'ll love',
    emoji: '🏢',
    badge: '⭐ Top Rated',
    badgeColor: 'bg-amber-100 text-amber-700',
    rating: 4.5,
    reviews: 89,
    distance: '5 min walk',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'lapinoz',
        name: "La Pino'z Pizza",
        emoji: '🍕',
        rating: 4.7,
        reviews: 180,
        timeLabel: '25-35 min',
        tag: 'Fan Favourite',
        coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'l1', category: 'Pizza', foodName: '🌶️ Schezwan Pizza', price: 229, rating: 4.8, description: 'Fiery Schezwan sauce base with veggies and a generous cheesy topping.' },
          { id: 'l2', category: 'Asian', foodName: '🥟 Veg Momos (8pc)', price: 89, rating: 4.9, description: 'Steamed dumplings stuffed with spiced cabbage, carrots and ginger.' },
          { id: 'l3', category: 'Asian', foodName: '🥟 Chicken Momos (8pc)', price: 119, rating: 4.9, description: 'Juicy chicken dumplings with a fiery chilli dip on the side.' },
          { id: 'l4', category: 'Snacks', foodName: '🌽 Cheese Corn Roll', price: 120, rating: 4.7, description: 'Crispy golden roll filled with cheesy sweet corn, herbs and spices.' },
          { id: 'l5', category: 'Pizza', foodName: '🧀 Cheese Burst', price: 299, rating: 4.9, description: 'Signature oozing cheese-stuffed crust with your choice of classic topping.' },
          { id: 'l6', category: 'Sides', foodName: '🍟 Crispy Fries', price: 79, rating: 4.6, description: 'Golden, perfectly salted crinkle fries with house dipping sauce.' },
          { id: 'l7', category: 'Desserts', foodName: '🍫 Choco Lava Cup', price: 99, rating: 4.8, description: 'Warm brownie cup with flowing molten chocolate inside — pure bliss.' },
          { id: 'l8', category: 'Drinks', foodName: '🍹 Fresh Lime Soda', price: 60, rating: 4.5, description: 'Zingy lime with a choice of sweet, salted, or mixed soda.' },
        ]
      },
      {
        id: 'thali',
        name: 'Desi Thali Hub',
        emoji: '🍛',
        rating: 4.4,
        reviews: 95,
        timeLabel: '15-25 min',
        tag: 'Home Style',
        coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 't1', category: 'Thali', foodName: '🍛 Full Veg Thali', price: 120, rating: 4.7, description: 'Rice, 2 rotis, dal, sabzi, kachumber salad, pickle & papad — a complete meal.' },
          { id: 't2', category: 'Thali', foodName: '🍗 Chicken Thali', price: 160, rating: 4.8, description: 'Hearty chicken curry, jeera rice, 2 rotis, raita, and salad.' },
          { id: 't3', category: 'Mains', foodName: '🫕 Paneer Butter Masala', price: 140, rating: 4.9, description: 'Silky tomato-butter gravy with soft paneer cubes. Best with butter naan.' },
          { id: 't4', category: 'Mains', foodName: '🍗 Butter Chicken', price: 165, rating: 4.8, description: 'Mildly spiced rich tomato gravy with tender chicken chunks.' },
          { id: 't5', category: 'Breads', foodName: '🫓 Butter Naan (2pc)', price: 40, rating: 4.7, description: 'Soft, fluffy naan brushed generously with fresh butter.' },
          { id: 't6', category: 'Breads', foodName: '🫓 Garlic Naan (2pc)', price: 50, rating: 4.8, description: 'Crispy around the edges, topped with golden garlic and coriander.' },
          { id: 't7', category: 'Desserts', foodName: '🍮 Gulab Jamun (2pc)', price: 50, rating: 4.8, description: 'Soft milk-solid dumplings soaked in fragrant cardamom syrup.' },
          { id: 't8', category: 'Drinks', foodName: '🥛 Sweet Lassi', price: 60, rating: 4.7, description: 'Chilled, thick yogurt drink with just a pinch of saffron and rose.' },
        ]
      },
      {
        id: 'burgerking',
        name: 'BK Café',
        emoji: '🍔',
        rating: 4.6,
        reviews: 240,
        timeLabel: '10-20 min',
        tag: '🔥 New Arrival',
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'bk1', category: 'Burgers', foodName: '🍔 Whopper', price: 249, rating: 4.8, description: 'Fire-grilled beef patty with fresh lettuce, tomato, onion, and mayo.' },
          { id: 'bk2', category: 'Burgers', foodName: '🌶️ Spicy Crispy Chicken', price: 229, rating: 4.9, description: 'Crunchy fried chicken with fiery sauce on a toasted sesame bun.' },
          { id: 'bk3', category: 'Burgers', foodName: '🧀 Double Cheese Burger', price: 269, rating: 4.7, description: 'Double beef patties with two layers of melted American cheese.' },
          { id: 'bk4', category: 'Burgers', foodName: '🥗 Veggie Bean Burger', price: 169, rating: 4.6, description: 'Crispy veggie bean patty with fresh veggies and chipotle sauce.' },
          { id: 'bk5', category: 'Sides', foodName: '🍟 BK Fries (Large)', price: 99, rating: 4.5, description: 'Thick-cut, golden, perfectly seasoned fries served hot.' },
          { id: 'bk6', category: 'Sides', foodName: '🧅 Onion Rings', price: 89, rating: 4.6, description: 'Golden battered onion rings, crispy outside, sweet inside.' },
          { id: 'bk7', category: 'Shakes', foodName: '🍫 Chocolate Milkshake', price: 129, rating: 4.8, description: 'Thick, creamy, real-ice-cream milkshake with rich chocolate syrup.' },
          { id: 'bk8', category: 'Shakes', foodName: '🍓 Strawberry Shake', price: 119, rating: 4.7, description: 'Frosty strawberry milkshake blended with real fruit.' },
        ]
      },
    ]
  },
  {
    id: 'north',
    name: 'North Campus Hub',
    tagline: 'Fast food paradise',
    emoji: '🏫',
    badge: '🆕 New',
    badgeColor: 'bg-blue-100 text-blue-600',
    rating: 4.3,
    reviews: 52,
    distance: '8 min walk',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=900',
    shops: [
      {
        id: 'rolls',
        name: 'Roll Junction',
        emoji: '🌯',
        rating: 4.5,
        reviews: 130,
        timeLabel: '10-15 min',
        tag: 'Street Food',
        coverImage: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'r1', category: 'Rolls', foodName: '🌯 Paneer Tikka Roll', price: 99, rating: 4.9, description: 'Charred paneer tikka wrapped in a buttery paratha with mint chutney.' },
          { id: 'r2', category: 'Rolls', foodName: '🌯 Chicken Kathi Roll', price: 119, rating: 4.8, description: 'Spicy egg-coated chicken wrapped in a flaky paratha with onion rings.' },
          { id: 'r3', category: 'Rolls', foodName: '🥚 Egg Roll', price: 69, rating: 4.7, description: 'Classic street-style double egg roll, crispy and satisfying.' },
          { id: 'r4', category: 'Rolls', foodName: '🫕 Kadai Paneer Roll', price: 109, rating: 4.8, description: 'Smoky kadai paneer stuffed inside a whole wheat layered paratha.' },
          { id: 'r5', category: 'Snacks', foodName: '🥔 Aloo Tikki Chaat', price: 60, rating: 4.6, description: 'Crispy potato patties topped with tangy chutneys, yoghurt, and sev.' },
          { id: 'r6', category: 'Drinks', foodName: '🥤 Nimbu Pani', price: 30, rating: 4.6, description: 'Fresh lime juice with black salt, cumin, and a hint of mint.' },
        ]
      },
      {
        id: 'sushi',
        name: 'Sakura Sushi Bar',
        emoji: '🍣',
        rating: 4.8,
        reviews: 88,
        timeLabel: '25-40 min',
        tag: '✨ Premium',
        coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=900',
        items: [
          { id: 'su1', category: 'Sushi', foodName: '🍣 California Roll (8pc)', price: 299, rating: 4.8, description: 'Crab, avocado, cucumber wrapped in seasoned sushi rice and nori.' },
          { id: 'su2', category: 'Sushi', foodName: '🐟 Salmon Sashimi (6pc)', price: 399, rating: 4.9, description: 'Premium fresh-cut Atlantic salmon, served with soy and wasabi.' },
          { id: 'su3', category: 'Sushi', foodName: '🥢 Dragon Roll (8pc)', price: 349, rating: 4.9, description: 'Inside-out roll topped with sliced avocado and spicy mayo.' },
          { id: 'su4', category: 'Sushi', foodName: '🌿 Veggie Roll (8pc)', price: 229, rating: 4.6, description: 'Cucumber, avocado, capsicum and cream cheese — light and fresh.' },
          { id: 'su5', category: 'Mains', foodName: '🍜 Chicken Ramen', price: 279, rating: 4.7, description: 'Rich tonkotsu broth with chicken chashu, soft-boiled egg, and noodles.' },
          { id: 'su6', category: 'Sides', foodName: '🥟 Gyoza (6pc)', price: 189, rating: 4.8, description: 'Pan-fried Japanese dumplings with a crispy bottom, served with soy dip.' },
          { id: 'su7', category: 'Drinks', foodName: '🍵 Matcha Latte', price: 159, rating: 4.7, description: 'Creamy, earthy ceremonial-grade matcha with steamed oat milk.' },
          { id: 'su8', category: 'Desserts', foodName: '🍡 Mochi Ice Cream (3pc)', price: 199, rating: 4.8, description: 'Pillowy Japanese rice cake filled with premium ice cream — assorted flavours.' },
        ]
      },
    ]
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Auto-seed if database is empty
    const count = await FoodCourt.countDocuments();
    if (count === 0) {
      await FoodCourt.insertMany(foodCourtsData);
    }

    const foodCourts = await FoodCourt.find().lean();
    return NextResponse.json({ foodCourts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching shops' }, { status: 500 });
  }
}
