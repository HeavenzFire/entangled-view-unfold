
import EMFDisplay from '@/components/EMFDisplay';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Quantum-Classical Hybrid System
          </h1>
          <p className="text-xl text-gray-600">Environmental Monitoring Interface</p>
        </div>
        <EMFDisplay />
      </div>
    </div>
  );
};

export default Index;
