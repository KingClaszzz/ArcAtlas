export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string; // New field for builder's X
  forumUrl?: string;   // New field for Arc Forum proof
  tags: string[];
  featured: boolean;
}
