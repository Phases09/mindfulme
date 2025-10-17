import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Wellness from "./pages/Wellness";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Home /><BottomNav /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /><BottomNav /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute><Wellness /><BottomNav /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /><BottomNav /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
