import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const NodeDetailsDrawer = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <Sheet open={!!node} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Node Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="mt-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium leading-none mb-3">Basic Information</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <span className="text-sm ml-2">{node.id}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Label:</span>
                  <span className="text-sm ml-2">{node.data.label}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm ml-2">{node.type || 'default'}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium leading-none mb-3">Position</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">X:</span>
                  <span className="text-sm ml-2">{Math.round(node.position.x)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Y:</span>
                  <span className="text-sm ml-2">{Math.round(node.position.y)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeDetailsDrawer;

