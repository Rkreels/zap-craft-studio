
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";

// Sample function categories
const functionCategories = [
  { name: "Text", functions: ["CONCAT", "LEFT", "RIGHT", "TRIM", "LOWER", "UPPER"] },
  { name: "Number", functions: ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "ROUND", "ABS"] },
  { name: "Date", functions: ["NOW", "DATE", "DAY", "MONTH", "YEAR", "FORMAT_DATE"] },
  { name: "Logic", functions: ["IF", "AND", "OR", "NOT", "SWITCH", "CASE"] },
];

interface FormulaEditorProps {
  initialFormula?: string;
  onSave?: (formula: string) => void;
  sampleData?: Record<string, any>;
}

export const FormulaEditor: React.FC<FormulaEditorProps> = ({
  initialFormula = "",
  onSave,
  sampleData = { name: "John Doe", email: "john@example.com", created_at: new Date().toISOString() }
}) => {
  const [formula, setFormula] = useState(initialFormula);
  const [category, setCategory] = useState("Text");
  const [result, setResult] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Voice guidance
  const editorVoiceProps = {
    elementName: "Formula Editor",
    hoverText: "Formula editor allows you to create custom data transformations using functions and operators.",
    clickText: "Edit the formula in the text area. You can use functions from the function list on the right."
  };
  const editorGuidance = useVoiceGuidance(editorVoiceProps);

  const insertFunction = (func: string) => {
    const funcText = `${func}()`;
    setFormula(prev => {
      // Insert at cursor position if we had that ability
      return prev + funcText;
    });
  };

  const testFormula = () => {
    try {
      // In a real implementation, this would use a proper formula parser
      // This is a simplified example that only handles some basic functions
      let result = "";
      
      if (formula.includes("CONCAT")) {
        result = `${sampleData.name} <${sampleData.email}>`;
      } else if (formula.includes("UPPER")) {
        result = sampleData.name.toUpperCase();
      } else if (formula.includes("NOW")) {
        result = new Date().toISOString();
      } else if (formula.includes("FORMAT_DATE")) {
        result = new Date(sampleData.created_at).toLocaleDateString();
      } else {
        // Default simple evaluation for demo purposes
        result = "Sample result based on formula";
      }

      setResult(result);
      setError(null);
    } catch (err) {
      setError("Error evaluating formula");
      setResult(null);
    }
  };

  const handleSave = () => {
    if (!formula.trim()) {
      setError("Formula cannot be empty");
      return;
    }

    if (onSave) {
      onSave(formula);
    }
    
    toast({
      title: "Formula saved",
      description: "Your formula has been saved successfully."
    });
  };

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      onMouseEnter={editorGuidance.handleMouseEnter}
      onClick={editorGuidance.handleClick}
    >
      {/* Formula editor */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Formula Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Enter your formula here..."
              className="font-mono min-h-[200px]"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            {result !== null && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Result Preview:</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  {typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString()}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={testFormula}>
              Test Formula
            </Button>
            <Button onClick={handleSave}>
              Save Formula
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Functions library */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Functions</CardTitle>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {functionCategories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {functionCategories
                .find(cat => cat.name === category)?.functions
                .map(func => (
                  <Button 
                    key={func} 
                    variant="outline" 
                    size="sm"
                    onClick={() => insertFunction(func)}
                    className="justify-start font-mono"
                  >
                    {func}
                  </Button>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-gray-500">
              <p>Sample Data Available:</p>
              <pre className="mt-1 bg-gray-100 p-2 rounded">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
