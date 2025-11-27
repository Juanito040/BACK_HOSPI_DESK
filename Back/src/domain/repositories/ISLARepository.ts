import { SLA } from '../entities/SLA';
import { Priority } from '../value-objects/Priority';

export interface ISLARepository {
  save(sla: SLA): Promise<SLA>;
  findById(id: string): Promise<SLA | null>;
  findByAreaAndPriority(areaId: string, priority: Priority): Promise<SLA | null>;
  findByArea(areaId: string): Promise<SLA[]>;
  findAll(): Promise<SLA[]>;
  update(sla: SLA): Promise<SLA>;
  delete(id: string): Promise<void>;
}
