
export type IEventHandler = (...args: any[]) => void;

export interface IEventEmitter {
  on(name: string, handler: IEventHandler): this;
  off(name: string, handler: IEventHandler): this;
  emit(name: string, ...args: any[]): boolean;
}