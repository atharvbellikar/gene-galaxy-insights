
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import Header from '@/components/Header';
import GeneSearch from '@/components/GeneSearch';
import GeneDetails from '@/components/GeneDetails';
import GenomeBrowser from '@/components/GenomeBrowser';
import EvolutionaryTimeline from '@/components/EvolutionaryTimeline';
import RegionalDiseaseMap from '@/components/RegionalDiseaseMap';
import { getGeneById, type Gene } from '@/services/geneService';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dna } from 'lucide-react';

const Index = () => {
  const [selectedGene, setSelectedGene] = useState<string | null>(null);
  const [geneData, setGeneData] = useState<Gene | null>(null);
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const fetchGeneData = async () => {
      if (!selectedGene) return;
      
      setLoading(true);
      try {
        const data = await getGeneById(selectedGene);
        if (data) {
          setGeneData(data);
          toast.success(`Gene ${data.symbol} data loaded successfully`);
        } else {
          setGeneData(null);
          toast.error(`Gene ${selectedGene} not found`, {
            description: "Try searching for BRCA1, TP53, EGFR, KRAS, or PTEN"
          });
        }
      } catch (error) {
        console.error("Error fetching gene data:", error);
        toast.error("Failed to load gene data");
        setGeneData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneData();
  }, [selectedGene]);

  const handleSearch = (geneId: string) => {
    setSelectedGene(geneId);
  };

  const handleBackToHome = () => {
    setSelectedGene(null);
    setGeneData(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleTheme={toggleTheme} isDarkMode={theme === 'dark'} />
      
      <main className="flex-1 container py-6">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gene Galaxy Insights</h1>
          <p className="text-muted-foreground">
            Explore genes with AI-powered insights and interactive visualizations
          </p>
          <Separator className="my-4" />
          {!selectedGene && <GeneSearch onSearch={handleSearch} />}
        </section>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="w-full h-[300px] rounded-lg" />
            <Skeleton className="w-full h-[200px] rounded-lg" />
            <Skeleton className="w-full h-[250px] rounded-lg" />
          </div>
        ) : selectedGene && !geneData ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Dna className="h-16 w-16 mb-4 text-muted" />
            <h2 className="text-xl font-medium mb-2">Gene Not Found</h2>
            <p>Try searching for BRCA1, TP53, EGFR, KRAS, or PTEN</p>
          </div>
        ) : (
          <>
            {geneData && (
              <div className="space-y-6">
                <GeneDetails gene={geneData} onBackToHome={handleBackToHome} />
                <GenomeBrowser geneId={selectedGene} />
                <EvolutionaryTimeline geneId={selectedGene} />
              </div>
            )}
            
            {!selectedGene && (
              <>
                <div className="flex flex-col items-center justify-center py-8 text-center mb-8">
                  <Dna className="h-16 w-16 mb-4 text-genome-primary animate-pulse" />
                  <h2 className="text-2xl font-medium mb-3">Welcome to Gene Galaxy Insights</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Search for a gene to explore its function, associated diseases, expression patterns, 
                    and evolutionary conservation. Our AI-powered platform provides comprehensive insights 
                    to help you understand the biological significance of genes.
                  </p>
                </div>
                
                {/* Add the Regional Disease Map component */}
                <RegionalDiseaseMap />
              </>
            )}
          </>
        )}
      </main>
      
      <footer className="py-4 border-t">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Gene Galaxy Insights - AI-Powered Genomic Analysis
          </p>
          <p className="text-sm text-muted-foreground">
            Demo Version 1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
