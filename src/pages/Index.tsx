
import React from 'react';
import QuantumClassicalSystem from '@/components/QuantumClassicalSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WifiHigh } from 'lucide-react';
import EMFDisplay from '@/components/EMFDisplay';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Quantum-Classical Hybrid System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Environmental Monitoring & Quantum Computation Interface</p>
        </div>

        <Tabs defaultValue="quantum" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-2">
            <TabsTrigger value="quantum">
              Quantum System
            </TabsTrigger>
            <TabsTrigger value="emf">
              <WifiHigh className="mr-2 h-4 w-4" />
              EMF Monitor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quantum" className="mt-4">
            <QuantumClassicalSystem />
          </TabsContent>
          
          <TabsContent value="emf" className="mt-4">
            <EMFDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
