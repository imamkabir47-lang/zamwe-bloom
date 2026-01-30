import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-zamwe.png";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t border-primary/10">
      <motion.div
        className="container mx-auto px-4 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center space-x-3">
              <motion.img
                src={logo}
                alt="ZAMWE"
                className="h-10 w-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              <span className="font-serif text-xl font-bold text-gradient-primary">ZAMWE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Women Entrepreneurs across Zamfara State through mentorship, training, and opportunities.
            </p>
            <div className="flex space-x-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://facebook.com/ZAMWE"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/zamwehub?igsh=MTBqemV0N3pkeXI4OQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.tiktok.com/@zamfara.women.ent?_t=ZM-90jKrpm80ls&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Association Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-4">Association</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="/members" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Members</Link></li>
              <li><Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forum</Link></li>
              <li><Link to="/videos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Videos</Link></li>
              <li><Link to="/success-stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                <span>Gusau, Zamfara State, Nigeria</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone size={16} className="flex-shrink-0 text-primary" />
                <a href="tel:+2349127545291" className="hover:text-primary">+234 912 754 5291</a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail size={16} className="flex-shrink-0 text-primary" />
                <a href="mailto:info@zamwe.org" className="hover:text-primary">info@zamwe.org</a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-primary/10"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 ZAMWE - Zamfara Women Entrepreneur Association. Empowering Women, Building Futures.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/join" className="hover:text-primary transition-colors">Join Us</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
