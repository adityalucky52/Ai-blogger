// Utility functions for the blog application

/**
 * Strips HTML tags from a string and returns plain text
 * @param {string} html - The HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the text
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  const stripped = stripHtmlTags(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength) + "...";
};
