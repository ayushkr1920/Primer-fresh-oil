import { NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';
export const dynamic = 'force-dynamic';
const fallbackProducts = [
  {id:1,name:'Yellow Mustard Oil',slug:'yellow-mustard-oil',description:'The company’s bestselling oil. Contact us to discuss product and bulk supply requirements.',category:'Oils'},
  {id:2,name:'Groundnut Seeds',slug:'groundnut-seeds',description:'A product identified by the company. Contact us to discuss product and bulk supply requirements.',category:'Seeds',image_url:'/Groundnut_Seeds.jpg'},
  {id:3,name:'Sesame Seeds',slug:'sesame-seeds',description:'A product identified by the company. Contact us to discuss product and bulk supply requirements.',category:'Seeds',image_url:'/Sesame_Seeds_Photo_2.jpg'},
  {id:4,name:'Sesame Oil',slug:'sesame-oil',description:'A product identified by the company. Contact us to discuss product and bulk supply requirements.',category:'Oils'},
  {id:5,name:'Yellow Mustard Seeds',slug:'yellow-mustard-seeds',description:'Product shown in the company-provided resource folder. Contact us for details.',category:'Seeds',image_url:'/Yellow_Mustard_Seeds.jpg'},
  {id:6,name:'Black Mustard Seeds',slug:'black-mustard-seeds',description:'Product shown in the company-provided resource folder. Contact us for details.',category:'Seeds',image_url:'/Black_Mustard_Seeds.jpg'},
  {id:7,name:'Black Sesame Seeds',slug:'black-sesame-seeds',description:'Product shown in the company-provided resource folder. Contact us for details.',category:'Seeds',image_url:'/Black_Sesame_Seeds.jpg'},
  {id:8,name:'Yellow Mustard Cake',slug:'yellow-mustard-cake',description:'Product shown in the company-provided resource folder. Contact us for details.',category:'De-oiled Cakes',image_url:'/Yellow_Mustard_Cake.jpg'},
  {id:9,name:'Black Mustard Cake',slug:'black-mustard-cake',description:'Product shown in the company-provided resource folder. Contact us for details.',category:'De-oiled Cakes',image_url:'/Black_Mustard_Cake.jpg'}
];
export async function GET() {
  try { await ensureSchema(); const { rows } = await db().query('SELECT id,name,slug,description,category,packaging_options,specifications,image_url FROM products WHERE is_published=TRUE ORDER BY id ASC'); return NextResponse.json({products:rows}); }
  catch (e) { console.error('Products endpoint:', e); return NextResponse.json({products:fallbackProducts,database_configured:false}); }
}
