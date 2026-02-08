import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  title: string;
  author: string;
  number: number;
}

export function BookCard({
  title,
  author,
  number,
}: Props) {
  return (
    <li className="relative ml-10 py-4">
      <div className="absolute -left-16 top-2 flex items-center justify-center">
        <Avatar className="border-2 border-primary/30 size-12 m-auto shadow-md">
          <AvatarFallback
            className="text-sm font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
          >
            {number}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        <h2 className="font-semibold leading-none">{title}</h2>
        <p className="text-sm text-muted-foreground">{author}</p>
      </div>
    </li>
  );
}