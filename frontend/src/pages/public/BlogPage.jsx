import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";

// Mock blog data
const blogData = {
  id: 1,
  title: "The Future of AI in Content Creation: A Complete Guide",
  content: `
    <p class="lead">Artificial Intelligence is transforming how we create, edit, and distribute content. In this comprehensive guide, we'll explore the current state of AI in content creation and what the future holds.</p>

    <h2>The Rise of AI Writing Tools</h2>
    <p>Over the past few years, we've witnessed an unprecedented surge in AI-powered writing tools. From simple grammar checkers to sophisticated content generators, these tools are becoming indispensable for content creators worldwide.</p>
    
    <p>The technology behind these tools has evolved significantly. Early versions relied on simple pattern matching and rule-based systems. Today's AI writers use advanced language models that can understand context, maintain consistency, and even adapt to different writing styles.</p>

    <blockquote>
      "AI won't replace writers, but writers who use AI will replace those who don't." — Industry Expert
    </blockquote>

    <h2>Key Benefits of AI-Assisted Writing</h2>
    <p>There are several compelling reasons why content creators are embracing AI tools:</p>
    
    <ul>
      <li><strong>Speed:</strong> Generate first drafts in minutes instead of hours</li>
      <li><strong>Consistency:</strong> Maintain a consistent tone and style across all content</li>
      <li><strong>SEO Optimization:</strong> AI can suggest keywords and optimize content for search engines</li>
      <li><strong>Creativity Boost:</strong> Overcome writer's block with AI-generated ideas and outlines</li>
    </ul>

    <h2>The Human Element Remains Crucial</h2>
    <p>Despite these advances, the human element remains irreplaceable. AI excels at generating content quickly, but it lacks the nuanced understanding, emotional depth, and creative spark that human writers bring to their work.</p>
    
    <p>The most effective approach combines AI efficiency with human creativity. Use AI to handle repetitive tasks, generate initial drafts, and optimize for SEO. Then, apply your unique perspective, expertise, and voice to create content that truly resonates with your audience.</p>

    <h2>Looking Ahead</h2>
    <p>The future of AI in content creation is bright. We can expect even more sophisticated tools that better understand context, can generate multimedia content, and seamlessly integrate with existing workflows.</p>
    
    <p>For content creators, the message is clear: embrace AI as a powerful ally in your creative toolkit. Those who learn to leverage these tools effectively will have a significant advantage in the increasingly competitive digital landscape.</p>
  `,
  category: "Technology",
  tags: ["AI", "Content Creation", "Writing", "Future Tech"],
  author: {
    name: "Sarah Johnson",
    avatar: "",
    bio: "Tech writer and AI enthusiast. Passionate about exploring how technology shapes our future.",
    followers: 2500,
  },
  publishedAt: "February 1, 2026",
  readTime: "8 min read",
  image:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
  likes: 342,
  comments: 56,
};

const relatedBlogs = [
  {
    id: 2,
    title: "Building a Successful Blog in 2026",
    slug: "building-successful-blog-2026",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop",
    category: "Blogging",
  },
  {
    id: 3,
    title: "Mastering SEO: From Beginner to Expert",
    slug: "mastering-seo-guide",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    category: "Marketing",
  },
];

export default function BlogPage() {
  const { slug } = useParams();

  return (
    <article className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={blogData.image}
          alt={blogData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="backdrop-blur-sm"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Article Header */}
          <div className="bg-background rounded-2xl shadow-xl p-8 md:p-12">
            <Badge className="mb-4">{blogData.category}</Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blogData.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={blogData.author.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                    {blogData.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground font-medium">
                    {blogData.author.name}
                  </p>
                  <p className="text-xs">
                    {blogData.author.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {blogData.publishedAt}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {blogData.readTime}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pb-8 border-b">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  {blogData.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {blogData.comments}
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: blogData.content }}
              style={{
                "--tw-prose-headings": "hsl(var(--foreground))",
                "--tw-prose-body": "hsl(var(--foreground))",
                "--tw-prose-bold": "hsl(var(--foreground))",
                "--tw-prose-quotes": "hsl(var(--muted-foreground))",
              }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm font-medium mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blogData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm font-medium mb-3">Share this article</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-8 p-6 rounded-xl bg-muted/50">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blogData.author.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xl">
                    {blogData.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {blogData.author.name}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {blogData.author.bio}
                  </p>
                  <Button className="mt-4" size="sm">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12 mb-20">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group flex gap-4 p-4 rounded-xl bg-card border hover:shadow-lg transition-all"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {blog.category}
                    </Badge>
                    <h3 className="font-semibold group-hover:text-violet-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
