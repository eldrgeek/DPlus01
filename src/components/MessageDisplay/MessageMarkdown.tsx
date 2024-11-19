import React from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Failed to highlight code:', err);
      }
    }
    return code;
  },
});

// Custom renderer for Discord-specific formatting
const renderer = new marked.Renderer();

// Handle user mentions
renderer.text = (text: string) => {
  return text.replace(/<@!?(\d+)>/g, (_, id) => `@user-${id}`);
};

// Handle channel mentions
renderer.link = (href: string, title: string, text: string) => {
  if (href.startsWith('#')) {
    return `<span class="channel-mention">${text}</span>`;
  }
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

interface MessageMarkdownProps {
  content: string;
}

export const MessageMarkdown: React.FC<MessageMarkdownProps> = ({ content }) => {
  const html = React.useMemo(() => {
    try {
      return marked(content, { renderer });
    } catch (error) {
      console.error('Failed to parse markdown:', error);
      return content;
    }
  }, [content]);

  return (
    <div 
      className="message-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}; 