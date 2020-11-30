import mitt from 'mitt';
import { Singleton } from 'typescript-ioc';

@Singleton
export class EventManager {

  static emitter =  mitt();

  public static emit(name: string, data: any) {
    this.emitter.emit(name, data);
  }

  public static subscribe(name: string, method: any) {
    this.emitter.on(name, method);
  }

  public static unsubscribe(name: string, method: any) {
    this.emitter.off(name, method);
  }

}