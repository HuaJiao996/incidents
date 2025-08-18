import { alertsApi } from './alerts';
import { incidentsApi } from './incidents';

export * from './alerts';
export * from './incidents';

export const apiDefinitions = {
  alerts: alertsApi,
  incidents: incidentsApi,
};

export default apiDefinitions;