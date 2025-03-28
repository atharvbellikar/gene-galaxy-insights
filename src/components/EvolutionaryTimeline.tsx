
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, AlertCircle, Sparkles } from "lucide-react";

interface EvolutionaryTimelineProps {
  geneId: string | null;
}

interface EvolutionaryData {
  species: string;
  scientificName: string;
  similarity: number;
  icon: string;
  key: string;
  conservedDomains: number;
  totalDomains: number;
}

const EvolutionaryTimeline: React.FC<EvolutionaryTimelineProps> = ({ geneId }) => {
  if (!geneId) return null;
  
  // Mock data - in a real app would be fetched based on the geneId
  const evolutionaryData: EvolutionaryData[] = [
    { 
      species: "Human", 
      scientificName: "Homo sapiens", 
      similarity: 100, 
      icon: "🧬", 
      key: "human",
      conservedDomains: 5,
      totalDomains: 5
    },
    { 
      species: "Chimpanzee", 
      scientificName: "Pan troglodytes", 
      similarity: 98, 
      icon: "🦍", 
      key: "chimp",
      conservedDomains: 5,
      totalDomains: 5
    },
    { 
      species: "Mouse", 
      scientificName: "Mus musculus", 
      similarity: 85, 
      icon: "🐭", 
      key: "mouse",
      conservedDomains: 4,
      totalDomains: 5
    },
    { 
      species: "Zebrafish", 
      scientificName: "Danio rerio", 
      similarity: 70, 
      icon: "🐟", 
      key: "zebrafish",
      conservedDomains: 3,
      totalDomains: 5
    },
    { 
      species: "Fruit Fly", 
      scientificName: "Drosophila melanogaster", 
      similarity: 40, 
      icon: "🦟", 
      key: "fruitfly",
      conservedDomains: 2,
      totalDomains: 5
    }
  ];

  // Generate a fun evolutionary fact
  const getEvolutionaryFact = (geneId: string) => {
    const facts = [
      `The ${geneId} gene has been conserved across vertebrates for over 400 million years.`,
      `${geneId} shows evidence of positive selection in primates.`,
      `The protein domains in ${geneId} have evolved at different rates, suggesting functional specialization.`,
      `${geneId} underwent a duplication event in mammals around 200 million years ago.`,
      `Mutations in ${geneId} are associated with adaptations to different environments.`
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Evolutionary Timeline
          </CardTitle>
          <Badge 
            className="bg-genome-tertiary text-white"
            title="Conservation Score"
          >
            {geneId} Evolution
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-8">
          <div className="absolute top-0 bottom-0 left-12 w-1 bg-muted"></div>
          
          {evolutionaryData.map((species, index) => (
            <div key={species.key} className="relative pl-16 pb-6">
              <div className="absolute left-10 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-genome-primary text-white shadow-sm">
                <span>{species.icon}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="font-medium">{species.species}</h3>
                  <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>
                </div>
                
                <div className="mt-2 sm:mt-0 flex items-center gap-3">
                  <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-genome-primary rounded-full" 
                      style={{ width: `${species.similarity}%` }}
                    ></div>
                  </div>
                  <Badge>{species.similarity}% similarity</Badge>
                </div>
              </div>
              
              <div className="mt-2 grid grid-cols-5 gap-1">
                {Array.from({ length: species.totalDomains }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 rounded-full ${i < species.conservedDomains ? 'bg-genome-primary' : 'bg-muted'}`}
                    title={i < species.conservedDomains ? 'Conserved domain' : 'Non-conserved domain'}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="rounded-md bg-muted/50 p-3 flex gap-3">
          <Sparkles className="h-5 w-5 text-genome-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Evolutionary Insight</h4>
            <p className="text-sm mt-1">{getEvolutionaryFact(geneId)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolutionaryTimeline;
