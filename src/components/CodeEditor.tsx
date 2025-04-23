
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, FileCode, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  onExecute?: (code: string, language: string) => void;
}

const CodeEditor = ({ onExecute }: CodeEditorProps) => {
  const [code, setCode] = useState<string>('console.log("Hello Quantum World!");');
  const [language, setLanguage] = useState<string>('javascript');
  const { toast } = useToast();
  
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
  ];

  const handleExecute = () => {
    if (onExecute) {
      onExecute(code, language);
    } else {
      toast({
        title: "Code Execution",
        description: `Executing ${language} code...`,
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  // Sample code templates based on selected language
  const getTemplate = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'console.log("Hello Quantum World!");';
      case 'python':
        return 'print("Hello Quantum World!")';
      case 'c':
        return '#include <stdio.h>\n\nint main() {\n    printf("Hello Quantum World!\\n");\n    return 0;\n}';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    std::cout << "Hello Quantum World!" << std::endl;\n    return 0;\n}';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Quantum World!");\n    }\n}';
      case 'ruby':
        return 'puts "Hello Quantum World!"';
      case 'rust':
        return 'fn main() {\n    println!("Hello Quantum World!");\n}';
      case 'go':
        return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Quantum World!")\n}';
      default:
        return 'console.log("Hello Quantum World!");';
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode(getTemplate(value));
  };

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileCode className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-mono">Quantum Code Editor</h3>
        </div>
        <div className="flex space-x-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] h-7 text-xs bg-gray-800 border-gray-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Textarea
        className="min-h-[300px] font-mono text-sm bg-gray-950 text-gray-100 border-0 rounded-none p-4 resize-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
      
      <div className="p-2 bg-gray-900 border-t border-gray-800 flex justify-end">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleExecute}
        >
          <Code className="h-4 w-4 mr-2" />
          Execute Code
        </Button>
      </div>
    </Card>
  );
};

export default CodeEditor;
