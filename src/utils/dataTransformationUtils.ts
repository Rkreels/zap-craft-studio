
import { InterfaceItem } from '@/types/interfaces';

export const transformForExport = (interfaces: InterfaceItem[], format: 'json' | 'csv'): string => {
  if (format === 'json') {
    return JSON.stringify(interfaces, null, 2);
  } else if (format === 'csv') {
    // Create CSV headers
    const headers = ['ID', 'Name', 'Type', 'Description', 'Status', 'Created At', 'Updated At', 'View Count'];
    
    // Create CSV rows
    const rows = interfaces.map(interface_ => [
      interface_.id,
      interface_.name,
      interface_.type,
      interface_.description || '',
      interface_.status,
      interface_.createdAt,
      interface_.updatedAt,
      interface_.viewCount || 0
    ]);
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
  
  throw new Error('Unsupported export format');
};

export const parseImportData = (data: string, format: 'json' | 'csv'): InterfaceItem[] => {
  if (format === 'json') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  } else if (format === 'csv') {
    // Basic CSV parsing (for more complex CSV, consider using a library)
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      return {
        id: values[0] || `imported-${index}`,
        name: values[1] || 'Imported Interface',
        type: (values[2] as 'form' | 'page' | 'dashboard') || 'form',
        description: values[3] || '',
        status: (values[4] as 'published' | 'draft') || 'draft',
        createdAt: values[5] || new Date().toISOString(),
        updatedAt: values[6] || new Date().toISOString(),
        viewCount: parseInt(values[7]) || 0,
        preview: 'https://placehold.co/600x400/e2e8f0/64748b?text=Imported+Interface',
        fields: [],
        integrations: []
      };
    });
  }
  
  throw new Error('Unsupported import format');
};
