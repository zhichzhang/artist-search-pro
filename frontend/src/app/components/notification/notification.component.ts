import { Component } from '@angular/core';
import {ToastComponent} from './toast/toast.component';
import {Toast} from '../../models/toast.model';
import {NotificationService} from '../../core/services/notification/notification.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    ToastComponent,
    NgForOf
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  toasts: Toast[] = [];

  constructor(private notificationService: NotificationService) {
    this.notificationService.toasts$.subscribe(toasts => this.toasts = toasts);
  }
}
