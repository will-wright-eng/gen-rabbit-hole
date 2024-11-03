import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { FLOW_DEFAULTS } from '../../constants';

export const NodeGenerationForm = ({ onGenerate, isGenerating }) => {
  const [generationCount, setGenerationCount] = useState(1);

  return (
    <div className="border rounded-lg p-4">
      <h4 className="text-sm font-medium leading-none mb-3">Generate Nodes</h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="1"
            max={FLOW_DEFAULTS.MAX_GENERATED_NODES}
            value={generationCount}
            onChange={(e) => setGenerationCount(parseInt(e.target.value) || 1)}
            className="w-20"
          />
          <Button
            onClick={() => onGenerate(generationCount)}
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
          Generate new nodes based on this node's context (max {FLOW_DEFAULTS.MAX_GENERATED_NODES})
        </p>
      </div>
    </div>
  );
};
