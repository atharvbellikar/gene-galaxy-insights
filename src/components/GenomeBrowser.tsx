
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, MoveHorizontal, Upload, Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface GenomeBrowserProps {
  geneId: string | null;
}

interface GenomeTrack {
  id: string;
  name: string;
  features: Array<{
    type: 'exon' | 'intron' | 'variant';
    start: number;
    end: number;
    id?: string;
    variantType?: string;
  }>;
}

const GenomeBrowser: React.FC<GenomeBrowserProps> = ({ geneId }) => {
  const [tracks, setTracks] = useState<GenomeTrack[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1000);
  const [totalLength, setTotalLength] = useState(10000);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);

  useEffect(() => {
    if (geneId) {
      // In a real app, this would be an API call to get the gene data
      const mockGeneData = generateMockGeneData(geneId);
      setTracks(mockGeneData.tracks);
      setTotalLength(mockGeneData.totalLength);
      setPosition(mockGeneData.totalLength * 0.3); // Start at 30% position
    } else {
      setTracks([]);
    }
  }, [geneId]);

  useEffect(() => {
    const handleResize = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const generateMockGeneData = (geneId: string) => {
    // This would normally be fetched from a genomic database
    const totalLength = 100000;
    const exonCount = Math.floor(Math.random() * 10) + 5;
    const exons = [];
    let currentPos = 10000;
    
    for (let i = 0; i < exonCount; i++) {
      const exonLength = Math.floor(Math.random() * 1000) + 200;
      exons.push({
        type: 'exon' as const,
        start: currentPos,
        end: currentPos + exonLength
      });
      currentPos += exonLength + Math.floor(Math.random() * 3000) + 1000;
    }
    
    const introns = [];
    for (let i = 0; i < exons.length - 1; i++) {
      introns.push({
        type: 'intron' as const,
        start: exons[i].end,
        end: exons[i + 1].start
      });
    }
    
    const variants = [];
    for (let i = 0; i < 8; i++) {
      const randomPosition = Math.floor(Math.random() * totalLength);
      variants.push({
        type: 'variant' as const,
        start: randomPosition,
        end: randomPosition,
        id: `rs${Math.floor(Math.random() * 10000000)}`,
        variantType: Math.random() > 0.5 ? 'SNP' : 'Deletion'
      });
    }
    
    return {
      totalLength,
      tracks: [
        {
          id: 'gene',
          name: `${geneId} Structure`,
          features: [...exons, ...introns]
        },
        {
          id: 'variants',
          name: 'Variants',
          features: variants
        }
      ]
    };
  };

  const handleZoomIn = () => {
    if (scale < 5) {
      setScale(prev => Math.min(prev * 1.5, 5));
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.2) {
      setScale(prev => Math.max(prev / 1.5, 0.2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    
    // Update position based on dx, scale and viewport width
    const delta = (dx / viewportWidth) * (totalLength / scale);
    setPosition(prev => Math.max(0, Math.min(totalLength, prev - delta)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    }
  };

  const handleUploadTrack = () => {
    toast.info("File upload functionality will be available in the next version", {
      description: "This will allow custom genomic tracks from BED, GFF, or VCF files."
    });
  };

  const handleDownloadData = () => {
    toast.info("Data export functionality will be available in the next version", {
      description: "This will allow exporting the current view as image or data file."
    });
  };

  const handleSliderChange = (value: number[]) => {
    setPosition(totalLength * (value[0] / 100));
  };

  const getVisibleRange = () => {
    const visibleLength = totalLength / scale;
    return {
      start: Math.max(0, position - visibleLength / 2),
      end: Math.min(totalLength, position + visibleLength / 2)
    };
  };

  const positionToPixel = (pos: number, visibleRange: { start: number; end: number }) => {
    const visibleLength = visibleRange.end - visibleRange.start;
    return ((pos - visibleRange.start) / visibleLength) * viewportWidth;
  };

  const visibleRange = getVisibleRange();
  const sliderPosition = (position / totalLength) * 100;

  if (!geneId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Genome Browser</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p>Search for a gene to view its genomic structure</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Interactive Genome Browser</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUploadTrack} title="Upload custom track">
              <Upload className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadData} title="Download data">
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-background">
              {Math.floor(visibleRange.start).toLocaleString()} - {Math.floor(visibleRange.end).toLocaleString()} bp
            </Badge>
            <Badge variant="outline" className="bg-background">
              Scale: {scale.toFixed(1)}x
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleZoomOut}
              disabled={scale <= 0.2}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 5}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Slider 
            defaultValue={[50]} 
            value={[sliderPosition]} 
            max={100} 
            step={0.1} 
            onValueChange={handleSliderChange}
          />
        </div>
        
        <div
          ref={viewportRef}
          className="relative h-auto border rounded-md overflow-hidden bg-gray-50 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-2 bg-muted/50 border-b flex items-center">
            <MoveHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click and drag to pan</span>
          </div>
          
          {tracks.map((track) => (
            <div key={track.id} className="p-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{track.name}</span>
              </div>
              <div className="genome-track">
                {track.features.map((feature, index) => {
                  if (feature.start > visibleRange.end || feature.end < visibleRange.start) {
                    return null;
                  }
                  
                  const left = positionToPixel(Math.max(feature.start, visibleRange.start), visibleRange);
                  
                  if (feature.type === 'exon') {
                    const width = positionToPixel(Math.min(feature.end, visibleRange.end), visibleRange) - left;
                    return (
                      <div 
                        key={`${track.id}-${index}`}
                        className="genome-exon"
                        style={{ left: `${left}px`, width: `${Math.max(1, width)}px` }}
                        title={`Exon: ${feature.start}-${feature.end}`}
                      />
                    );
                  } else if (feature.type === 'intron') {
                    const width = positionToPixel(Math.min(feature.end, visibleRange.end), visibleRange) - left;
                    return (
                      <div 
                        key={`${track.id}-${index}`}
                        className="genome-intron"
                        style={{ left: `${left}px`, width: `${Math.max(1, width)}px` }}
                        title={`Intron: ${feature.start}-${feature.end}`}
                      />
                    );
                  } else if (feature.type === 'variant') {
                    return (
                      <div 
                        key={`${track.id}-${index}`}
                        className="genome-variant"
                        style={{ left: `${left}px` }}
                        title={`${feature.variantType}: ${feature.id} at position ${feature.start}`}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenomeBrowser;
