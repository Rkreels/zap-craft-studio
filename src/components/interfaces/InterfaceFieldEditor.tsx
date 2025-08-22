
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { InterfaceField } from '@/types/interfaces';
import { Save, X } from 'lucide-react';

interface InterfaceFieldEditorProps {
  field: InterfaceField;
  onSave: (field: InterfaceField) => void;
  onCancel: () => void;
}

export const InterfaceFieldEditor: React.FC<InterfaceFieldEditorProps> = ({
  field,
  onSave,
  onCancel
}) => {
  const [editingField, setEditingField] = useState<InterfaceField>(field);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editingField.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(editingField.name)) {
      newErrors.name = 'Field name must start with a letter and contain only letters, numbers, and underscores';
    }

    if (!editingField.label.trim()) {
      newErrors.label = 'Field label is required';
    }

    if (!editingField.type) {
      newErrors.type = 'Field type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateField()) {
      onSave(editingField);
    }
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'password', label: 'Password' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File' }
  ];

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Field Name *</label>
          <Input
            value={editingField.name}
            onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
            placeholder="field_name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Field Label *</label>
          <Input
            value={editingField.label}
            onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
            placeholder="Field Label"
            className={errors.label ? 'border-red-500' : ''}
          />
          {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Field Type *</label>
          <Select
            value={editingField.type}
            onValueChange={(value) => setEditingField({ ...editingField, type: value })}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Placeholder</label>
          <Input
            value={editingField.placeholder || ''}
            onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={editingField.description || ''}
          onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
          placeholder="Field description or help text"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={editingField.required}
          onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked as boolean })}
        />
        <label htmlFor="required" className="text-sm font-medium">
          Required field
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} size="sm">
          <Save size={16} className="mr-1" />
          Save Field
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};
