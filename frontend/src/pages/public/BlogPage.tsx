import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import useBlogStore, { Blog } from "../../store/blogStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
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

// Removed mock data

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentBlog: blogData, fetchBlogBySlug, isLoading } = useBlogStore();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);

  if (!blogData)
    return (
      <div className="min-h-screen pt-32 text-center text-muted-foreground">
        Loading...
      </div>
    ); // Simple loading state

  // Mock related for structure
  const relatedBlogs: Blog[] = [];

  return (
    <article className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={blogData.image}
          alt={blogData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

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

            <div
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: blogData.title }}
            />

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatarUrl(blogData.author?.avatar)} />
                  <AvatarFallback className="bg-linear-to-br from-violet-600 to-indigo-600 text-white">
                    {blogData.author?.name
                      ? blogData.author.name.charAt(0)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground font-medium">
                    {blogData.author?.name || "Unknown Author"}
                  </p>
                  <p className="text-xs">
                    {(blogData.createdAt || "").split("T")[0]}
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {(blogData.createdAt || "").split("T")[0]}
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
                  {blogData.likes.length}
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
              className="blog-content prose prose-lg dark:prose-invert max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: blogData.content }}
            />

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
                  <AvatarImage src={getAvatarUrl(blogData.author?.avatar)} />
                  <AvatarFallback className="bg-linear-to-br from-violet-600 to-indigo-600 text-white text-xl">
                    {blogData.author?.name
                      ? blogData.author.name.charAt(0)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {blogData.author?.name || "Unknown Author"}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {blogData.author?.bio || "No bio available."}
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
                  key={blog._id}
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
