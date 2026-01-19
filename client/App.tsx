import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MeetingBrief from "./pages/MeetingBrief";
import InFlightAssistant from "./pages/InFlightAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/meeting-brief/:accountId" element={<MeetingBrief />} />
          <Route path="/in-flight-assistant" element={<InFlightAssistant />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Store root reference to prevent multiple createRoot calls during HMR
let root: Root | null = null;
const container = document.getElementById("root");

if (container) {
  // Check if root was already created and reuse it, or create a new one
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}
