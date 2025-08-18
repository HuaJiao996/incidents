import { Method } from 'alova';
import { alovaInstance } from '..';
import { Alert } from './alerts';

export type Incident = {
  id?: number;
  title: string;
  description?: string;
  status: string;
  severity: string;
  serviceId?: number;
  typeId?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  resolvedAt?: string | Date;
  acknowledgedAt?: string | Date;
  customFields?: Record<string, any> | null;
  alerts?: Alert[];
};

export type IncidentsResponse = {
  incidents: Incident[];
  total: number;
  page: number;
  pageSize: number;
};

export type IncidentsQuery = {
  page?: number;
  pageSize?: number;
  status?: string;
  severity?: string;
  serviceId?: number;
  typeId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export const incidentsApi = {
  /**
   * 获取事件列表
   */
  getIncidents: (params: IncidentsQuery) => {
    return Method('GET', alovaInstance, '/api/incident', { params }) as any as Promise<IncidentsResponse>;
  },

  /**
   * 获取事件详情
   */
  getIncidentDetail: (params: { id: number }) => {
    return Method('GET', alovaInstance, `/api/incident/${params.id}`) as any as Promise<Incident>;
  },

  /**
   * 创建事件
   */
  createIncident: (data: Incident) => {
    return Method('POST', alovaInstance, '/api/incident', { data }) as any as Promise<Incident>;
  },

  /**
   * 更新事件
   */
  updateIncident: (data: Incident & { id: number }) => {
    return Method('PATCH', alovaInstance, `/api/incident/${data.id}`, { data }) as any as Promise<Incident>;
  },

  /**
   * 关联告警到事件
   */
  associateAlerts: (params: { id: number, alertIds: number[] }) => {
    return Method('POST', alovaInstance, `/api/incident/${params.id}/associate-alerts`, { data: { alertIds: params.alertIds } }) as any as Promise<Incident>;
  },

  /**
   * 解决事件
   */
  resolveIncident: (params: { id: number }) => {
    return Method('POST', alovaInstance, `/api/incident/${params.id}/resolve`) as any as Promise<Incident>;
  },

  /**
   * 确认事件
   */
  acknowledgeIncident: (params: { id: number }) => {
    return Method('POST', alovaInstance, `/api/incident/${params.id}/acknowledge`) as any as Promise<Incident>;
  },

  /**
   * 删除事件
   */
  deleteIncident: (params: { id: number }) => {
    return Method('DELETE', alovaInstance, `/api/incident/${params.id}`) as any as Promise<void>;
  },
};