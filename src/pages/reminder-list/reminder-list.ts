import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Reminder } from '../../models/reminder/reminder.module';
import { ReminderListProvider } from '../../providers/reminder-list/reminder-list';
import { ToastProvider } from '../../providers/toast/toast';


@IonicPage()
@Component({
  selector: 'page-reminder-list',
  templateUrl: 'reminder-list.html',
})
export class ReminderListPage implements OnInit {

  loader:any;
  reminderList$: Observable<Reminder[]>;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private reminderProvider: ReminderListProvider,
    private toast: ToastProvider) { }

  ngOnInit() {

    this.showLoading();

    this.reminderList$ = this.reminderProvider
    .getReminderList() // DB LIST
    // .valueChanges()
    .snapshotChanges() // Key and value
    .map(changes => {
      this.hideLoading();
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    
  }

  removeReminder(reminder: Reminder) {
    this.reminderProvider.removeReminder(reminder)
      .then(() => {
        this.toast.show('Reminder Deleted!');
      })
  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  hideLoading() {
    this.loader.dismiss();
  }


}
