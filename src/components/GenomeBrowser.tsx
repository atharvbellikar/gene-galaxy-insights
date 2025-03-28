
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, MoveHorizontal, Upload, Download, Info, View3d, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import GenomeVisualization3D from "./GenomeVisualization3D";

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
  const [show3DView, setShow3DView] = useState(false);
  const [highlightedFeature, setHighlightedFeature] = useState<any | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const [is3DTransitioning, setIs3DTransitioning] = useState(false);

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
      const variantType = Math.random() > 0.5 ? 'SNP' : 'Deletion';
      variants.push({
        type: 'variant' as const,
        start: randomPosition,
        end: randomPosition,
        id: `rs${Math.floor(Math.random() * 10000000)}`,
        variantType
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
  
  const toggle3DView = () => {
    setIs3DTransitioning(true);
    
    // Animate the transition
    setTimeout(() => {
      setShow3DView(prev => !prev);
      setIs3DTransitioning(false);
    }, 500);
    
    if (!show3DView) {
      toast.success("3D Genome Visualization Activated", {
        description: "Use mouse to rotate, scroll to zoom, and click features for details."
      });
    }
  };
  
  const handleFeatureClick = (feature: any) => {
    setHighlightedFeature(feature);
    
    const featureType = feature.type.charAt(0).toUpperCase() + feature.type.slice(1);
    toast.info(`${featureType} selected`, {
      description: `Positions ${feature.start.toLocaleString()}-${feature.end.toLocaleString()} bp`
    });
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={show3DView ? "default" : "outline"} 
                  size="sm" 
                  onClick={toggle3DView} 
                  className={`text-foreground transition-all ${show3DView ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <View3d className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">3D View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {show3DView ? "Switch to 2D browser view" : "Explore 3D genome visualization"}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleUploadTrack} className="text-foreground">
                  <Upload className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Upload custom genomic tracks
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleDownloadData} className="text-foreground">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Export current view as image or data
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`transition-all duration-500 ${is3DTransitioning ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"}`}>
          {show3DView ? (
            <GenomeVisualization3D 
              geneId={geneId}
              tracks={tracks}
              visibleRange={visibleRange}
              highlightedFeature={highlightedFeature}
              setHighlightedFeature={setHighlightedFeature}
              onBackToGenomeBrowser={() => toggle3DView()}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <Badge variant="outline" className="bg-background">
                        {Math.floor(visibleRange.start).toLocaleString()} - {Math.floor(visibleRange.end).toLocaleString()} bp
                      </Badge>
                      <Badge variant="outline" className="bg-background">
                        Scale: {scale.toFixed(1)}x
                      </Badge>
                      <Info className="h-4 w-4 text-muted-foreground ml-1" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Genome Browser Navigation</h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Position:</span> {Math.floor(visibleRange.start).toLocaleString()} - {Math.floor(visibleRange.end).toLocaleString()} base pairs
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Scale:</span> {scale.toFixed(1)}x zoom level
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Use zoom buttons or click and drag to navigate the sequence.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleZoomOut}
                        disabled={scale <= 0.2}
                        className="text-foreground"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom out</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={scale >= 5}
                        className="text-foreground"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom in</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Slider 
                        defaultValue={[50]} 
                        value={[sliderPosition]} 
                        max={100} 
                        step={0.1} 
                        onValueChange={handleSliderChange}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Slide to navigate through the genome sequence
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div
                ref={viewportRef}
                className="relative h-auto border rounded-md overflow-hidden bg-background/5 cursor-grab dark:bg-slate-900/80 dark:border-slate-800 group"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="p-3 bg-muted/80 dark:bg-slate-800/90 border-b flex items-center justify-between text-foreground">
                      <div className="flex items-center">
                        <MoveHorizontal className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Click and drag to pan genomic view</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Navigation Instructions</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Click and hold to drag the genomic view left or right</li>
                        <li>Use the zoom buttons to increase or decrease detail</li>
                        <li>The slider allows quick navigation to different regions</li>
                        <li>Hover over features to see detailed information</li>
                        <li>Try the 3D View button for an interactive 3D visualization</li>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="p-1 bg-muted/60 dark:bg-slate-800/60 border-b flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center px-2 py-1 rounded-full bg-primary/10 text-foreground">
                    <span className="h-3 w-3 rounded-full bg-indigo-500 mr-1"></span>
                    <span>Exons</span>
                  </div>
                  <div className="flex items-center px-2 py-1 rounded-full bg-muted/70 text-foreground">
                    <span className="h-0.5 w-3 bg-gray-400 mr-1"></span>
                    <span>Introns</span>
                  </div>
                  <div className="flex items-center px-2 py-1 rounded-full bg-red-500/10 text-foreground">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                    <span>Variants</span>
                  </div>
                </div>
                
                {tracks.map((track) => (
                  <div key={track.id} className="p-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{track.name}</span>
                    </div>
                    <div className="genome-track dark:bg-slate-800/80">
                      {track.features.map((feature, index) => {
                        if (feature.start > visibleRange.end || feature.end < visibleRange.start) {
                          return null;
                        }
                        
                        const left = positionToPixel(Math.max(feature.start, visibleRange.start), visibleRange);
                        const isHighlighted = highlightedFeature && 
                          highlightedFeature.start === feature.start && 
                          highlightedFeature.end === feature.end && 
                          highlightedFeature.type === feature.type;
                        
                        if (feature.type === 'exon') {
                          const width = positionToPixel(Math.min(feature.end, visibleRange.end), visibleRange) - left;
                          return (
                            <Tooltip key={`${track.id}-${index}`}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`genome-exon dark:bg-indigo-500 ${isHighlighted ? 'ring-2 ring-white dark:ring-indigo-300' : ''}`}
                                  style={{ 
                                    left: `${left}px`, 
                                    width: `${Math.max(1, width)}px`,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleFeatureClick(feature)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Exon: {feature.start.toLocaleString()}-{feature.end.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Length: {(feature.end - feature.start).toLocaleString()} bp</p>
                                <p className="text-xs text-muted-foreground">Click for details</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        } else if (feature.type === 'intron') {
                          const width = positionToPixel(Math.min(feature.end, visibleRange.end), visibleRange) - left;
                          return (
                            <Tooltip key={`${track.id}-${index}`}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`genome-intron dark:bg-gray-500 ${isHighlighted ? 'h-1 dark:bg-gray-300' : ''}`}
                                  style={{ 
                                    left: `${left}px`, 
                                    width: `${Math.max(1, width)}px`,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleFeatureClick(feature)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Intron: {feature.start.toLocaleString()}-{feature.end.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Length: {(feature.end - feature.start).toLocaleString()} bp</p>
                                <p className="text-xs text-muted-foreground">Click for details</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        } else if (feature.type === 'variant') {
                          return (
                            <Tooltip key={`${track.id}-${index}`}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`genome-variant dark:bg-red-500 ${isHighlighted ? 'ring-2 ring-white dark:ring-red-300 transform scale-150' : ''}`}
                                  style={{ 
                                    left: `${left}px`,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleFeatureClick(feature)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.variantType}: {feature.id}</p>
                                <p className="text-xs text-muted-foreground">Position: {feature.start.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Click for details</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Highlighted feature details panel */}
                {highlightedFeature && !show3DView && (
                  <div className="absolute right-2 top-20 bg-card dark:bg-slate-800/95 border rounded-md p-3 shadow-lg w-64 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">
                        {highlightedFeature.type === 'variant' 
                          ? `${highlightedFeature.variantType || 'Variant'} ${highlightedFeature.id || ''}`
                          : `${highlightedFeature.type.charAt(0).toUpperCase() + highlightedFeature.type.slice(1)} Details`
                        }
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => setHighlightedFeature(null)}
                      >
                        ×
                      </Button>
                    </div>
                    
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start:</span>
                        <span>{highlightedFeature.start.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End:</span>
                        <span>{highlightedFeature.end.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Length:</span>
                        <span>{(highlightedFeature.end - highlightedFeature.start).toLocaleString()} bp</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        {highlightedFeature.type === 'exon' && "This exon may contribute to the protein's functional domain, affecting its stability and interaction capabilities."}
                        {highlightedFeature.type === 'intron' && "This intron may contain regulatory elements influencing alternative splicing patterns."}
                        {highlightedFeature.type === 'variant' && highlightedFeature.variantType === 'SNP' && "This SNP may alter protein function or expression levels, potentially affecting disease susceptibility."}
                        {highlightedFeature.type === 'variant' && highlightedFeature.variantType === 'Deletion' && "This deletion may cause a frameshift, potentially leading to a truncated protein or nonsense-mediated decay."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenomeBrowser;
