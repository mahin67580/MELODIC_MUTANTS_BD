import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  Music,
  MapPin,
  Clock
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-black text-white border-t ">
      <div className="  flex  flex-col lg:p-14  p-5  ">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl  ">𝕸𝖊𝖑𝖔𝖉𝖎𝖈 𝕸𝖚𝖙𝖆𝖓𝖙𝖘</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Transforming music education with expert instructors and innovative technology. 
              Learn anytime, anywhere with our comprehensive online courses.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@melodicmutant.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Music Street, Harmony City</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri: 9AM-6PM</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className=" ">
            {/* Quick Links */}
            <div className="space-y-3 flex  flex-col justify-center items-center lg:mt-20">
              <h3 className="  text-xl">𝕼𝖚𝖎𝖈𝖐 𝕷𝖎𝖓𝖐𝖘</h3>
              <ul className="space-y-2 flex  gap-8 flex-wrap justify-center items-center">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/courses", label: "Courses" },
                  { href: "/instructors", label: "Instructors" },
                  { href: "/contact", label: "Contact" }
                ].map((link) => (
                  <li key={link.href}>
                    <Button asChild variant="ghost" className="justify-start   h-auto p-2">
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            {/* <div className="space-y-3">
              <h3 className="font-semibold text-lg">Support</h3>
              <ul className="space-y-2">
                {[
                  { href: "/faq", label: "FAQs" },
                  { href: "/help", label: "Help Center" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms & Conditions" },
                  { href: "/careers", label: "Careers" }
                ].map((link) => (
                  <li key={link.href}>
                    <Button asChild variant="ghost" className="justify-start h-auto p-0">
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Resources */}
            {/* <div className="space-y-3">
              <h3 className="font-semibold text-lg">Resources</h3>
              <ul className="space-y-2">
                {[
                  { href: "/blog", label: "Blog" },
                  { href: "/tutorials", label: "Tutorials" },
                  { href: "/webinars", label: "Webinars" },
                  { href: "/community", label: "Community" },
                  { href: "/downloads", label: "Free Resources" }
                ].map((link) => (
                  <li key={link.href}>
                    <Button asChild variant="ghost" className="justify-start h-auto p-0">
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>

        {/* Newsletter Section */}
       

        <Separator className="my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>© {currentYear} Melodic Mutant Music Academy. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Youtube, href: "#", label: "YouTube" }
            ].map((social) => (
              <Button key={social.label} asChild variant="ghost" size="icon">
                <Link 
                  href={social.href} 
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}