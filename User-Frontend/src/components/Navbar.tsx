import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Menu, X, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Movies", scrollTo: "now-showing" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // 👇 Smooth scroll function
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 👇 Handle Movies click
  const handleMoviesClick = () => {
    if (location.pathname === "/") {
      // Already on home — just scroll
      scrollToSection("now-showing");
    } else {
      // Navigate to home and then scroll after short delay
      navigate("/");
      setTimeout(() => scrollToSection("now-showing"), 600);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#0072ff] to-[#00c6a7] flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Tamil Film Sweden
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.scrollTo ? (
                <button
                  key={link.name}
                  onClick={handleMoviesClick}
                  className={`text-foreground hover:text-blue-500 transition-colors duration-200 font-medium`}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path!}
                  className={`text-foreground hover:text-blue-500 transition-colors duration-200 font-medium ${
                    isActive(link.path!) ? "text-accent font-bold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop Right Section */}
          {/* <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>demo@example.com</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.scrollTo ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      handleMoviesClick();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-foreground hover:text-blue-500 hover:bg-muted rounded-lg transition-all"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`px-4 py-2 text-foreground hover:text-blue-500 hover:bg-muted rounded-lg transition-all ${
                      isActive(link.path!) ? "text-accent font-bold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}

              {/* <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>demo@example.com</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 justify-start mx-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
