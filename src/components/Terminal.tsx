
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Terminal as TerminalIcon, Play, Delete, Code, Save, Database, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { executeQuantumAlgorithm } from '@/utils/quantumSimulator';

interface CommandResponse {
  output: string;
  error?: string;
  executionTime?: number;
}

const Terminal = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<Array<{command: string, response: CommandResponse}>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'classical' | 'quantum' | 'hybrid'>('classical');
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
      const startTime = performance.now();
      
      // Execute command based on the current mode
      let response: CommandResponse;
      
      if (mode === 'quantum' || (mode === 'hybrid' && input.toLowerCase().includes('quantum'))) {
        response = await executeQuantumAlgorithm(input);
      } else {
        // Use the existing simulation for classical or non-quantum hybrid commands
        response = await simulateExecution(input);
      }
      
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
        } else if (code.toLowerCase().includes('qaoa')) {
          resolve({
            output: 'Executing Quantum Approximate Optimization Algorithm...\n\n' +
                   'Problem: MaxCut on 10-node graph\n' +
                   'Iterations: 100\n' +
                   'Final approximation ratio: 0.9342\n' +
                   'Solution: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1]'
          });
        } else if (code.toLowerCase().includes('vqe')) {
          resolve({
            output: 'Executing Variational Quantum Eigensolver...\n\n' +
                   'Molecule: H2\n' +
                   'Converged energy: -1.137 Hartree\n' +
                   'Bond length: 0.735 angstroms\n' +
                   'Iterations: 35'
          });
        } else if (code.toLowerCase().includes('qnn')) {
          resolve({
            output: 'Training Quantum Neural Network...\n\n' +
                   'Dataset: MNIST digits (subset)\n' +
                   'Quantum layers: 3\n' +
                   'Classical layers: 2\n' +
                   'Training accuracy: 92.7%\n' +
                   'Test accuracy: 89.3%'
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
          <div className="flex items-center space-x-1 ml-4">
            <Button 
              variant={mode === 'classical' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 py-1 text-xs"
              onClick={() => setMode('classical')}
            >
              Classical
            </Button>
            <Button 
              variant={mode === 'quantum' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 py-1 text-xs"
              onClick={() => setMode('quantum')}
            >
              <Cpu className="h-3 w-3 mr-1" />
              Quantum
            </Button>
            <Button 
              variant={mode === 'hybrid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 py-1 text-xs"
              onClick={() => setMode('hybrid')}
            >
              <Database className="h-3 w-3 mr-1" />
              Hybrid
            </Button>
          </div>
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
            {mode === 'quantum' ? (
              <span>Type a quantum algorithm command (e.g., "qaoa", "vqe", "qnn") and press Enter to execute.</span>
            ) : mode === 'hybrid' ? (
              <span>Execute both classical and quantum commands. Try "hello", "emf", "qaoa", or "vqe".</span>
            ) : (
              <span>Type a command and press Enter to execute. Try "hello" or "emf" for demo responses.</span>
            )}
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
            placeholder={
              mode === 'quantum' 
                ? "Enter quantum algorithm (qaoa, vqe, qnn)..." 
                : mode === 'hybrid'
                ? "Enter classical or quantum command..."
                : "Enter code or command here..."
            }
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
          {mode === 'quantum' 
            ? "Shift+Enter to execute quantum simulations. Supports QAOA, VQE, and QNN." 
            : mode === 'hybrid'
            ? "Shift+Enter to execute. Supports hybrid quantum-classical computation simulation."
            : "Shift+Enter to execute. Supports multiple languages via backend execution service."}
        </div>
      </div>
    </Card>
  );
};

export default Terminal;
