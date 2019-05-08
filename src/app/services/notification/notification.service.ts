import { Injectable } from '@angular/core';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  stack: Notification[] = [];

  constructor() { }

  create(type: string, message: string) {
    const notification = new Notification({ type: type, message: message });

    this.stack.push(notification);

    setTimeout(() => {
      this.stack = this.stack.filter((obj) => { obj['id'] !== notification['id'] });
    }, 10000);
  }

  remove(id: string): void {
    this.stack = this.stack.filter((obj) => { obj['id'] !== id });
  }

}
