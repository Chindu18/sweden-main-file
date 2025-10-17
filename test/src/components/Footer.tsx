const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Sweden Tamil Film. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
