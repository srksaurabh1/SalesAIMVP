import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, BookMarked } from "lucide-react";

interface CitationItem {
  text: string;
  source: string;
  url?: string;
}

interface CitationsProps {
  citations: CitationItem[];
}

export function Citations({ citations }: CitationsProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-primary" />
          Data Sources & Citations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">
            Every AI-generated insight is backed by verified sources:
          </p>

          <div className="space-y-2">
            {citations.map((citation, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    {citation.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {citation.source}
                  </p>
                </div>
                {citation.url && (
                  <a
                    href={citation.url}
                    className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors p-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-info/10 text-info border border-info/20 rounded-lg text-xs">
          <strong>Transparency:</strong> We cross-reference multiple sources to
          ensure accuracy. Hover over citations to see source details.
        </div>
      </CardContent>
    </Card>
  );
}
