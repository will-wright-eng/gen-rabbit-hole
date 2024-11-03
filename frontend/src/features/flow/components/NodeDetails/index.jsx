import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NodeProperties } from './NodeProperties';
import { NodeConnections } from './NodeConnections';
import { NodeGenerationForm } from './NodeGenerationForm';

const NodeDetailsDrawer = ({ node, onClose, onGenerateNodes, edges = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const childNodes = edges
    .filter(edge => edge.source === node?.id)
    .map(edge => edge.target);

  const handleGenerate = async (count) => {
    try {
      setIsGenerating(true);
      await onGenerateNodes(node.id, count);
      toast({
        title: "Nodes Generated",
        description: `Successfully generated ${count} new nodes.`,
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
          <NodeProperties node={node} />
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
          <NodeConnections childNodes={childNodes} />
          <NodeGenerationForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsDrawer;
