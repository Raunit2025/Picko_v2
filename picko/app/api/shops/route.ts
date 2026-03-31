import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FoodCourt from "@/lib/models/FoodCourt";

export async function GET() {
  try {
    await connectDB();

    // 1. Check if the database is already seeded
    const count = await FoodCourt.countDocuments();

    // 2. Auto-Seeder: If empty, inject dummy data
    if (count === 0) {
      console.log("Database empty. Seeding Food Courts...");

      const seedData = [
        {
          name: "Main Block Cafeteria",
          location: "Central Campus",
          shops: [
            {
              name: "Slice of Heaven",
              description: "Wood-fired pizzas and sides.",
              image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
              rating: 4.5,
              items: [
                { name: "Margherita Pizza", description: "Classic cheese and tomato", price: 199, emoji: "🍕", tags: ["Veg", "Best Seller"] },
                { name: "Pepperoni Pizza", description: "Double pepperoni and cheese", price: 299, emoji: "🍕", tags: ["Non-Veg"] },
                { name: "Farmhouse Pizza", description: "Onion, capsicum, tomato, mushroom", price: 249, emoji: "🍕", tags: ["Veg"] },
                { name: "Garlic Breadsticks", description: "Freshly baked with cheese dip", price: 129, emoji: "🥖", tags: ["Veg", "Sides"] },
                { name: "Choco Lava Cake", description: "Warm chocolate cake with gooey center", price: 99, emoji: "🧁", tags: ["Dessert"] },
                { name: "Pepsi", description: "500ml", price: 50, emoji: "🥤", tags: ["Beverage"] },
                { name: "Cheese Dip", description: "Extra creamy cheese dip", price: 30, emoji: "🧀", tags: ["Add-on"] },
              ],
            },
            {
              name: "Brew & Beans",
              description: "Premium coffee and pastries.",
              image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
              rating: 4.8,
              items: [
                { name: "Cappuccino", description: "Rich espresso with steamed milk foam", price: 120, emoji: "☕", tags: ["Hot", "Best Seller"] },
                { name: "Iced Latte", description: "Chilled espresso and milk over ice", price: 140, emoji: "🧊", tags: ["Cold"] },
                { name: "Mocha Frappe", description: "Blended iced coffee with chocolate", price: 180, emoji: "🥤", tags: ["Cold", "Sweet"] },
                { name: "Butter Croissant", description: "Flaky, buttery French pastry", price: 90, emoji: "🥐", tags: ["Snack"] },
                { name: "Blueberry Muffin", description: "Freshly baked with real blueberries", price: 110, emoji: "🧁", tags: ["Snack", "Sweet"] },
                { name: "Espresso Shot", description: "Single shot of dark roast", price: 80, emoji: "☕", tags: ["Hot", "Strong"] },
                { name: "Green Tea", description: "Organic calming green tea", price: 70, emoji: "🍵", tags: ["Hot", "Healthy"] },
              ],
            },
          ],
        },
        {
          name: "Hostel Food Court",
          location: "North Wing",
          shops: [
            {
              name: "Desi Bites",
              description: "Authentic Indian thalis and curries.",
              image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
              rating: 4.2,
              items: [
                { name: "Deluxe Veg Thali", description: "Paneer, Dal Makhani, Mix Veg, Rice, 2 Rotis, Sweet", price: 220, emoji: "🍛", tags: ["Veg", "Meals"] },
                { name: "Chicken Tikka Masala", description: "Spicy and creamy boneless chicken curry", price: 280, emoji: "🍗", tags: ["Non-Veg", "Curry"] },
                { name: "Paneer Butter Masala", description: "Cottage cheese in rich tomato gravy", price: 240, emoji: "🍲", tags: ["Veg", "Curry"] },
                { name: "Garlic Naan", description: "Tandoori bread topped with garlic and butter", price: 50, emoji: "🫓", tags: ["Bread"] },
                { name: "Jeera Rice", description: "Basmati rice cooked with cumin seeds", price: 110, emoji: "🍚", tags: ["Rice"] },
                { name: "Sweet Lassi", description: "Traditional sweet yogurt drink", price: 60, emoji: "🥛", tags: ["Beverage"] },
                { name: "Gulab Jamun", description: "2 pieces of sweet milk dumplings", price: 40, emoji: "🍯", tags: ["Dessert"] },
              ],
            },
            {
              name: "Burger Station",
              description: "Juicy burgers and thick shakes.",
              image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
              rating: 4.6,
              items: [
                { name: "Classic Crispy Chicken", description: "Crispy fried chicken patty with mayo and lettuce", price: 180, emoji: "🍔", tags: ["Non-Veg", "Best Seller"] },
                { name: "Aloo Tikki Burger", description: "Spiced potato patty with mint mayo", price: 90, emoji: "🍔", tags: ["Veg"] },
                { name: "Double Cheese Smash", description: "Two beef patties, double cheese, caramelized onions", price: 320, emoji: "🍔", tags: ["Non-Veg", "Premium"] },
                { name: "Peri Peri Fries", description: "Crispy fries tossed in spicy peri peri seasoning", price: 110, emoji: "🍟", tags: ["Sides", "Spicy"] },
                { name: "Onion Rings", description: "Golden fried crispy onion rings", price: 130, emoji: "🧅", tags: ["Sides"] },
                { name: "Oreo Milkshake", description: "Thick shake blended with Oreo cookies", price: 160, emoji: "🥤", tags: ["Beverage", "Sweet"] },
                { name: "Cold Coffee", description: "Classic cold coffee with ice cream", price: 140, emoji: "🧋", tags: ["Beverage"] },
              ],
            },
          ],
        },
        {
          name: "Library Cafe",
          location: "Quiet Zone",
          shops: [
            {
              name: "Zen Sushi",
              description: "Fresh and healthy Japanese cuisine.",
              image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
              rating: 4.9,
              items: [
                { name: "California Roll", description: "Crab, avocado, and cucumber (8 pieces)", price: 450, emoji: "🍣", tags: ["Seafood", "Best Seller"] },
                { name: "Spicy Tuna Roll", description: "Fresh tuna with spicy mayo (8 pieces)", price: 480, emoji: "🍣", tags: ["Seafood", "Spicy"] },
                { name: "Veggie Tempura Roll", description: "Crispy vegetable tempura inside (8 pieces)", price: 350, emoji: "🍱", tags: ["Veg"] },
                { name: "Salmon Nigiri", description: "Fresh salmon over pressed rice (2 pieces)", price: 280, emoji: "🍣", tags: ["Seafood"] },
                { name: "Edamame", description: "Steamed soybeans with sea salt", price: 180, emoji: "🫛", tags: ["Veg", "Sides"] },
                { name: "Miso Soup", description: "Traditional Japanese soup with tofu and seaweed", price: 150, emoji: "🥣", tags: ["Soup"] },
                { name: "Matcha Mochi", description: "Green tea flavored rice cake with ice cream filling", price: 200, emoji: "🍡", tags: ["Dessert"] },
              ],
            },
            {
              name: "Fit Bowls",
              description: "Salads, smoothies, and power foods.",
              image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
              rating: 4.4,
              items: [
                { name: "Chicken Caesar Salad", description: "Grilled chicken, romaine lettuce, parmesan, croutons", price: 260, emoji: "🥗", tags: ["Non-Veg", "Healthy"] },
                { name: "Quinoa Power Bowl", description: "Quinoa, roasted veggies, avocado, tahini dressing", price: 290, emoji: "🥗", tags: ["Veg", "Vegan"] },
                { name: "Greek Salad", description: "Cucumbers, tomatoes, olives, feta cheese", price: 220, emoji: "🥗", tags: ["Veg", "Healthy"] },
                { name: "Whey Protein Shake", description: "Chocolate protein blended with almond milk and banana", price: 200, emoji: "🥤", tags: ["Beverage", "Fitness"] },
                { name: "Avocado Toast", description: "Smashed avocado on sourdough with chili flakes", price: 180, emoji: "🥑", tags: ["Veg", "Snack"] },
                { name: "Berry Smoothie Bowl", description: "Mixed berries, granola, chia seeds, coconut flakes", price: 240, emoji: "🥣", tags: ["Veg", "Breakfast"] },
                { name: "Kombucha", description: "Fermented fizzy probiotic tea", price: 150, emoji: "🍾", tags: ["Beverage", "Healthy"] },
              ],
            },
          ],
        },
      ];

      await FoodCourt.insertMany(seedData);
      console.log("Database seeded successfully!");
    }

    // 3. Fetch and return all Food Courts with their nested shops and items
    const foodCourts = await FoodCourt.find({}).lean();

    return NextResponse.json(foodCourts, { status: 200 });

  } catch (error) {
    console.error("Shops API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" }, 
      { status: 500 }
    );
  }
}