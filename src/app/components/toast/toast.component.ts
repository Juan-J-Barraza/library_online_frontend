import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (ToastMessage & { id: number })[] = [];
  private toastSub!: Subscription;
  private nextId = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSub = this.toastService.toastState$.subscribe(msg => {
      const toast = { ...msg, id: this.nextId++ };
      this.toasts.push(toast);

      // Auto-remove after 4 seconds
      setTimeout(() => this.removeToast(toast.id), 4000);
    });
  }

  ngOnDestroy() {
    this.toastSub?.unsubscribe();
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
