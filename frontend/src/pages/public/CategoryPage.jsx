import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

// Topic categories for filtering
const topics = [
  { name: "All", count: 156 },
  { name: "AI & Machine Learning", count: 45 },
  { name: "Web Development", count: 38 },
  { name: "Cloud Computing", count: 28 },
  { name: "DevOps", count: 24 },
  { name: "Cybersecurity", count: 19 },
];

const mockBlogs = [
  {
    id: 1,
    title: "The Future of AI in Software Development: A Complete Guide",
    excerpt:
      "Discover how artificial intelligence is revolutionizing the way we write code. From GitHub Copilot to autonomous agents.",
    slug: "future-of-ai-software-development",
    topic: "AI & Machine Learning",
    author: { name: "Sarah Johnson", avatar: "" },
    publishedAt: "Feb 1, 2026",
    readTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Building Scalable APIs with Node.js and TypeScript",
    excerpt:
      "Learn best practices for building production-ready APIs that can handle millions of requests.",
    slug: "scalable-apis-nodejs-typescript",
    topic: "Web Development",
    author: { name: "Mike Chen", avatar: "" },
    publishedAt: "Jan 28, 2026",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
  },
  {
    id: 3,
    title: "React 19: New Features and Migration Guide",
    excerpt:
      "Everything you need to know about React 19's new features and how to upgrade your existing applications.",
    slug: "react-19-new-features",
    topic: "Web Development",
    author: { name: "Emily Davis", avatar: "" },
    publishedAt: "Jan 25, 2026",
    readTime: "12 min",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Understanding Docker and Kubernetes for Beginners",
    excerpt:
      "A comprehensive guide to containerization and orchestration for modern applications.",
    slug: "docker-kubernetes-beginners",
    topic: "DevOps",
    author: { name: "Alex Turner", avatar: "" },
    publishedAt: "Jan 20, 2026",
    readTime: "10 min",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335e?w=600&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Cybersecurity Best Practices for Web Developers",
    excerpt:
      "Protect your applications from common vulnerabilities and security threats.",
    slug: "cybersecurity-web-developers",
    topic: "Cybersecurity",
    author: { name: "Jordan Lee", avatar: "" },
    publishedAt: "Jan 18, 2026",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Getting Started with Next.js 15 and Server Components",
    excerpt:
      "Build faster, more efficient web applications with the latest Next.js features.",
    slug: "nextjs-15-server-components",
    topic: "Web Development",
    author: { name: "Sam Wilson", avatar: "" },
    publishedAt: "Jan 15, 2026",
    readTime: "9 min",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop",
  },
  {
    id: 7,
    title: "AWS vs Azure vs GCP: Cloud Platform Comparison 2026",
    excerpt:
      "A detailed comparison of the major cloud platforms to help you choose the right one.",
    slug: "cloud-platform-comparison",
    topic: "Cloud Computing",
    author: { name: "Chris Brown", avatar: "" },
    publishedAt: "Jan 12, 2026",
    readTime: "15 min",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Introduction to Large Language Models (LLMs)",
    excerpt:
      "Understanding the architecture and applications of modern language models like GPT and Claude.",
    slug: "intro-to-llms",
    topic: "AI & Machine Learning",
    author: { name: "Lisa Wang", avatar: "" },
    publishedAt: "Jan 10, 2026",
    readTime: "11 min",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop",
  },
  {
    id: 9,
    title: "CI/CD Pipelines: A Complete Implementation Guide",
    excerpt:
      "Set up continuous integration and deployment for your projects with GitHub Actions.",
    slug: "cicd-pipelines-guide",
    topic: "DevOps",
    author: { name: "David Kim", avatar: "" },
    publishedAt: "Jan 8, 2026",
    readTime: "14 min",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=300&fit=crop",
  },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on selected topic and search query
  const filteredBlogs = mockBlogs.filter((blog) => {
    const matchesTopic =
      selectedTopic === "All" || blog.topic === selectedTopic;
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-background/10 text-background border-background/20">
            Browse Articles
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Technology</h1>
          <p className="text-lg text-background/70 max-w-2xl mx-auto">
            Explore the latest in tech, from AI and machine learning to web
            development and cybersecurity.
          </p>
          <p className="mt-4 text-background/50">
            {filteredBlogs.length} articles
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Topic Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {topics.map((topic) => (
              <Badge
                key={topic.name}
                variant={selectedTopic === topic.name ? "default" : "outline"}
                className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                  selectedTopic === topic.name
                    ? "bg-foreground text-background"
                    : "hover:bg-accent"
                }`}
                onClick={() => setSelectedTopic(topic.name)}
              >
                {topic.name}
                <span className="ml-2 opacity-60">({topic.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="group overflow-hidden border hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-background text-foreground">
                      {blog.topic}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:underline transition-colors">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={blog.author.avatar} />
                        <AvatarFallback className="bg-foreground text-background text-xs">
                          {blog.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{blog.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {blog.readTime}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedTopic("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredBlogs.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
