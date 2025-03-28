
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard, Html } from '@react-three/drei';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import * as THREE from 'three';
import { toast } from "sonner";

interface GenomeVisualization3DProps {
  geneId: string;
  tracks: any[];
  visibleRange: { start: number; end: number };
  highlightedFeature: any | null;
  setHighlightedFeature: (feature: any | null) => void;
  onBackToGenomeBrowser: () => void;
}

// DNA double helix parameters
const helixRadius = 2;
const helixHeight = 20;
const helixTurns = 10;
const basePairsPerTurn = 10;

// DNA visualization component
const DNAModel = ({ 
  tracks, 
  visibleRange, 
  highlightedFeature, 
  setHighlightedFeature 
}: {
  tracks: any[];
  visibleRange: { start: number; end: number };
  highlightedFeature: any | null;
  setHighlightedFeature: (feature: any | null) => void;
}) => {
  const group = useRef<THREE.Group>(null);
  const [hoveredFeature, setHoveredFeature] = useState<any | null>(null);
  
  // Animation rotation
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
    }
  });
  
  // Map a genomic position to a height on the helix
  const mapPositionToHeight = (position: number) => {
    const rangeLength = visibleRange.end - visibleRange.start;
    const normalizedPos = (position - visibleRange.start) / rangeLength;
    return helixHeight * normalizedPos - helixHeight / 2;
  };
  
  // Extract all features from tracks
  const allFeatures = tracks.flatMap(track => 
    track.features.filter((feature: any) => 
      feature.start >= visibleRange.start && feature.end <= visibleRange.end
    )
  );
  
  // Color mapping for feature types
  const getFeatureColor = (feature: any) => {
    switch (feature.type) {
      case 'exon':
        return new THREE.Color(0x4F46E5); // Primary purple
      case 'intron':
        return new THREE.Color(0x94a3b8); // Gray
      case 'variant':
        return feature.variantType === 'SNP' 
          ? new THREE.Color(0xEF4444) // Red for SNPs
          : new THREE.Color(0xF97316); // Orange for other variants
      default:
        return new THREE.Color(0xcccccc);
    }
  };
  
  // Generate the DNA backbone
  const generateDNABackbone = () => {
    const points1 = [];
    const points2 = [];
    
    for (let i = 0; i <= helixTurns * 32; i++) {
      const t = i / (helixTurns * 32);
      const angle = t * Math.PI * 2 * helixTurns;
      
      points1.push(
        new THREE.Vector3(
          helixRadius * Math.cos(angle),
          helixHeight * t - helixHeight / 2,
          helixRadius * Math.sin(angle)
        )
      );
      
      points2.push(
        new THREE.Vector3(
          helixRadius * Math.cos(angle + Math.PI),
          helixHeight * t - helixHeight / 2,
          helixRadius * Math.sin(angle + Math.PI)
        )
      );
    }
    
    return [points1, points2];
  };
  
  const [backbone1, backbone2] = generateDNABackbone();
  
  // Handle feature click
  const handleFeatureClick = (feature: any) => {
    setHighlightedFeature(feature);
    const featureType = feature.type.charAt(0).toUpperCase() + feature.type.slice(1);
    toast.info(`${featureType} selected`, {
      description: `Positions ${feature.start.toLocaleString()}-${feature.end.toLocaleString()} bp`
    });
  };
  
  return (
    <group ref={group}>
      {/* DNA backbones */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={backbone1.length}
            array={new Float32Array(backbone1.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" linewidth={3} />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={backbone2.length}
            array={new Float32Array(backbone2.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" linewidth={3} />
      </line>
      
      {/* Base pairs (simplified representation) */}
      {Array.from({ length: helixTurns * basePairsPerTurn }).map((_, i) => {
        const t = i / (helixTurns * basePairsPerTurn);
        const angle = t * Math.PI * 2 * helixTurns;
        const y = helixHeight * t - helixHeight / 2;
        
        return (
          <line key={`base-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  helixRadius * Math.cos(angle), y, helixRadius * Math.sin(angle),
                  helixRadius * Math.cos(angle + Math.PI), y, helixRadius * Math.sin(angle + Math.PI)
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#a5b4fc" linewidth={1} />
          </line>
        );
      })}
      
      {/* Feature representations */}
      {allFeatures.map((feature, idx) => {
        const yStart = mapPositionToHeight(feature.start);
        const yEnd = mapPositionToHeight(feature.end);
        const featureLength = Math.max(0.2, yEnd - yStart);
        const yCenter = (yStart + yEnd) / 2;
        const color = getFeatureColor(feature);
        const isHighlighted = highlightedFeature && 
          highlightedFeature.start === feature.start && 
          highlightedFeature.end === feature.end && 
          highlightedFeature.type === feature.type;
        
        // Show different representations based on feature type
        if (feature.type === 'exon') {
          return (
            <group key={`feature-${idx}`} position={[0, yCenter, 0]}>
              <mesh 
                position={[helixRadius * 1.5, 0, 0]}
                scale={[0.5, featureLength, 0.5]}
                onClick={() => handleFeatureClick(feature)}
                onPointerOver={() => setHoveredFeature(feature)}
                onPointerOut={() => setHoveredFeature(null)}
              >
                <boxGeometry />
                <meshStandardMaterial 
                  color={color} 
                  emissive={isHighlighted ? color : undefined}
                  emissiveIntensity={isHighlighted ? 0.5 : 0}
                />
              </mesh>
              {(isHighlighted || hoveredFeature === feature) && (
                <Billboard position={[helixRadius * 2.5, 0, 0]}>
                  <Text
                    fontSize={0.3}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                  >
                    {`Exon: ${feature.start}-${feature.end}`}
                  </Text>
                </Billboard>
              )}
            </group>
          );
        } else if (feature.type === 'intron') {
          return (
            <group key={`feature-${idx}`} position={[0, yCenter, 0]}>
              <line 
                onClick={() => handleFeatureClick(feature)}
                onPointerOver={() => setHoveredFeature(feature)}
                onPointerOut={() => setHoveredFeature(null)}
              >
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      helixRadius * 1.2, -featureLength/2, 0,
                      helixRadius * 1.8, featureLength/2, 0
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  color={isHighlighted ? "#ffffff" : color} 
                  linewidth={isHighlighted ? 2 : 1} 
                />
              </line>
              {(isHighlighted || hoveredFeature === feature) && (
                <Billboard position={[helixRadius * 2.2, 0, 0]}>
                  <Text
                    fontSize={0.3}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                  >
                    {`Intron: ${feature.start}-${feature.end}`}
                  </Text>
                </Billboard>
              )}
            </group>
          );
        } else if (feature.type === 'variant') {
          return (
            <group key={`feature-${idx}`} position={[0, yCenter, 0]}>
              <mesh 
                position={[0, 0, helixRadius * 1.5]}
                onClick={() => handleFeatureClick(feature)}
                onPointerOver={() => setHoveredFeature(feature)}
                onPointerOut={() => setHoveredFeature(null)}
              >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial 
                  color={color} 
                  emissive={isHighlighted ? color : undefined}
                  emissiveIntensity={isHighlighted ? 0.8 : 0}
                />
              </mesh>
              {(isHighlighted || hoveredFeature === feature) && (
                <Billboard position={[0, 0, helixRadius * 2.2]}>
                  <Text
                    fontSize={0.3}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                  >
                    {`${feature.variantType}: ${feature.id || 'Unknown'}`}
                  </Text>
                </Billboard>
              )}
            </group>
          );
        }
        return null;
      })}
    </group>
  );
};

// Features info panel component
const FeatureInfoPanel = ({ feature, onClose }: { feature: any; onClose: () => void }) => {
  if (!feature) return null;
  
  const getFeatureTitle = () => {
    if (feature.type === 'variant') {
      return `${feature.variantType || 'Variant'} ${feature.id || ''}`;
    }
    return `${feature.type.charAt(0).toUpperCase() + feature.type.slice(1)} Details`;
  };
  
  const getVariantBadge = () => {
    if (feature.type !== 'variant') return null;
    
    switch (feature.variantType) {
      case 'SNP':
        return <Badge variant="secondary">SNP</Badge>;
      case 'Deletion':
        return <Badge variant="destructive">Deletion</Badge>;
      default:
        return <Badge variant="outline">{feature.variantType}</Badge>;
    }
  };
  
  return (
    <div className="absolute top-4 right-4 w-72 bg-card border rounded-lg shadow-lg p-4 space-y-3 z-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">{getFeatureTitle()}</h3>
        {getVariantBadge()}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Start:</span>
          <span className="font-medium">{feature.start.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">End:</span>
          <span className="font-medium">{feature.end.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Length:</span>
          <span className="font-medium">{(feature.end - feature.start).toLocaleString()} bp</span>
        </div>
      </div>
      
      <div className="border-t pt-3 mt-2">
        <h4 className="text-sm font-medium mb-1">AI Insights</h4>
        <p className="text-xs text-muted-foreground">
          {feature.type === 'exon' && "This exon may contribute to the protein's functional domain, affecting its stability and interaction capabilities."}
          {feature.type === 'intron' && "This intron may contain regulatory elements influencing alternative splicing patterns."}
          {feature.type === 'variant' && feature.variantType === 'SNP' && "This SNP may alter protein function or expression levels, potentially affecting disease susceptibility."}
          {feature.type === 'variant' && feature.variantType === 'Deletion' && "This deletion may cause a frameshift, potentially leading to a truncated protein or nonsense-mediated decay."}
        </p>
      </div>
      
      <Button variant="outline" size="sm" onClick={onClose} className="w-full">Close</Button>
    </div>
  );
};

// Scene controls component
const SceneControls = ({ showLayers, setShowLayers }: { 
  showLayers: {dna: boolean; genes: boolean; variants: boolean}; 
  setShowLayers: React.Dispatch<React.SetStateAction<{dna: boolean; genes: boolean; variants: boolean}>>;
}) => {
  return (
    <div className="absolute bottom-4 left-4 space-y-2 z-10">
      <div className="flex flex-col gap-1.5 p-2 bg-card/80 backdrop-blur-sm border rounded-md">
        <div className="text-xs font-medium text-foreground mb-1">Visualization Layers</div>
        <label className="flex items-center gap-2 text-xs">
          <input 
            type="checkbox" 
            checked={showLayers.dna}
            onChange={(e) => setShowLayers(prev => ({...prev, dna: e.target.checked}))}
            className="w-3.5 h-3.5"
          />
          <span>DNA Structure</span>
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input 
            type="checkbox" 
            checked={showLayers.genes}
            onChange={(e) => setShowLayers(prev => ({...prev, genes: e.target.checked}))}
            className="w-3.5 h-3.5"
          />
          <span>Gene Regions</span>
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input 
            type="checkbox" 
            checked={showLayers.variants}
            onChange={(e) => setShowLayers(prev => ({...prev, variants: e.target.checked}))}
            className="w-3.5 h-3.5"
          />
          <span>Genetic Variants</span>
        </label>
      </div>
    </div>
  );
};

// Main 3D visualization component
const GenomeVisualization3D: React.FC<GenomeVisualization3DProps> = ({
  geneId,
  tracks,
  visibleRange,
  highlightedFeature,
  setHighlightedFeature,
  onBackToGenomeBrowser
}) => {
  const [showLayers, setShowLayers] = useState({
    dna: true,
    genes: true,
    variants: true
  });
  
  return (
    <div className="relative w-full h-[500px] rounded-md overflow-hidden border">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onBackToGenomeBrowser}>
              <span className="mr-1">←</span> 2D View
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Return to 2D genome browser
          </TooltipContent>
        </Tooltip>
        
        <Badge variant="outline" className="bg-black/30 backdrop-blur-sm text-foreground">
          {geneId} 3D Model
        </Badge>
      </div>
      
      <SceneControls showLayers={showLayers} setShowLayers={setShowLayers} />
      
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {highlightedFeature && (
          <Html>
            <FeatureInfoPanel 
              feature={highlightedFeature} 
              onClose={() => setHighlightedFeature(null)} 
            />
          </Html>
        )}
        
        <DNAModel 
          tracks={tracks.filter(track => 
            (track.id === 'gene' && showLayers.genes) || 
            (track.id === 'variants' && showLayers.variants)
          )} 
          visibleRange={visibleRange}
          highlightedFeature={highlightedFeature}
          setHighlightedFeature={setHighlightedFeature}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        
        <gridHelper args={[30, 30, '#666666', '#444444']} position={[0, -helixHeight/2 - 1, 0]} />
      </Canvas>
    </div>
  );
};

export default GenomeVisualization3D;
