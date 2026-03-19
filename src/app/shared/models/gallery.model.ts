export interface GalleryItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  category: 'park' | 'nature' | 'activities';
}
