import {Component, Input} from '@angular/core';
import {Toast} from '../../../models/toast.model';
import {NgClass} from '@angular/common';
import {NotificationService} from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-toast',
  imports: [
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() toast: Toast = { toastId: '', message: '', type: 'success' };

constructor(private notificationService: NotificationService) {
}

  removeToast() {
    this.notificationService.removeToast(this.toast.toastId);
  }
}
