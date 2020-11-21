import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { CameraService } from "../../../services/camera.service";
import { NodeSocketService } from "../../../services/node-socket.service";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-all-contacts",
  templateUrl: "./all-contacts.page.html",
  styleUrls: ["./all-contacts.page.scss"],
})
export class AllContactsPage extends BasePage implements OnInit {
  protected params: any;
  public currentUser;
  public restaurant_search_string: any;
  public distributor_supplier_search_string: any;
  public restaurant_contact_list = [];
  public restaurant_contact_list_backup = [];
  public distributor_supplier_contact_list = [];
  public distributor_supplier_contact_list_backup = [];
  public selected_contact_list: any = [];
  public selected_conversation_list: any = [];
  public conversation_list: any = [];
  public conversation_list_backup: any = [];
  public isInGroupSelectionMode: boolean = false;
  public preExistingConversation: any = null;
  public loadingDialog: any = null;
  public isConversationListEmptyBecauseOfSearchResult: boolean = false;
  public shouldIgnoreNextPageLeave: boolean;
  public online_user_list: any;
  public contactSide: string = "restaurant_bar";

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private nodeSocket: NodeSocketService
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
      await this._enableRestaurantMenu();

      this.online_user_list = [];
      this.contactSide = "restaurant_bar";
      this.currentUser = await this.storage.get(constants.STORAGE_USER);
      this.nodeSocket.setUserId(this.currentUser.id);
      this.nodeSocket.event("conversation-list-updated").subscribe(({ conversation_list }) => {
        conversation_list = conversation_list.filter(({ should_show }) => should_show);
        conversation_list.sort((a, b) => {
          if (b.updated_at === a.updated_at) {
            return b.id - a.id;
          }
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        });
        this.conversation_list = conversation_list;
        this.conversation_list_backup = conversation_list;
        this.distributorSearchStringChanged();
      });

      (<any>window).openedConversationIdAndTimestampList = [];
      this.nodeSocket.event("new-conversation-created").subscribe((conversation) => {
        let entry = (<any>window).openedConversationIdAndTimestampList.find((entry) => {
          return entry.conversation_id === conversation.id && Date.now() - entry.timestamp < 1000;
        });
        if (!entry) {
          (<any>window).openedConversationIdAndTimestampList.push({
            conversation_id: conversation.id,
            timestamp: Date.now(),
          });

          if (this.isInGroupSelectionMode) {
            this.isInGroupSelectionMode = false;
            // TODO - Fix me
            // this.navCtrl.push("MessageConversationPage", { conversation });
          } else {
            // TODO - Fix me
            // this.navCtrl.push("MessageConversationPage", { conversation });
          }
        }
      });

      this.nodeSocket.subscribeToUserOnlineStatus((list) => (this.online_user_list = list));

      await this._loadContacts("restaurant", true);
      await this._loadContacts("distributor", false);
    })();
  }

  ionViewWillLeave() {
    if (this.loadingDialog) {
      this.loadingDialog.dismiss();
      this.loadingDialog = null;
    }
  }

  async _loadContacts(type, blockUi = true) {
    let res = await this.callApi(
      apis.API_ALL_CONTACTS_BY_ORG,
      { org_type: type },
      { shouldBlockUi: blockUi }
    );
    if (!res.success) {
      return;
    }
    let list = res.data;
    list.filter((org) => {
      let contactList = org.employee;
      contactList.filter((contact) => contact.user_id !== this.currentUser.id);
      contactList.forEach((contact) => (contact.onlinseStatus = { isOnline: false }));
      contactList.forEach((contact) => {
        if (contact.logo_image_url == "") {
          contact.no_logo_name = "TK";
        }
      });
    });
    if (type === "restaurant") {
      this.restaurant_contact_list = list;
      this.restaurant_contact_list_backup = list;
    } else if (type === "distributor") {
      this.distributor_supplier_contact_list = list;
      this.distributor_supplier_contact_list_backup = list;
    }
  }

  groupSelectionStartTapped() {
    this.isInGroupSelectionMode = true;
  }

  async groupSelectionCancelTapped() {
    await this.navCtrl.pop();
    this.isInGroupSelectionMode = false;
    this.selected_contact_list = [];
    this.selected_conversation_list = [];
  }

  async addParticipantsTapped() {
    this.isInGroupSelectionMode = true;
    this.preExistingConversation = [];
  }

  groupSelectionConfirmTapped() {
    if (this.preExistingConversation) {
      this.selected_conversation_list.push(this.preExistingConversation);
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    let participant_id_list = this.selected_contact_list.map((contact) => contact.user_id);
    if (!this.preExistingConversation) {
      this.selected_conversation_list.forEach((conversation) => {
        conversation.participant_list.forEach((participant) => {
          participant_id_list.push(participant.user_id);
        });
      });
    }
    participant_id_list = participant_id_list
      .filter(onlyUnique)
      .filter((participant) => participant.user_id !== this.currentUser.id);

    this.nodeSocket.emit("begin-conversation", {
      participant_id_list,
    });
    this.selected_contact_list = [];
    this.selected_conversation_list = [];
  }

  restaurantSearchCanceled() {
    this.restaurant_contact_list = this.restaurant_contact_list_backup;
  }

  async restaurantSearchStringChanged() {
    if (this.restaurant_search_string === "") {
      this.restaurantSearchCanceled();
    }

    this.restaurant_contact_list = this.restaurant_contact_list_backup.filter((restaurant) => {
      if (restaurant.employee.length > 0) {
        return restaurant.employee.some((contact) => {
          let regex = new RegExp(this.restaurant_search_string, "i");
          return (
            regex.test(contact.company_name) ||
            regex.test(contact.first_name) ||
            regex.test(contact.last_name)
          );
        });
      }
    });
  }

  distributorSearchCanceled() {
    this.distributor_supplier_contact_list = this.distributor_supplier_contact_list_backup;
  }

  async distributorSearchStringChanged() {
    if (this.distributor_supplier_search_string === "") {
      this.restaurantSearchCanceled();
    }

    this.distributor_supplier_contact_list = this.distributor_supplier_contact_list_backup.filter(
      (distributor_supplier) => {
        if (distributor_supplier.employee.length > 0) {
          return distributor_supplier.employee.some((contact) => {
            let regex = new RegExp(this.distributor_supplier_search_string, "i");
            return (
              regex.test(contact.company_name) ||
              regex.test(contact.first_name) ||
              regex.test(contact.last_name)
            );
          });
        }
      }
    );
  }

  public nameToInitials(first_name, last_name) {
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
  }

  async contactTapped(ev, contact) {
    ev.preventDefault();
    if (this.isInGroupSelectionMode) {
      let index = this.selected_contact_list.indexOf(contact);
      if (index > -1) {
        this.selected_contact_list.splice(index, 1);
      } else {
        this.selected_contact_list.push(contact);
      }
    } else {
      this._startConversation(contact);
    }
  }

  _startConversation(contact) {
    this.nodeSocket.emit("begin-conversation", { participant_id_list: [contact.user_id] });
    this.loadingDialog = this.loadingCtrl.create({
      spinner: "crescent",
      message: "Talking to the server. Please wait.",
    });
    this.loadingDialog.present();
  }

  shouldShowContactDialog: boolean = false;
  selectedContact: any;

  async showContactInfo(event, contact: any) {
    event.stopPropagation();
    this.selectedContact = contact;
    this.shouldShowContactDialog = true;
  }

  async closeContactDialog() {
    this.shouldShowContactDialog = false;
  }
}
