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

// Module-level variable to persist root across HMR reloads
let root: Root | null = null;

const rootElement = document.getElementById("root");
if (rootElement) {
  if (!root) {
    root = createRoot(rootElement);
  }
  root.render(<App />);
}

// Enable HMR hot reload
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup on HMR dispose (optional)
  });
}
