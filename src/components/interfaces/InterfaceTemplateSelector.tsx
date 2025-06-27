
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Layout, BarChart3, Users, Calendar, ShoppingCart, MessageSquare, Settings } from 'lucide-react';
import { InterfaceItem, InterfaceField } from '@/types/interfaces';

interface InterfaceTemplate {
  id: string;
  name: string;
  description: string;
  type: 'form' | 'page' | 'dashboard';
  category: string;
  icon: React.ComponentType<any>;
  preview: string;
  fields: InterfaceField[];
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const templates: InterfaceTemplate[] = [
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message fields',
    type: 'form',
    category: 'Forms',
    icon: FileText,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Contact+Form',
    difficulty: 'beginner',
    features: ['Email validation', 'Required fields', 'Success message'],
    fields: [
      { id: 'name', name: 'name', type: 'text', required: true, label: 'Full Name' },
      { id: 'email', name: 'email', type: 'email', required: true, label: 'Email Address' },
      { id: 'message', name: 'message', type: 'textarea', required: true, label: 'Message' }
    ]
  },
  {
    id: 'user-registration',
    name: 'User Registration',
    description: 'Complete user registration form with validation',
    type: 'form',
    category: 'Forms',
    icon: Users,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Registration+Form',
    difficulty: 'intermediate',
    features: ['Password validation', 'Confirmation fields', 'Terms acceptance'],
    fields: [
      { id: 'firstName', name: 'firstName', type: 'text', required: true, label: 'First Name' },
      { id: 'lastName', name: 'lastName', type: 'text', required: true, label: 'Last Name' },
      { id: 'email', name: 'email', type: 'email', required: true, label: 'Email' },
      { id: 'password', name: 'password', type: 'password', required: true, label: 'Password' },
      { id: 'confirmPassword', name: 'confirmPassword', type: 'password', required: true, label: 'Confirm Password' },
      { id: 'terms', name: 'terms', type: 'checkbox', required: true, label: 'I agree to the terms and conditions' }
    ]
  },
  {
    id: 'event-booking',
    name: 'Event Booking',
    description: 'Event booking form with date/time selection',
    type: 'form',
    category: 'Forms',
    icon: Calendar,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Event+Booking',
    difficulty: 'intermediate',
    features: ['Date picker', 'Time slots', 'Attendee count'],
    fields: [
      { id: 'eventName', name: 'eventName', type: 'select', required: true, label: 'Event', options: ['Conference', 'Workshop', 'Seminar'] },
      { id: 'date', name: 'date', type: 'date', required: true, label: 'Event Date' },
      { id: 'time', name: 'time', type: 'time', required: true, label: 'Time' },
      { id: 'attendees', name: 'attendees', type: 'number', required: true, label: 'Number of Attendees' }
    ]
  },
  {
    id: 'product-catalog',
    name: 'Product Catalog',
    description: 'E-commerce product catalog page',
    type: 'page',
    category: 'E-commerce',
    icon: ShoppingCart,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Product+Catalog',
    difficulty: 'advanced',
    features: ['Product grid', 'Filtering', 'Search', 'Pagination'],
    fields: []
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics dashboard with charts',
    type: 'dashboard',
    category: 'Analytics',
    icon: BarChart3,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Analytics+Dashboard',
    difficulty: 'advanced',
    features: ['Real-time data', 'Interactive charts', 'KPI widgets', 'Export options'],
    fields: []
  },
  {
    id: 'feedback-form',
    name: 'Feedback Form',
    description: 'Customer feedback form with rating system',
    type: 'form',
    category: 'Forms',
    icon: MessageSquare,
    preview: 'https://placehold.co/300x200/e2e8f0/64748b?text=Feedback+Form',
    difficulty: 'intermediate',
    features: ['Star ratings', 'Category selection', 'Optional fields'],
    fields: [
      { id: 'rating', name: 'rating', type: 'number', required: true, label: 'Overall Rating (1-5)' },
      { id: 'category', name: 'category', type: 'select', required: true, label: 'Feedback Category', options: ['Product', 'Service', 'Support', 'Other'] },
      { id: 'feedback', name: 'feedback', type: 'textarea', required: true, label: 'Your Feedback' },
      { id: 'recommend', name: 'recommend', type: 'radio', required: false, label: 'Would you recommend us?', options: ['Yes', 'No', 'Maybe'] }
    ]
  }
];

interface InterfaceTemplateSelectorProps {
  onSelectTemplate: (template: InterfaceTemplate) => void;
  onClose: () => void;
}

export const InterfaceTemplateSelector: React.FC<InterfaceTemplateSelectorProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-gray-600">Start with a pre-built template to speed up your development</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Category:</span>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Difficulty:</span>
          {difficulties.map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredTemplates.map(template => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent size={20} />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-32 object-cover rounded-md bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => onSelectTemplate(template)}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Template Option */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Settings size={32} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Start from Scratch</h3>
          <p className="text-gray-600 text-center mb-4">
            Create a completely custom interface without any template
          </p>
          <Button variant="outline" onClick={onClose}>
            Start Blank
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
