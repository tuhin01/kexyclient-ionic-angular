import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

import { getConfig } from "../../common/config";


@Injectable({
  providedIn: 'root'
})
export class NodeSocketService {

  private user_id: any = null;
  private isSubscribed = false;
  private endPointList: { eventName: string; propertyName: string; observable }[];
  private requestQueue: { eventName: string; data: object }[];
  userListObserver: any;
  __notify: () => void;
  messageLog: string;
  private socket: any;

  constructor(public alertCtrl: AlertController, public storage: Storage, ) {
    console.log('(NodeSocketProvider)> Constructor');
    this._message('(NodeSocketProvider)> Constructor');
    //setTimeout(() => {
    this.__conn();
    //}, 1);
  }

  __conn() {

    console.log('(NodeSocketProvider)> Provider Created');
    this._message('(NodeSocketProvider)> Provider Created.');

    let url = getConfig().socketUri;
    // 'https://api.getkexy.com:3001';
    // let url = 'http://localhost:3001';
    this.socket = io(url, {
      forceNew: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      // transports: ['polling', 'websocket']
      transports: ['polling']
    });

    this.messageLog = '';
    this.endPointList = [
      { eventName: 'conversation-list-updated', propertyName: '...', observable: null },
      { eventName: 'new-conversation-created', propertyName: '...', observable: null },
      { eventName: 'online-list', propertyName: '...', observable: null },
      { eventName: 'message-list', propertyName: '...', observable: null },
      { eventName: 'new-message-queued', propertyName: '...', observable: null }
    ];

    this.requestQueue = [];


    this.socket.on('connect', () => this.onConnect());
    this.socket.on('reconnect', () => this.onReconnect());
    this.socket.on('disconnect', () => this.onDisconnect());

    this.socket.on('error', (err) => {
      console.log('(NodeSocketProvider)> Socket Error', JSON.stringify(err));
      this._message('(NodeSocketProvider)> Socket Error' + JSON.stringify(err));
    })


    this.socket.on('connect_error', (err) => {
      console.log('(NodeSocketProvider)> Socket connect_error', JSON.stringify(err));
      this._message('(NodeSocketProvider)> Socket connect_error' + JSON.stringify(err));
    })



    this.initEndpoints();
    this.initMaintainOnlineList();

    this.socket.connect();
    //window.setTimeout(() => this._setUpReconnector(), 30000);

  }


  public _setUpReconnector() {
    console.log('(NodeSocketProvider)> Socket Manually Trying to Disconnect.');
    this._message('(NodeSocketProvider)> Socket Manually Trying to Disconnect.');

    this.socket.disconnect();
    this.socket.connect();
    window.setTimeout(() => this._setUpReconnector(), 30000);
  }

  public setUserId(user_id) {
    if (this.user_id === user_id && this.isSubscribed) return;
    console.log(`(NodeSocketProvider)> user_id SET TO ${user_id}`);
    this._message(`(NodeSocketProvider)> user_id SET TO ${user_id}`);
    this.isSubscribed = false;
    this.user_id = user_id;
    this.subscribeToRemote();
  }

  public get isConnected() {
    return this.socket.connected;
  }

  private processRequestQueue() {
    if (!this.isSubscribed) return;
    this.requestQueue.forEach(({ eventName, data }) => {
      console.log(`(NodeSocketProvider)> Emitting ${eventName}`, data);
      this._message(`(NodeSocketProvider)> Emitting ${eventName} - ${data}`);
      this.socket.emit(eventName, data);
    });
    this.requestQueue = [];
  }

  private subscribeToRemote() {
    if (!this.user_id) return;
    if (this.isSubscribed) return;
    this.socket.once('subscribed', () => {
      console.log('(NodeSocketProvider)> Subscription Acquired.');
      this._message('(NodeSocketProvider)> Subscription Acquired.');
      this.isSubscribed = true;
      this.processRequestQueue();
    });
    console.log('(NodeSocketProvider)> Subscription Requested.');
    this._message('(NodeSocketProvider)> Subscription Requested.');
    this.socket.emit('subscribe', { user_id: this.user_id }, (res) => {
      console.log('(NodeSocketProvider)> Subscription Requested: RES.', res);
      this._message('(NodeSocketProvider)> Subscription Requested. RES' + JSON.stringify(res));
    });
  }

  private onConnect() {
    console.log('(NodeSocketProvider)> Socket Connected.');
    this._message('(NodeSocketProvider)> Socket Connected.');
    this.subscribeToRemote();
  }

  private _message(message) {
    // this.messageLog = String(message) + '<br><br>' + this.messageLog;
    // this.messageLog = this.messageLog.slice(0, 500);
    // console.log("new message", message);
    this.storage.get('SHOULD_DEBUG').then((now) => {
      // console.log('now', now);
      if (now === "YES") {
        // let alert = this.alertCtrl.create({
        //   title: '',
        //   subTitle: '',
        //   message: this.messageLog,
        //   buttons: [{
        //     text: 'Ok',
        //   }]
        // });
        // alert.present();
        //alert(message);
      }
    });


  }

  private onReconnect() {
    console.log('(NodeSocketProvider)> Socket Reconnected.');
    this._message('(NodeSocketProvider)> Socket Reconnected.');
    // NOTE socket.connect() is automatically called.
  }

  private onDisconnect() {
    console.log('(NodeSocketProvider)> Socket Disconnected.');
    this._message('(NodeSocketProvider)> Socket Disconnected.');
    this.isSubscribed = false;
  }

  private initEndpoints() {
    console.log('(NodeSocketProvider)> Setting up Endpoints');
    this._message('(NodeSocketProvider)> Setting up Endpoints qwqw');

    this.endPointList.forEach(endPoint => {

      endPoint.observable = Observable.create((observer) => {
        this.socket.on(endPoint.eventName, (data) => {
          console.log(`(NodeSocketProvider)> Received: "${endPoint.eventName}"`);
          this._message(`(NodeSocketProvider)> Received: "${endPoint.eventName}"`);
          observer.next(data);
        });
      }).share();

    });
  }

  public subscribeToUserOnlineStatus(cbfn) {
    this.userListObserver.subscribe(cbfn);
    this.__notify();
  }

  private initMaintainOnlineList() {

    this.userListObserver = Observable.create(observer => {

      let online_user_id_list = [];

      this.__notify = () => {
        // this.online_user_id_list = online_user_id_list;
        console.log('(NodeSocketProvider)> online_user_id_list:', online_user_id_list);
        //this._message(`(NodeSocketProvider)> online_user_id_list:. ${online_user_id_list}`);
        observer.next(online_user_id_list);
      }

      this.socket.on('global-online', (user_id) => {
        console.log('(NodeSocketProvider)> global-online:', user_id);
        let i = online_user_id_list.indexOf(user_id);
        if (i === -1) {
          online_user_id_list.push(user_id);
          this.__notify();
        }
      });

      this.socket.on('global-offline', (user_id) => {
        console.log('(NodeSocketProvider)> global-offline:', user_id)
        let i = online_user_id_list.indexOf(user_id);
        if (i > -1) {
          online_user_id_list.splice(i, 1);
          this.__notify();
        }
      });

      this.socket.on('online-list', (user_list) => {
        let new_online_user_id_list = user_list.map(i => parseInt(String(i)));

        let array1 = new_online_user_id_list;
        let array2 = online_user_id_list;
        if (!(array1.length === array2.length && array1.every((value, index) => value === array2[index]))) {
          online_user_id_list = new_online_user_id_list;
          this.__notify();
        }
      });

      this.emit('request-push', { event: 'online-list' });

    }).share();

  }

  public event(eventName) {
    let endPoint = this.endPointList.find(e => e.eventName === eventName);
    if (!endPoint) throw new Error("Invalid Endpoint Name Provided");
    return endPoint.observable;
  };

  public emit(eventName, data) {
    // let endPoint = this.endPointList.find(e => e.eventName === eventName);
    // if (!endPoint) throw new Error("Invalid Endpoint Name Provided");
    this.requestQueue.push({ eventName, data });
    this.processRequestQueue();
  }

}
