import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Created with ❤️ by{" "}
            <a 
              href="https://jobacx.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              jobacx
            </a>
          </p>
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <Link 
              href="/terms" 
              className="hover:text-foreground hover:underline transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              href="/privacy" 
              className="hover:text-foreground hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
