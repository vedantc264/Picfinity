import getPool from '../config/db.js';

export async function uploadPhoto(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    const { title, description, category } = req.body;
    let photoUrl = req.body.imageUrl || req.body.photo_url;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    if (!photoUrl) {
      return res.status(400).json({ Api_Response: 316, message: 'Please provide an image file or imageUrl' });
    }
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO photos (title, description, photo_url, category, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', photoUrl, category || 'Nature', userId]
    );

    return res.status(201).json({
      message: 'Photo added successfully',
      verified: true,
      photo: {
        photoId: result.insertId,
        id: result.insertId,
        title,
        description,
        photo_url: photoUrl,
        category: category || 'Nature',
        authorId: userId
      }
    });
  } catch (error) {
    console.error('[PhotoController.uploadPhoto]', error);
    return res.status(500).json({ Api_Response: 316, message: 'Error saving photo' });
  }
}

export async function getAllPhotosUnprotected(req, res) {
  try {
    const pool = getPool();
    const [photos] = await pool.query(`
      SELECT 
        p.id AS photoId,
        p.id,
        p.title,
        p.description,
        p.photo_url,
        p.category,
        p.likes,
        p.created_at,
        p.author_id AS authorId,
        u.name AS authorName
      FROM photos p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.id DESC
    `);

    return res.json({ photos });
  } catch (error) {
    console.error('[PhotoController.getAllPhotosUnprotected]', error);
    return res.status(500).json({ Api_Response: 315, message: 'Error getting all photos' });
  }
}

export async function getAllUploadedPhotos(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    const pool = getPool();

    const [photos] = await pool.query(
      `
      SELECT 
        p.id AS photoId,
        p.id,
        p.title,
        p.description,
        p.photo_url,
        p.category,
        p.likes,
        p.created_at,
        p.author_id AS authorId,
        u.name AS authorName
      FROM photos p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ?
      ORDER BY p.id DESC
    `,
      [userId]
    );

    return res.json({ photos });
  } catch (error) {
    console.error('[PhotoController.getAllUploadedPhotos]', error);
    return res.status(500).json({ Api_Response: 318, message: 'Error getting uploaded photos' });
  }
}

export async function saveAPhoto(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    let photoId = req.headers.photo_id || req.body.photo_id || req.body.photoId;

    if (!photoId) {
      return res.status(400).json({ Api_Response: 322, message: 'Provide the photoId to save' });
    }
    photoId = parseInt(photoId, 10);

    const pool = getPool();

    // Verify photo exists
    const [photos] = await pool.query('SELECT id FROM photos WHERE id = ?', [photoId]);
    if (photos.length === 0) {
      return res.status(404).json({ Api_Response: 322, message: 'No such photo uploaded' });
    }

    // Check if already saved
    const [existing] = await pool.query(
      'SELECT id FROM saved_photos WHERE user_id = ? AND photo_id = ?',
      [userId, photoId]
    );

    if (existing.length > 0) {
      // If client requests toggle or already saved
      if (req.query.toggle === 'true') {
        await pool.query('DELETE FROM saved_photos WHERE user_id = ? AND photo_id = ?', [userId, photoId]);
        return res.json({ saved: false, message: 'Photo removed from saved' });
      }
      return res.json({ Api_Response: 323, message: 'Photo already saved' });
    }

    await pool.query('INSERT INTO saved_photos (user_id, photo_id) VALUES (?, ?)', [userId, photoId]);
    return res.json({ Api_Response: 321, message: 'The Photo is saved', saved: true });
  } catch (error) {
    console.error('[PhotoController.saveAPhoto]', error);
    return res.status(500).json({ Api_Response: 319, message: 'Error in saving photo' });
  }
}

export async function getAllSavedPhoto(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    const pool = getPool();

    const [photos] = await pool.query(
      `
      SELECT 
        p.id AS photoId,
        p.id,
        p.title,
        p.description,
        p.photo_url,
        p.category,
        p.likes,
        p.created_at,
        p.author_id AS authorId,
        u.name AS authorName
      FROM saved_photos sp
      JOIN photos p ON sp.photo_id = p.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE sp.user_id = ?
      ORDER BY sp.id DESC
    `,
      [userId]
    );

    return res.json({ photos });
  } catch (error) {
    console.error('[PhotoController.getAllSavedPhoto]', error);
    return res.status(500).json({ Api_Response: 324, message: 'Error in getAllSavedPhoto' });
  }
}

export async function getPhotosByCategory(req, res) {
  try {
    const category = req.headers.category || req.params.category || req.query.category;
    if (!category) {
      return res.status(400).json({ Api_Response: 326, message: 'No category provided' });
    }

    const pool = getPool();
    const [photos] = await pool.query(
      `
      SELECT 
        p.id AS photoId,
        p.id,
        p.title,
        p.description,
        p.photo_url,
        p.category,
        p.likes,
        p.created_at,
        p.author_id AS authorId,
        u.name AS authorName
      FROM photos p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE LOWER(p.category) = LOWER(?)
      ORDER BY p.id DESC
    `,
      [category]
    );

    return res.json({ photos });
  } catch (error) {
    console.error('[PhotoController.getPhotosByCategory]', error);
    return res.status(500).json({ Api_Response: 325, message: 'Error getting photos by category' });
  }
}

const DEFAULT_CATEGORIES = [
  'Nature',
  'Animals',
  'Cars',
  'Bikes',
  'Sports',
  'Art',
  'Design',
  'Crafts',
  'Food',
  'Quotes',
  'Tatoos',
  'Fashion',
  'Decor'
];

export async function getAllCategories(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT DISTINCT category FROM photos WHERE category IS NOT NULL AND category != ""');

    const categorySet = new Set(DEFAULT_CATEGORIES);
    rows.forEach((row) => {
      if (row.category) categorySet.add(row.category);
    });

    return res.json({ categories: Array.from(categorySet) });
  } catch (error) {
    console.error('[PhotoController.getAllCategories]', error);
    return res.json({ categories: DEFAULT_CATEGORIES });
  }
}

export async function deleteAPhoto(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    let photoId = req.headers.photo_id || req.body.photo_id || req.params.photoId;

    if (!photoId) {
      return res.status(400).json({ Api_Response: 322, message: 'Provide the photoId to delete' });
    }
    photoId = parseInt(photoId, 10);

    const pool = getPool();

    // Check if photo exists and belongs to user
    const [photos] = await pool.query('SELECT * FROM photos WHERE id = ?', [photoId]);
    if (photos.length === 0) {
      return res.status(404).json({ Api_Response: 322, message: 'No such photo uploaded' });
    }

    if (photos[0].author_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this photo' });
    }

    // Delete photo - cascading foreign keys in MySQL will automatically delete from saved_photos
    await pool.query('DELETE FROM photos WHERE id = ?', [photoId]);

    return res.json({ Api_Response: 321, message: 'The Photo is deleted', deleted: true });
  } catch (error) {
    console.error('[PhotoController.deleteAPhoto]', error);
    return res.status(500).json({ Api_Response: 319, message: 'Error deleting photo' });
  }
}
