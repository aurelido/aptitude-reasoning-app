import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private toastCtrl: ToastController) {}

  extractMessage(err: HttpErrorResponse): string {
    const backendMessage = (err.error?.error?.message || err.error?.message || err.message || '').toString();
    if (backendMessage) return backendMessage;
    if (err.status === 0) return 'Cannot reach server. Check your connection.';
    return `Request failed (${err.status})`;
  }

  async notify(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
