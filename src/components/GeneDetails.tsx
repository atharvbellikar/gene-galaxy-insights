
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, AlertCircle, Thermometer, BarChart3, History } from "lucide-react";

interface GeneDetailsProps {
  gene: Gene | null;
}

interface Gene {
  id: string;
  symbol: string;
  name: string;
  description: string;
  chromosome: string;
  start: number;
  end: number;
  diseases: Array<{ name: string; omimId: string }>;
  function: string;
  expression: Array<{ tissue: string; level: number }>;
  conservation: number;
  similarGenes: Array<{ symbol: string; score: number }>;
}

const GeneDetails: React.FC<GeneDetailsProps> = ({ gene }) => {
  if (!gene) return null;

  return (
    <Card className="w-full animate-zoom-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {gene.symbol}
              <Badge variant="outline" className="ml-2">
                {gene.chromosome}:{gene.start.toLocaleString()}-{gene.end.toLocaleString()}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 text-base">{gene.name}</CardDescription>
          </div>
          <Badge 
            className="bg-genome-accent text-white"
            title="Conservation Score"
          >
            <Thermometer className="h-3 w-3 mr-1" />
            Conservation: {gene.conservation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="function">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="function">Function</TabsTrigger>
            <TabsTrigger value="disease">Diseases</TabsTrigger>
            <TabsTrigger value="expression">Expression</TabsTrigger>
            <TabsTrigger value="similar">Similar Genes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="function" className="space-y-4">
            <div className="mt-4">
              <p className="text-sm leading-relaxed">{gene.function}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="disease">
            <div className="mt-4 space-y-3">
              {gene.diseases.length > 0 ? (
                gene.diseases.map((disease, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                    <AlertCircle className="h-5 w-5 text-genome-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{disease.name}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">OMIM: {disease.omimId}</Badge>
                        <a 
                          href={`https://omim.org/entry/${disease.omimId}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground flex items-center hover:text-primary"
                        >
                          View in OMIM <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">No disease associations found.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expression">
            <div className="mt-4">
              <div className="space-y-2">
                {gene.expression.map((exp, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm">{exp.tissue}</div>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-genome-primary rounded-full" 
                        style={{ width: `${exp.level}%` }}
                      ></div>
                    </div>
                    <div className="text-sm w-10 text-right">{exp.level}%</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span>Expression data based on GTEx database</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="similar">
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gene.similarGenes.map((similar, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="font-medium">{similar.symbol}</div>
                    <Badge variant="secondary">
                      Similarity: {similar.score}%
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <History className="h-4 w-4 mr-1" />
                <span>Based on function, protein interactions, and literature</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GeneDetails;
