import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  FolderOpen,
  Video,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoZamwe from "@/assets/logo-zamwe.png";

interface AdminSidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/manage-users" },
  { icon: FileText, label: "Applications", path: "/admin/dashboard", tab: "applications" },
  { icon: MessageSquare, label: "Messages", path: "/admin/dashboard", tab: "messages" },
  { icon: Calendar, label: "Events", path: "/admin/manage-events" },
  { icon: FolderOpen, label: "Resources", path: "/admin/manage-resources" },
  { icon: Video, label: "Videos", path: "/admin/manage-videos" },
];

const bottomMenuItems = [
  { icon: Shield, label: "Create Admin", path: "/admin/create-admin" },
  { icon: Users, label: "Create User", path: "/admin/create-user" },
];

export const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "p-6 border-b border-border/50 flex items-center",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <img src={logoZamwe} alt="Zamwe" className="w-10 h-10 object-contain" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif font-bold text-lg text-primary"
          >
            Admin Panel
          </motion.span>
        )}
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-20 w-8 h-8 rounded-full bg-card border border-border shadow-md z-10"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border/50 space-y-1">
        {bottomMenuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
        
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
