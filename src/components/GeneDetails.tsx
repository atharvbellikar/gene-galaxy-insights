
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, Activity, AlertCircle } from 'lucide-react';
import type { Gene } from '@/services/geneService';

interface GeneDetailsProps {
  gene: Gene;
  onBackToHome?: () => void;
}

const GeneDetails: React.FC<GeneDetailsProps> = ({ gene, onBackToHome }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackToHome && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackToHome}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          )}
          <h2 className="text-2xl font-bold">{gene.symbol}</h2>
          {/* Removed the type badge since it doesn't exist in the Gene interface */}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{gene.name}</CardTitle>
          <CardDescription>Chromosome {gene.chromosome}, Location: {gene.start}-{gene.end}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Function</h3>
                <p className="text-sm text-muted-foreground">{gene.function}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Activity className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Expression</h3>
                <p className="text-sm text-muted-foreground">
                  {gene.expression.map((exp, index) => (
                    <span key={exp.tissue}>
                      {exp.tissue} ({exp.level}%)
                      {index < gene.expression.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Associated Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  {gene.diseases.map((disease, index) => (
                    <span key={disease.omimId}>
                      {disease.name} (OMIM: {disease.omimId})
                      {index < gene.diseases.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Data sourced from genomic databases - Last updated: {new Date().toLocaleDateString()}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneDetails;
