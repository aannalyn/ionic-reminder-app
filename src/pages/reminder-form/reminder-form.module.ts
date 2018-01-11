import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReminderFormPage } from './reminder-form';

@NgModule({
  declarations: [
    ReminderFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ReminderFormPage),
  ],
})
export class ReminderFormPageModule {}
