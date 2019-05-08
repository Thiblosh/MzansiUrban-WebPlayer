export class Notification {
  id: string;
  type: string;
  message: string;

  constructor(data: any) {
    this.type = data['type'];
    this.message = data['message'];

    //Create random id
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
