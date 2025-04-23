
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Terminal as TerminalIcon, Play, Delete, Code, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommandResponse {
  output: string;
  error?: string;
  executionTime?: number;
}

const Terminal = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<Array<{command: string, response: CommandResponse}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const executeCommand = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would connect to a backend service
      // that can execute code in various languages
      
      // For demo purposes, we'll simulate code execution with a timeout
      const startTime = performance.now();
      
      // Mock command execution - in production this would call your backend
      const response = await simulateExecution(input);
      
      const executionTime = Math.round(performance.now() - startTime);
      
      // Add the command and response to history
      setHistory(prev => [
        ...prev, 
        {
          command: input,
          response: {
            ...response,
            executionTime
          }
        }
      ]);

      // Save command to Supabase using the conversations table
      try {
        await supabase.from('conversations').insert({
          message: input, // Use 'message' field for the command
          response: response.output || response.error || '', // Use 'response' field for output
        });
      } catch (error) {
        console.error('Failed to save command to database:', error);
      }
      
      // Clear the input
      setInput('');
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearTerminal = () => {
    setHistory([]);
    toast({
      title: "Terminal Cleared",
      description: "Terminal history has been cleared.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }
  };

  // This is a mock function to simulate code execution
  // In a real app, this would call your backend execution service
  const simulateExecution = async (code: string): Promise<CommandResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock response based on input
        if (code.toLowerCase().includes('error')) {
          resolve({
            output: '',
            error: 'Simulated error in code execution'
          });
        } else if (code.toLowerCase().includes('hello')) {
          resolve({
            output: 'Hello, Quantum World!'
          });
        } else if (code.toLowerCase().includes('emf')) {
          resolve({
            output: 'Current EMF Reading: ' + (Math.random() * 100 + 50).toFixed(2) + ' μT'
          });
        } else {
          resolve({
            output: `Executed:\n${code}\n\nSuccess! This is a simulated response.`
          });
        }
      }, 500);
    });
  };

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-5 w-5" />
          <h3 className="text-sm font-mono">Quantum Terminal</h3>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={clearTerminal}
          >
            <Delete className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => {
              toast({
                title: "Code Saved",
                description: "Your code has been saved to the database.",
              });
            }}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Terminal output history */}
      <div className="bg-gray-950 text-gray-100 p-4 font-mono text-sm overflow-y-auto flex-1 min-h-[200px] max-h-[400px]">
        {history.length === 0 && (
          <div className="text-gray-500 italic">
            Type a command and press Enter to execute. Try "hello" or "emf" for demo responses.
          </div>
        )}
        
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center text-green-400">
              <span className="mr-2">$</span>
              <pre className="whitespace-pre-wrap break-all">{item.command}</pre>
            </div>
            
            {item.response.output && (
              <pre className="whitespace-pre-wrap text-gray-300 pl-4 mt-1 break-all">
                {item.response.output}
              </pre>
            )}
            
            {item.response.error && (
              <pre className="whitespace-pre-wrap text-red-400 pl-4 mt-1 break-all">
                Error: {item.response.error}
              </pre>
            )}
            
            {item.response.executionTime !== undefined && (
              <div className="text-xs text-gray-500 mt-1 pl-4">
                Executed in {item.response.executionTime}ms
              </div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef}></div>
      </div>
      
      {/* Command input area */}
      <div className="border-t border-gray-800 p-2 bg-gray-900">
        <div className="flex">
          <Textarea 
            className="flex-1 bg-gray-800 text-white border-gray-700 font-mono text-sm min-h-[100px] resize-none"
            placeholder="Enter code or command here..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="ml-2 flex flex-col space-y-2">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={executeCommand}
              disabled={isLoading}
            >
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300"
              onClick={() => setInput('')}
              disabled={!input}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1 pl-1">
          Shift+Enter to execute. Supports multiple languages via backend execution service.
        </div>
      </div>
    </Card>
  );
};

export default Terminal;
