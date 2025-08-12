import { Hash, FileText, Key, FileDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const toolsConfig: ToolConfig[] = [
  {
    id: "bcrypt",
    title: "Bcrypt Hash Generator",
    description: "Generate and verify bcrypt hashes for password security",
    icon: Hash,
    href: "/tools/bcrypt"
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode text or data using Base64 encoding",
    icon: FileText,
    href: "/tools/base64"
  },
  {
    id: "jwt",
    title: "JWT Encoder/Decoder",
    description: "Encode, decode, and verify JSON Web Tokens",
    icon: Key,
    href: "/tools/jwt"
  },
  {
    id: "google-drive",
    title: "Google Drive Link Generator",
    description: "Convert Google Drive sharing links to direct download links",
    icon: FileDown,
    href: "/tools/google-drive"
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
