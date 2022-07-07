import { Injectable, NgZone } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { PanelService } from '../panel/panel.service';
import { UserService } from '../user/user.service';
import { UtilityService } from '../utility/utility.service';
declare var $: any;

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private panelService: PanelService,
    private userService: UserService,
    private utilityService: UtilityService,
    private routes: Router,
    private zone: NgZone) {
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   })

    this.angularFireMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        _messaging.onBackgroundMessage = _messaging.onBackgroundMessage.bind(_messaging);
      });
  }

  requestPermission() {
    console.log('requestPermission call hua');
    this.angularFireMessaging
      .requestToken
      .subscribe((token) => {
        console.log("User's FCM Token is:");
        console.log(token);
        if (token) {
          this.userService.userFcmToken = token;
          this.panelService
            .saveFcmToken(token)
            .subscribe(data => {
              console.log('User fcm token saved sucessfully.');
              console.log(data);
            }, error => {
              console.log('Error while saving user\'s fcm token');
              console.log(error);
            });
        }
      }, (err) => {
        console.error('Unable to get permission to notify.', err);
      }
      );
  }

  receiveMessage() {
    console.log('receiveMessage called.');
    this.angularFireMessaging
      .messages
      .subscribe((payload) => {
        console.log("new message received. ");
        console.log(payload);
        this.currentMessage.next(payload);
        this.showNotification(payload);
        this.fetchAllUnreadNotificationsAndAutoRefersh();
      }, error => {
        console.log("error occured", error);
      })
  }

  showNotification(payload) {
    console.log("showNotification called.");
    let permission = Notification.permission;
    console.log("permission");
    console.log(permission);

    if (permission !== 'granted') return;

    let notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: 'assets/assets/images/text_editor_logo2.png'
    });

    notification.onclick = () => {
      this.zone.run(() => {
        console.log('onclick');
        this.routes.navigate(['notifications']);
      });

    };
  }

  fetchAllUnreadNotificationsAndAutoRefersh() {
    console.log('fetchAllUnreadNotifications2 called');

    this.panelService.getAllUnreadNotifications().subscribe(
      (data) => {
        console.log('fetchAllUnreadNotifications api response');

        this.utilityService.unreadNotificationsCount = data.length;
        this.utilityService.allUnreadNotificationsData = data;

        console.log("this.allUnreadNotificationsData");
        console.log(this.utilityService.allUnreadNotificationsData);
      },
      (error) => {
        console.log('fetchAllUnreadNotifications2 api error');
        console.log(error);
      });
  }

}
