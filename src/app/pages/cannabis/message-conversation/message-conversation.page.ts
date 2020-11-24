import { Component, OnInit, ViewChild } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  LoadingController,
  MenuController,
  NavController,
} from "@ionic/angular";
import { CameraService } from "../../../services/camera.service";
import { Observable } from "rxjs";
import { NodeSocketService } from "../../../services/node-socket.service";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-message-conversation",
  templateUrl: "./message-conversation.page.html",
  styleUrls: ["./message-conversation.page.scss"],
})
export class MessageConversationPage extends BasePage implements OnInit {
  @ViewChild("myMessages") content = IonContent;

  protected params: any;

  public newMessageContent: String = "";

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  progress: number = 0;

  currentUser: any = {};
  private inputToolbar: any;
  private inputMessage: any;

  conversation;

  message_list: any;
  online_user_list: any;
  subscriptionList: any;
  isTypingNewMessage: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private cameraService: CameraService,
    private nodeSocket: NodeSocketService,
    public actionSheetCtrl: ActionSheetController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });
    (async () => {
      await this._disableMenu();
      this.online_user_list = [];
      console.log("Convo", this.params.conversation);
      this.conversation = JSON.parse(this.params.conversation);
      if (!this.conversation) {
        await this.setRoot(routeConstants.CANNABIS.MESSAGE);
        return;
      }

      this.subscriptionList = [];
      await this._initFirebase(); // to make sure file upload will work
      this.message_list = [];
      this.currentUser = await this.storage.get(constants.STORAGE_USER);
      this.nodeSocket.setUserId(this.currentUser.id);
      let subscription;

      subscription = this.nodeSocket.event("message-list").subscribe(({ message_list }) => {
        console.log("(ws)> message-list", message_list);
        this.message_list = message_list;
        this.scrollToBottom(500);
      });

      this.subscriptionList.push(subscription);
      this.nodeSocket.subscribeToUserOnlineStatus((list) => (this.online_user_list = list));

      subscription = this.nodeSocket.event("new-message-queued").subscribe(({ message }) => {
        console.log("(ws)> new-message-queued", message);
        this.message_list.push(message);
        this.scrollToBottom(400);
      });

      this.subscriptionList.push(subscription);
    })();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave CONVERSATION");
    this.subscriptionList.forEach((subscription) => {
      subscription.unsubscribe();
      // this.nodeSocket.userListObserver.unsubscribe(subscription)
    });
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter CONVERSATION");

    this._loadMessages();
  }

  ionViewWillEnter() {
    this.inputToolbar = document.querySelector(".tr-input-toolbar");
    this.inputMessage = document.querySelector(".message-input");
  }

  async _loadMessages() {
    this.nodeSocket.emit("request-push", {
      event: "message-list",
      conversation_id: this.conversation.id,
    });
  }

  colorList = ["red", "green", "blue", "yellow", "cyan", "magenta"];

  public nameToColor(first_name, last_name) {
    let sum = String(first_name + last_name)
      .split("")
      .reduce((sum, value) => {
        return sum + value.charCodeAt(0);
      }, 0);
    return this.colorList[sum % this.colorList.length];
  }

  public nameToInitials(first_name, last_name) {
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
  }

  async _initFirebase() {
    // let uid = await this.kFire.getUid();
    // if (!uid) {
    //   this.navCtrl.setRoot(LoginPage);
    //   return
    // }
  }

  async _sendMessage(message, type = "text", file_original_name = null, file_mime_type = null) {
    this.nodeSocket.emit("send-message", {
      conversation_id: this.conversation.id,
      type,
      content: message,
      file_mime_type,
      file_original_name,
    });

    console.log(this.conversation);
    this.conversation.participant_list.forEach((participant) => {
      if (this.online_user_list.indexOf(participant.user_id) === -1) {
        console.log("SENDING NOTIFICATION", participant);
        this.callApi(
          apis.API_USER_SEND_PUSH_NOTIFICATION,
          {
            conversation_id: this.conversation.id,
            target_user_id: participant.user_id,
            notification_title: this.currentUser.first_name + " " + this.currentUser.last_name,
            notification_body: type === "text" ? message : "New file - " + file_original_name,
            notification_icon:
              "http://52.9.133.44/kexyapi/user-uploads/user/profile_photo/1547053867662840.png",
          },
          { shouldBlockUi: false }
        );
      }
    });
  }

  sendButtonTapped() {
    this.isTypingNewMessage = false;
    if (this.newMessageContent != "") this._sendMessage(this.newMessageContent, "text");
    this.resizeInputMessageFieldToOriginal();
    this.scrollToBottom(10);
    this.newMessageContent = "";
  }

  openFileDialog() {
    (<any>document.querySelector(".file-attach-input")).click();
  }

  async addParticipantsTapped() {
    await this.navigateTo(routeConstants.CANNABIS.ALL_CONTACTS, {
      conversation: this.conversation,
      mode: "add-participants", // TODO - Fix me all contacts page
    });
  }

  async fileSelected(event) {
    if (event.target.files.length === 0) {
      return;
    }

    let file = event.target.files[0];
    console.log(file);
    let type = "file";
    if (file.type.indexOf("image") > -1) {
      type = "image";
    }

    const blockedMimeList = ["application/javascript", "text/javascript", "text/html"];

    if (blockedMimeList.indexOf(file.type) > -1) {
      await this.showAwaitableAlert("Sorry!", "You can not send files of that type.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      await this.showAwaitableAlert(
        "Sorry!",
        "Please select a file of size not more than than 20MB."
      );
      return;
    }

    let filePath = "message-attachment/" + file.name;
    this.progress = 1;

    this.uploadPercent.subscribe((progress) => {
      this.progress = Math.ceil(progress);
      if (progress == 100) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    });
  }

  imageLoaded() {
    this.scrollToBottom(100);
  }

  async downloadContent(message) {
    console.log(message);
    // let url = await this.kFire.afStorage.storage.refFromURL(message.content).getDownloadURL();
    // window.open(url, '_system', 'location=yes');
  }

  photoTapped(link) {
    // console.log(event.target)
    // TODO - Fix me
    // let profileModal = this.modalCtrl.create("MessageConversationImagePreviewModalPage", { link });
    // profileModal.present();
  }

  onFocusInputMessage() {
    console.log("onfocus called");
    this.scrollToBottom(100);
  }

  resizeInputMessageField(event: any): void {
    this.isTypingNewMessage = this.newMessageContent !== "";
    let textarea: any = event.target;
    textarea.style.overflow = "hidden";
    textarea.style.height = "auto";
    let height = textarea.scrollHeight;
    textarea.style.height = height + "px";
    this.scrollToBottom(100);
  }

  resizeInputMessageFieldToOriginal() {
    if (this.inputToolbar != null) {
      this.inputToolbar.style.height = "70px"; // 70px is the default height.
    }
    if (this.inputMessage != null) {
      this.inputMessage.style.height = "auto";
    }
  }

  getName(message) {
    let obj = this.conversation.participant_list.find((u) => u.user_id === message.user_id);
    return obj.first_name;
  }

  scrollToBottom(delay = 100) {
    setTimeout(() => {
      if (this.content != null) {
        try {
          (<any>this.content).scrollToBottom();
        } catch (ex) {}
      }
    }, delay);
  }

  async showParticipantsTapped() {
    let message = this.conversation.participant_list
      .map((participant) => {
        return participant.first_name + " " + participant.last_name;
      })
      .join(", ");
    await this.showAwaitableAlert(
      this.conversation.participant_list.length + " Participants",
      message
    );
  }

  async cameraTapped() {
    let imageData = await this.cameraService.presentFileChooser();
    if (imageData) {
      console.log(imageData);
      let imageName = Date.now() + ".jpg";
      let self = this;
      let filePath = "message-attachment/" + imageName;
      // this.kFire.afStorage.ref(filePath).putString(String(imageData), 'base64').then(function (snapshot) {
      //   snapshot.ref.getDownloadURL().then((url) => {
      //     self.downloadURL = url;
      //     self._sendMessage(url, 'image', imageName, 'image/jpeg');
      //   });
      // });
    }
  }

  longPressCount: number = 0;
  longPressEnded() {
    this.longPressCount = 0;
  }

  async messageLongTapped(message: any) {
    console.log({ message });
    // This is to prevent showing multiple action sheet popup if user keep the button pressed more than we expect
    this.longPressCount++;
    if (this.longPressCount > 1) return;

    const actionSheet = await this.actionSheetCtrl.create({
      header: "",
      subHeader: "",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          handler: () => {
            console.log("Destructive clicked");
            this.deleteMessageTapped(message);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async deleteMessageTapped(message) {
    this.nodeSocket.emit("delete-message", {
      id: message.id,
    });
    await this._loadMessages();
  }
}
