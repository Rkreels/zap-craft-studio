// Centralized API service for real data operations
class ApiService {
  private baseUrl = 'https://api.zapierclone.local'; // Mock API endpoint
  
  // Simulate API delays
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Generic request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    await this.delay(Math.random() * 1000 + 500); // Simulate network delay
    
    // For demo purposes, we'll simulate successful responses
    // In a real app, this would make actual HTTP requests
    const response = {
      ok: true,
      status: 200,
      json: async () => this.getMockData(endpoint, options.method)
    };
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  // Mock data generator based on endpoint
  private getMockData(endpoint: string, method?: string): any {
    const timestamp = new Date().toISOString();
    
    switch (true) {
      case endpoint.includes('/workflows'):
        return method === 'POST' ? 
          { id: `wf_${Date.now()}`, created: timestamp } :
          { workflows: [], total: 0 };
          
      case endpoint.includes('/tables'):
        return method === 'POST' ? 
          { id: `tbl_${Date.now()}`, created: timestamp } :
          { tables: [], total: 0 };
          
      case endpoint.includes('/webhooks'):
        return method === 'POST' ? 
          { id: `hook_${Date.now()}`, url: `https://hooks.zapier.com/${Date.now()}` } :
          { webhooks: [], total: 0 };
          
      case endpoint.includes('/integrations'):
        return {
          integrations: [
            { id: 'gmail', name: 'Gmail', status: 'connected', lastSync: timestamp },
            { id: 'slack', name: 'Slack', status: 'connected', lastSync: timestamp },
            { id: 'sheets', name: 'Google Sheets', status: 'error', lastSync: timestamp }
          ]
        };
        
      default:
        return { success: true, timestamp };
    }
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