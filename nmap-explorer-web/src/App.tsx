import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>

          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          {/* THIS IS THE COPYRIGHT PART */}

        </Routes>
      </main>
      <footer className="py-6 border-t bg-background text-center">
  <div className="container mx-auto px-4">
    <p className="text-sm text-muted-foreground">
      © {new Date().getFullYear()} @hejhdiss (Muhammed Shafin P). All rights reserved.
    </p>
    {/* Lovable Attribution Added Below */}
    <p className="text-xs text-muted-foreground mt-2 opacity-70">
      Developed with the assistance of{" "}
      <a 
        href="https://lovable.dev" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-primary underline underline-offset-4 transition-colors"
      >
        Lovable AI
      </a>
    </p>
  </div>
</footer>
    </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
