
import React, { useState } from 'react';
import Terminal from '@/components/Terminal';
import CodeEditor from '@/components/CodeEditor';
import QuantumCanvas from '@/components/QuantumCanvas';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Code, Terminal as TerminalIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuantumTerminalSystem = () => {
  const [activeTab, setActiveTab] = useState<string>('editor');
  const { toast } = useToast();
  
  const handleCodeExecution = (code: string, language: string) => {
    toast({
      title: `Executing ${language} code`,
      description: "Sending to quantum terminal...",
    });
    
    // You can add logic here to pass the code to the terminal component
    // For now, we'll just log it
    console.log(`Executing ${language} code:`, code);
  };
  
  return (
    <div className="w-full">
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[600px] rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Top panel: Visualization */}
        <ResizablePanel defaultSize={40}>
          <QuantumCanvas />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Bottom panel: Terminal & Code Editor */}
        <ResizablePanel defaultSize={60}>
          <Card className="rounded-none border-0 h-full flex flex-col">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-900 border-b border-gray-800 p-1">
                <TabsList className="bg-gray-800 grid grid-cols-2 w-[240px]">
                  <TabsTrigger 
                    value="editor"
                    className="data-[state=active]:bg-gray-700"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger 
                    value="terminal"
                    className="data-[state=active]:bg-gray-700"
                  >
                    <TerminalIcon className="h-4 w-4 mr-2" />
                    Terminal
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Code Editor content */}
              <TabsContent value="editor" className="flex-1 m-0 p-0 h-full">
                <div className="p-4 h-full">
                  <CodeEditor onExecute={handleCodeExecution} />
                </div>
              </TabsContent>
              
              {/* Terminal content */}
              <TabsContent value="terminal" className="flex-1 m-0 p-0 h-full">
                <div className="p-4 h-full">
                  <Terminal />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QuantumTerminalSystem;
