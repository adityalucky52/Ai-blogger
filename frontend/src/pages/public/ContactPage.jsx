import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-background/10 text-background border-background/20">
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-background/70">
              Have a question, suggestion, or want to contribute? We'd love to
              hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our articles, want to
                contribute, or just want to say hello, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">
                      contact@techblog.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">
                      Remote Team Worldwide
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Working across all timezones
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Response Time</h3>
                    <p className="text-muted-foreground">
                      Usually within 24 hours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="mt-12">
                <h3 className="font-semibold mb-4">Common Questions</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">
                      How can I contribute an article?
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Register an account and submit your article through the
                      dashboard.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">
                      Is TechBlog free to read?
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Yes! All our content is completely free and always will
                      be.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        rows={5}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
