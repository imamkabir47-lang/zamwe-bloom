import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure Supabase envs are always defined at build time (fallbacks use publishable values)
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://ulhjhxueagwssulwqmmy.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsaGpoeHVlYWd3c3N1bHdxbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc1MzcsImV4cCI6MjA3NjYxMzUzN30.19hM3aKCnk7Dh7SYjEnP0uDR4ZMmVn4uqsoL7g8VM1M'),
  },
}));
