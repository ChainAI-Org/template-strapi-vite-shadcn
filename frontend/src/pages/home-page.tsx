import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useHome } from '@/hooks/use-home';

export function HomePage() {
  const { data, isLoading, error } = useHome();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load home page data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertTitle>No Content</AlertTitle>
        <AlertDescription>
          No home page content found. Please create some content in the Strapi admin panel.
        </AlertDescription>
      </Alert>
    );
  }

  const { welcome_text, subtitle, content } = data;

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{welcome_text}</CardTitle>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          {content && (
            <div className="prose dark:prose-invert max-w-none" 
                 dangerouslySetInnerHTML={{ __html: content }}></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
