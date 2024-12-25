import { sql } from '@vercel/postgres';

const connectionString = process.env.POSTGRES_URL || 'postgresql://neondb_owner:3Ey2lxhdeQNA@ep-odd-meadow-a1m7mirj.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Create tables if they don't exist
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_images (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        image_data BYTEA NOT NULL,
        mime_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON user_images(user_id);
    `;
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize tables
initDB();

// Function to upload image
export async function uploadImage(userId: string, imageBuffer: Buffer, mimeType: string): Promise<number> {
  const result = await sql`
    INSERT INTO user_images (user_id, image_data, mime_type) 
    VALUES (${userId}, ${imageBuffer}, ${mimeType}) 
    RETURNING id
  `;
  return result.rows[0].id;
}

// Function to get image
export async function getImage(userId: string): Promise<{ imageData: Buffer; mimeType: string } | null> {
  const result = await sql`
    SELECT image_data, mime_type 
    FROM user_images 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  
  if (result.rows.length === 0) {
    return null;
  }

  return {
    imageData: result.rows[0].image_data,
    mimeType: result.rows[0].mime_type,
  };
}

// Function to update image
export async function updateImage(userId: string, imageBuffer: Buffer, mimeType: string): Promise<void> {
  await sql`
    UPDATE user_images 
    SET image_data = ${imageBuffer}, 
        mime_type = ${mimeType}, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = (
      SELECT id 
      FROM user_images 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 1
    )
  `;
} 