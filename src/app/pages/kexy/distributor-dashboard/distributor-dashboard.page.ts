import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { constants, apis } from '../../../../common/shared';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-distributor-dashboard',
  templateUrl: './distributor-dashboard.page.html',
  styleUrls: ['./distributor-dashboard.page.scss'],
})
export class DistributorDashboardPage extends BasePage implements OnInit {
  uid: {};
  notificationCount: any;
  unreadMessageCount: any;
  private organization;

  public currentUser;
  online_user_list: any = [];
  conversation_list: any = [];
  conversation_list_backup: any = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    // private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
    this._setupNotificationCountUpdate();
   
  }
  _setupNotificationCountUpdate() {
    // this.kFire.afStore.collection('personal').doc(String(this.uid)).collection('notification').valueChanges().subscribe((list) => {
    //   list = list.filter(item => !item.isRead)
    //   this.notificationCount = list.length;
    // })
  }

  async _getDashboardData() {
    this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
    console.log(this.organization.type);
    let res = await this.callApi(apis.API_USER_GET_DASHBOARD_DATA, {}, { shouldBlockUi: false });
    if (!res.success) return;
    // this.unreadMessageCount = res.data.unread_message;
  }



  // _setupWebSocketApis() {
  //   console.log("(ws)> Setting up APIs.");
  //   this.socket.removeAllListeners('conversation-list-updated');
  //   this.socket.on('conversation-list-updated', ({ conversation_list }) => {
  //     console.log('(ws)> conversation-list-updated', conversation_list);
  //     // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  //     // conversation_list.forEach(conversation => {
  //     //   console.log(conversation.updated_at, conversation.id);
  //     // });
  //     // 'TEST'
  //     conversation_list.sort((a, b) => {
  //       if (b.updated_at === a.updated_at) return b.id - a.id;
  //       return Date.parse(b.updated_at) - Date.parse(a.updated_at);
  //     });
  //     // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
  //     // conversation_list.forEach(conversation => {
  //     //   console.log(conversation.updated_at, conversation.id);
  //     // });
  //     this.conversation_list = conversation_list;
  //     this.conversation_list_backup = conversation_list;
  //     this.unreadMessageCount = this.conversation_list.filter(c => c.unread_message_count > 0).length;
  //   });
  //   this._loadConversations();

  //   this.socket.removeAllListeners('global-online');
  //   this.socket.on('global-online', (user_id) => {
  //     let i = this.online_user_list.indexOf(user_id);
  //     if (i === -1) this.online_user_list.push(user_id);
  //     console.log('online_user_list', this.online_user_list)
  //   });

  //   this.socket.removeAllListeners('global-offline');
  //   this.socket.on('global-offline', (user_id) => {
  //     let i = this.online_user_list.indexOf(user_id);
  //     if (i > -1) this.online_user_list.splice(i, 1);
  //     console.log('online_user_list', this.online_user_list)
  //   });

  //   this.socket.removeAllListeners('online-list');
  //   this.socket.on('online-list', (user_list) => {
  //     this.online_user_list = user_list.map(i => parseInt(String(i)));
  //     console.log('online_user_list', this.online_user_list)
  //   });
  //   this.socket.emit('request-push', { event: 'online-list' });
  // }

  /** FIXME needing to duplicate everywhere */
  // _setupWebSocket() {
  //   const onConnection = () => {
  //     console.log('onConnection');
  //     this.socket.emit('subscribe', { user_id: this.currentUser.id });
  //   };
  //   const onSubscribe = () => {
  //     console.log('onSubscribe');
  //     this._setupWebSocketApis();
  //   }
  //   this.socket.on('connection', onConnection);
  //   this.socket.on('subscribed', onSubscribe);
  //   if (this.socket.ioSocket.connected) {
  //     console.log("(ws)> Socket already connected.");
  //     onSubscribe();
  //   } else {
  //     console.log("(ws)> Socket not connected. Trying to connect.");
  //     this.socket.connect();
  //   }
  // }

  // async _loadConversations() {
  //   this.socket.emit('request-push', { event: 'conversation-list-updated' });
  //   if (this.conversation_list_backup.length === 0) {
  //     window.setTimeout(() => { this._loadConversations() }, 5000); // not sure why it's necessary
  //   }
  // }



  async ionViewDidEnter() {
    this.currentUser = await this.storage.get(constants.STORAGE_USER);

    this._enableDistributorMenu();
    this._getDashboardData();
    // this._setupWebSocket();

  }

  addAnotherRestaurant() {
   
      this.navigateTo(routeConstants.KEXY.MY_RESTAURANTS)

  }

  private addAnotherRep(): void {
    this.navigateTo(routeConstants.KEXY.INVITE_DISTRIBUTOR_EMPLOYEE,{
      distributor_id: this.organization.distributor_id,
      from_page: 'my_restaurant'
    })
   }

  messagesTapped() {
 
    this.navigateTo(routeConstants.KEXY.MESSAGE);

  }

  public contactBtnTapped(): void {
     this.navigateTo(routeConstants.KEXY.ALL_CONTACTS);

  }

  restaurantBarTapped() {
   
    this.navigateTo(routeConstants.KEXY.MY_RESTAURANTS)

  }

  // notificationTapped() {
  //   this.navCtrl.push("NotificationsPage");
  // }

  // public inProgress() {
  //   this.showAwaitableAlert("Coming Soon!", "We are working hard to get it ready for you!");
  // }

  public invitePeopleTapped() {
 
    this.navigateTo(routeConstants.KEXY.INVITE_PEOPLE)
  
  }


  public myOrdersTapped() {

    this.navigateTo(routeConstants.KEXY.DISTRIBUTOR_REP_ORDERS);
  
  }
}
