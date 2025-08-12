import { Hash, FileText, Key, FileDown, Shield } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const toolsConfig: ToolConfig[] = [
  {
    id: "bcrypt",
    title: "Bcrypt Hash Generator",
    description: "Generate and verify bcrypt hashes for password security",
    icon: Hash,
    href: "/tools/bcrypt",
    seo: {
      title: "Bcrypt Hash Generator - Secure Password Hashing Tool",
      description: "Generate and verify bcrypt hashes online. Secure password hashing with customizable salt rounds. Free bcrypt hash generator for developers and security professionals.",
      keywords: ["bcrypt", "hash generator", "password hashing", "salt", "security", "bcrypt online", "password hash", "encryption"]
    }
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode text or data using Base64 encoding",
    icon: FileText,
    href: "/tools/base64",
    seo: {
      title: "Base64 Encoder/Decoder - Online Base64 Conversion Tool",
      description: "Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 to text. Support for file uploads and binary data conversion.",
      keywords: ["base64", "encoder", "decoder", "base64 online", "text encoding", "binary conversion", "base64 converter", "encode decode"]
    }
  },
  {
    id: "jwt",
    title: "JWT Encoder/Decoder",
    description: "Encode, decode, and verify JSON Web Tokens",
    icon: Key,
    href: "/tools/jwt",
    seo: {
      title: "JWT Encoder/Decoder - JSON Web Token Tool",
      description: "Create, decode, and verify JSON Web Tokens (JWT) online. Support for HS256, HS384, HS512 algorithms. Free JWT debugger and token generator for developers.",
      keywords: ["jwt", "json web token", "jwt decoder", "jwt encoder", "token generator", "jwt debugger", "HS256", "authentication"]
    }
  },
  {
    id: "google-drive",
    title: "Google Drive Link Generator",
    description: "Convert Google Drive sharing links to direct download links",
    icon: FileDown,
    href: "/tools/google-drive",
    seo: {
      title: "Google Drive Direct Link Generator - Convert Sharing Links",
      description: "Convert Google Drive sharing links to direct download links. Generate direct URLs for Google Drive files, images, and documents for embedding and hotlinking.",
      keywords: ["google drive", "direct link", "download link", "google drive converter", "file sharing", "hotlink", "embed", "direct download"]
    }
  },
  {
    id: "password",
    title: "Password Generator",
    description: "Generate secure, customizable passwords with advanced options",
    icon: Shield,
    href: "/tools/password",
    seo: {
      title: "Password Generator - Create Strong Secure Passwords",
      description: "Generate strong, secure passwords with customizable options. Create random passwords with numbers, symbols, uppercase, lowercase letters. Free password generator tool.",
      keywords: ["password generator", "strong password", "secure password", "random password", "password creator", "password maker", "cybersecurity", "password strength"]
    }
  }
];

// Helper function to get tool config for navigation (used in layout)
export const getToolsForNavigation = () => {
  return toolsConfig.map(tool => ({
    title: tool.title,
    url: tool.href,
    icon: tool.icon
  }));
};

// Helper function to get tool config by ID
export const getToolById = (id: string): ToolConfig | undefined => {
  return toolsConfig.find(tool => tool.id === id);
};
