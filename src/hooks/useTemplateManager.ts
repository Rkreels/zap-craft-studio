import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  rating?: number;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  previewImage?: string;
  author?: string;
  lastUpdated?: string;
  usageCount?: number;
  requiredAccounts?: string[];
  workflowSteps?: string[];
  steps?: any[];
  schedule?: any;
}

export const useTemplateManager = () => {
  const queryClient = useQueryClient();
  
  const { data: templatesData, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: apiService.getTemplates,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const applyTemplateMutation = useMutation({
    mutationFn: (templateId: string) => apiService.applyTemplate(templateId),
    onSuccess: (data, templateId) => {
      const template = templates.find(t => t.id === templateId);
      toast({
        title: 'Template Applied',
        description: `${template?.name || 'Template'} has been applied successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to apply template. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: apiService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Template Created',
        description: 'Your custom template has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const templates: WorkflowTemplate[] = (templatesData as any)?.templates || [];
  
  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };
  
  const getFeaturedTemplates = () => {
    return templates.filter(template => template.featured);
  };
  
  const getPopularTemplates = () => {
    return templates.filter(template => template.popular);
  };
  
  const getNewTemplates = () => {
    return templates.filter(template => template.new);
  };
  
  const searchTemplates = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  const applyTemplate = async (templateId: string) => {
    try {
      const result = await applyTemplateMutation.mutateAsync(templateId);
      return result.workflow;
    } catch (error) {
      throw error;
    }
  };
  
  return {
    templates,
    isLoading,
    error,
    applyTemplate,
    createTemplate: createTemplateMutation.mutate,
    getTemplatesByCategory,
    getFeaturedTemplates,
    getPopularTemplates,
    getNewTemplates,
    searchTemplates,
    isApplying: applyTemplateMutation.isPending,
    isCreating: createTemplateMutation.isPending,
  };
};