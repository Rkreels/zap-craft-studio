
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CanvasElement {
  id: string;
  type: 'shape' | 'text' | 'image' | 'connector' | 'workflow' | 'data-source';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    text?: string;
    fontSize?: number;
    fontWeight?: string;
    imageUrl?: string;
    connectedTo?: string[];
    workflowId?: string;
    dataSourceId?: string;
  };
  rotation?: number;
  opacity?: number;
  locked?: boolean;
}

export interface CanvasProject {
  id: string;
  name: string;
  description: string;
  elements: CanvasElement[];
  settings: {
    backgroundColor: string;
    gridEnabled: boolean;
    snapToGrid: boolean;
    gridSize: number;
    zoom: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const useCanvas = () => {
  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CanvasProject | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const createProject = useCallback((name: string, description: string) => {
    const newProject: CanvasProject = {
      id: `canvas_${Date.now()}`,
      name,
      description,
      elements: [],
      settings: {
        backgroundColor: '#ffffff',
        gridEnabled: true,
        snapToGrid: true,
        gridSize: 20,
        zoom: 1
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    addToHistory(newProject);

    toast({
      title: 'Canvas project created',
      description: `Project "${name}" has been created.`
    });

    return newProject;
  }, []);

  const addToHistory = useCallback((project: CanvasProject) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { ...project }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    if (!currentProject) return;

    const newElement: CanvasElement = {
      ...element,
      id: `element_${Date.now()}`
    };

    const updatedProject = {
      ...currentProject,
      elements: [...currentProject.elements, newElement],
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    addToHistory(updatedProject);

    toast({
      title: 'Element added',
      description: `${element.type} element has been added to the canvas.`
    });
  }, [currentProject, addToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      elements: currentProject.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  }, [currentProject]);

  const deleteElements = useCallback((elementIds: string[]) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      elements: currentProject.elements.filter(el => !elementIds.includes(el.id)),
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    setSelectedElements([]);
    addToHistory(updatedProject);

    toast({
      title: 'Elements deleted',
      description: `${elementIds.length} element(s) have been deleted.`
    });
  }, [currentProject, addToHistory]);

  const duplicateElements = useCallback((elementIds: string[]) => {
    if (!currentProject) return;

    const elementsToDuplicate = currentProject.elements.filter(el => elementIds.includes(el.id));
    const duplicatedElements = elementsToDuplicate.map(el => ({
      ...el,
      id: `element_${Date.now()}_${Math.random()}`,
      position: { x: el.position.x + 20, y: el.position.y + 20 }
    }));

    const updatedProject = {
      ...currentProject,
      elements: [...currentProject.elements, ...duplicatedElements],
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    addToHistory(updatedProject);

    toast({
      title: 'Elements duplicated',
      description: `${elementIds.length} element(s) have been duplicated.`
    });
  }, [currentProject, addToHistory]);

  const copyElements = useCallback((elementIds: string[]) => {
    if (!currentProject) return;

    const elementsToCopy = currentProject.elements.filter(el => elementIds.includes(el.id));
    setClipboard(elementsToCopy);

    toast({
      title: 'Elements copied',
      description: `${elementIds.length} element(s) copied to clipboard.`
    });
  }, [currentProject]);

  const pasteElements = useCallback(() => {
    if (!currentProject || clipboard.length === 0) return;

    const pastedElements = clipboard.map(el => ({
      ...el,
      id: `element_${Date.now()}_${Math.random()}`,
      position: { x: el.position.x + 20, y: el.position.y + 20 }
    }));

    const updatedProject = {
      ...currentProject,
      elements: [...currentProject.elements, ...pastedElements],
      updatedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    addToHistory(updatedProject);

    toast({
      title: 'Elements pasted',
      description: `${pastedElements.length} element(s) have been pasted.`
    });
  }, [currentProject, clipboard, addToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousProject = history[historyIndex - 1];
      setCurrentProject(previousProject);
      setProjects(prev => prev.map(p => p.id === previousProject.id ? previousProject : p));
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextProject = history[historyIndex + 1];
      setCurrentProject(nextProject);
      setProjects(prev => prev.map(p => p.id === nextProject.id ? nextProject : p));
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  const exportProject = useCallback((format: 'json' | 'png' | 'svg') => {
    if (!currentProject) return;

    if (format === 'json') {
      const dataStr = JSON.stringify(currentProject, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject.name}.json`;
      link.click();
    }

    toast({
      title: 'Project exported',
      description: `Project exported as ${format.toUpperCase()}.`
    });
  }, [currentProject]);

  return {
    projects,
    currentProject,
    selectedElements,
    clipboard,
    history,
    historyIndex,
    createProject,
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
  };
};
