import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Note: These should match your .env values
const supabaseUrl = "https://ndsjdveztbxqeulpyspk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kc2pkdmV6dGJ4cWV1bHB5c3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjE4ODAsImV4cCI6MjA5NjczNzg4MH0.paoXut3kY2a8ZYZWxx9z9oRXlbZBf1w_hT45EokDdd4";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Lifestyle'];
const materials = ['18K Gold', 'Sterling Silver', 'Rose Gold', 'Platinum', 'Diamond Studded'];
const styles = ['Contemporary', 'Vintage', 'Minimalist', 'Bohemian', 'Royal'];

const jewelryImages = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  'https://images.unsplash.com/photo-1535633302703-b0703af2953a',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
  'https://images.unsplash.com/photo-1573408302185-91275f9639f7',
  'https://images.unsplash.com/photo-1584302174644-02d54037b14d',
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638',
  'https://images.unsplash.com/photo-1630030532634-21701643bc2a'
];

async function seedProducts() {
  console.log('💎 Starting to generate 500 premium products...');
  
  const products = [];
  
  for (let i = 0; i < 500; i++) {
    const price = faker.number.int({ min: 1500, max: 150000 });
    const originalPrice = Math.floor(price * (1 + faker.number.float({ min: 0.1, max: 0.4 })));
    
    products.push({
      title: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.helpers.arrayElement(['Necklace', 'Ring', 'Earrings', 'Bracelet', 'Bangle'])}`,
      description: faker.commerce.productDescription(),
      price: price,
      original_price: originalPrice,
      discount_percentage: Math.round(((originalPrice - price) / originalPrice) * 100),
      image_url: `${faker.helpers.arrayElement(jewelryImages)}?auto=format&fit=crop&q=80&w=800`,
      category: faker.helpers.arrayElement(categories),
      rating: faker.number.float({ min: 3.8, max: 5.0, fractionDigits: 1 }),
      rating_count: faker.number.int({ min: 10, max: 2500 }),
      stock: faker.number.int({ min: 0, max: 50 }),
      material: faker.helpers.arrayElement(materials),
      style: faker.helpers.arrayElement(styles),
    });
  }

  // Insert in batches of 50 to avoid payload limits
  for (let i = 0; i < products.length; i += 50) {
    const batch = products.slice(i, i + 50);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error(`❌ Error inserting batch ${i/50 + 1}:`, error.message);
    } else {
      console.log(`✅ Batch ${i/50 + 1} (50 products) inserted successfully.`);
    }
  }

  console.log('✨ Seeding complete! AV KART now has a massive inventory.');
}

seedProducts();
