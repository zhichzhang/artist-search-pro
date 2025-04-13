import { Injectable } from '@angular/core';
import {Toast} from '../../../models/toast.model';
import {BehaviorSubject} from 'rxjs';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsList: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  constructor() { }

  getToasts() {
    return this.toastsSubject.getValue();
  }

  addToast(newToast: Toast) {
    console.log(JSON.stringify(newToast));
    this.toastsList.unshift(newToast);
    this.toastsSubject.next(this.toastsList);

    setTimeout(() => this.removeToast(newToast.toastId), 3000);
  }

  public addSuccessMessage(message: string): void {
    this.addToast({
      toastId: uuidv4(),
      message: message,
      type: 'success'
    });
  }

  public addErrorMessage(message: string): void {
    this.addToast({
      toastId: uuidv4(),
      message: message,
      type: 'error'
    });
  }

  removeToast(toastId: string) {
    this.toastsList = this.toastsList.filter((toast) => toast.toastId !== toastId);
    this.toastsSubject.next(this.toastsList);
  }
}
