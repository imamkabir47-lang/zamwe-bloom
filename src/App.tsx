import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import MinimalNavbar from "./components/MinimalNavbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { ScrollProgress, FloatingActionHub, LiveVisitorsBadge } from "./components/GodModeFeatures";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const EventsNew = lazy(() => import("./pages/EventsNew"));
const Gallery = lazy(() => import("./pages/Gallery"));
const MembersDirectory = lazy(() => import("./pages/MembersDirectory"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const Resources = lazy(() => import("./pages/Resources"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Join = lazy(() => import("./pages/Join"));
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCreateUser = lazy(() => import("./pages/AdminCreateUser"));
const AdminCreateAdmin = lazy(() => import("./pages/AdminCreateAdmin"));
const AdminManageEvents = lazy(() => import("./pages/AdminManageEvents"));
const AdminManageResources = lazy(() => import("./pages/AdminManageResources"));
const AdminManageVideos = lazy(() => import("./pages/AdminManageVideos"));
const AdminManageUsers = lazy(() => import("./pages/AdminManageUsers"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const EditPost = lazy(() => import("./pages/EditPost"));
const Videos = lazy(() => import("./pages/Videos"));
const Messages = lazy(() => import("./pages/Messages"));
const Forum = lazy(() => import("./pages/Forum"));
const Courses = lazy(() => import("./pages/Courses"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />
      
      {/* Auth-aware navigation */}
      {user ? <MinimalNavbar /> : <Navbar />}
      
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
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
            <Route path="/post/:id" element={<ProductDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-user" element={<AdminCreateUser />} />
            <Route path="/admin/create-admin" element={<AdminCreateAdmin />} />
            <Route path="/admin/manage-events" element={<AdminManageEvents />} />
            <Route path="/admin/manage-resources" element={<AdminManageResources />} />
            <Route path="/admin/manage-videos" element={<AdminManageVideos />} />
            <Route path="/admin/manage-users" element={<AdminManageUsers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Only show footer when NOT logged in */}
      {!user && <Footer />}
      
      {/* God Mode Features */}
      <LiveVisitorsBadge />
      <FloatingActionHub />
    </div>
  );
};

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

export default App;
