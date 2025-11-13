


// import { Card, CardContent } from "@/components/ui/card";
// import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useState } from "react";
// import { toast } from "@/hooks/use-toast";

// const Contact = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Message Sent!",
//       description: "We'll get back to you soon.",
//     });
//     setName("");
//     setEmail("");
//     setMessage("");
//   };

//   const contactInfo = [
//     {
//       icon: <MapPin className="w-10 h-10 text-[#00c6a7]" />,
//       title: "Visit Us",
//       content: [
//         "Varby Gard - Varby Gard T-Bana, Varby Alle 14, 143 40 Varby, Sweden",
//       ],
//     },
//     {
//       icon: <Phone className="w-10 h-10 text-[#00c6a7]" />,
//       title: "Call Us",
//       content: ["+46 704 859 228", "+46 739 844 564"],
//     },
//     {
//       icon: <Mail className="w-10 h-10 text-[#00c6a7]" />,
//       title: "Email Us",
//       content: ["info@swedentamilfilm.com", "booking@swedentamilfilm.com"],
//     },
//     {
//       icon: <Clock className="w-10 h-10 text-[#00c6a7]" />,
//       title: "Opening Hours",
//       content: ["Monday - Sunday", "9:00 AM - 11:00 PM", "All Days Open"],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="py-24 bg-white text-center">
//         <div className="container mx-auto px-4">
//           <MessageCircle className="w-20 h-20 mx-auto mb-6 text-[#00c6a7]" />
//           <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
//             Get In Touch
//           </h1>
//           <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full mb-6"></div>
//           <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-700">
//             Have questions? We'd love to hear from you. Send us a message and
//             we'll respond as soon as possible.
//           </p>
//         </div>
//       </section>

//       {/* Contact Cards */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 max-w-7xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {contactInfo.map((info, index) => (
//               <Card
//                 key={index}
//                 className="border-2 border-[#00c6a7] shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <CardContent className="p-8 text-center">
//                   <div className="flex justify-center mb-4">
//                     <div className="p-4 bg-[#00c6a7]/10 rounded-full">
//                       {info.icon}
//                     </div>
//                   </div>
//                   <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
//                     {info.title}
//                   </h3>
//                   <div className="space-y-2">
//                     {info.content.map((line, i) => (
//                       <p key={i} className="text-gray-700 font-medium">
//                         {line}
//                       </p>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Form & Map Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 max-w-7xl">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Contact Form */}
//             <Card className="border-2 border-[#00c6a7] shadow-2xl transition-colors">
//               <CardContent className="p-8">
//                 <div className="mb-8">
//                   <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] flex items-center gap-3">
//                     <Send className="w-8 h-8 text-[#00c6a7]" />
//                     Send Message
//                   </h2>
//                   <p className="text-gray-600 text-lg">
//                     Fill out the form below and we'll get back to you shortly.
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="space-y-2">
//                     <label className="text-gray-700 font-semibold text-lg">
//                       Your Name
//                     </label>
//                     <Input
//                       type="text"
//                       placeholder="John Doe"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                       className="text-lg p-6 border-2 focus:border-[#00c6a7]"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-gray-700 font-semibold text-lg">
//                       Your Email
//                     </label>
//                     <Input
//                       type="email"
//                       placeholder="john@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="text-lg p-6 border-2 focus:border-[#00c6a7]"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-gray-700 font-semibold text-lg">
//                       Message
//                     </label>
//                     <Textarea
//                       placeholder="Tell us how we can help you..."
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       required
//                       rows={6}
//                       className="text-lg p-6 border-2 focus:border-[#00c6a7] resize-none"
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white font-bold text-xl py-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
//                   >
//                     Send Message
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Map */}
//        <Card className="border-2 border-[#00c6a7] shadow-2xl overflow-hidden">
//   <div className="h-full min-h-[600px]">
//     <iframe
//       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12833.36689341262!2d18.0632403!3d59.334591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d6050a8b93b%3A0x44b47d72b5a7a68b!2sStockholm%20City%20Theatre!5e0!3m2!1sen!2sin!4v1731071912345!5m2!1sen!2sin"
//       width="100%"
//       height="100%"
//       style={{ border: 0 }}
//       allowFullScreen
//       loading="lazy"
//       referrerPolicy="no-referrer-when-downgrade"
//       title="Theatre Location"
//       className="w-full h-full"
//     ></iframe>
//   </div>
// </Card>


//           </div>
//         </div>
//       </section>

//       {/* Direction Info */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <Card className="border-2 border-[#00c6a7] shadow-2xl">
//             <CardContent className="p-10">
//               <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-center">
//                 How to Reach Us
//               </h2>
//               <div className="grid md:grid-cols-3 gap-8 justify-center">
//                 <div className="space-y-4 p-6 bg-[#00c6a7]/5 rounded-xl hover:bg-[#00c6a7]/10 transition-colors">
//                   <div className="w-16 h-16 bg-[#00c6a7]/20 rounded-full flex items-center justify-center mx-auto">
//                     <span className="text-3xl">🚌</span>
//                   </div>
//                   <p className="text-gray-700 text-center font-medium">
//                     Utbildningsvagen 2A, 147 40 Tumba, Sweden
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Contact;

import theatreImg from '../../../User-Frontend/src/assets/theatre image.jpg'
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { backend_url } from "@/config";


const backendurl=backend_url
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${backendurl}/contact/contactemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you soon.",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-10 h-10 text-[#00c6a7]" />,
      title: "Visit Us",
      content: [
        "Varby Gard - Varby Gard T-Bana, Varby Alle 14, 143 40 Varby, Sweden",
      ],
    },
    {
      icon: <Phone className="w-10 h-10 text-[#00c6a7]" />,
      title: "Call Us",
      content: ["+46 704 859 228", "+46 739 844 564"],
    },
    {
      icon: <Mail className="w-10 h-10 text-[#00c6a7]" />,
      title: "Email Us",
      content: ["info@swedentamilfilm.com", "booking@swedentamilfilm.com"],
    },
    {
      icon: <Clock className="w-10 h-10 text-[#00c6a7]" />,
      title: "Opening Hours",
      content: ["Monday - Sunday", "9:00 AM - 11:00 PM", "All Days Open"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <MessageCircle className="w-20 h-20 mx-auto mb-6 text-[#00c6a7]" />
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
            Get In Touch
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-700">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="border-2 border-[#00c6a7] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-[#00c6a7]/10 rounded-full">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7]">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.content.map((line, i) => (
                      <p key={i} className="text-gray-700 font-medium">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-[#00c6a7] shadow-2xl transition-colors">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] flex items-center gap-3">
                    <Send className="w-8 h-8 text-[#00c6a7]" />
                    Send Message
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-lg p-6 border-2 focus:border-[#00c6a7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Your Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg p-6 border-2 focus:border-[#00c6a7]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 font-semibold text-lg">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="text-lg p-6 border-2 focus:border-[#00c6a7] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white font-bold text-xl py-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-2 border-[#00c6a7] shadow-2xl overflow-hidden">
              <div className="h-full min-h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12833.36689341262!2d18.0632403!3d59.334591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d6050a8b93b%3A0x44b47d72b5a7a68b!2sStockholm%20City%20Theatre!5e0!3m2!1sen!2sin!4v1731071912345!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Theatre Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
  <div className="container mx-auto px-4 max-w-6xl">
    <Card className="border-2 border-[#00c6a7] shadow-2xl flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side Image */}
      <div className="md:w-1/2 w-full">
        <img
          src={theatreImg}
          alt="Theatre"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Content */}
      <CardContent className="md:w-1/2 w-full p-10 flex flex-col justify-center bg-gradient-to-br from-[#f9f9ff] to-[#e6fffa] rounded-r-2xl">
  <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-center md:text-left relative inline-block">
    How to Reach Us
    <span className="absolute left-1/2 md:left-0 -bottom-2 w-24 h-[3px] bg-gradient-to-r from-[#0072ff] to-[#00c6a7] rounded-full transform -translate-x-1/2 md:translate-x-0 animate-pulse"></span>
  </h2>

  <div className="grid md:grid-cols-1 gap-8">
    <div className="group space-y-4 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#00c6a7]/30 hover:border-[#00c6a7] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="w-16 h-16 bg-gradient-to-r from-[#0072ff]/20 to-[#00c6a7]/20 rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
        <span className="text-4xl drop-shadow-sm">🚌</span>
      </div>
      <p className="text-gray-700 font-medium text-center md:text-left leading-relaxed group-hover:text-[#0072ff] transition-colors duration-300">
        Utbildningsvagen 2A, 147 40 Tumba, Sweden
      </p>
    </div>
  </div>
</CardContent>

    </Card>
  </div>
</section>

    </div>
  );
};

export default Contact;
