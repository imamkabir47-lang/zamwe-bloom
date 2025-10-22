import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n/config";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import EventsNew from "./pages/EventsNew";
import Gallery from "./pages/Gallery";
import MembersDirectory from "./pages/MembersDirectory";
import MemberProfile from "./pages/MemberProfile";
import Resources from "./pages/Resources";
import SuccessStories from "./pages/SuccessStories";
import Join from "./pages/Join";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Videos from "./pages/Videos";
import Messages from "./pages/Messages";
import Forum from "./pages/Forum";
import Courses from "./pages/Courses";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/events" element={<EventsNew />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/members" element={<MembersDirectory />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/join" element={<Join />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
