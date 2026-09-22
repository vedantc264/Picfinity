import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import getPool, { initDatabase } from '../config/db.js';

dotenv.config();

const SEED_PHOTOS = [
  {
    title: 'Majestic Alpine Peaks',
    description: 'Golden hour sunlight breaking through misty mountain summits.',
    photo_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'Nature',
    likes: 42
  },
  {
    title: 'Emerald Forest River',
    description: 'A winding clear river surrounded by lush pine trees and mossy rocks.',
    photo_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Nature',
    likes: 88
  },
  {
    title: 'Wild Bengal Tiger',
    description: 'Intense gaze of a wild tiger prowling through dense tall grass.',
    photo_url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    category: 'Animals',
    likes: 125
  },
  {
    title: 'Curious Red Fox',
    description: 'A vibrant red fox looking curiously through fresh winter snow.',
    photo_url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=1200&q=80',
    category: 'Animals',
    likes: 76
  },
  {
    title: 'Vintage Supercar',
    description: 'A classic red supercar parked under vibrant neon city lights.',
    photo_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    category: 'Cars',
    likes: 93
  },
  {
    title: 'Sleek Modern Hypercar',
    description: 'Aerodynamic carbon fiber masterpiece on an open coastal highway.',
    photo_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    category: 'Cars',
    likes: 114
  },
  {
    title: 'Cafe Racer Motorcycle',
    description: 'Custom built vintage cafe racer motorcycle on an asphalt road.',
    photo_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Bikes',
    likes: 67
  },
  {
    title: 'Downhill Mountain Biker',
    description: 'Extreme adrenaline mountain biking down a rugged forest ridge.',
    photo_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    category: 'Bikes',
    likes: 54
  },
  {
    title: 'Abstract Oil Canvas',
    description: 'Vibrant dynamic strokes of cyan, magenta, and gold leaf paint.',
    photo_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    category: 'Art',
    likes: 130
  },
  {
    title: 'Minimalist Architecture',
    description: 'Striking geometric concrete and glass facade under deep blue skies.',
    photo_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    likes: 81
  },
  {
    title: 'Artisan Ceramic Pottery',
    description: 'Handcrafted stoneware ceramics with organic earth tone glaze.',
    photo_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    category: 'Crafts',
    likes: 45
  },
  {
    title: 'Artisanal Neapolitan Pizza',
    description: 'Wood-fired sourdough pizza topped with buffalo mozzarella and fresh basil.',
    photo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    category: 'Food',
    likes: 152
  },
  {
    title: 'Modern Cozy Living Room',
    description: 'Warm lighting, mid-century wooden furniture and leafy indoor plants.',
    photo_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    category: 'Decor',
    likes: 99
  },
  {
    title: 'Urban Street Fashion',
    description: 'Contemporary minimalist high-fashion portrait on city streets.',
    photo_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
    likes: 110
  }
];

export async function runSeed() {
  console.log('[Seed] Starting database seed...');
  await initDatabase();
  const pool = getPool();

  // Create demo user if not exists
  const [users] = await pool.query('SELECT id FROM users WHERE email = ?', ['demo@picfinity.com']);
  let userId;

  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userRes] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['Demo User', 'demo@picfinity.com', hashedPassword]
    );
    userId = userRes.insertId;
    console.log('[Seed] Created demo user: demo@picfinity.com (password: password123)');
  } else {
    userId = users[0].id;
  }

  // Check if photos table is empty
  const [photos] = await pool.query('SELECT COUNT(*) as count FROM photos');
  if (photos[0].count === 0) {
    for (const photo of SEED_PHOTOS) {
      await pool.query(
        'INSERT INTO photos (title, description, photo_url, category, likes, author_id) VALUES (?, ?, ?, ?, ?, ?)',
        [photo.title, photo.description, photo.photo_url, photo.category, photo.likes, userId]
      );
    }
    console.log(`[Seed] Seeded ${SEED_PHOTOS.length} photos.`);
  } else {
    console.log(`[Seed] Database already has ${photos[0].count} photos. Skipping photo insertion.`);
  }

  console.log('[Seed] Seeding completed successfully!');
}

// Run directly if invoked from command line
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
