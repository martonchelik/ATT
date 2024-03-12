import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import TypedLocalStore, {
  MemoryStorage,
  RetrievalMode,
} from 'typed-local-store';

@Injectable({
  providedIn: 'root',
})
export class StorageService<T> {
  readonly retrievealMode: RetrievalMode = 'safe';
  storage: TypedLocalStore<T>;
  private valueUpdateMap: Map<keyof T, Subject<T[keyof T] | null>> = new Map();

  constructor() {
    const memoryStorage = new MemoryStorage();
    this.storage = new TypedLocalStore<T>({
      fallbackStorage: memoryStorage,
    });
  }

  setItem<K extends keyof T>(key: K, value: T[K]): void {
    this.storage.setItem(key, value);

    if (!this.valueUpdateMap.has(key)) {
      this.valueUpdateMap.set(key, new Subject<T[keyof T] | null>());
    }

    const updatedValue = this.getItem(key);
    this.valueUpdateMap.get(key)?.next(updatedValue);
  }

  getItem<K extends keyof T>(key: K): T[K] | null {
    return this.storage.getItem(key, this.retrievealMode);
  }


  getItemObservable(key: keyof T): Observable<T[keyof T] | null> {
    if (!this.valueUpdateMap.has(key)) {
      this.valueUpdateMap.set(key, new Subject<T[keyof T] | null>());
    }

    return new Observable<T[keyof T] | null>((observer) => {

      const currentValue = this.getItem(key);
      observer.next(currentValue);

      const subject = this.valueUpdateMap.get(key)!;
      const subscription = subject.subscribe((value) => {
        observer.next(value);
      });

      return () => {
        subscription;
      };
    });
  }

  clear() {
    this.storage.clear();
    this.valueUpdateMap.forEach((value) => value.next(null));
  }
}
