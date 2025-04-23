
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu, BarChart, Braces, Search, Calculator, Activity, Dna } from 'lucide-react';

const QuantumAlgorithms = () => {
  const [activeTab, setActiveTab] = useState('qaoa');
  const { toast } = useToast();
  
  // QAOA state
  const [qaoaNodes, setQaoaNodes] = useState(10);
  const [qaoaIterations, setQaoaIterations] = useState(100);
  const [qaoaResult, setQaoaResult] = useState<string | null>(null);
  
  // VQE state
  const [vqeMolecule, setVqeMolecule] = useState('H2');
  const [vqeAccuracy, setVqeAccuracy] = useState(0.001);
  const [vqeResult, setVqeResult] = useState<string | null>(null);
  
  // Grover state
  const [groverBits, setGroverBits] = useState(4);
  const [groverTarget, setGroverTarget] = useState('1010');
  const [groverResult, setGroverResult] = useState<string | null>(null);
  
  // Shor state
  const [shorNumber, setShorNumber] = useState(15);
  const [shorResult, setShorResult] = useState<string | null>(null);
  
  const simulateQAOA = () => {
    setQaoaResult('Simulating...');
    
    setTimeout(() => {
      // Generate random approximation ratio between 0.85 and 0.96
      const approxRatio = (0.85 + Math.random() * 0.11).toFixed(4);
      
      // Generate a random solution bit string
      const solution = Array.from({ length: qaoaNodes }, () => Math.floor(Math.random() * 2)).join(', ');
      
      setQaoaResult(`Problem: MaxCut on ${qaoaNodes}-node graph
Iterations: ${qaoaIterations}
Final approximation ratio: ${approxRatio}
Solution: [${solution}]

Circuit depth: ${Math.floor(qaoaIterations * 1.5)}
Gate count: ${Math.floor(qaoaNodes * qaoaIterations * 2.7)}
Execution time: ${Math.floor(qaoaNodes * qaoaIterations / 20)} ms`);
      
      toast({
        title: "QAOA Simulation Complete",
        description: `MaxCut problem solved with ${approxRatio} approximation ratio`,
      });
    }, 1000);
  };
  
  const simulateVQE = () => {
    setVqeResult('Simulating...');
    
    setTimeout(() => {
      // Molecular data dictionary (simplified)
      const molecularData: Record<string, { energy: number, bondLength: number, iterations: number }> = {
        'H2': { energy: -1.137, bondLength: 0.735, iterations: 35 },
        'LiH': { energy: -7.883, bondLength: 1.595, iterations: 48 },
        'H2O': { energy: -76.438, bondLength: 0.958, iterations: 62 },
        'NH3': { energy: -56.247, bondLength: 1.012, iterations: 76 },
        'CH4': { energy: -40.513, bondLength: 1.087, iterations: 89 }
      };
      
      // Get molecular data or generate random data if molecule not found
      const data = molecularData[vqeMolecule] || {
        energy: -Math.random() * 100 - 1,
        bondLength: Math.random() * 2 + 0.5,
        iterations: Math.floor(Math.random() * 50) + 30
      };
      
      // Adjust energy based on accuracy
      const energyNoise = Math.random() * vqeAccuracy * 10;
      const finalEnergy = data.energy + (Math.random() > 0.5 ? energyNoise : -energyNoise);
      
      setVqeResult(`Molecule: ${vqeMolecule}
Convergence accuracy: ${vqeAccuracy}
Converged energy: ${finalEnergy.toFixed(3)} Hartree
Bond length: ${data.bondLength.toFixed(3)} angstroms
Iterations: ${data.iterations}

Quantum resources:
- Qubits used: ${Math.floor(Math.log2(vqeMolecule.length * 8))}
- Circuit depth: ${Math.floor(data.iterations * 2.2)}
- Measurement shots: ${Math.floor(1000 / vqeAccuracy)}`);
      
      toast({
        title: "VQE Simulation Complete",
        description: `${vqeMolecule} ground state energy calculated`,
      });
    }, 1500);
  };
  
  const simulateGrover = () => {
    setGroverResult('Simulating...');
    
    setTimeout(() => {
      // Calculate iterations
      const iterations = Math.floor(Math.PI / 4 * Math.sqrt(Math.pow(2, groverBits)));
      
      setGroverResult(`Search space: ${Math.pow(2, groverBits)} elements (${groverBits} qubits)
Target element: |${groverTarget}⟩
Optimal iterations: ${iterations}

Search results:
- Target found with probability: ${(1 - 1/Math.pow(2, Math.min(groverBits, 4))).toFixed(4)}
- Quantum speedup: O(√N) vs O(N) classical
- Expected oracle queries: ${iterations} (vs ${Math.pow(2, groverBits)/2} classical)

Circuit statistics:
- Oracle depth: ${groverBits * 2}
- Diffusion operator depth: ${groverBits + 4}
- Total gate count: ${iterations * (groverBits * 3 + 4)}`);
      
      toast({
        title: "Grover's Algorithm Simulation Complete",
        description: `Target ${groverTarget} found in quantum database`,
      });
    }, 1200);
  };
  
  const simulateShor = () => {
    setShorResult('Simulating...');
    
    setTimeout(() => {
      // Simple primality check
      const isPrime = (num: number): boolean => {
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) return false;
        }
        return num > 1;
      };
      
      // Find factors (this is a simplified version for simulation)
      let factor1 = 0, factor2 = 0;
      let resultText = '';
      
      if (isPrime(shorNumber)) {
        resultText = `Input number: ${shorNumber}
Result: ${shorNumber} is prime

Quantum resources:
- Logical qubits required: ${Math.ceil(Math.log2(shorNumber) * 2)}
- Circuit depth: n/a (terminated early)
- Phase estimation precision: ${Math.ceil(Math.log2(shorNumber))} bits

Note: Shor's algorithm cannot factor prime numbers.`;
      } else {
        // Find a simple factor for demonstration
        for (let i = 2; i <= Math.sqrt(shorNumber); i++) {
          if (shorNumber % i === 0) {
            factor1 = i;
            factor2 = shorNumber / i;
            break;
          }
        }
        
        resultText = `Input number: ${shorNumber}
Factorization: ${factor1} × ${factor2}

Quantum resources:
- Logical qubits required: ${Math.ceil(Math.log2(shorNumber) * 2)}
- Circuit depth: ${Math.ceil(Math.pow(Math.log2(shorNumber), 2) * 5)}
- Phase estimation precision: ${Math.ceil(Math.log2(shorNumber))} bits
- Modular exponentiation executed

Classical post-processing:
- Continued fraction expansion 
- Greatest common divisor calculation
- Success probability: ${(0.7 + Math.random() * 0.3).toFixed(2)}`;
      }
      
      setShorResult(resultText);
      
      if (isPrime(shorNumber)) {
        toast({
          title: "Shor's Algorithm Result",
          description: `${shorNumber} is prime and cannot be factored`,
        });
      } else {
        toast({
          title: "Shor's Algorithm Complete",
          description: `${shorNumber} factored into ${factor1} × ${factor2}`,
        });
      }
    }, 2000);
  };
  
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-900 to-blue-800 text-white">
        <CardTitle className="flex items-center">
          <Cpu className="mr-2 h-6 w-6" />
          Quantum Algorithm Simulator
        </CardTitle>
        <CardDescription className="text-gray-200">
          Interactive simulations of key quantum algorithms
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-100">
          <TabsTrigger value="qaoa" className="flex items-center justify-center">
            <BarChart className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">QAOA</span>
          </TabsTrigger>
          <TabsTrigger value="vqe" className="flex items-center justify-center">
            <Dna className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">VQE</span>
          </TabsTrigger>
          <TabsTrigger value="grover" className="flex items-center justify-center">
            <Search className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Grover</span>
          </TabsTrigger>
          <TabsTrigger value="shor" className="flex items-center justify-center">
            <Calculator className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Shor</span>
          </TabsTrigger>
        </TabsList>
        
        {/* QAOA Content */}
        <TabsContent value="qaoa" className="border-none p-0 pt-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Quantum Approximate Optimization Algorithm</h3>
                <p className="text-sm text-gray-500">
                  Solves combinatorial optimization problems like MaxCut using quantum-classical hybrid approach.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nodes">Number of Nodes</Label>
                  <Input 
                    id="nodes" 
                    type="number" 
                    value={qaoaNodes} 
                    onChange={(e) => setQaoaNodes(parseInt(e.target.value) || 2)}
                    min={2}
                    max={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="iterations">Iterations</Label>
                  <Input 
                    id="iterations" 
                    type="number" 
                    value={qaoaIterations} 
                    onChange={(e) => setQaoaIterations(parseInt(e.target.value) || 10)}
                    min={10}
                    max={1000}
                  />
                </div>
              </div>
              
              {qaoaResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-purple-600" />
                    Simulation Result
                  </h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap">{qaoaResult}</pre>
                </div>
              )}
              
              <Button 
                onClick={simulateQAOA}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Cpu className="mr-2 h-4 w-4" />
                Simulate QAOA
              </Button>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* VQE Content */}
        <TabsContent value="vqe" className="border-none p-0 pt-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Variational Quantum Eigensolver</h3>
                <p className="text-sm text-gray-500">
                  Calculates molecular ground state energies using a hybrid quantum-classical approach.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="molecule">Molecule</Label>
                  <Select value={vqeMolecule} onValueChange={setVqeMolecule}>
                    <SelectTrigger id="molecule" className="w-full">
                      <SelectValue placeholder="Select molecule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H2">H₂</SelectItem>
                      <SelectItem value="LiH">LiH</SelectItem>
                      <SelectItem value="H2O">H₂O</SelectItem>
                      <SelectItem value="NH3">NH₃</SelectItem>
                      <SelectItem value="CH4">CH₄</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accuracy">Convergence Accuracy</Label>
                  <Select 
                    value={String(vqeAccuracy)} 
                    onValueChange={(val) => setVqeAccuracy(parseFloat(val))}
                  >
                    <SelectTrigger id="accuracy" className="w-full">
                      <SelectValue placeholder="Select accuracy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0.01 (Low)</SelectItem>
                      <SelectItem value="0.001">0.001 (Medium)</SelectItem>
                      <SelectItem value="0.0001">0.0001 (High)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {vqeResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-600" />
                    Simulation Result
                  </h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap">{vqeResult}</pre>
                </div>
              )}
              
              <Button 
                onClick={simulateVQE}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Dna className="mr-2 h-4 w-4" />
                Simulate VQE
              </Button>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Grover Content */}
        <TabsContent value="grover" className="border-none p-0 pt-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Grover's Search Algorithm</h3>
                <p className="text-sm text-gray-500">
                  Provides quadratic speedup for searching in an unstructured database.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bits">Number of Bits</Label>
                  <Input 
                    id="bits" 
                    type="number" 
                    value={groverBits} 
                    onChange={(e) => {
                      const bits = parseInt(e.target.value) || 2;
                      setGroverBits(bits);
                      // Ensure target matches bit length
                      if (groverTarget.length !== bits) {
                        setGroverTarget('1'.padStart(bits, '0'));
                      }
                    }}
                    min={2}
                    max={12}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target">Target Bit String</Label>
                  <Input 
                    id="target" 
                    value={groverTarget} 
                    onChange={(e) => {
                      // Ensure only 0s and 1s
                      const filtered = e.target.value.replace(/[^01]/g, '');
                      // Trim to appropriate length
                      const trimmed = filtered.slice(0, groverBits);
                      setGroverTarget(trimmed);
                    }}
                    maxLength={groverBits}
                    placeholder={`${groverBits} bits (0s and 1s)`}
                  />
                </div>
              </div>
              
              {groverResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-600" />
                    Simulation Result
                  </h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap">{groverResult}</pre>
                </div>
              )}
              
              <Button 
                onClick={simulateGrover}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={groverTarget.length !== groverBits || !/^[01]+$/.test(groverTarget)}
              >
                <Search className="mr-2 h-4 w-4" />
                Simulate Grover's Search
              </Button>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Shor Content */}
        <TabsContent value="shor" className="border-none p-0 pt-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Shor's Factorization Algorithm</h3>
                <p className="text-sm text-gray-500">
                  Factors large numbers exponentially faster than classical algorithms.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number">Number to Factor</Label>
                <Input 
                  id="number" 
                  type="number" 
                  value={shorNumber} 
                  onChange={(e) => setShorNumber(parseInt(e.target.value) || 15)}
                  min={4}
                  max={997}
                />
                <p className="text-xs text-gray-500">
                  For demonstration, enter a composite number between 4 and 997.
                </p>
              </div>
              
              {shorResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-orange-600" />
                    Simulation Result
                  </h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap">{shorResult}</pre>
                </div>
              )}
              
              <Button 
                onClick={simulateShor}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Simulate Shor's Algorithm
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="p-4 bg-gray-50 flex flex-col text-xs text-gray-500">
        <div className="flex items-center">
          <Braces className="h-3 w-3 mr-1" />
          <span>Simulated results for educational purposes only</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuantumAlgorithms;
