import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export function EscalateButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = () => {
    setEscalated(true);
    setShowDialog(false);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setEscalated(false);
    }, 3000);
  };

  if (escalated) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-success">
        <CheckCircle className="w-5 h-5" />
        <p className="text-sm font-medium">
          Escalated to Human Review
        </p>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="w-full border-secondary text-secondary hover:bg-secondary/10"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Escalate to Human Review
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalate to Human Review?</AlertDialogTitle>
            <AlertDialogDescription>
              You can manually review and refine any AI-suggested content before
              it's sent. This allows you to override or modify suggestions to
              better match your communication style.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Benefits:</p>
            <ul className="space-y-1">
              <li>• Review AI suggestions before sending</li>
              <li>• Add your personal touch and context</li>
              <li>• Maintain brand voice and authenticity</li>
            </ul>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep Using AI</AlertDialogCancel>
            <AlertDialogAction onClick={handleEscalate} className="bg-secondary hover:bg-secondary/90">
              Escalate Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
