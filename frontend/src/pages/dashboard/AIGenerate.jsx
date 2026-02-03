import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Wand2,
  FileText,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  Zap,
  PenTool,
  Target,
  ArrowRight,
} from "lucide-react";

const tones = [
  "Professional",
  "Casual",
  "Humorous",
  "Formal",
  "Creative",
  "Technical",
];
const lengths = [
  "Short (300 words)",
  "Medium (600 words)",
  "Long (1000+ words)",
];

export default function AIGenerate() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium (600 words)");
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const mockContent = `# ${topic}

## Introduction

In today's rapidly evolving digital landscape, understanding ${topic.toLowerCase()} has become essential for professionals and enthusiasts alike. This comprehensive guide will explore the key aspects and provide actionable insights.

## Key Points to Consider

When diving into ${topic.toLowerCase()}, there are several crucial factors to keep in mind:

1. **Stay Updated**: The field is constantly evolving, so continuous learning is essential.
2. **Practical Application**: Theory is important, but real-world application solidifies understanding.
3. **Community Engagement**: Connect with others who share your interests to accelerate growth.

## Best Practices

Here are some proven strategies that experts recommend:

- Start with the fundamentals before advancing to complex topics
- Document your learning journey for future reference
- Seek feedback from mentors and peers
- Experiment with different approaches to find what works best

## Conclusion

Mastering ${topic.toLowerCase()} requires dedication, continuous learning, and practical application. By following the guidelines outlined in this article, you'll be well on your way to achieving your goals.

Remember, the journey of learning is just as important as the destination. Embrace challenges as opportunities for growth and never stop exploring new possibilities.`;

    setGeneratedContent(mockContent);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseContent = () => {
    // Navigate to create blog with pre-filled content
    navigate("/dashboard/blogs/new", {
      state: { content: generatedContent, title: topic },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            AI Content Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate blog content with the power of AI
          </p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="generate" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Outline
          </TabsTrigger>
          <TabsTrigger value="ideas" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Ideas
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Generate Blog Content</CardTitle>
                <CardDescription>
                  Enter a topic and let AI create compelling content for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic / Title</label>
                  <Input
                    placeholder="e.g., The Future of Artificial Intelligence"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {tone}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {tones.map((t) => (
                          <DropdownMenuItem key={t} onClick={() => setTone(t)}>
                            {t}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Length</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {length.split(" ")[0]}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {lengths.map((l) => (
                          <DropdownMenuItem
                            key={l}
                            onClick={() => setLength(l)}
                          >
                            {l}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Additional Instructions (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any specific requirements or keywords..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    Your AI-generated blog content
                  </CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`}
                      />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="max-h-[400px] overflow-y-auto p-4 rounded-lg bg-muted/50">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generatedContent}
                      </pre>
                    </div>
                    <Button className="w-full" onClick={handleUseContent}>
                      Use This Content
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-center">
                    <div>
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Enter a topic and click "Generate Content" to see your
                        AI-generated blog post here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Outline Tab */}
        <TabsContent value="outline" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Generate Blog Outline</CardTitle>
              <CardDescription>
                Get a structured outline for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your blog topic..." />
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                <FileText className="h-4 w-4 mr-2" />
                Generate Outline
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Get Blog Ideas</CardTitle>
              <CardDescription>
                Let AI suggest blog topics based on your niche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your niche (e.g., Technology, Health, Finance)..." />
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate Ideas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Generate complete blog posts in seconds
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <PenTool className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Multiple Tones</h3>
            <p className="text-sm text-muted-foreground">
              Choose from various writing styles
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">SEO Optimized</h3>
            <p className="text-sm text-muted-foreground">
              Content optimized for search engines
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
