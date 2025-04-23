
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Laptop, Cpu, Calculator } from 'lucide-react';
import TerminalComponent from '@/components/Terminal';
import QuantumCanvas from '@/components/QuantumCanvas';
import QuantumAlgorithms from '@/components/QuantumAlgorithms';

const QuantumClassicalSystem = () => {
  const [activeTab, setActiveTab] = useState<string>('visualization');
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold text-white mb-1">Quantum-Classical Hybrid System</h2>
        <p className="text-gray-300 text-sm">
          Interactive quantum computing simulation with classical integration
        </p>
      </div>
      
      <Card className="rounded-t-none border-t-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="visualization" className="flex items-center justify-center">
              <Calculator className="h-4 w-4 mr-2" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="algorithms" className="flex items-center justify-center">
              <Cpu className="h-4 w-4 mr-2" />
              Quantum Algorithms
            </TabsTrigger>
            <TabsTrigger value="terminal" className="flex items-center justify-center">
              <Terminal className="h-4 w-4 mr-2" />
              Terminal
            </TabsTrigger>
          </TabsList>
          
          {/* Visualization Tab */}
          <TabsContent value="visualization" className="mt-0 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Quantum State Visualization</h3>
              <p className="text-sm text-gray-500 mb-4">
                Interactive visual representation of quantum states and processes
              </p>
              <QuantumCanvas />
            </div>
          </TabsContent>
          
          {/* Algorithms Tab */}
          <TabsContent value="algorithms" className="mt-0 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Quantum Algorithm Simulator</h3>
              <p className="text-sm text-gray-500 mb-4">
                Interactive simulations of key quantum algorithms
              </p>
              <QuantumAlgorithms />
            </div>
          </TabsContent>
          
          {/* Terminal Tab */}
          <TabsContent value="terminal" className="mt-0 p-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Quantum Terminal</h3>
              <p className="text-sm text-gray-500 mb-4">
                Execute quantum and classical commands in an integrated environment
              </p>
              <TerminalComponent />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
        <h4 className="font-medium mb-2">System Architecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center text-purple-700 mb-1">
              <Cpu className="h-4 w-4 mr-2" />
              <h5 className="font-medium">Quantum Layer</h5>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Quantum Algorithm Simulation</li>
              <li>• State Preparation & Measurement</li>
              <li>• Error Simulation & Correction</li>
            </ul>
          </div>
          
          <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center text-blue-700 mb-1">
              <Terminal className="h-4 w-4 mr-2" />
              <h5 className="font-medium">Interface Layer</h5>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Quantum-Classical Conversion</li>
              <li>• Command Routing & Processing</li>
              <li>• Results Formatting & Display</li>
            </ul>
          </div>
          
          <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center text-green-700 mb-1">
              <Laptop className="h-4 w-4 mr-2" />
              <h5 className="font-medium">Classical Layer</h5>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Data Processing & Storage</li>
              <li>• Optimization Routines</li>
              <li>• Visualization Engine</li>
            </ul>
          </div>
        </div>
        
        <p className="mt-3 text-xs text-gray-500">
          This architecture demonstrates the core principles of quantum-classical hybrid computing systems with integrated processing capabilities.
        </p>
      </div>
    </div>
  );
};

export default QuantumClassicalSystem;
