
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, GithubIcon } from "lucide-react";
import { Dna } from "lucide-react";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Dna className="h-6 w-6 text-genome-primary" />
          <h1 className="text-xl font-bold">Gene Galaxy Insights</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline-block">GitHub</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
