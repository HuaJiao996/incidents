import { Method } from 'alova';
import { alovaInstance } from '..';

export type Alert = {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  severity: string;
  status: string;
  source?: string;
  serviceId?: number;
  incidentId?: number | null;
  timestamp?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  customFields?: Record<string, any> | null;
};

export type AlertsResponse = {
  alerts: Alert[];
  total: number;
  page: number;
  pageSize: number;
};

export type AlertsQuery = {
  page?: number;
  pageSize?: number;
  status?: string;
  severity?: string;
  serviceId?: number;
  source?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export const alertsApi = {
  /**
   * 获取告警列表
   */
  getAlerts: (params: AlertsQuery) => {
    return Method('GET', alovaInstance, '/api/alert', { params }) as any as Promise<AlertsResponse>;
  },

  /**
   * 获取告警详情
   */
  getAlertDetail: (params: { id: number }) => {
    return Method('GET', alovaInstance, `/api/alert/${params.id}`) as any as Promise<Alert>;
  },

  /**
   * 创建告警
   */
  createAlert: (data: Alert) => {
    return Method('POST', alovaInstance, '/api/alert', { data }) as any as Promise<Alert>;
  },

  /**
   * 批量创建告警
   */
  createAlertsBatch: (data: Alert[]) => {
    return Method('POST', alovaInstance, '/api/alert/batch', { data }) as any as Promise<Alert[]>;
  },

  /**
   * 更新告警
   */
  updateAlert: (data: Alert & { id: number }) => {
    return Method('PATCH', alovaInstance, `/api/alert/${data.id}`, { data }) as any as Promise<Alert>;
  },

  /**
   * 解决告警
   */
  resolveAlert: (params: { id: number }) => {
    return Method('POST', alovaInstance, `/api/alert/${params.id}/resolve`) as any as Promise<Alert>;
  },

  /**
   * 删除告警
   */
  deleteAlert: (params: { id: number }) => {
    return Method('DELETE', alovaInstance, `/api/alert/${params.id}`) as any as Promise<void>;
  },
};