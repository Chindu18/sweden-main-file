import { Film, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0f1729] text-primary-foreground border-t border-border ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mx-10">
    <div className="flex flex-col md:flex-row justify-between mb-8 gap-8">
      {/* Brand Section (Left) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#0072ff] to-[#00c6a7] flex items-center justify-center">
            <Film className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-white">
            Tamil Film Sweden
          </span>
        </div>
        <p className="text-white/50 text-sm">
          Experience the magic of Tamil cinema in Sweden.
        </p>
      </div>

      {/* Contact Info (Right) */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg mb-4">Contact</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-sm text-white/50">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>info@tamilfilmsweden.com</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-white/50">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>+46 70 123 4567</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-white/50">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Stockholm, Sweden</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Copyright */}
    <div className="pt-8 border-t border-border/20 text-center">
      <p className="text-white/50 text-sm">
        © 2025 Tamil Film Sweden. All rights reserved.
      </p>
    </div>
  </div>
</footer>

  );
};

export default Footer;
