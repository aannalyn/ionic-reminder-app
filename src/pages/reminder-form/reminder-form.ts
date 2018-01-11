import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Reminder } from '../../models/reminder/reminder.module';
import { ReminderListProvider } from '../../providers/reminder-list/reminder-list';
import { ToastProvider } from '../../providers/toast/toast';

import { format } from 'date-fns';

@IonicPage()
@Component({
  selector: 'page-reminder-form',
  templateUrl: 'reminder-form.html',
})
export class ReminderFormPage {

  mode: string;
  dateFormat:string = 'MMM DD, YYYY hh:mm A';
  reminder: Reminder = {
    reminder: '',
    date: null,
    notifID: 0
  }

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private localNotification: LocalNotifications,
    private reminderProvider: ReminderListProvider,
    private toast: ToastProvider) { }

  ionViewWillLoad() {
    this.mode = this.navParams.get('mode') || 'add';
    if (this.mode == 'update') {
      this.reminder = this.navParams.get('reminder'); 
    } else {
      let dateNow = format(new Date());
      this.reminder = {
        reminder: '',
        date: dateNow,
        notifID: 0
      };
    }
  }

  onClick(mode, reminder) {
    if (mode == 'update') {
      this.updateReminder(reminder);
    } else {
      this.addReminder(reminder);
    }
  }

  addReminder(reminder: Reminder) {
    let notifID = new Date().getTime();
    reminder['notifID'] = notifID;

    this.reminderProvider.addReminder(reminder).then(ref => {
      this.toast.show('Reminder Added!');

      if (this.platform.is('cordova')) {
        this.localNotification.registerPermission().then(res => {
          this.localNotification.schedule({ id: reminder.notifID, at: new Date(reminder.date).setSeconds(0), text: reminder.reminder });
        });
      }

     this.navCtrl.setRoot('ReminderListPage', { key: ref.key });
    });

  }

  updateReminder(reminder: Reminder) {
    this.reminderProvider.updateReminder(reminder).then(() => {
      this.toast.show('Reminder Updated!');

      if (this.platform.is('cordova')) {
        this.localNotification.registerPermission().then(res => {
          this.localNotification.isPresent(reminder.notifID).then(isPresent => {
            if (isPresent) {
              this.localNotification.update({id: reminder.notifID, at: new Date(reminder.date).setSeconds(0), text: reminder.reminder });
            } else {
              this.localNotification.schedule({ id: reminder.notifID, at: new Date(reminder.date).setSeconds(0), text: reminder.reminder });
            }
          });
        });
      }

      this.navCtrl.setRoot('ReminderListPage');
    });

  }


}
