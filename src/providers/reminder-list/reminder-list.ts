import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";

import { Reminder } from "../../models/reminder/reminder.module";

@Injectable()
export class ReminderListProvider {

  private reminderListRef = this.db.list<Reminder>('reminder-list');

  constructor(private db: AngularFireDatabase) { }

  getReminderList() {
    return this.reminderListRef;
  }

  addReminder(reminder: Reminder) {
    return this.reminderListRef.push(reminder);
  }

  updateReminder(reminder: Reminder) {
    return this.reminderListRef.update(reminder.key, reminder);
  }

  removeReminder(reminder: Reminder) {
    return this.reminderListRef.remove(reminder.key);
  }
}