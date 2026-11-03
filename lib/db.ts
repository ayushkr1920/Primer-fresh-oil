import { Pool } from 'pg';

let pool: Pool | undefined;
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured. Add a PostgreSQL connection string to your environment variables.');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }, max: 5 });
  return pool;
}

export async function ensureSchema() {
  const sql = db();
  await sql.query(`CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Edible Oil',
    packaging_options TEXT NOT NULL DEFAULT '', specifications TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '', is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await sql.query(`CREATE TABLE IF NOT EXISTS quote_requests (
    id BIGSERIAL PRIMARY KEY, reference_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL, business_name TEXT NOT NULL,
    business_email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '',
    products_requested TEXT NOT NULL, quantity TEXT NOT NULL, quantity_unit TEXT NOT NULL,
    packaging_preference TEXT NOT NULL DEFAULT '', application TEXT NOT NULL DEFAULT '',
    delivery_region TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New','In Progress','Responded','Closed')),
    internal_notes TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await sql.query(`CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests(created_at DESC)`);
  await sql.query(`INSERT INTO products (name, slug, description, category, is_published)
    VALUES ($1,$2,$3,$4,TRUE) ON CONFLICT (slug) DO NOTHING`,
    ['Yellow Mustard Oil','yellow-mustard-oil','The company’s bestselling oil. Contact us to discuss product and bulk supply requirements.','Oils']);
  const catalog = [
    ['Groundnut Seeds','groundnut-seeds','A product identified by the company. Contact us to discuss product and bulk supply requirements.','Seeds','/Groundnut_Seeds.jpg'],
    ['Sesame Seeds','sesame-seeds','A product identified by the company. Contact us to discuss product and bulk supply requirements.','Seeds','/Sesame_Seeds_Photo_2.jpg'],
    ['Sesame Oil','sesame-oil','A product identified by the company. Contact us to discuss product and bulk supply requirements.','Oils',''],
    ['Yellow Mustard Seeds','yellow-mustard-seeds','Product shown in the company-provided resource folder. Contact us for details.','Seeds','/Yellow_Mustard_Seeds.jpg'],
    ['Black Mustard Seeds','black-mustard-seeds','Product shown in the company-provided resource folder. Contact us for details.','Seeds','/Black_Mustard_Seeds.jpg'],
    ['Black Sesame Seeds','black-sesame-seeds','Product shown in the company-provided resource folder. Contact us for details.','Seeds','/Black_Sesame_Seeds.jpg'],
    ['Yellow Mustard Cake','yellow-mustard-cake','Product shown in the company-provided resource folder. Contact us for details.','De-oiled Cakes','/Yellow_Mustard_Cake.jpg'],
    ['Black Mustard Cake','black-mustard-cake','Product shown in the company-provided resource folder. Contact us for details.','De-oiled Cakes','/Black_Mustard_Cake.jpg']
  ];
  for (const [name, slug, description, category, image_url] of catalog) {
    await sql.query(`INSERT INTO products (name, slug, description, category, image_url, is_published)
      VALUES ($1,$2,$3,$4,$5,TRUE) ON CONFLICT (slug) DO NOTHING`,
      [name, slug, description, category, image_url]);
  }
}
