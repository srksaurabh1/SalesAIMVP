import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MessageCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Rebuttal {
  objection: string;
  rebuttal: string;
}

interface RebuttalsProps {
  rebuttals: Rebuttal[];
}

export function RebuttalsPanel({ rebuttals }: RebuttalsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="w-5 h-5 text-secondary" />
          Common Objections & Rebuttals
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {rebuttals.map((item, index) => (
          <Collapsible
            key={index}
            open={openIndex === index}
            onOpenChange={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-start justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-start gap-2 flex-1">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground">
                    {item.objection}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-3 pb-3">
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-secondary">
                    Response:
                  </span>{" "}
                  {item.rebuttal}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
