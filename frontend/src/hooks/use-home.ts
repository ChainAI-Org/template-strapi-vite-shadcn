import { useState, useEffect } from 'react';

// Interface for home data from Strapi
export interface HomeData {
  id: number;
  documentId: string;
  welcome_text: string;
  subtitle?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export function useHome() {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        // For single types in Strapi v5, we need to specifically use /api/single-type-name
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home?populate=*`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { data, isLoading, error };
}
