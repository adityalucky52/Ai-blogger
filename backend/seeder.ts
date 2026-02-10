import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Blog from "./models/Blog.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // Clear existing data
    await Blog.deleteMany();
    await User.deleteMany();

    console.log("Cleared Data");

    // Create Users
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      bio: "I am the admin of this platform.",
    });

    const regularUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
      bio: "Tech Enthusiast and Blogger.",
    });

    console.log("Users Created");

    // Create Blogs
    const blogs = [
      {
        title: "The Future of AI in Software Development",
        slug: "future-of-ai-software-development",
        excerpt:
          "Discover how artificial intelligence is revolutionizing the way we write code. From GitHub Copilot to autonomous agents, the landscape is changing fast.",
        content:
          "<h2>AI is changing everything</h2><p>Artificial Intelligence is no longer just a buzzword; it's a fundamental shift in how we approach software development. Tools like GitHub Copilot and ChatGPT are empowering developers to write faster, cleaner code.</p><p>But what does this mean for the future of jobs?</p>",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        category: "Technology",
        topic: "AI & Machine Learning",
        author: adminUser._id,
        featured: true,
        readTime: "5 min read",
        tags: ["AI", "Future", "Coding"],
        createdAt: new Date(),
      },
      {
        title: "React 19: New Features and Migration Guide",
        slug: "react-19-new-features",
        excerpt:
          "Everything you need to know about React 19's new features and how to upgrade your existing applications effectively.",
        content:
          "<h2>React 19 is here</h2><p>The React team has announced React 19, and it comes with exciting new features. From the new compiler to improved server components.</p>",
        image:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
        category: "Technology",
        topic: "Web Development",
        author: regularUser._id,
        featured: true,
        readTime: "8 min read",
        tags: ["React", "Frontend", "JavaScript"],
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        title: "Understanding Docker and Kubernetes",
        slug: "docker-and-kubernetes",
        excerpt:
          "A comprehensive guide to containerization and orchestration for modern applications.",
        content:
          "<p>Containers are standard units of software that package up code and all its dependencies.</p>",
        image:
          "https://images.unsplash.com/photo-1605745341112-85968b19335e?w=800&h=400&fit=crop",
        category: "Technology",
        topic: "DevOps",
        author: adminUser._id,
        featured: false,
        readTime: "12 min read",
        tags: ["Docker", "Kubernetes", "DevOps"],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        title: "Cybersecurity Best Practices for 2026",
        slug: "cybersecurity-best-practices-2026",
        excerpt:
          "Protect your applications from common vulnerabilities and security threats with these essential tips.",
        content:
          "<p>Security is easier effectively applied when you know the landscape.</p>",
        image:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
        category: "Technology",
        topic: "Cybersecurity",
        author: regularUser._id,
        featured: true,
        readTime: "7 min read",
        tags: ["Security", "Web", "Privacy"],
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
      },
      {
        title: "Cloud Computing Comparison: AWS vs Azure vs GCP",
        slug: "cloud-computing-comparison",
        excerpt:
          "A detailed comparison of the major cloud platforms to help you choose the right one for your business needs.",
        content: "<p>Choosing a cloud provider is a big decision in 2026.</p>",
        image:
          "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
        category: "Technology",
        topic: "Cloud Computing",
        author: adminUser._id,
        featured: false,
        readTime: "15 min read",
        tags: ["Cloud", "AWS", "Azure"],
        createdAt: new Date(Date.now() - 345600000), // 4 days ago
      },
    ];

    await Blog.insertMany(blogs);

    console.log("Blogs Imported!");
    process.exit();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
