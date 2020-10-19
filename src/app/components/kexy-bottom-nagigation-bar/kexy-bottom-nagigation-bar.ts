import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { constants } from '../../../common/shared';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'kexy-bottom-nagigation-bar',
    templateUrl: 'kexy-bottom-nagigation-bar.html',
})
export class KexyBottomNagigationBarComponent {
    homeIcon = 'ios-home-outline';
    homeSelectedIcon = 'ios-home';
    messageIcon = 'ios-mail-outline';
    messageSelectedIcon = 'ios-mail';
    orderIcon = 'ios-cart-outline';
    orderSelectedIcon = 'ios-cart';
    contactsIcon = 'ios-paper-outline';
    contacsSelectedIcon = 'ios-paper';
    selectedClass = 'tr-selected';

    dashboardPage;
    messagePage;
    allContactsPage;
    placeOrderPage;
    organization;
    isRestaurant = true;

    @Input() selectedPage;

    constructor(public navCtrl: NavController, public storage: Storage) {}

    async ngAfterContentInit() {
        const appType = window.localStorage.getItem(constants.USER_APP_TYEP);
        if (appType === constants.DISPENSARY) {
            this.selectedClass += ' cannabis';
            this.dashboardPage = 'CannabisRestaurantDashboardPage';
            this.messagePage = 'CannabisMessagePage';
            this.allContactsPage = 'CannabisAllContactsPage';
            this.placeOrderPage = 'CannabisPlaceOrderPage';
        } else {
            this.dashboardPage = 'RestaurantDashboardPage';
            this.messagePage = 'MessagePage';
            this.allContactsPage = 'AllContactsPage';
            this.placeOrderPage = 'PlaceOrderPage';
        }
        this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
        if (this.organization.type !== constants.RESTAURANT) {
            this.isRestaurant = false;
        }

        if (this.selectedPage == 'home') {
            this.homeIcon = this.homeSelectedIcon;
        }
        if (this.selectedPage == 'message') {
            this.messageIcon = this.messageSelectedIcon;
        }
        if (this.selectedPage == 'order') {
            this.orderIcon = this.orderSelectedIcon;
        }

        if (this.selectedPage == 'contacts') {
            this.contactsIcon = this.contacsSelectedIcon;
        }
    }

    async bottomHomeBtnTapped() {
        //await this.navCtrl.setRoot(this.dashboardPage);
    }

    async bottomMessageBtnTapped() {
        //await this.navCtrl.setRoot(this.messagePage);
    }

    async bottomDistributorTapped() {
        //await this.navCtrl.setRoot(this.allContactsPage);
    }

    async bottomAddOrderTapped(type) {
        //await this.navCtrl.setRoot(this.placeOrderPage, { pageType: type });
    }
}
