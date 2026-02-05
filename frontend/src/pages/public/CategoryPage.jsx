import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ArrowRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import useBlogStore from "../../store/blogStore";
import { stripHtmlTags } from "../../utils/textUtils";

export default function CategoryPage() {
  const { slug } = useParams();
  const { blogs: filteredBlogs, fetchBlogs, isLoading } = useBlogStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = { category: slug }; // Filter by category from URL (e.g., technology)
    if (searchQuery) params.search = searchQuery;

    const timeoutId = setTimeout(() => {
      fetchBlogs(params);
    }, 500); // Debounce

    return () => clearTimeout(timeoutId);
  }, [slug, searchQuery, fetchBlogs]);

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
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                      {blog.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:underline transition-colors">
                        {stripHtmlTags(blog.title)}
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
