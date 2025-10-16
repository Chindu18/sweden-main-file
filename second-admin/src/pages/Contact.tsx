import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import theaterImage from "@/assets/theater.jpg";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground">Get in touch with Tamil Film Sweden</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg overflow-hidden">
            <div className="relative h-80 overflow-hidden">
              <img
                src={theaterImage}
                alt="Tamil Film Sweden Theater"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Our Theater</h2>
                <p className="text-white/90">Experience Tamil Cinema in Sweden</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-primary rounded-lg">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm">
                    Drottninggatan 123<br />
                    111 60 Stockholm<br />
                    Sweden
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-primary rounded-lg">
                  <Phone className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">+46 8 123 456 78</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-primary rounded-lg">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">info@tamilfilmsweden.se</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-primary rounded-lg">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Opening Hours</h3>
                  <div className="text-muted-foreground text-sm space-y-1">
                    <p>Monday - Friday: 10:00 - 22:00</p>
                    <p>Saturday - Sunday: 12:00 - 23:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="h-full min-h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.7244855945906!2d18.063054!3d59.331278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d5ef8e59c4f%3A0x4019078290e7c40!2sDrottninggatan%2C%20Stockholm%2C%20Sweden!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tamil Film Sweden Location"
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-lg border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              For booking inquiries, technical support, or general questions, our team is here to assist you. 
              Feel free to reach out via phone or email during our business hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+46812345678"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
              <a
                href="mailto:info@tamilfilmsweden.se"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
