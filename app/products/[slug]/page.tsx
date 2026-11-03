import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, ensureSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';

type ProductDetail = { name: string; slug: string; category: string; description: string; image_url: string; packaging_options?: string; specifications?: string };

const knownProducts: ProductDetail[] = [
  { name: 'Yellow Mustard Oil', slug: 'yellow-mustard-oil', category: 'Oils', description: 'The company’s bestselling oil. Contact us to discuss product and bulk supply requirements.', image_url: '' },
  { name: 'Groundnut Seeds', slug: 'groundnut-seeds', category: 'Seeds', description: 'A product identified by the company. Contact us to discuss product and bulk supply requirements.', image_url: '/Groundnut_Seeds.jpg' },
  { name: 'Sesame Seeds', slug: 'sesame-seeds', category: 'Seeds', description: 'A product identified by the company. Contact us to discuss product and bulk supply requirements.', image_url: '/Sesame_Seeds_Photo_2.jpg' },
  { name: 'Sesame Oil', slug: 'sesame-oil', category: 'Oils', description: 'A product identified by the company. Contact us to discuss product and bulk supply requirements.', image_url: '' },
  { name: 'Yellow Mustard Seeds', slug: 'yellow-mustard-seeds', category: 'Seeds', description: 'Product shown in the company-provided resource folder. Contact us for details.', image_url: '/Yellow_Mustard_Seeds.jpg' },
  { name: 'Black Mustard Seeds', slug: 'black-mustard-seeds', category: 'Seeds', description: 'Product shown in the company-provided resource folder. Contact us for details.', image_url: '/Black_Mustard_Seeds.jpg' },
  { name: 'Black Sesame Seeds', slug: 'black-sesame-seeds', category: 'Seeds', description: 'Product shown in the company-provided resource folder. Contact us for details.', image_url: '/Black_Sesame_Seeds.jpg' },
  { name: 'Yellow Mustard Cake', slug: 'yellow-mustard-cake', category: 'De-oiled Cakes', description: 'Product shown in the company-provided resource folder. Contact us for details.', image_url: '/Yellow_Mustard_Cake.jpg' },
  { name: 'Black Mustard Cake', slug: 'black-mustard-cake', category: 'De-oiled Cakes', description: 'Product shown in the company-provided resource folder. Contact us for details.', image_url: '/Black_Mustard_Cake.jpg' }
];

export default async function ProductDetails({ params }: { params: { slug: string } }) {
  let product = knownProducts.find((item) => item.slug === params.slug);
  try {
    await ensureSchema();
    const result = await db().query(
      'SELECT name, slug, category, description, packaging_options, specifications, image_url FROM products WHERE slug = $1 AND is_published = TRUE LIMIT 1',
      [params.slug]
    );
    product = result.rows[0];
  } catch {
    // Public details remain available from the verified catalog if PostgreSQL is not configured.
  }
  if (!product) notFound();

  return (
    <main className="privacy-page product-detail-page">
      <Link href="/#products" className="text-link">← Back to products</Link>
      <p className="eyebrow">{product.category}</p>
      <h1>{product.name}</h1>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.image_url ? <img src={product.image_url} alt={product.name} /> : <p>Official product image not available.</p>}
        </div>
        <div>
          <p>{product.description || 'Contact us to discuss this product and your requirements.'}</p>
          {product.packaging_options && <p><strong>Packaging:</strong> {product.packaging_options}</p>}
          {product.specifications && <p><strong>Specifications:</strong> {product.specifications}</p>}
          <p>For availability, packaging and specifications, please contact the company to confirm.</p>
          <Link className="button button-dark" href={`/?product=${encodeURIComponent(product.name)}#quote`}>Request a quote <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </main>
  );
}
