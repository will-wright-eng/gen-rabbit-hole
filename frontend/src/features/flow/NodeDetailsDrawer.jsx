// src/features/flow/NodeDetailsDrawer.jsx
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Loader2,
  Wand2,
  Calendar,
  Tag,
  Box,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const NodeDetailsDrawer = ({ node, onClose, onGenerateNodes, edges = [] }) => {
  const [generationCount, setGenerationCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const childNodes = edges
    .filter(edge => edge.source === node?.id)
    .map(edge => edge.target);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await onGenerateNodes(node.id, generationCount);
      toast({
        title: "Nodes Generated",
        description: `Successfully generated ${generationCount} new nodes.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate nodes. Using fallback data.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!node) return null;

  return (
    <Sheet open={!!node} onOpenChange={onClose}>
      <SheetContent className="w-[400px] overflow-y-auto">
        <SheetHeader className="flex flex-row justify-between items-center">
          <div>
            <SheetTitle>{node.data.label}</SheetTitle>
            <SheetDescription>{node.data.description}</SheetDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium leading-none mb-3">Properties</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Box className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">
                  {node.data.metadata?.type || 'default'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">
                  {node.data.metadata?.category || 'none'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">
                  {node.data.metadata?.createdAt ?
                    format(new Date(node.data.metadata.createdAt), 'PPP') :
                    'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Generation Information */}
          {node.data.metadata?.generation && (
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium leading-none mb-3">Generation Info</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Prompt:</span>
                  <span className="ml-2">{node.data.metadata.generation.prompt}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Sequence:</span>
                  <span className="ml-2">{node.data.metadata.generation.sequence}</span>
                </p>
              </div>
            </div>
          )}

          {/* Connected Nodes */}
          {childNodes.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium leading-none mb-3">Connected Nodes</h4>
              <div className="space-y-2">
                {childNodes.map(nodeId => (
                  <div key={nodeId} className="flex items-center text-sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    <span>{nodeId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate New Nodes */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium leading-none mb-3">Generate Nodes</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={generationCount}
                  onChange={(e) => setGenerationCount(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate new nodes based on this node's context (max 5)
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsDrawer;
