import { IceBreaker } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface IceBreakersProps {
  items: IceBreaker[];
}

export function IceBreakers({ items }: IceBreakersProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Ice Breakers</h2>
      </div>
      <p className="text-muted-foreground mb-4">
        Start conversations with these contextual questions based on recent
        activity and company news
      </p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition-shadow border-l-4 border-l-primary"
          >
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="text-2xl font-bold text-primary/30 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">
                    {item.question}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {item.context}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
