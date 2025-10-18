
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface InterfaceElement {
  id: string;
  type: 'button' | 'input' | 'text' | 'image' | 'form' | 'table' | 'chart';
  properties: {
    label?: string;
    placeholder?: string;
    required?: boolean;
    style?: Record<string, any>;
    onClick?: string; // JavaScript code to execute
    validation?: string;
    dataSource?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  children?: InterfaceElement[];
}

export interface InterfaceDesign {
  id: string;
  name: string;
  description: string;
  elements: InterfaceElement[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
  };
  responsive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useInterfaceBuilder = () => {
  const [interfaces, setInterfaces] = useState<InterfaceDesign[]>([]);
  const [currentInterface, setCurrentInterface] = useState<InterfaceDesign | null>(null);
  const [selectedElement, setSelectedElement] = useState<InterfaceElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const createInterface = useCallback((name: string, description: string) => {
    const newInterface: InterfaceDesign = {
      id: `interface_${Date.now()}`,
      name,
      description,
      elements: [],
      theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: 8
      },
      responsive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setInterfaces(prev => [...prev, newInterface]);
    setCurrentInterface(newInterface);

    toast({
      title: 'Interface created',
      description: `Interface "${name}" has been created.`
    });

    return newInterface;
  }, []);

  const addElement = useCallback((element: Omit<InterfaceElement, 'id'>) => {
    if (!currentInterface) return;

    const newElement: InterfaceElement = {
      ...element,
      id: `element_${Date.now()}`
    };

    const updatedInterface = {
      ...currentInterface,
      elements: [...currentInterface.elements, newElement],
      updatedAt: new Date()
    };

    setCurrentInterface(updatedInterface);
    setInterfaces(prev => prev.map(iface => 
      iface.id === currentInterface.id ? updatedInterface : iface
    ));

    toast({
      title: 'Element added',
      description: `${element.type} element has been added to the interface.`
    });
  }, [currentInterface]);

  const updateElement = useCallback((elementId: string, updates: Partial<InterfaceElement>) => {
    if (!currentInterface) return;

    const updatedInterface = {
      ...currentInterface,
      elements: currentInterface.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date()
    };

    setCurrentInterface(updatedInterface);
    setInterfaces(prev => prev.map(iface => 
      iface.id === currentInterface.id ? updatedInterface : iface
    ));
  }, [currentInterface]);

  const deleteElement = useCallback((elementId: string) => {
    if (!currentInterface) return;

    const updatedInterface = {
      ...currentInterface,
      elements: currentInterface.elements.filter(el => el.id !== elementId),
      updatedAt: new Date()
    };

    setCurrentInterface(updatedInterface);
    setInterfaces(prev => prev.map(iface => 
      iface.id === currentInterface.id ? updatedInterface : iface
    ));

    setSelectedElement(null);

    toast({
      title: 'Element deleted',
      description: 'Element has been removed from the interface.'
    });
  }, [currentInterface]);

  const executeElementAction = useCallback((element: InterfaceElement, context: any = {}) => {
    if (element.properties.onClick) {
      try {
        // Create a safe execution context
        const func = new Function('context', 'toast', element.properties.onClick);
        func(context, toast);
      } catch (error) {
        console.error('Error executing element action:', error);
        toast({
          title: 'Action Error',
          description: 'Failed to execute element action.',
          variant: 'destructive'
        });
      }
    }
  }, []);

  const publishInterface = useCallback((interfaceId: string) => {
    const iface = interfaces.find(i => i.id === interfaceId);
    if (!iface) return;

    // Simulate publishing
    toast({
      title: 'Interface published',
      description: `Interface "${iface.name}" is now live and accessible.`
    });
  }, [interfaces]);

  return {
    interfaces,
    currentInterface,
    selectedElement,
    previewMode,
    createInterface,
    addElement,
    updateElement,
    deleteElement,
    executeElementAction,
    publishInterface,
    setCurrentInterface,
    setSelectedElement,
    setPreviewMode
  };
};
