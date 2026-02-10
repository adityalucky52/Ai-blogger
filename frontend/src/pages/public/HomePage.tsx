import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { Code2, ArrowRight, Clock, Cpu, Globe, Shield } from "lucide-react";
import useBlogStore, { Blog } from "../../store/blogStore";
import { useEffect } from "react";
import { stripHtmlTags } from "../../utils/textUtils";

// Removed mock data

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
          }
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-background text-foreground">
          {blog.category}
        </Badge>
      </div>
      <CardContent className="p-5">
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:underline transition-all">
            {stripHtmlTags(blog.title)}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {blog.excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarUrl(blog.author?.avatar)} />
            <AvatarFallback className="bg-foreground text-background text-xs">
              {blog.author?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {blog.author?.name || "Unknown"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {blog.readTime || "5 min read"}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  const { blogs, fetchBlogs, isLoading } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Use first 6 blogs as latest
  const latestBlogs = blogs.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-background/10 text-background border-background/20">
              <Code2 className="h-3 w-3 mr-1" />
              Technology Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stay Ahead in Tech
            </h1>
            <p className="text-lg md:text-xl text-background/70 mb-8 max-w-2xl mx-auto">
              Your go-to source for the latest in software development, AI,
              cloud computing, and everything technology. Learn, build, and
              grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-semibold px-8"
                asChild
              >
                <Link to="/category/technology">
                  Explore Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8"
                asChild
              >
                <Link to="/register">Start Writing</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-background/70">Tech Articles</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm text-background/70">Developers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1M+</p>
                <p className="text-sm text-background/70">Monthly Reads</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Cover</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In-depth articles on the technologies that matter most to
              developers and tech enthusiasts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-7 w-7 text-background" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                AI & Machine Learning
              </h3>
              <p className="text-muted-foreground text-sm">
                From neural networks to LLMs, explore the cutting edge of
                artificial intelligence and its applications.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Globe className="h-7 w-7 text-background" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Web Development</h3>
              <p className="text-muted-foreground text-sm">
                Master modern frameworks, best practices, and build scalable web
                applications that users love.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-background" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cybersecurity</h3>
              <p className="text-muted-foreground text-sm">
                Stay secure with guides on protecting applications,
                understanding threats, and security best practices.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Latest Articles</h2>
              <p className="text-muted-foreground mt-1">
                Fresh content from our tech writers
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link to="/category/technology">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link to="/category/technology">
                View All Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-foreground text-background border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Share Your Tech Knowledge
              </h2>
              <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
                Join our community of developers and tech enthusiasts. Write
                articles, share tutorials, and help others learn.
              </p>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-semibold px-8"
                asChild
              >
                <Link to="/register">
                  Start Writing Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
