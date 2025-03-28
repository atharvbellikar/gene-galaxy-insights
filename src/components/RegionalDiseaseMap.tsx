
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Info } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for region-specific genetic diseases
const regionalGeneticData: Record<string, Array<{
  disease: string;
  prevalence: string;
  genes: string[];
  description: string;
}>> = {
  "africa": [
    {
      disease: "Sickle Cell Anemia",
      prevalence: "High",
      genes: ["HBB"],
      description: "A genetic disorder affecting hemoglobin, causing red blood cells to become sickle-shaped."
    },
    {
      disease: "G6PD Deficiency",
      prevalence: "Moderate",
      genes: ["G6PD"],
      description: "An enzyme deficiency that can cause hemolytic anemia, particularly common in West and Central Africa."
    }
  ],
  "asia": [
    {
      disease: "Thalassemia",
      prevalence: "High",
      genes: ["HBB", "HBA1", "HBA2"],
      description: "A blood disorder that reduces the production of hemoglobin, particularly common in Southeast Asia."
    },
    {
      disease: "Aldehyde Dehydrogenase Deficiency",
      prevalence: "Common",
      genes: ["ALDH2"],
      description: "Affects alcohol metabolism, causing the 'Asian flush' reaction, common in East Asian populations."
    }
  ],
  "europe": [
    {
      disease: "Cystic Fibrosis",
      prevalence: "High",
      genes: ["CFTR"],
      description: "A genetic disorder that affects mostly the lungs, but also the pancreas, liver, and intestines."
    },
    {
      disease: "Phenylketonuria (PKU)",
      prevalence: "Moderate",
      genes: ["PAH"],
      description: "A rare inherited disorder that increases levels of phenylalanine in the blood."
    }
  ],
  "north america": [
    {
      disease: "Tay-Sachs Disease",
      prevalence: "Higher in certain populations",
      genes: ["HEXA"],
      description: "A rare inherited disorder that destroys nerve cells in the brain and spinal cord."
    },
    {
      disease: "Hereditary Hemochromatosis",
      prevalence: "Common in those of European descent",
      genes: ["HFE"],
      description: "A disorder that causes the body to absorb too much iron from food."
    }
  ],
  "south america": [
    {
      disease: "Machado-Joseph Disease",
      prevalence: "Higher in certain areas",
      genes: ["ATXN3"],
      description: "A rare inherited ataxia affecting muscle movement control."
    },
    {
      disease: "Gaucher Disease",
      prevalence: "Varies by population",
      genes: ["GBA"],
      description: "A genetic disorder that affects many organs and tissues."
    }
  ],
  "australia": [
    {
      disease: "Hereditary Spastic Paraplegia",
      prevalence: "Varies",
      genes: ["SPAST", "ATL1"],
      description: "A group of inherited disorders that cause weakness and stiffness in the leg muscles."
    },
    {
      disease: "Friedreich Ataxia",
      prevalence: "Higher in certain populations",
      genes: ["FXN"],
      description: "A neurodegenerative movement disorder causing gait and limb ataxia."
    }
  ]
};

const suggestedRegions = [
  "Africa", 
  "Asia", 
  "Europe", 
  "North America", 
  "South America", 
  "Australia"
];

const RegionalDiseaseMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{
    disease: string;
    prevalence: string;
    genes: string[];
    description: string;
  }> | null>(null);
  const [searchedRegion, setSearchedRegion] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a region name");
      return;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const results = regionalGeneticData[normalizedQuery];
    
    if (results && results.length > 0) {
      setSearchResults(results);
      setSearchedRegion(searchQuery);
      toast.success(`Found genetic data for ${searchQuery}`);
    } else {
      setSearchResults([]);
      setSearchedRegion(searchQuery);
      toast.error("No genetic data found for this region", {
        description: "Try searching for Africa, Asia, Europe, North America, South America, or Australia"
      });
    }
  };

  const handleSuggestedRegion = (region: string) => {
    setSearchQuery(region);
    
    const normalizedRegion = region.toLowerCase();
    const results = regionalGeneticData[normalizedRegion];
    
    if (results && results.length > 0) {
      setSearchResults(results);
      setSearchedRegion(region);
      toast.success(`Found genetic data for ${region}`);
    } else {
      setSearchResults([]);
      setSearchedRegion(region);
      toast.error("No genetic data found for this region");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Regional Genetic Diseases</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Explore Genetic Diseases by Region</CardTitle>
          <CardDescription>Discover prevalent genetic conditions in different geographic regions</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Enter a region (e.g., Africa, Asia, Europe)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-1">Suggested regions:</span>
            {suggestedRegions.map((region) => (
              <Button 
                key={region} 
                variant="outline" 
                size="sm" 
                onClick={() => handleSuggestedRegion(region)}
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {region}
              </Button>
            ))}
          </div>
          
          {searchResults && searchedRegion && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">
                Genetic Diseases in {searchedRegion}
                {searchResults.length === 0 && " - No data found"}
              </h3>
              
              {searchResults.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disease</TableHead>
                      <TableHead>Prevalence</TableHead>
                      <TableHead>Associated Genes</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((result) => (
                      <TableRow key={result.disease}>
                        <TableCell className="font-medium">{result.disease}</TableCell>
                        <TableCell>
                          <Badge variant={
                            result.prevalence.toLowerCase().includes('high') ? 'destructive' : 
                            result.prevalence.toLowerCase().includes('moderate') ? 'warning' : 
                            'outline'
                          }>
                            {result.prevalence}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {result.genes.map((gene) => (
                              <TooltipProvider key={gene}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="cursor-help">
                                      {gene}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Gene ID: {gene}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1">
                            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{result.description}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground">
          Data based on genomic research and population studies. This information is for educational purposes only.
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegionalDiseaseMap;
