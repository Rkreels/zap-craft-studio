// Enhanced API service with in-memory storage (no localStorage)
class ApiService {
  private memoryStore: Map<string, any[]> = new Map();
  private initialized = false;

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  private getFromMemory<T>(key: string): T[] {
    if (!this.initialized) this.seedData();
    return (this.memoryStore.get(key) as T[]) || [];
  }

  private saveToMemory<T>(key: string, data: T[]): void {
    this.memoryStore.set(key, data);
  }

  private seedData() {
    this.initialized = true;

    // 20 Workflows
    this.saveToMemory('workflows', [
      { id: 'wf_1', name: 'Gmail to Slack Alerts', status: 'active', steps: [{type:'trigger',appName:'Gmail',actionName:'New Email'},{type:'action',appName:'Slack',actionName:'Send Message'}], created: '2025-12-01T08:00:00Z', updated: '2026-02-10T09:00:00Z', runs: 1247, lastRun: '2026-02-17T06:30:00Z' },
      { id: 'wf_2', name: 'Shopify Orders to Sheets', status: 'active', steps: [{type:'trigger',appName:'Shopify',actionName:'New Order'},{type:'action',appName:'Google Sheets',actionName:'Add Row'}], created: '2025-11-15T10:00:00Z', updated: '2026-02-16T14:00:00Z', runs: 892, lastRun: '2026-02-17T05:45:00Z' },
      { id: 'wf_3', name: 'Trello Card to Jira Issue', status: 'active', steps: [{type:'trigger',appName:'Trello',actionName:'New Card'},{type:'action',appName:'Jira',actionName:'Create Issue'}], created: '2025-10-20T09:00:00Z', updated: '2026-02-15T11:00:00Z', runs: 456, lastRun: '2026-02-16T22:10:00Z' },
      { id: 'wf_4', name: 'Stripe Payments to QuickBooks', status: 'active', steps: [{type:'trigger',appName:'Stripe',actionName:'New Payment'},{type:'action',appName:'QuickBooks',actionName:'Create Invoice'}], created: '2025-09-05T12:00:00Z', updated: '2026-02-14T08:00:00Z', runs: 2103, lastRun: '2026-02-17T07:00:00Z' },
      { id: 'wf_5', name: 'GitHub PR to Slack', status: 'active', steps: [{type:'trigger',appName:'GitHub',actionName:'New PR'},{type:'action',appName:'Slack',actionName:'Send Message'}], created: '2025-08-18T15:00:00Z', updated: '2026-02-13T10:00:00Z', runs: 734, lastRun: '2026-02-17T04:20:00Z' },
      { id: 'wf_6', name: 'Calendly to Google Calendar', status: 'active', steps: [{type:'trigger',appName:'Calendly',actionName:'New Event'},{type:'action',appName:'Google Calendar',actionName:'Create Event'}], created: '2025-11-22T14:00:00Z', updated: '2026-02-12T16:00:00Z', runs: 321, lastRun: '2026-02-16T18:30:00Z' },
      { id: 'wf_7', name: 'HubSpot Lead to Mailchimp', status: 'paused', steps: [{type:'trigger',appName:'HubSpot',actionName:'New Contact'},{type:'action',appName:'Mailchimp',actionName:'Add Subscriber'}], created: '2025-07-10T08:00:00Z', updated: '2026-01-20T12:00:00Z', runs: 189, lastRun: '2026-01-20T12:00:00Z' },
      { id: 'wf_8', name: 'Typeform to Salesforce', status: 'active', steps: [{type:'trigger',appName:'Typeform',actionName:'New Response'},{type:'action',appName:'Salesforce',actionName:'Create Lead'}], created: '2025-12-08T11:00:00Z', updated: '2026-02-11T13:00:00Z', runs: 567, lastRun: '2026-02-17T03:15:00Z' },
      { id: 'wf_9', name: 'Intercom to Asana Tasks', status: 'active', steps: [{type:'trigger',appName:'Intercom',actionName:'New Conversation'},{type:'action',appName:'Asana',actionName:'Create Task'}], created: '2025-10-01T09:00:00Z', updated: '2026-02-10T15:00:00Z', runs: 245, lastRun: '2026-02-16T20:45:00Z' },
      { id: 'wf_10', name: 'Zendesk Tickets to Slack', status: 'error', steps: [{type:'trigger',appName:'Zendesk',actionName:'New Ticket'},{type:'action',appName:'Slack',actionName:'Send Message'}], created: '2025-06-15T07:00:00Z', updated: '2026-02-15T09:00:00Z', runs: 1890, lastRun: '2026-02-15T09:00:00Z', error: 'API rate limit exceeded' },
      { id: 'wf_11', name: 'Notion to Google Docs', status: 'active', steps: [{type:'trigger',appName:'Notion',actionName:'Page Updated'},{type:'action',appName:'Google Docs',actionName:'Create Document'}], created: '2025-12-20T10:00:00Z', updated: '2026-02-16T08:00:00Z', runs: 98, lastRun: '2026-02-16T08:00:00Z' },
      { id: 'wf_12', name: 'Airtable to Slack Summary', status: 'active', steps: [{type:'trigger',appName:'Airtable',actionName:'New Record'},{type:'action',appName:'Slack',actionName:'Send Message'}], created: '2025-11-05T13:00:00Z', updated: '2026-02-14T17:00:00Z', runs: 412, lastRun: '2026-02-17T01:00:00Z' },
      { id: 'wf_13', name: 'RSS Feed to Email Digest', status: 'active', steps: [{type:'trigger',appName:'RSS',actionName:'New Item'},{type:'action',appName:'Gmail',actionName:'Send Email'}], created: '2025-09-28T16:00:00Z', updated: '2026-02-13T06:00:00Z', runs: 365, lastRun: '2026-02-17T06:00:00Z' },
      { id: 'wf_14', name: 'Slack Emoji to Google Sheets', status: 'paused', steps: [{type:'trigger',appName:'Slack',actionName:'New Reaction'},{type:'action',appName:'Google Sheets',actionName:'Add Row'}], created: '2025-08-12T11:00:00Z', updated: '2026-01-15T10:00:00Z', runs: 78, lastRun: '2026-01-15T10:00:00Z' },
      { id: 'wf_15', name: 'WooCommerce to Mailchimp', status: 'active', steps: [{type:'trigger',appName:'WooCommerce',actionName:'New Customer'},{type:'action',appName:'Mailchimp',actionName:'Add Subscriber'}], created: '2025-10-14T09:00:00Z', updated: '2026-02-16T12:00:00Z', runs: 634, lastRun: '2026-02-17T02:30:00Z' },
      { id: 'wf_16', name: 'Google Forms to Trello', status: 'active', steps: [{type:'trigger',appName:'Google Forms',actionName:'New Response'},{type:'action',appName:'Trello',actionName:'Create Card'}], created: '2025-07-22T14:00:00Z', updated: '2026-02-12T11:00:00Z', runs: 289, lastRun: '2026-02-16T15:00:00Z' },
      { id: 'wf_17', name: 'Dropbox to Google Drive Sync', status: 'active', steps: [{type:'trigger',appName:'Dropbox',actionName:'New File'},{type:'action',appName:'Google Drive',actionName:'Upload File'}], created: '2025-11-30T08:00:00Z', updated: '2026-02-15T14:00:00Z', runs: 1567, lastRun: '2026-02-17T07:15:00Z' },
      { id: 'wf_18', name: 'Twitter Mentions to Sheets', status: 'error', steps: [{type:'trigger',appName:'Twitter',actionName:'New Mention'},{type:'action',appName:'Google Sheets',actionName:'Add Row'}], created: '2025-09-10T10:00:00Z', updated: '2026-02-14T09:00:00Z', runs: 456, lastRun: '2026-02-14T09:00:00Z', error: 'Authentication expired' },
      { id: 'wf_19', name: 'LinkedIn Lead to HubSpot', status: 'active', steps: [{type:'trigger',appName:'LinkedIn',actionName:'New Lead'},{type:'action',appName:'HubSpot',actionName:'Create Contact'}], created: '2025-12-12T13:00:00Z', updated: '2026-02-16T10:00:00Z', runs: 178, lastRun: '2026-02-16T23:00:00Z' },
      { id: 'wf_20', name: 'Slack to Notion Meeting Notes', status: 'active', steps: [{type:'trigger',appName:'Slack',actionName:'New Message'},{type:'action',appName:'Notion',actionName:'Create Page'}], created: '2025-10-25T15:00:00Z', updated: '2026-02-17T08:00:00Z', runs: 203, lastRun: '2026-02-17T08:00:00Z' },
    ]);

    // 20 Tables
    this.saveToMemory('tables', [
      { id: 'tbl_1', name: 'Customer Contacts', description: 'All customer contact information', columns: [{id:'c1',name:'Name',type:'text'},{id:'c2',name:'Email',type:'email'},{id:'c3',name:'Phone',type:'text'},{id:'c4',name:'Company',type:'text'},{id:'c5',name:'Status',type:'select',options:['Lead','Customer','Churned']}], rows: [], recordCount: 1247, status: 'active', automations: 3, created: '2025-10-01T08:00:00Z', updated: '2026-02-17T06:00:00Z' },
      { id: 'tbl_2', name: 'Product Inventory', description: 'Product catalog and stock levels', columns: [{id:'c1',name:'Product',type:'text'},{id:'c2',name:'SKU',type:'text'},{id:'c3',name:'Price',type:'number'},{id:'c4',name:'Stock',type:'number'},{id:'c5',name:'Category',type:'text'}], rows: [], recordCount: 584, status: 'active', automations: 2, created: '2025-09-15T10:00:00Z', updated: '2026-02-16T14:00:00Z' },
      { id: 'tbl_3', name: 'Project Tasks', description: 'Task tracking for all active projects', columns: [{id:'c1',name:'Task',type:'text'},{id:'c2',name:'Assignee',type:'text'},{id:'c3',name:'Due Date',type:'date'},{id:'c4',name:'Priority',type:'select',options:['Low','Medium','High','Critical']},{id:'c5',name:'Done',type:'checkbox'}], rows: [], recordCount: 342, status: 'active', automations: 4, created: '2025-11-20T09:00:00Z', updated: '2026-02-17T05:30:00Z' },
      { id: 'tbl_4', name: 'Sales Pipeline', description: 'Track deals from lead to close', columns: [{id:'c1',name:'Deal Name',type:'text'},{id:'c2',name:'Value',type:'number'},{id:'c3',name:'Stage',type:'select',options:['Prospecting','Qualification','Proposal','Negotiation','Closed Won','Closed Lost']},{id:'c4',name:'Contact',type:'text'}], rows: [], recordCount: 89, status: 'active', automations: 5, created: '2025-08-10T12:00:00Z', updated: '2026-02-16T16:00:00Z' },
      { id: 'tbl_5', name: 'Employee Directory', description: 'Company employee information', columns: [{id:'c1',name:'Name',type:'text'},{id:'c2',name:'Email',type:'email'},{id:'c3',name:'Department',type:'text'},{id:'c4',name:'Role',type:'text'},{id:'c5',name:'Start Date',type:'date'}], rows: [], recordCount: 156, status: 'active', automations: 1, created: '2025-07-05T08:00:00Z', updated: '2026-02-15T11:00:00Z' },
      { id: 'tbl_6', name: 'Marketing Campaigns', description: 'Track all marketing initiatives', columns: [{id:'c1',name:'Campaign',type:'text'},{id:'c2',name:'Channel',type:'text'},{id:'c3',name:'Budget',type:'number'},{id:'c4',name:'Status',type:'select',options:['Planning','Active','Paused','Completed']}], rows: [], recordCount: 67, status: 'active', automations: 2, created: '2025-12-01T10:00:00Z', updated: '2026-02-14T13:00:00Z' },
      { id: 'tbl_7', name: 'Support Tickets', description: 'Customer support ticket tracking', columns: [{id:'c1',name:'Subject',type:'text'},{id:'c2',name:'Customer',type:'text'},{id:'c3',name:'Priority',type:'select',options:['Low','Medium','High','Urgent']},{id:'c4',name:'Status',type:'select',options:['Open','In Progress','Resolved','Closed']}], rows: [], recordCount: 2340, status: 'active', automations: 6, created: '2025-06-20T09:00:00Z', updated: '2026-02-17T07:00:00Z' },
      { id: 'tbl_8', name: 'Invoice Records', description: 'All client invoices and payments', columns: [{id:'c1',name:'Invoice #',type:'text'},{id:'c2',name:'Client',type:'text'},{id:'c3',name:'Amount',type:'number'},{id:'c4',name:'Due Date',type:'date'},{id:'c5',name:'Paid',type:'checkbox'}], rows: [], recordCount: 478, status: 'active', automations: 3, created: '2025-10-12T11:00:00Z', updated: '2026-02-16T09:00:00Z' },
      { id: 'tbl_9', name: 'Event Registrations', description: 'Event attendee management', columns: [{id:'c1',name:'Attendee',type:'text'},{id:'c2',name:'Email',type:'email'},{id:'c3',name:'Event',type:'text'},{id:'c4',name:'Ticket Type',type:'select',options:['Free','Standard','VIP']}], rows: [], recordCount: 234, status: 'active', automations: 2, created: '2025-11-08T14:00:00Z', updated: '2026-02-15T16:00:00Z' },
      { id: 'tbl_10', name: 'Content Calendar', description: 'Content publishing schedule', columns: [{id:'c1',name:'Title',type:'text'},{id:'c2',name:'Author',type:'text'},{id:'c3',name:'Publish Date',type:'date'},{id:'c4',name:'Platform',type:'text'},{id:'c5',name:'Status',type:'select',options:['Draft','Review','Scheduled','Published']}], rows: [], recordCount: 145, status: 'active', automations: 1, created: '2025-09-25T10:00:00Z', updated: '2026-02-17T04:00:00Z' },
      { id: 'tbl_11', name: 'Vendor Contacts', description: 'Supplier and vendor information', columns: [{id:'c1',name:'Vendor',type:'text'},{id:'c2',name:'Contact',type:'text'},{id:'c3',name:'Email',type:'email'},{id:'c4',name:'Category',type:'text'}], rows: [], recordCount: 78, status: 'draft', automations: 0, created: '2025-12-15T08:00:00Z', updated: '2026-02-10T12:00:00Z' },
      { id: 'tbl_12', name: 'Bug Tracker', description: 'Software bug reports and fixes', columns: [{id:'c1',name:'Bug',type:'text'},{id:'c2',name:'Reporter',type:'text'},{id:'c3',name:'Severity',type:'select',options:['Low','Medium','High','Critical']},{id:'c4',name:'Fixed',type:'checkbox'}], rows: [], recordCount: 567, status: 'active', automations: 3, created: '2025-08-30T09:00:00Z', updated: '2026-02-16T18:00:00Z' },
      { id: 'tbl_13', name: 'Expense Reports', description: 'Employee expense tracking', columns: [{id:'c1',name:'Employee',type:'text'},{id:'c2',name:'Category',type:'text'},{id:'c3',name:'Amount',type:'number'},{id:'c4',name:'Date',type:'date'},{id:'c5',name:'Approved',type:'checkbox'}], rows: [], recordCount: 890, status: 'active', automations: 2, created: '2025-07-18T11:00:00Z', updated: '2026-02-15T15:00:00Z' },
      { id: 'tbl_14', name: 'Newsletter Subscribers', description: 'Email newsletter subscriber list', columns: [{id:'c1',name:'Name',type:'text'},{id:'c2',name:'Email',type:'email'},{id:'c3',name:'Subscribed Date',type:'date'},{id:'c4',name:'Active',type:'checkbox'}], rows: [], recordCount: 4567, status: 'active', automations: 4, created: '2025-06-01T08:00:00Z', updated: '2026-02-17T03:00:00Z' },
      { id: 'tbl_15', name: 'Meeting Notes', description: 'Notes and action items from meetings', columns: [{id:'c1',name:'Meeting',type:'text'},{id:'c2',name:'Date',type:'date'},{id:'c3',name:'Attendees',type:'text'},{id:'c4',name:'Notes',type:'text'}], rows: [], recordCount: 234, status: 'active', automations: 1, created: '2025-10-08T13:00:00Z', updated: '2026-02-14T10:00:00Z' },
      { id: 'tbl_16', name: 'Feedback Responses', description: 'Customer feedback and surveys', columns: [{id:'c1',name:'Respondent',type:'text'},{id:'c2',name:'Rating',type:'number'},{id:'c3',name:'Comment',type:'text'},{id:'c4',name:'Date',type:'date'}], rows: [], recordCount: 1890, status: 'active', automations: 2, created: '2025-09-12T09:00:00Z', updated: '2026-02-16T20:00:00Z' },
      { id: 'tbl_17', name: 'Shipping Tracking', description: 'Order shipping and delivery status', columns: [{id:'c1',name:'Order #',type:'text'},{id:'c2',name:'Customer',type:'text'},{id:'c3',name:'Carrier',type:'text'},{id:'c4',name:'Status',type:'select',options:['Processing','Shipped','In Transit','Delivered']}], rows: [], recordCount: 3456, status: 'active', automations: 5, created: '2025-08-05T10:00:00Z', updated: '2026-02-17T06:30:00Z' },
      { id: 'tbl_18', name: 'Interview Schedule', description: 'Hiring interview management', columns: [{id:'c1',name:'Candidate',type:'text'},{id:'c2',name:'Position',type:'text'},{id:'c3',name:'Date',type:'date'},{id:'c4',name:'Interviewer',type:'text'},{id:'c5',name:'Result',type:'select',options:['Pending','Pass','Fail','Offer']}], rows: [], recordCount: 45, status: 'draft', automations: 1, created: '2025-12-20T14:00:00Z', updated: '2026-02-13T11:00:00Z' },
      { id: 'tbl_19', name: 'API Endpoints', description: 'API documentation and testing', columns: [{id:'c1',name:'Endpoint',type:'text'},{id:'c2',name:'Method',type:'select',options:['GET','POST','PUT','DELETE']},{id:'c3',name:'Description',type:'text'},{id:'c4',name:'Auth Required',type:'checkbox'}], rows: [], recordCount: 124, status: 'active', automations: 0, created: '2025-11-01T08:00:00Z', updated: '2026-02-12T15:00:00Z' },
      { id: 'tbl_20', name: 'Social Media Posts', description: 'Scheduled social media content', columns: [{id:'c1',name:'Content',type:'text'},{id:'c2',name:'Platform',type:'select',options:['Twitter','LinkedIn','Instagram','Facebook']},{id:'c3',name:'Schedule Date',type:'date'},{id:'c4',name:'Published',type:'checkbox'}], rows: [], recordCount: 312, status: 'active', automations: 3, created: '2025-10-18T10:00:00Z', updated: '2026-02-16T22:00:00Z' },
    ]);

    // 20 Templates
    this.saveToMemory('templates', [
      { id: 'tmpl_1', name: 'Gmail to Slack Notification', description: 'Get Slack messages when new emails arrive in Gmail', category: 'Communication', featured: true, popular: true, rating: 4.9, usageCount: 45200, steps: [{type:'trigger',appName:'Gmail',actionName:'New Email'},{type:'action',appName:'Slack',actionName:'Send Message'}] },
      { id: 'tmpl_2', name: 'Shopify to Google Sheets', description: 'Log new Shopify orders to a Google Sheets spreadsheet', category: 'E-commerce', featured: true, popular: true, rating: 4.8, usageCount: 38900, steps: [{type:'trigger',appName:'Shopify',actionName:'New Order'},{type:'action',appName:'Google Sheets',actionName:'Add Row'}] },
      { id: 'tmpl_3', name: 'Stripe to QuickBooks Invoice', description: 'Create QuickBooks invoices from new Stripe charges', category: 'Finance', popular: true, rating: 4.7, usageCount: 22400, steps: [{type:'trigger',appName:'Stripe',actionName:'New Payment'},{type:'action',appName:'QuickBooks',actionName:'Create Invoice'}] },
      { id: 'tmpl_4', name: 'Typeform to Mailchimp', description: 'Add Typeform respondents to Mailchimp lists', category: 'Marketing', new: true, rating: 4.6, usageCount: 18700, steps: [{type:'trigger',appName:'Typeform',actionName:'New Response'},{type:'action',appName:'Mailchimp',actionName:'Add Subscriber'}] },
      { id: 'tmpl_5', name: 'GitHub PR to Slack', description: 'Notify Slack when pull requests are created on GitHub', category: 'Development', popular: true, rating: 4.8, usageCount: 31200, steps: [{type:'trigger',appName:'GitHub',actionName:'New PR'},{type:'action',appName:'Slack',actionName:'Send Message'}] },
      { id: 'tmpl_6', name: 'Calendly to Google Calendar', description: 'Create Google Calendar events from Calendly bookings', category: 'Productivity', featured: true, rating: 4.7, usageCount: 27800, steps: [{type:'trigger',appName:'Calendly',actionName:'New Event'},{type:'action',appName:'Google Calendar',actionName:'Create Event'}] },
      { id: 'tmpl_7', name: 'Salesforce to Slack Deal Alerts', description: 'Alert Slack when Salesforce deals reach specific stages', category: 'Sales', popular: true, rating: 4.5, usageCount: 15600, steps: [{type:'trigger',appName:'Salesforce',actionName:'Deal Updated'},{type:'action',appName:'Slack',actionName:'Send Message'}] },
      { id: 'tmpl_8', name: 'Jira to Trello Sync', description: 'Create Trello cards from new Jira issues', category: 'Project Management', rating: 4.4, usageCount: 12300, steps: [{type:'trigger',appName:'Jira',actionName:'New Issue'},{type:'action',appName:'Trello',actionName:'Create Card'}] },
      { id: 'tmpl_9', name: 'Intercom to Asana Task', description: 'Create Asana tasks from Intercom conversations', category: 'Support', new: true, rating: 4.6, usageCount: 9800, steps: [{type:'trigger',appName:'Intercom',actionName:'New Conversation'},{type:'action',appName:'Asana',actionName:'Create Task'}] },
      { id: 'tmpl_10', name: 'RSS to Email Digest', description: 'Send daily email digests from RSS feeds', category: 'Content', rating: 4.3, usageCount: 14500, steps: [{type:'trigger',appName:'RSS',actionName:'New Item'},{type:'action',appName:'Gmail',actionName:'Send Email'}] },
      { id: 'tmpl_11', name: 'HubSpot to Slack New Contact', description: 'Notify Slack when new contacts are added in HubSpot', category: 'CRM', rating: 4.5, usageCount: 11200, steps: [{type:'trigger',appName:'HubSpot',actionName:'New Contact'},{type:'action',appName:'Slack',actionName:'Send Message'}] },
      { id: 'tmpl_12', name: 'Google Forms to Trello', description: 'Create Trello cards from Google Forms responses', category: 'Productivity', popular: true, rating: 4.7, usageCount: 25600, steps: [{type:'trigger',appName:'Google Forms',actionName:'New Response'},{type:'action',appName:'Trello',actionName:'Create Card'}] },
      { id: 'tmpl_13', name: 'Airtable to Slack Updates', description: 'Send Slack messages when Airtable records change', category: 'Database', rating: 4.4, usageCount: 8900, steps: [{type:'trigger',appName:'Airtable',actionName:'Record Updated'},{type:'action',appName:'Slack',actionName:'Send Message'}] },
      { id: 'tmpl_14', name: 'Notion to Google Docs', description: 'Export Notion pages to Google Docs automatically', category: 'Productivity', new: true, rating: 4.6, usageCount: 7600, steps: [{type:'trigger',appName:'Notion',actionName:'Page Updated'},{type:'action',appName:'Google Docs',actionName:'Create Document'}] },
      { id: 'tmpl_15', name: 'WooCommerce to Mailchimp', description: 'Add WooCommerce customers to Mailchimp lists', category: 'E-commerce', rating: 4.5, usageCount: 19400, steps: [{type:'trigger',appName:'WooCommerce',actionName:'New Customer'},{type:'action',appName:'Mailchimp',actionName:'Add Subscriber'}] },
      { id: 'tmpl_16', name: 'Dropbox to Google Drive Backup', description: 'Automatically backup Dropbox files to Google Drive', category: 'Storage', rating: 4.3, usageCount: 16700, steps: [{type:'trigger',appName:'Dropbox',actionName:'New File'},{type:'action',appName:'Google Drive',actionName:'Upload File'}] },
      { id: 'tmpl_17', name: 'Zendesk to Jira Escalation', description: 'Create Jira issues from high-priority Zendesk tickets', category: 'Support', featured: true, rating: 4.8, usageCount: 13200, steps: [{type:'trigger',appName:'Zendesk',actionName:'New Ticket'},{type:'action',appName:'Jira',actionName:'Create Issue'}] },
      { id: 'tmpl_18', name: 'LinkedIn Lead to CRM', description: 'Add LinkedIn leads to your CRM automatically', category: 'Sales', new: true, rating: 4.5, usageCount: 6800, steps: [{type:'trigger',appName:'LinkedIn',actionName:'New Lead'},{type:'action',appName:'HubSpot',actionName:'Create Contact'}] },
      { id: 'tmpl_19', name: 'Twitter Mentions to Sheets', description: 'Track Twitter mentions in Google Sheets', category: 'Social Media', rating: 4.4, usageCount: 21300, steps: [{type:'trigger',appName:'Twitter',actionName:'New Mention'},{type:'action',appName:'Google Sheets',actionName:'Add Row'}] },
      { id: 'tmpl_20', name: 'Slack to Notion Meeting Notes', description: 'Save Slack messages as Notion meeting notes', category: 'Productivity', rating: 4.6, usageCount: 10500, steps: [{type:'trigger',appName:'Slack',actionName:'New Message'},{type:'action',appName:'Notion',actionName:'Create Page'}] },
    ]);

    // 20 Integrations
    this.saveToMemory('integrations', [
      { id: 'gmail', name: 'Gmail', status: 'connected', lastSync: '2026-02-17T08:30:00Z', category: 'Email' },
      { id: 'slack', name: 'Slack', status: 'connected', lastSync: '2026-02-17T08:25:00Z', category: 'Communication' },
      { id: 'sheets', name: 'Google Sheets', status: 'connected', lastSync: '2026-02-17T07:45:00Z', category: 'Productivity' },
      { id: 'trello', name: 'Trello', status: 'connected', lastSync: '2026-02-17T06:15:00Z', category: 'Project Management' },
      { id: 'stripe', name: 'Stripe', status: 'connected', lastSync: '2026-02-17T08:00:00Z', category: 'Finance' },
      { id: 'github', name: 'GitHub', status: 'connected', lastSync: '2026-02-17T07:30:00Z', category: 'Development' },
      { id: 'salesforce', name: 'Salesforce', status: 'connected', lastSync: '2026-02-16T22:00:00Z', category: 'CRM' },
      { id: 'mailchimp', name: 'Mailchimp', status: 'connected', lastSync: '2026-02-17T05:00:00Z', category: 'Marketing' },
      { id: 'jira', name: 'Jira', status: 'connected', lastSync: '2026-02-17T04:20:00Z', category: 'Project Management' },
      { id: 'asana', name: 'Asana', status: 'connected', lastSync: '2026-02-16T20:00:00Z', category: 'Productivity' },
      { id: 'dropbox', name: 'Dropbox', status: 'disconnected', lastSync: null, category: 'Storage' },
      { id: 'twitter', name: 'Twitter', status: 'error', lastSync: '2026-02-14T09:00:00Z', category: 'Social Media', error: 'Token expired' },
      { id: 'hubspot', name: 'HubSpot', status: 'connected', lastSync: '2026-02-17T03:15:00Z', category: 'CRM' },
      { id: 'notion', name: 'Notion', status: 'connected', lastSync: '2026-02-16T18:30:00Z', category: 'Productivity' },
      { id: 'calendly', name: 'Calendly', status: 'connected', lastSync: '2026-02-17T02:45:00Z', category: 'Scheduling' },
      { id: 'shopify', name: 'Shopify', status: 'connected', lastSync: '2026-02-17T07:00:00Z', category: 'E-commerce' },
      { id: 'zendesk', name: 'Zendesk', status: 'disconnected', lastSync: null, category: 'Support' },
      { id: 'intercom', name: 'Intercom', status: 'connected', lastSync: '2026-02-16T15:00:00Z', category: 'Support' },
      { id: 'airtable', name: 'Airtable', status: 'connected', lastSync: '2026-02-17T01:00:00Z', category: 'Database' },
      { id: 'typeform', name: 'Typeform', status: 'connected', lastSync: '2026-02-16T12:00:00Z', category: 'Forms' },
    ]);

    // 20 Interfaces
    this.saveToMemory('interfaces', [
      { id: 'int_1', name: 'Customer Intake Form', type: 'form', description: 'New customer registration form', status: 'published', fields: [{id:'f1',name:'Full Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true},{id:'f3',name:'Phone',type:'text',required:false},{id:'f4',name:'Company',type:'text',required:false}], created: '2025-10-05T08:00:00Z', updated: '2026-02-15T10:00:00Z', submissions: 456 },
      { id: 'int_2', name: 'Support Request Form', type: 'form', description: 'Customer support ticket submission', status: 'published', fields: [{id:'f1',name:'Subject',type:'text',required:true},{id:'f2',name:'Description',type:'textarea',required:true},{id:'f3',name:'Priority',type:'select',required:true,options:['Low','Medium','High','Urgent']},{id:'f4',name:'Email',type:'email',required:true}], created: '2025-09-20T09:00:00Z', updated: '2026-02-16T11:00:00Z', submissions: 1234 },
      { id: 'int_3', name: 'Sales Dashboard', type: 'dashboard', description: 'Real-time sales metrics and KPIs', status: 'published', fields: [], created: '2025-11-10T14:00:00Z', updated: '2026-02-17T06:00:00Z', submissions: 0 },
      { id: 'int_4', name: 'Employee Feedback Survey', type: 'form', description: 'Quarterly employee satisfaction survey', status: 'draft', fields: [{id:'f1',name:'Department',type:'select',required:true,options:['Engineering','Sales','Marketing','HR','Operations']},{id:'f2',name:'Rating',type:'number',required:true},{id:'f3',name:'Comments',type:'textarea',required:false}], created: '2025-12-01T10:00:00Z', updated: '2026-02-14T08:00:00Z', submissions: 89 },
      { id: 'int_5', name: 'Product Catalog', type: 'page', description: 'Public product listing page', status: 'published', fields: [], created: '2025-08-15T11:00:00Z', updated: '2026-02-13T15:00:00Z', submissions: 0 },
      { id: 'int_6', name: 'Event Registration', type: 'form', description: 'Event signup and RSVP form', status: 'published', fields: [{id:'f1',name:'Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true},{id:'f3',name:'Ticket Type',type:'select',required:true,options:['Free','Standard','VIP']},{id:'f4',name:'Dietary Requirements',type:'text',required:false}], created: '2025-10-22T09:00:00Z', updated: '2026-02-16T12:00:00Z', submissions: 234 },
      { id: 'int_7', name: 'Job Application Form', type: 'form', description: 'Career page application form', status: 'published', fields: [{id:'f1',name:'Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true},{id:'f3',name:'Position',type:'text',required:true},{id:'f4',name:'Resume URL',type:'text',required:true},{id:'f5',name:'Cover Letter',type:'textarea',required:false}], created: '2025-11-28T13:00:00Z', updated: '2026-02-15T09:00:00Z', submissions: 178 },
      { id: 'int_8', name: 'Newsletter Signup', type: 'form', description: 'Email newsletter subscription form', status: 'published', fields: [{id:'f1',name:'Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true}], created: '2025-07-10T08:00:00Z', updated: '2026-02-17T04:00:00Z', submissions: 5670 },
      { id: 'int_9', name: 'Project Status Page', type: 'page', description: 'Public status page for projects', status: 'published', fields: [], created: '2025-09-05T10:00:00Z', updated: '2026-02-12T16:00:00Z', submissions: 0 },
      { id: 'int_10', name: 'Contact Us Page', type: 'form', description: 'General inquiry contact form', status: 'published', fields: [{id:'f1',name:'Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true},{id:'f3',name:'Subject',type:'text',required:true},{id:'f4',name:'Message',type:'textarea',required:true}], created: '2025-06-20T09:00:00Z', updated: '2026-02-14T14:00:00Z', submissions: 890 },
      { id: 'int_11', name: 'Order Tracking Portal', type: 'page', description: 'Customer order tracking interface', status: 'published', fields: [], created: '2025-10-30T11:00:00Z', updated: '2026-02-16T08:00:00Z', submissions: 0 },
      { id: 'int_12', name: 'Bug Report Form', type: 'form', description: 'Software bug reporting form', status: 'published', fields: [{id:'f1',name:'Title',type:'text',required:true},{id:'f2',name:'Steps to Reproduce',type:'textarea',required:true},{id:'f3',name:'Severity',type:'select',required:true,options:['Low','Medium','High','Critical']},{id:'f4',name:'Screenshot URL',type:'text',required:false}], created: '2025-08-25T14:00:00Z', updated: '2026-02-15T12:00:00Z', submissions: 567 },
      { id: 'int_13', name: 'Vendor Onboarding', type: 'form', description: 'New vendor registration and setup', status: 'draft', fields: [{id:'f1',name:'Company Name',type:'text',required:true},{id:'f2',name:'Contact',type:'text',required:true},{id:'f3',name:'Email',type:'email',required:true},{id:'f4',name:'Tax ID',type:'text',required:true}], created: '2025-12-10T09:00:00Z', updated: '2026-02-10T11:00:00Z', submissions: 23 },
      { id: 'int_14', name: 'Analytics Dashboard', type: 'dashboard', description: 'Website traffic and conversion analytics', status: 'published', fields: [], created: '2025-11-15T13:00:00Z', updated: '2026-02-17T05:00:00Z', submissions: 0 },
      { id: 'int_15', name: 'Feature Request Form', type: 'form', description: 'Customer feature request submission', status: 'published', fields: [{id:'f1',name:'Feature Title',type:'text',required:true},{id:'f2',name:'Description',type:'textarea',required:true},{id:'f3',name:'Priority',type:'select',required:false,options:['Nice to Have','Important','Critical']},{id:'f4',name:'Email',type:'email',required:true}], created: '2025-09-18T10:00:00Z', updated: '2026-02-13T09:00:00Z', submissions: 345 },
      { id: 'int_16', name: 'Team Directory', type: 'page', description: 'Internal team member directory', status: 'published', fields: [], created: '2025-07-28T08:00:00Z', updated: '2026-02-11T14:00:00Z', submissions: 0 },
      { id: 'int_17', name: 'Expense Claim Form', type: 'form', description: 'Employee expense reimbursement form', status: 'published', fields: [{id:'f1',name:'Employee',type:'text',required:true},{id:'f2',name:'Amount',type:'number',required:true},{id:'f3',name:'Category',type:'select',required:true,options:['Travel','Meals','Software','Equipment','Other']},{id:'f4',name:'Receipt URL',type:'text',required:true},{id:'f5',name:'Description',type:'textarea',required:false}], created: '2025-10-12T11:00:00Z', updated: '2026-02-16T10:00:00Z', submissions: 678 },
      { id: 'int_18', name: 'Partner Portal', type: 'page', description: 'Partner resources and documentation', status: 'draft', fields: [], created: '2025-12-05T15:00:00Z', updated: '2026-02-09T13:00:00Z', submissions: 0 },
      { id: 'int_19', name: 'Appointment Booking', type: 'form', description: 'Schedule appointments and consultations', status: 'published', fields: [{id:'f1',name:'Name',type:'text',required:true},{id:'f2',name:'Email',type:'email',required:true},{id:'f3',name:'Date',type:'date',required:true},{id:'f4',name:'Time Slot',type:'select',required:true,options:['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM']},{id:'f5',name:'Notes',type:'textarea',required:false}], created: '2025-11-20T09:00:00Z', updated: '2026-02-15T16:00:00Z', submissions: 412 },
      { id: 'int_20', name: 'Satisfaction Survey', type: 'form', description: 'Post-service satisfaction survey', status: 'published', fields: [{id:'f1',name:'Rating',type:'number',required:true},{id:'f2',name:'What went well?',type:'textarea',required:false},{id:'f3',name:'What could improve?',type:'textarea',required:false},{id:'f4',name:'Email',type:'email',required:false}], created: '2025-08-08T10:00:00Z', updated: '2026-02-14T17:00:00Z', submissions: 2340 },
    ]);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await this.delay(Math.random() * 300 + 100);
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body as string) : null;
    return this.handleRequest<T>(endpoint, method, data);
  }

  private handleRequest<T>(endpoint: string, method: string, data?: any): T {
    if (endpoint.includes('/templates')) return this.handleTemplateRequests(endpoint, method, data) as T;
    if (endpoint.includes('/workflows')) return this.handleWorkflowRequests(endpoint, method, data) as T;
    if (endpoint.includes('/tables')) return this.handleTableRequests(endpoint, method, data) as T;
    if (endpoint.includes('/interfaces')) return this.handleInterfaceRequests(endpoint, method, data) as T;
    if (endpoint.includes('/integrations')) return this.handleIntegrationRequests(endpoint, method, data) as T;
    return { success: true } as T;
  }

  private handleTemplateRequests(endpoint: string, method: string, data?: any) {
    const templates = this.getFromMemory<any>('templates');
    if (method === 'GET') return { templates, total: templates.length };
    if (method === 'POST') {
      const t = { id: `tmpl_${Date.now()}`, ...data, created: new Date().toISOString() };
      templates.push(t);
      this.saveToMemory('templates', templates);
      return t;
    }
    return { success: true };
  }

  private handleWorkflowRequests(endpoint: string, method: string, data?: any) {
    const workflows = this.getFromMemory<any>('workflows');
    if (method === 'GET') return { workflows, total: workflows.length };
    if (method === 'POST' && endpoint.includes('/execute')) {
      return { success: true, executionId: `exec_${Date.now()}`, status: 'completed', duration: `${(Math.random() * 5 + 0.5).toFixed(1)}s` };
    }
    if (method === 'POST') {
      const w = { id: `wf_${Date.now()}`, status: 'active', runs: 0, created: new Date().toISOString(), updated: new Date().toISOString(), ...data };
      workflows.push(w);
      this.saveToMemory('workflows', workflows);
      return w;
    }
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const i = workflows.findIndex((w: any) => w.id === id);
      if (i !== -1) { workflows[i] = { ...workflows[i], ...data, updated: new Date().toISOString() }; this.saveToMemory('workflows', workflows); return workflows[i]; }
    }
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      this.saveToMemory('workflows', workflows.filter((w: any) => w.id !== id));
      return { success: true };
    }
    return { success: true };
  }

  private handleTableRequests(endpoint: string, method: string, data?: any) {
    const tables = this.getFromMemory<any>('tables');
    if (method === 'GET') return { tables, total: tables.length };
    if (method === 'POST') {
      const t = { id: `tbl_${Date.now()}`, recordCount: 0, status: 'draft', automations: 0, created: new Date().toISOString(), updated: new Date().toISOString(), ...data };
      tables.push(t);
      this.saveToMemory('tables', tables);
      return t;
    }
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const i = tables.findIndex((t: any) => t.id === id);
      if (i !== -1) { tables[i] = { ...tables[i], ...data, updated: new Date().toISOString() }; this.saveToMemory('tables', tables); return tables[i]; }
    }
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      this.saveToMemory('tables', tables.filter((t: any) => t.id !== id));
      return { success: true };
    }
    return { success: true };
  }

  private handleInterfaceRequests(endpoint: string, method: string, data?: any) {
    const interfaces = this.getFromMemory<any>('interfaces');
    if (method === 'GET') return { interfaces, total: interfaces.length };
    if (method === 'POST') {
      const iface = { id: `int_${Date.now()}`, status: 'draft', submissions: 0, created: new Date().toISOString(), updated: new Date().toISOString(), ...data };
      interfaces.push(iface);
      this.saveToMemory('interfaces', interfaces);
      return iface;
    }
    if (method === 'PUT') {
      const id = endpoint.split('/').pop();
      const i = interfaces.findIndex((x: any) => x.id === id);
      if (i !== -1) { interfaces[i] = { ...interfaces[i], ...data, updated: new Date().toISOString() }; this.saveToMemory('interfaces', interfaces); return interfaces[i]; }
    }
    if (method === 'DELETE') {
      const id = endpoint.split('/').pop();
      this.saveToMemory('interfaces', interfaces.filter((x: any) => x.id !== id));
      return { success: true };
    }
    return { success: true };
  }

  private handleIntegrationRequests(endpoint: string, method: string, data?: any) {
    const integrations = this.getFromMemory<any>('integrations');
    if (method === 'GET') return { integrations, total: integrations.length };
    if (method === 'POST' && endpoint.includes('/connect')) {
      const service = endpoint.split('/')[2];
      const idx = integrations.findIndex((i: any) => i.id === service);
      const integration = { id: service, name: data?.name || service, status: 'connected', lastSync: new Date().toISOString(), ...data };
      if (idx !== -1) integrations[idx] = integration; else integrations.push(integration);
      this.saveToMemory('integrations', integrations);
      return integration;
    }
    if (method === 'POST' && endpoint.includes('/disconnect')) {
      const service = endpoint.split('/')[2];
      const idx = integrations.findIndex((i: any) => i.id === service);
      if (idx !== -1) { integrations[idx].status = 'disconnected'; integrations[idx].lastSync = null; this.saveToMemory('integrations', integrations); }
      return { success: true };
    }
    return { success: true };
  }

  // Public API methods
  async getTemplates() { return this.request('/templates'); }
  async createTemplate(data: any) { return this.request('/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async applyTemplate(templateId: string) {
    const templates = this.getFromMemory<any>('templates');
    const template = templates.find((t: any) => t.id === templateId);
    if (template) {
      const workflow = { id: `wf_${Date.now()}`, name: `Copy of ${template.name}`, steps: template.steps, status: 'active', runs: 0, created: new Date().toISOString() };
      const workflows = this.getFromMemory<any>('workflows');
      workflows.push(workflow);
      this.saveToMemory('workflows', workflows);
      return { success: true, workflow };
    }
    throw new Error('Template not found');
  }
  async getWorkflows() { return this.request('/workflows'); }
  async createWorkflow(data: any) { return this.request('/workflows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async updateWorkflow(id: string, data: any) { return this.request(`/workflows/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async deleteWorkflow(id: string) { return this.request(`/workflows/${id}`, { method: 'DELETE' }); }
  async executeWorkflow(id: string, data: any) { return this.request(`/workflows/${id}/execute`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async getInterfaces() { return this.request('/interfaces'); }
  async createInterface(data: any) { return this.request('/interfaces', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async updateInterface(id: string, data: any) { return this.request(`/interfaces/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async deleteInterface(id: string) { return this.request(`/interfaces/${id}`, { method: 'DELETE' }); }
  async getTables() { return this.request('/tables'); }
  async createTable(data: any) { return this.request('/tables', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async updateTable(id: string, data: any) { return this.request(`/tables/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async deleteTable(id: string) { return this.request(`/tables/${id}`, { method: 'DELETE' }); }
  async createWebhook(data: any) { return this.request('/webhooks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
  async triggerWebhook(url: string, data: any) {
    try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, mode: 'no-cors', body: JSON.stringify(data) }); return { success: true, status: 'sent' }; }
    catch (error: any) { return { success: false, error: error.message }; }
  }
  async getIntegrations() { return this.request('/integrations'); }
  async connectIntegration(service: string, credentials: any) { return this.request(`/integrations/${service}/connect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }); }
  async disconnectIntegration(service: string) { return this.request(`/integrations/${service}/disconnect`, { method: 'POST' }); }
  async getWorkflowRuns(workflowId: string) { return this.request(`/workflows/${workflowId}/runs`); }
  async getSystemHealth() { return this.request('/health'); }
}

export const apiService = new ApiService();
