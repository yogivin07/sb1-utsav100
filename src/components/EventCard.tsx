import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

export function EventCard({ title, description, date, location, imageUrl }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <AspectRatio ratio={16 / 9}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop'}
          alt={title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(date), 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="w-4 h-4" />
          {location}
        </div>
      </CardContent>
    </Card>
  );
}