
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";

interface GeneSearchProps {
  onSearch: (geneId: string) => void;
}

const GeneSearch: React.FC<GeneSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState<string[]>([
    'BRCA1', 'TP53', 'EGFR', 'KRAS', 'PTEN'
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a gene name or ID");
      return;
    }
    onSearch(searchQuery);
  };

  const handleRecentSearch = (gene: string) => {
    setSearchQuery(gene);
    onSearch(gene);
  };

  return (
    <div className="w-full mb-6 animate-fade-in">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a gene (e.g., BRCA1, TP53)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Popular genes:</span>
        {recentSearches.map((gene) => (
          <Button 
            key={gene} 
            variant="outline" 
            size="sm" 
            onClick={() => handleRecentSearch(gene)}
            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {gene}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GeneSearch;
