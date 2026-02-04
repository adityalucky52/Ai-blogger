import Groq from "groq-sdk";

export const generateContent = async (req, res) => {
  const { prompt, type } = req.body;

  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE"
  ) {
    return res.status(500).json({
      message: "Groq API Key is not configured. Please check backend/.env",
    });
  }

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let finalPrompt = "";

    switch (type) {
      case "outline":
        finalPrompt = `Generate a comprehensive blog post outline for the topic: "${prompt}". Use Markdown format with proper headings.`;
        break;
      case "improve":
        finalPrompt = `Improve the following text for clarity, engagement, and flow. Maintain the original meaning but make it more professional:\n\n"${prompt}"`;
        break;
      case "seo":
        finalPrompt = `Generate an SEO-optimized meta description (max 160 characters) and a list of 10 relevant keywords for a blog post about: "${prompt}". Return in JSON format { "metaDescription": "...", "keywords": [...] }`;
        break;
      case "headlines":
        finalPrompt = `Generate 5 catchy, viral-worthy headlines for a blog post about: "${prompt}". Return as a bulleted list.`;
        break;
      case "generate":
        finalPrompt = `Write a comprehensive, engaging, and professional blog post about: "${prompt}". 
        
IMPORTANT: Format the output in HTML (not Markdown). Use these formatting rules:
- Use <h2><strong>Heading Text</strong></h2> for main section headings (make them bold)
- Use <h3><strong>Subheading Text</strong></h3> for subheadings (make them bold)
- Use <p> tags for paragraphs
- Use <strong> for important text
- Use <em> for emphasized text
- Use <ul><li> for bullet lists
- Use <ol><li> for numbered lists
- Use <blockquote> for quotes

Include an introduction, 3-5 body sections with headings, and a conclusion. Make it engaging and professional.`;
        break;
      case "ideas":
        finalPrompt = `Generate 10 creative and engaging blog post ideas for the niche/topic: "${prompt}". Provide a brief 1-sentence description for each idea.`;
        break;
      default:
        finalPrompt = prompt;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    let text = chatCompletion.choices[0]?.message?.content || "";

    // If JSON is expected (seo), try to clean it
    if (type === "seo") {
      try {
        // Remove markdown code blocks if present
        text = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
      } catch (e) {
        // ignore
      }
    }

    res.status(200).json({ content: text });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({
      message: "Failed to generate content",
      error: error.message,
    });
  }
};
