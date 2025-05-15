
/**
 * Utility functions for transforming interface data similar to Zapier's data transformation tools
 */

import { InterfaceItem } from "@/types/interfaces";

// Transform interface data for export
export const transformForExport = (interfaces: InterfaceItem[], format: 'json' | 'csv' = 'json') => {
  // Basic data for export
  const baseData = interfaces.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    description: item.description || '',
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    fieldsCount: (item.fields || []).length,
    integrationsCount: (item.integrations || []).length
  }));

  if (format === 'json') {
    return JSON.stringify(baseData, null, 2);
  } else if (format === 'csv') {
    // Header row
    let csv = 'id,name,type,description,status,created_at,updated_at,fields_count,integrations_count\n';
    
    // Data rows
    baseData.forEach(item => {
      csv += `${item.id},${item.name.replace(/,/g, '')},${item.type},${item.description.replace(/,/g, '')},${item.status},${item.createdAt},${item.updatedAt},${item.fieldsCount},${item.integrationsCount}\n`;
    });
    
    return csv;
  }
  
  return '';
};

// Filter interfaces by date range
export const filterByDateRange = (
  interfaces: InterfaceItem[], 
  startDate?: Date, 
  endDate?: Date
): InterfaceItem[] => {
  if (!startDate && !endDate) return interfaces;
  
  return interfaces.filter(item => {
    const updatedAt = new Date(item.updatedAt);
    
    if (startDate && endDate) {
      return updatedAt >= startDate && updatedAt <= endDate;
    } else if (startDate) {
      return updatedAt >= startDate;
    } else if (endDate) {
      return updatedAt <= endDate;
    }
    
    return true;
  });
};

// Map field types between different formats
export const mapFieldType = (
  sourceType: string, 
  targetFormat: 'html' | 'json' | 'airtable' | 'notion' = 'html'
): string => {
  const typeMap: Record<string, Record<string, string>> = {
    text: {
      html: 'text',
      json: 'string',
      airtable: 'singleLineText',
      notion: 'text'
    },
    email: {
      html: 'email',
      json: 'string',
      airtable: 'email',
      notion: 'email'
    },
    tel: {
      html: 'tel',
      json: 'string',
      airtable: 'phoneNumber',
      notion: 'phone_number'
    },
    number: {
      html: 'number',
      json: 'number',
      airtable: 'number',
      notion: 'number'
    },
    checkbox: {
      html: 'checkbox',
      json: 'boolean',
      airtable: 'checkbox',
      notion: 'checkbox'
    },
    date: {
      html: 'date',
      json: 'string',
      airtable: 'date',
      notion: 'date'
    }
  };
  
  if (typeMap[sourceType] && typeMap[sourceType][targetFormat]) {
    return typeMap[sourceType][targetFormat];
  }
  
  // Default to original type if mapping not found
  return sourceType;
};

// Generate sample data for an interface based on its fields
export const generateSampleData = (interfaceItem: InterfaceItem): Record<string, any> => {
  if (!interfaceItem.fields || interfaceItem.fields.length === 0) {
    return {};
  }
  
  const sampleData: Record<string, any> = {};
  
  interfaceItem.fields.forEach(field => {
    switch (field.type) {
      case 'text':
        sampleData[field.name] = `Sample ${field.label}`;
        break;
      case 'email':
        sampleData[field.name] = 'user@example.com';
        break;
      case 'tel':
        sampleData[field.name] = '+1234567890';
        break;
      case 'number':
        sampleData[field.name] = 42;
        break;
      case 'checkbox':
        sampleData[field.name] = true;
        break;
      case 'date':
        sampleData[field.name] = new Date().toISOString().split('T')[0];
        break;
      default:
        sampleData[field.name] = `Sample data for ${field.name}`;
    }
  });
  
  return sampleData;
};

// Create a webhook URL format for an interface (similar to Zapier's webhook triggers)
export const generateWebhookUrl = (interfaceId: string): string => {
  // In a real implementation, this would generate a secure, unique URL
  return `https://api.example.com/webhooks/${interfaceId}-${Date.now()}`;
};
