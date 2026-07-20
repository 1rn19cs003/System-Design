import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/data/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://system-design-architectures.local'; // Can be customized upon deployment

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      routes.push({
        url: `${baseUrl}${item.href}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: item.category === 'core' || item.category === 'hld' ? 0.9 : 0.8,
      });
    });
  });

  return routes;
}
