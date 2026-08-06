import "./globals.css";
import "@livekit/components-styles";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="bg-background text-foreground transition-colors dark:bg-gray-900 dark:text-gray-100">
        <ThemeProvider>
          {children}
           <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
