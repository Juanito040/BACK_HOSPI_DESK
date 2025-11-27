import { Area } from '../entities/Area';

export interface IAreaRepository {
  save(area: Area): Promise<Area>;
  findById(id: string): Promise<Area | null>;
  findAll(): Promise<Area[]>;
  findActiveAreas(): Promise<Area[]>;
  update(area: Area): Promise<Area>;
  delete(id: string): Promise<void>;
}
