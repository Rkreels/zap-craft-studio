
import { useWorkflowData } from './useWorkflowData';
import { useTableData } from './useTableData';
import { useSystemMonitoring } from './useSystemMonitoring';
import { useIntegrationData } from './useIntegrationData';

// Export the individual hooks for modular usage
export { useWorkflowData } from './useWorkflowData';
export { useTableData } from './useTableData';
export { useSystemMonitoring } from './useSystemMonitoring';
export { useIntegrationData } from './useIntegrationData';

// Main hook that combines all real-time data
export const useRealTimeData = () => {
  const workflows = useWorkflowData();
  const tables = useTableData();
  const monitoring = useSystemMonitoring();
  const integrations = useIntegrationData();

  return {
    workflows,
    tables,
    monitoring,
    integrations,
  };
};

// Legacy exports for backward compatibility
export const useRealTimeWorkflows = useWorkflowData;
export const useRealTimeTables = useTableData;
export const useRealTimeIntegrations = useIntegrationData;
