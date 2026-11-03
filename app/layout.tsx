import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from './chat-widget';
export const metadata: Metadata = {
  title: 'Prime Fresh Oil Mills | Oils, Seeds & De-oiled Cakes',
  description: 'Explore Yellow Mustard Oil, seeds, sesame oil and de-oiled cakes from Prime Fresh Oil Mills. Contact us for product and bulk supply inquiries.',
  applicationName: 'Prime Fresh Oil Mills',
  openGraph: {
    title: 'Prime Fresh Oil Mills',
    description: 'Explore oils, seeds and de-oiled cakes for your business.',
    type: 'website'
  }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<ChatWidget /></body></html>;
}
