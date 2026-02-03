import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-background/10 text-background border-background/20">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About TechBlog
            </h1>
            <p className="text-lg text-background/70">
              We're a community of developers, engineers, and tech enthusiasts
              passionate about sharing knowledge and staying at the forefront of
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                TechBlog was founded with a simple mission: to make technology
                knowledge accessible to everyone. We believe that learning
                should be free, open, and available to developers at all skill
                levels.
              </p>
              <p className="text-muted-foreground">
                Whether you're just starting your coding journey or you're a
                seasoned architect, our articles are designed to help you grow,
                learn new skills, and stay updated with the ever-evolving tech
                landscape.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-sm text-muted-foreground">
                  Articles Published
                </p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold mb-2">50K+</p>
                <p className="text-sm text-muted-foreground">Active Readers</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold mb-2">100+</p>
                <p className="text-sm text-muted-foreground">Contributors</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold mb-2">1M+</p>
                <p className="text-sm text-muted-foreground">Monthly Views</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by these core principles.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold mb-2">Quality Content</h3>
              <p className="text-sm text-muted-foreground">
                Every article is thoroughly researched and reviewed for
                accuracy.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold mb-2">Community First</h3>
              <p className="text-sm text-muted-foreground">
                We prioritize our community's needs and feedback in everything
                we do.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold mb-2">Practical Focus</h3>
              <p className="text-sm text-muted-foreground">
                Real-world examples and actionable advice you can use
                immediately.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-background" />
              </div>
              <h3 className="font-semibold mb-2">Open & Free</h3>
              <p className="text-sm text-muted-foreground">
                All our content is free and accessible to everyone, forever.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind TechBlog.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Card className="p-6 text-center">
              <div className="h-20 w-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-background">AK</span>
              </div>
              <h3 className="font-semibold">Aditya Kumar</h3>
              <p className="text-sm text-muted-foreground">
                Founder & Lead Developer
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-20 w-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-background">TM</span>
              </div>
              <h3 className="font-semibold">Tech Team</h3>
              <p className="text-sm text-muted-foreground">
                Content & Engineering
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="h-20 w-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-background">CM</span>
              </div>
              <h3 className="font-semibold">Community</h3>
              <p className="text-sm text-muted-foreground">
                Contributors Worldwide
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
