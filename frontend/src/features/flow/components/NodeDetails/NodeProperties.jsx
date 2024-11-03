import { Box, Tag, Calendar } from "lucide-react";
import { format } from 'date-fns';

export const NodeProperties = ({ node }) => (
  <div className="border rounded-lg p-4">
    <h4 className="text-sm font-medium leading-none mb-3">Properties</h4>
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <Box className="h-4 w-4 mr-2" />
        <span className="text-muted-foreground">Type:</span>
        <span className="ml-2">{node.data.metadata?.type || 'default'}</span>
      </div>
      <div className="flex items-center text-sm">
        <Tag className="h-4 w-4 mr-2" />
        <span className="text-muted-foreground">Category:</span>
        <span className="ml-2">{node.data.metadata?.category || 'none'}</span>
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
);
