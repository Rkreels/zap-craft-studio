// Enhanced API service with in-memory storage (no localStorage)
class ApiService {
  private baseUrl = 'https://api.zapierclone.local';
  
  // In-memory storage
  private memoryStore: Map<string, any[]> = new Map();
  
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  private getFromMemory<T>(key: string): T[] {
    return (this.memoryStore.get(key) as T[]) || [];
  }
  
  private saveToMemory<T>(key: string, data: T[]): void {
    this.memoryStore.set(key, data);
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.delay(Math.random() * 500 + 200);
    
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body as string) : null;
    
    return this.handleRequest<T>(endpoint, method, data);
  }
  
  private handleRequest<T>(endpoint: string, method: string, data?: any): T {
    const timestamp = new Date().toISOString();
    
    // Templates endpoints
    if (endpoint.includes('/templates')) {
      return this.handleTemplateRequests(method, data) as T;
    }
    
    // Workflows endpoints
    if (endpoint.includes('/workflows')) {
      return this.handleWorkflowRequests(endpoint, method, data) as T;
    }
    
    // Tables endpoints
    if (endpoint.includes('/tables')) {
      return this.handleTableRequests(endpoint, method, data) as T;
    }
    
    // Interfaces endpoints
    if (endpoint.includes('/interfaces')) {
      return this.handleInterfaceRequests(endpoint, method, data) as T;
    }
    
    // Integrations endpoints
    if (endpoint.includes('/integrations')) {
      return this.handleIntegrationRequests(endpoint, method, data) as T;
    }
    
    return { success: true, timestamp } as T;
  }
  
  private handleTemplateRequests(method: string, data?: any) {
    const templates = this.getFromMemory('templates');
    
    if (method === 'GET') {
      return { 
        templates: templates.length ? templates : this.getDefaultTemplates(),
        total: templates.length || this.getDefaultTemplates().length
      };
    }
    
    return { success: true };
  }
  
  private getDefaultTemplates() {
    return [
      {
        id: "template-1",
        name: "Gmail to Slack Notification",
        description: "Get Slack messages when new emails with specific labels arrive in Gmail",
        category: "Communication",
        featured: true,
        popular: true,
        steps: [
          {
            id: "trigger-1",
            type: "trigger",
            appId: "gmail",
            appName: "Gmail",
            actionName: "New Email",
            configured: true,
            config: { labels: ["important"] }
          },
          {
            id: "action-1",
            type: "action",
            appId: "slack",
            appName: "Slack",
            actionName: "Send Channel Message",
            configured: true,
            config: { channel: "#general" }
          }
        ]
      },
      {
        id: "template-2",
        name: "Form to Google Sheets",
        description: "Automatically add form submissions to a Google Sheets spreadsheet",
        category: "Productivity",
        new: true,
        steps: [
          {
            id: "trigger-1",
            type: "trigger",
            appId: "forms",
            appName: "Form Service",
            actionName: "New Submission",
            configured: true,
            config: {}
          },
          {
            id: "action-1",
            type: "action",
            appId: "sheets",
            appName: "Google Sheets",
            actionName: "Add Row",
            configured: true,
            config: {}
          }
        ]
      }
    ];
  }
  
  private handleWorkflowRequests(endpoint: string, method: string, data?: any) {
    const workflows = this.getFromMemory<any>('workflows');
    
    if (method === 'GET') {
      return { workflows, total: workflows.length };
    }
    
    if (method === 'POST') {
      const newWorkflow = {
        id: `wf_${Date.now()}`,
        name: data?.name || 'Untitled Workflow',
        steps: data?.steps || [],
        status: 'inactive',
        created: new Date().toISOString(),
        ...data
      };
      workflows.push(newWorkflow);
      this.saveToMemory('workflows', workflows);
      return newWorkflow;
    }
    
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const index = workflows.findIndex((w: any) => w.id === id);
      if (index !== -1) {
        workflows[index] = { ...workflows[index], ...data, updated: new Date().toISOString() };
        this.saveToMemory('workflows', workflows);
        return workflows[index];
      }
    }
    
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const filtered = workflows.filter((w: any) => w.id !== id);
      this.saveToMemory('workflows', filtered);
      return { success: true };
    }
    
    return { success: true };
  }
  
  private handleTableRequests(endpoint: string, method: string, data?: any) {
    const tables = this.getFromMemory<any>('tables');
    
    if (method === 'GET') {
      return { tables, total: tables.length };
    }
    
    if (method === 'POST') {
      const newTable = {
        id: `tbl_${Date.now()}`,
        name: data?.name || 'Untitled Table',
        columns: data?.columns || [],
        rows: data?.rows || [],
        created: new Date().toISOString(),
        ...data
      };
      tables.push(newTable);
      this.saveToMemory('tables', tables);
      return newTable;
    }
    
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const index = tables.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        tables[index] = { ...tables[index], ...data, updated: new Date().toISOString() };
        this.saveToMemory('tables', tables);
        return tables[index];
      }
    }
    
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const filtered = tables.filter((t: any) => t.id !== id);
      this.saveToMemory('tables', filtered);
      return { success: true };
    }
    
    return { success: true };
  }
  
  private handleInterfaceRequests(endpoint: string, method: string, data?: any) {
    const interfaces = this.getFromMemory<any>('interfaces');
    
    if (method === 'GET') {
      return { interfaces, total: interfaces.length };
    }
    
    if (method === 'POST') {
      const newInterface = {
        id: `int_${Date.now()}`,
        name: data?.name || 'Untitled Interface',
        type: data?.type || 'form',
        description: data?.description || '',
        fields: data?.fields || [],
        status: 'draft',
        created: new Date().toISOString(),
        ...data
      };
      interfaces.push(newInterface);
      this.saveToMemory('interfaces', interfaces);
      return newInterface;
    }
    
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const index = interfaces.findIndex((i: any) => i.id === id);
      if (index !== -1) {
        interfaces[index] = { ...interfaces[index], ...data, updated: new Date().toISOString() };
        this.saveToMemory('interfaces', interfaces);
        return interfaces[index];
      }
    }
    
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      const filtered = interfaces.filter((i: any) => i.id !== id);
      this.saveToMemory('interfaces', filtered);
      return { success: true };
    }
    
    return { success: true };
  }
  
  private handleIntegrationRequests(endpoint: string, method: string, data?: any) {
    const integrations = this.getFromMemory<any>('integrations');
    const defaultIntegrations = [
      { id: 'gmail', name: 'Gmail', status: 'connected', lastSync: new Date().toISOString() },
      { id: 'slack', name: 'Slack', status: 'connected', lastSync: new Date().toISOString() },
      { id: 'sheets', name: 'Google Sheets', status: 'disconnected', lastSync: null }
    ];
    
    if (method === 'GET') {
      return { 
        integrations: integrations.length ? integrations : defaultIntegrations,
        total: integrations.length || defaultIntegrations.length
      };
    }
    
    if (method === 'POST' && endpoint.includes('/connect')) {
      const service = endpoint.split('/')[2];
      const existingIndex = integrations.findIndex((i: any) => i.id === service);
      const integration = {
        id: service,
        name: data?.name || service,
        status: 'connected',
        lastSync: new Date().toISOString(),
        credentials: data
      };
      
      if (existingIndex !== -1) {
        integrations[existingIndex] = integration;
      } else {
        integrations.push(integration);
      }
      
      this.saveToMemory('integrations', integrations);
      return integration;
    }
    
    if (method === 'POST' && endpoint.includes('/disconnect')) {
      const service = endpoint.split('/')[2];
      const index = integrations.findIndex((i: any) => i.id === service);
      if (index !== -1) {
        integrations[index].status = 'disconnected';
        integrations[index].lastSync = null;
        this.saveToMemory('integrations', integrations);
      }
      return { success: true };
    }
    
    return { success: true };
  }
  
  // Template operations
  async getTemplates() {
    return this.request('/templates');
  }
  
  async createTemplate(data: any) {
    return this.request('/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async applyTemplate(templateId: string) {
    const templates = this.getFromMemory<any>('templates');
    const template = templates.find((t: any) => t.id === templateId) ||
                    this.getDefaultTemplates().find((t: any) => t.id === templateId);
    
    if (template) {
      return {
        success: true,
        workflow: {
          id: `wf_${Date.now()}`,
          name: `Copy of ${template.name}`,
          steps: template.steps,
          schedule: template.schedule,
          created: new Date().toISOString()
        }
      };
    }
    
    throw new Error('Template not found');
  }

  // Workflow operations
  async getWorkflows() {
    return this.request('/workflows');
  }
  
  async createWorkflow(data: any) {
    return this.request('/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async updateWorkflow(id: string, data: any) {
    return this.request(`/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async deleteWorkflow(id: string) {
    return this.request(`/workflows/${id}`, { method: 'DELETE' });
  }
  
  async executeWorkflow(id: string, data: any) {
    return this.request(`/workflows/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  // Interface operations
  async getInterfaces() {
    return this.request('/interfaces');
  }
  
  async createInterface(data: any) {
    return this.request('/interfaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async updateInterface(id: string, data: any) {
    return this.request(`/interfaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async deleteInterface(id: string) {
    return this.request(`/interfaces/${id}`, { method: 'DELETE' });
  }
  
  // Table operations
  async getTables() {
    return this.request('/tables');
  }
  
  async createTable(data: any) {
    return this.request('/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async updateTable(id: string, data: any) {
    return this.request(`/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async deleteTable(id: string) {
    return this.request(`/tables/${id}`, { method: 'DELETE' });
  }
  
  // Webhook operations
  async createWebhook(data: any) {
    return this.request('/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  async triggerWebhook(url: string, data: any) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(data)
      });
      return { success: true, status: 'sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Integration operations
  async getIntegrations() {
    return this.request('/integrations');
  }
  
  async connectIntegration(service: string, credentials: any) {
    return this.request(`/integrations/${service}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  }
  
  async disconnectIntegration(service: string) {
    return this.request(`/integrations/${service}/disconnect`, { method: 'POST' });
  }
  
  // Real-time monitoring
  async getWorkflowRuns(workflowId: string) {
    return this.request(`/workflows/${workflowId}/runs`);
  }
  
  async getSystemHealth() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();