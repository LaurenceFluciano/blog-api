import { Repository } from "../core/repository/interface/repository.js";

export function generateTestText(repetitions: number): string {
  return "Texto de teste válido. ".repeat(repetitions);
}

export interface AbstractTestCreateFactory<
  R extends Repository<T, ID, F>, 
  T, 
  ID = any, 
  F = any
> {
  create(repository: R, obj: Partial<T>): Promise<T>;
}

