export const NODE_TEMPLATES = {
  default: {
    type: 'default',
    data: {
      label: 'Generated Node',
      description: 'AI-generated node',
      metadata: {
        type: 'generated',
        category: 'auto'
      }
    }
  },
  task: {
    type: 'task',
    data: {
      label: 'Task Node',
      description: 'A task to be completed',
      metadata: {
        type: 'task',
        category: 'workflow'
      }
    }
  },
  decision: {
    type: 'decision',
    data: {
      label: 'Decision Node',
      description: 'A decision point in the flow',
      metadata: {
        type: 'decision',
        category: 'workflow'
      }
    }
  }
};

// const nodeTypes = ['process', 'decision', 'input', 'output', 'storage'];
// const nodeCategories = ['system', 'user', 'data', 'service', 'integration'];

// const templates = {
//   process: [
//     'Process Data',
//     'Transform Input',
//     'Validate Request',
//     'Format Response',
//     'Calculate Result',
//     'Filter Items',
//     'Sort Elements',
//     'Merge Data',
//     'Split Content',
//     'Analyze Results'
//   ],
//   decision: [
//     'Check Condition',
//     'Validate Rules',
//     'Branch Logic',
//     'Route Request',
//     'Evaluate Status',
//     'Verify Access',
//     'Compare Values',
//     'Assert State',
//     'Test Criteria',
//     'Select Path'
//   ],
//   input: [
//     'User Input',
//     'System Feed',
//     'Data Stream',
//     'File Upload',
//     'API Request',
//     'Form Submit',
//     'Queue Message',
//     'Event Trigger',
//     'Sensor Data',
//     'Batch Import'
//   ],
//   output: [
//     'Generate Report',
//     'Send Response',
//     'Export Data',
//     'Create Log',
//     'Emit Event',
//     'Update UI',
//     'Store Result',
//     'Push Notice',
//     'Write File',
//     'Print Output'
//   ],
//   storage: [
//     'Cache Data',
//     'Store Record',
//     'Update DB',
//     'Save State',
//     'Persist Info',
//     'Archive Content',
//     'Buffer Stream',
//     'Index Data',
//     'Backup State',
//     'Queue Item'
//   ]
// };

// export const generateDescription = (type) => {
//   const descriptions = {
//     process: [
//       'Processes incoming data according to business rules',
//       'Transforms data from one format to another',
//       'Applies business logic to input values',
//       'Handles data processing operations',
//       'Executes transformation logic'
//     ],
//     decision: [
//       'Evaluates conditions and determines flow path',
//       'Makes routing decisions based on input',
//       'Validates business rules and conditions',
//       'Controls flow based on criteria',
//       'Determines next steps in workflow'
//     ],
//     input: [
//       'Accepts incoming data from external sources',
//       'Handles user or system input',
//       'Receives data for processing',
//       'Captures incoming information',
//       'Collects data from various sources'
//     ],
//     output: [
//       'Generates output based on processed data',
//       'Produces results for downstream systems',
//       'Creates formatted output',
//       'Prepares data for external consumption',
//       'Formats and sends results'
//     ],
//     storage: [
//       'Stores data for later retrieval',
//       'Maintains persistent state',
//       'Handles data storage operations',
//       'Manages data persistence',
//       'Saves information to storage'
//     ]
//   };

//   const typeDescriptions = descriptions[type] || descriptions.process;
//   return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
// };

// export const generateNodeStyle = (type) => {
//   const styles = {
//     process: {
//       backgroundColor: '#4CAF50',
//       borderColor: '#388E3C',
//       color: '#fff'
//     },
//     decision: {
//       backgroundColor: '#FFC107',
//       borderColor: '#FFA000',
//       color: '#000'
//     },
//     input: {
//       backgroundColor: '#2196F3',
//       borderColor: '#1976D2',
//       color: '#fff'
//     },
//     output: {
//       backgroundColor: '#F44336',
//       borderColor: '#D32F2F',
//       color: '#fff'
//     },
//     storage: {
//       backgroundColor: '#9C27B0',
//       borderColor: '#7B1FA2',
//       color: '#fff'
//     }
//   };

//   return styles[type] || styles.process;
// };

