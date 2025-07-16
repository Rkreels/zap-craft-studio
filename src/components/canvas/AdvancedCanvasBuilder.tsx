import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Square, 
  Circle, 
  Triangle, 
  Type, 
  Image, 
  Minus, 
  Move, 
  Trash2, 
  Copy, 
  Save, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Layers,
  Palette,
  Settings,
  Undo,
  Redo,
  MousePointer,
  Hand,
  PenTool
} from 'lucide-react';
import { useCanvas, CanvasElement, CanvasProject } from '@/hooks/useCanvas';

interface AdvancedCanvasBuilderProps {
  projectId?: string;
  onSave?: (project: CanvasProject) => void;
  onClose?: () => void;
}

const tools = [
  { id: 'select', label: 'Select', icon: MousePointer },
  { id: 'pan', label: 'Pan', icon: Hand },
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'line', label: 'Line', icon: Minus },
  { id: 'pen', label: 'Pen', icon: PenTool }
];

const shapeTemplates = [
  { id: 'process', label: 'Process', shape: 'rectangle', color: '#3b82f6' },
  { id: 'decision', label: 'Decision', shape: 'diamond', color: '#f59e0b' },
  { id: 'start-end', label: 'Start/End', shape: 'oval', color: '#10b981' },
  { id: 'data', label: 'Data', shape: 'parallelogram', color: '#8b5cf6' },
  { id: 'connector', label: 'Connector', shape: 'circle', color: '#64748b' }
];

export const AdvancedCanvasBuilder: React.FC<AdvancedCanvasBuilderProps> = ({
  projectId,
  onSave,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    projects,
    currentProject,
    selectedElements,
    addElement,
    updateElement,
    deleteElements,
    duplicateElements,
    copyElements,
    pasteElements,
    undo,
    redo,
    exportProject,
    setCurrentProject,
    setSelectedElements
  } = useCanvas();

  const [activeTool, setActiveTool] = useState('select');
  const [activeTab, setActiveTab] = useState('design');
  const [zoom, setZoom] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedStroke, setSelectedStroke] = useState(2);
  const [selectedFill, setSelectedFill] = useState('#ffffff');

  // Initialize project
  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects, setCurrentProject]);

  // Canvas drawing logic
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentProject) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (gridEnabled) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Draw elements
    currentProject.elements.forEach(element => {
      drawElement(ctx, element);
    });

    // Draw selection indicators
    selectedElements.forEach(elementId => {
      const element = currentProject.elements.find(el => el.id === elementId);
      if (element) {
        drawSelectionIndicator(ctx, element);
      }
    });

  }, [currentProject, gridEnabled, selectedElements]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.save();
    
    // Apply transformations
    ctx.globalAlpha = element.opacity || 1;
    ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
    ctx.rotate((element.rotation || 0) * Math.PI / 180);
    ctx.translate(-element.size.width / 2, -element.size.height / 2);

    // Set styles
    ctx.fillStyle = element.properties.backgroundColor || selectedFill;
    ctx.strokeStyle = element.properties.borderColor || selectedColor;
    ctx.lineWidth = element.properties.borderWidth || selectedStroke;

    switch (element.type) {
      case 'shape':
        if (element.properties.text === 'rectangle') {
          ctx.fillRect(0, 0, element.size.width, element.size.height);
          ctx.strokeRect(0, 0, element.size.width, element.size.height);
        } else if (element.properties.text === 'circle') {
          ctx.beginPath();
          ctx.arc(element.size.width / 2, element.size.height / 2, 
                 Math.min(element.size.width, element.size.height) / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
        break;
        
      case 'text':
        ctx.font = `${element.properties.fontSize || 16}px Arial`;
        ctx.fillStyle = element.properties.color || '#000000';
        ctx.fillText(element.properties.text || 'Text', 0, 20);
        break;
        
      case 'connector':
        ctx.beginPath();
        ctx.moveTo(0, element.size.height / 2);
        ctx.lineTo(element.size.width, element.size.height / 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  };

  const drawSelectionIndicator = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    ctx.save();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(element.position.x - 2, element.position.y - 2, 
                  element.size.width + 4, element.size.height + 4);
    ctx.restore();
  };

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'select') {
      // Selection logic
      const clickedElement = findElementAtPosition(x, y);
      if (clickedElement) {
        if (!selectedElements.includes(clickedElement.id)) {
          setSelectedElements([clickedElement.id]);
        }
      } else {
        setSelectedElements([]);
      }
    } else if (activeTool !== 'pan') {
      // Start drawing
      setIsDrawing(true);
      setDrawingStart({ x, y });
    }
  }, [activeTool, selectedElements, setSelectedElements]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update preview drawing
    drawCanvas();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = selectedStroke;
    ctx.setLineDash([]);

    if (activeTool === 'rectangle') {
      ctx.strokeRect(drawingStart.x, drawingStart.y, x - drawingStart.x, y - drawingStart.y);
    } else if (activeTool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - drawingStart.x, 2) + Math.pow(y - drawingStart.y, 2));
      ctx.beginPath();
      ctx.arc(drawingStart.x, drawingStart.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (activeTool === 'line') {
      ctx.beginPath();
      ctx.moveTo(drawingStart.x, drawingStart.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [isDrawing, drawingStart, activeTool, selectedColor, selectedStroke, drawCanvas]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create element based on tool
    const newElement: Omit<CanvasElement, 'id'> = {
      type: 'shape',
      position: { 
        x: Math.min(drawingStart.x, x), 
        y: Math.min(drawingStart.y, y) 
      },
      size: { 
        width: Math.abs(x - drawingStart.x), 
        height: Math.abs(y - drawingStart.y) 
      },
      properties: {
        backgroundColor: selectedFill,
        borderColor: selectedColor,
        borderWidth: selectedStroke,
        text: activeTool
      }
    };

    if (newElement.size.width > 5 && newElement.size.height > 5) {
      addElement(newElement);
    }

    setIsDrawing(false);
    setDrawingStart(null);
    setActiveTool('select');
  }, [isDrawing, drawingStart, activeTool, selectedColor, selectedStroke, selectedFill, addElement]);

  const findElementAtPosition = (x: number, y: number): CanvasElement | null => {
    if (!currentProject) return null;

    // Check elements in reverse order (top-most first)
    for (let i = currentProject.elements.length - 1; i >= 0; i--) {
      const element = currentProject.elements[i];
      if (x >= element.position.x && x <= element.position.x + element.size.width &&
          y >= element.position.y && y <= element.position.y + element.size.height) {
        return element;
      }
    }
    return null;
  };

  const handleAddTemplate = (template: typeof shapeTemplates[0]) => {
    const newElement: Omit<CanvasElement, 'id'> = {
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 120, height: 80 },
      properties: {
        backgroundColor: template.color,
        borderColor: template.color,
        borderWidth: 2,
        text: template.shape
      }
    };

    addElement(newElement);
    
    toast({
      title: 'Shape added',
      description: `${template.label} shape has been added to the canvas`
    });
  };

  const handleDeleteSelected = () => {
    if (selectedElements.length > 0) {
      deleteElements(selectedElements);
      setSelectedElements([]);
    }
  };

  const handleDuplicateSelected = () => {
    if (selectedElements.length > 0) {
      duplicateElements(selectedElements);
    }
  };

  const handleCopySelected = () => {
    if (selectedElements.length > 0) {
      copyElements(selectedElements);
    }
  };

  const saveProject = () => {
    if (currentProject) {
      onSave?.(currentProject);
      toast({
        title: 'Project saved',
        description: 'Canvas project has been saved successfully'
      });
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.map(tool => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-2"
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Shapes</h3>
            <div className="space-y-2">
              {shapeTemplates.map(template => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTemplate(template)}
                  className="w-full justify-start"
                >
                  <div 
                    className="w-4 h-4 rounded mr-2" 
                    style={{ backgroundColor: template.color }}
                  />
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Properties</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Fill Color</Label>
                <Input
                  type="color"
                  value={selectedFill}
                  onChange={(e) => setSelectedFill(e.target.value)}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Stroke Color</Label>
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Stroke Width</Label>
                <Slider
                  value={[selectedStroke]}
                  onValueChange={(value) => setSelectedStroke(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={undo}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo}>
                <Redo className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" onClick={handleCopySelected}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDuplicateSelected}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm">Grid</Label>
                <Switch checked={gridEnabled} onCheckedChange={setGridEnabled} />
              </div>

              <Button onClick={saveProject}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden" ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="border border-gray-300 bg-white cursor-crosshair"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Layers</h3>
              <div className="space-y-2">
                {currentProject?.elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                      selectedElements.includes(element.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedElements([element.id])}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm">
                        {element.type} {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElements([element.id]);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Element Properties</h3>
              {selectedElements.length === 1 ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Position X</Label>
                    <Input
                      type="number"
                      value={currentProject?.elements.find(el => el.id === selectedElements[0])?.position.x || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        updateElement(selectedElements[0], { 
                          position: { 
                            ...currentProject?.elements.find(el => el.id === selectedElements[0])?.position!,
                            x: value 
                          }
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Position Y</Label>
                    <Input
                      type="number"
                      value={currentProject?.elements.find(el => el.id === selectedElements[0])?.position.y || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        updateElement(selectedElements[0], { 
                          position: { 
                            ...currentProject?.elements.find(el => el.id === selectedElements[0])?.position!,
                            y: value 
                          }
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Width</Label>
                    <Input
                      type="number"
                      value={currentProject?.elements.find(el => el.id === selectedElements[0])?.size.width || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        updateElement(selectedElements[0], { 
                          size: { 
                            ...currentProject?.elements.find(el => el.id === selectedElements[0])?.size!,
                            width: value 
                          }
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Height</Label>
                    <Input
                      type="number"
                      value={currentProject?.elements.find(el => el.id === selectedElements[0])?.size.height || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        updateElement(selectedElements[0], { 
                          size: { 
                            ...currentProject?.elements.find(el => el.id === selectedElements[0])?.size!,
                            height: value 
                          }
                        });
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select an element to edit its properties
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};