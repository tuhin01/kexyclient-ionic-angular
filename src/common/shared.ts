
export const constants = {
  USER_APP_TYEP: 'user_app_type',
  RESTAURANT: 'restaurant',
  INVENTORY: 'inventory',
  ORDER: 'order',
  DISPENSARY: 'dispensary',
  STORAGE_USER: 'user',
  STORAGE_TOKEN: 'kexytoken',
  STORAGE_ORGANIZATION: 'organization',
  ORGANIZATION_TYPE_RESTAURANT: 'restaurant',
  ORGANIZATION_TYPE_DISTRIBUTOR: 'distributor',
  ORGANIZATION_TYPE_SUPPLIER: 'supplier',
  IS_INVITED: 'is_invited',
  IS_JOIN_TYPE: 'is_join_type',
  JOIN_TO_ORG: 'join_to_org',
  USER_SETTINGS: 'user_settings',
  JOB_TITLE: 'job_title',
  RESTAURANT_MENU: 'restaurantMenu',
  SUPPLIER_MENU: 'supplierMenu',
  DISTRIBUTOR_MENU: 'distributorMenu',
};



export interface ApiOptions {
  path: String,
  requiresAuthentication: Boolean
}

export class ApiDef {
  public path: String;
  public requiresAuthentication: Boolean;
  constructor(public options: ApiOptions) {
    this.path = options.path;
    this.requiresAuthentication = options.requiresAuthentication;
  }
}

export const apis = {
  API_USER_SEND_CONFIRMATION_CODE: new ApiDef({
    path: "user/sendConfirmationCode",
    requiresAuthentication: false
  }),

  API_USER_SEND_INVITATION_CONFIRMATION_CODE: new ApiDef({
    path: "user/sendInvitationConfirmationCode",
    requiresAuthentication: false
  }),
  API_GET_LIST_INVITED_USER: new ApiDef({
    path: "user/listInvitations",
    requiresAuthentication: true
  }),

  API_USER_VERIFY_CONFIRMATION_CODE: new ApiDef({
    path: "user/verifyConfirmationCode",
    requiresAuthentication: false
  }),

  API_USER_VERIFY_INVITATION_CONFIRMATION_CODE: new ApiDef({
    path: "user/verifyInvitationConfirmationCode",
    requiresAuthentication: false
  }),

  API_USER_REGISTER: new ApiDef({
    path: "user/register",
    requiresAuthentication: false
  }),

  API_USER_LOGIN: new ApiDef({
    path: "user/login",
    requiresAuthentication: false
  }),

  API_USER_MOBILE_LOGIN: new ApiDef({
    path: "user/mobileLogin",
    requiresAuthentication: false
  }),

  API_CREATE_USER_IN_WEBSITE: new ApiDef({
    path: "user/createUserInKexyWebsite",
    requiresAuthentication: true
  }),

  API_USER_EDIT_PROFILE: new ApiDef({
    path: "user/editProfile",
    requiresAuthentication: true
  }),

  API_USER_EDIT_EMAIL_PASSWORD: new ApiDef({
    path: "user/updateEmailAddress",
    requiresAuthentication: true
  }),

  API_USER_CLAIM_ACCOUNT: new ApiDef({
    path: "user/claimUserAccount",
    requiresAuthentication: true
  }),

  API_USER_CHANGE_PASSWORD: new ApiDef({
    path: "user/changePassword",
    requiresAuthentication: true
  }),

  API_USER_REQUEST_PASSWORD_RECOVERY_CODE: new ApiDef({
    path: "user/requestPasswordRecoveryCode",
    requiresAuthentication: false
  }),

  API_USER_VERIFY_PASSWORD_RECOVERY_CODE: new ApiDef({
    path: "user/verifyPasswordRecoveryCode",
    requiresAuthentication: false
  }),

  API_DISTRIBUTOR_CREATE: new ApiDef({
    path: "distributor/create",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_EDIT: new ApiDef({
    path: "distributor/edit",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_LIST_ALL_RESTAURANTS: new ApiDef({
    path: "distributor/listAllRestaurants",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_SELECT_RESTAURANTS: new ApiDef({
    path: "distributor/selectRestaurants",
    requiresAuthentication: true
  }),

  // TODO: Favorite and not favourite
  API_DISTRIBUTOR_DELETE_FAVOURITE_RESTAURANTS: new ApiDef({
    path: "distributor/deleteFavouriteRestaurants",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_INVITE_RESTAURANTS: new ApiDef({
    path: "distributor/inviteRestaurants",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_INVITE_EMPLOYEES: new ApiDef({
    path: "distributor/inviteEmployees",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_All_ORDERS: new ApiDef({
    path: "distributor/getAllOrders",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_ORDER_DETAILS: new ApiDef({
    path: "distributor/getOrderDetails",
    requiresAuthentication: true
  }),

  API_DISTRIBUTOR_CONFIRM_ORDER: new ApiDef({
    path: "distributor/confirmOrder",
    requiresAuthentication: true
  }),

  API_USER_GET_USER_FOR_CHAT: new ApiDef({
    path: "user/getUserForChat",
    requiresAuthentication: true
  }),

  API_USER_GET_USER_ORGANIZATIONS: new ApiDef({
    path: "user/getUserOrganizations",
    requiresAuthentication: true
  }),
  API_USER_GET_SSO_TOKEN: new ApiDef({
    path: "user/getPurchaseSSOToken",
    requiresAuthentication: true
  }),

  API_USER_ADD_TO_CONTACT: new ApiDef({
    path: "user/addToContact",
    requiresAuthentication: true
  }),

  API_USER_LIST_CONTACTS: new ApiDef({
    path: "user/listContacts",
    requiresAuthentication: true
  }),

  API_ALL_CONTACTS: new ApiDef({
    path: "user/getAllContacts",
    requiresAuthentication: true
  }),

  API_ALL_CONTACTS_BY_ORG: new ApiDef({
    path: "user/getContactsByOrg",
    requiresAuthentication: true
  }),

  API_USER_REMOVE_FROM_CONTACTS: new ApiDef({
    path: "user/removeFromContacts",
    requiresAuthentication: true
  }),

  API_USER_LIST_ORGANANIZATIONAL_CONTACTS: new ApiDef({
    path: "user/listOrganizationalContacts",
    requiresAuthentication: true
  }),

  API_USER_ADD_DEVICE: new ApiDef({
    path: "user/addDevice",
    requiresAuthentication: true
  }),

  API_USER_SEND_PUSH_NOTIFICATION: new ApiDef({
    path: "user/sendPushNotification",
    requiresAuthentication: true
  }),

  API_USER_GET_DASHBOARD_DATA: new ApiDef({
    path: "user/getDashboardData",
    requiresAuthentication: true
  }),

  API_SEARCH_ORGANIZATIONS: new ApiDef({
    path: "user/searchOrganizations",
    requiresAuthentication: true
  }),

  API_JOIN_REQUEST: new ApiDef({
    path: "user/joinRequest",
    requiresAuthentication: true
  }),

  API_CHECK_JOIN_REQUEST: new ApiDef({
    path: "user/checkJoinRequest",
    requiresAuthentication: true
  }),

  API_CANCEL_JOIN_REQUEST: new ApiDef({
    path: "user/cancelJoinRequest",
    requiresAuthentication: true
  }),

  API_APPROVE_OR_DELETE_JOIN_REQUEST: new ApiDef({
    path: "user/approveOrDeleteJoinRequest",
    requiresAuthentication: true
  }),

  API_GET_JOIN_REQUESTS: new ApiDef({
    path: "user/getJoinRequests",
    requiresAuthentication: true
  }),

  API_ADD_SUBSCRIPTION: new ApiDef({
    path: "user/addSubscription",
    requiresAuthentication: true
  }),

  API_GET_USER_SETTINGS: new ApiDef({
    path: "user/getUserSettings",
    requiresAuthentication: true
  }),

  API_ADD_OR_UPDATE_SETTINGS: new ApiDef({
    path: "user/addOrUpdateSettings",
    requiresAuthentication: true
  }),

  API_RESTAURANT_CREATE: new ApiDef({
    path: "restaurant/create",
    requiresAuthentication: true
  }),
  API_RESTAURANT_ADD_CATEGORY: new ApiDef({
    path: "restaurant/addProductCategory",
    requiresAuthentication: true
  }),

  API_TRIAL_EXTEND_REQUEST: new ApiDef({
    path: "restaurant/trialExtendRequest",
    requiresAuthentication: true
  }),

  API_RESTAURANT_EDIT: new ApiDef({
    path: "restaurant/edit",
    requiresAuthentication: true
  }),

  API_RESTAURANT_REP_DELIVERY_METHOD: new ApiDef({
    path: "restaurant/getRepDeliveryMethod",
    requiresAuthentication: true
  }),

  API_RESTAURANT_UPDATE_REP_DELIVERY_METHOD: new ApiDef({
    path: "restaurant/updateRepDeliveryMethod",
    requiresAuthentication: true
  }),

  API_RESTAURANT_INVITE_EMPLOYEES: new ApiDef({
    path: "restaurant/inviteEmployees",
    requiresAuthentication: true
  }),

  API_RESTAURANT_ADD_INVENTORY_IN_BULK: new ApiDef({
    path: "restaurant/addInventoryInBulk",
    requiresAuthentication: true
  }),

  API_RESTAURANT_LIST_ALL_DISTRIBUTORS: new ApiDef({
    path: "restaurant/listAllDistributors",
    requiresAuthentication: true
  }),

  API_RESTAURANT_SELECT_DISTRIBUTORS: new ApiDef({
    path: "restaurant/selectDistributors",
    requiresAuthentication: true
  }),

  // TODO: Favorite and not favourite
  API_RESTAURANT_DELETE_FAVOURITE_DISTRIBUTORS: new ApiDef({
    path: "restaurant/deleteFavouriteDistributor",
    requiresAuthentication: true
  }),

  API_RESTAURANT_INVITE_DISTRIBUTORS: new ApiDef({
    path: "restaurant/inviteDistributors",
    requiresAuthentication: true
  }),

  API_RESTAURANT_COPY_DEFAULT_LOCATION_CATEGORY: new ApiDef({
    path: "restaurant/copyDefaultLocationsAndCategoriesInRestaurant",
    requiresAuthentication: true
  }),

  API_RESTAURANT_EDIT_PRODUCT: new ApiDef({
    path: "restaurant/editProduct",
    requiresAuthentication: true
  }),

  API_GET_RESTAURANT_SUBSCRIPTION: new ApiDef({
    path: "restaurant/getSubscriptionData",
    requiresAuthentication: true
  }),

  API_CANCEL_RESTAURANT_SUBSCRIPTION: new ApiDef({
    path: "restaurant/cancelSubscription",
    requiresAuthentication: true
  }),

  API_ADD_EMPLOYEE_FROM_INVITATION: new ApiDef({
    path: "user/addEmployeeFromInvitation",
    requiresAuthentication: true
  }),

  MAKE_INVITATION_ACCEPTED_UPON_REGISTER: new ApiDef({
    path: "user/makeInvitationAsAcceptedUponSignup",
    requiresAuthentication: true
  }),

  API_SUPPLIER_CREATE: new ApiDef({
    path: "supplier/create",
    requiresAuthentication: true
  }),

  API_SUPPLIER_EDIT: new ApiDef({
    path: "supplier/edit",
    requiresAuthentication: true
  }),

  API_SUPPLIER_LIST_ALL_DISTRIBUTORS: new ApiDef({
    path: "supplier/listAllDistributors",
    requiresAuthentication: true
  }),

  API_SUPPLIER_SELECT_DISTRIBUTORS: new ApiDef({
    path: "supplier/selectDistributors",
    requiresAuthentication: true
  }),

  API_SUPPLIER_INVITE_DISTRIBUTORS: new ApiDef({
    path: "supplier/inviteDistributors",
    requiresAuthentication: true
  }),

  API_SUPPLIER_INVITE_EMPLOYEES: new ApiDef({
    path: "supplier/inviteEmployees",
    requiresAuthentication: true
  }),

  API_GET_ORGANIZATION_SELECTED_ORGANIZATIONS: new ApiDef({
    path: "user/getOrganizationSelectedOrganizations",
    requiresAuthentication: true
  }),

  API_USER_LOGOUT: new ApiDef({
    path: "user/logout",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_LOCATION_IN_RESTAURANT_LIST: new ApiDef({
    path: "restaurant/getLocationInRestaurantList",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_PRODUCT_CATEGORY_LIST: new ApiDef({
    path: "restaurant/getProductCategoryList",
    requiresAuthentication: true
  }),

  API_GET_DISTRIBUTOR_LIST: new ApiDef({
    path: "restaurant/listAllDistributors",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_PRODUCT_LIST: new ApiDef({
    path: "restaurant/getProductList",
    requiresAuthentication: true
  }),

  API_RESTAURANT_ADD_INVENTORY: new ApiDef({
    path: "restaurant/addOrUpdateInventory",
    requiresAuthentication: true
  }),

  API_RESTAURANT_MAKE_INVENTORY_AN_ORDER: new ApiDef({
    path: "restaurant/makeInventoryAnOder",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_ALL_INVENTORY_ORDER: new ApiDef({
    path: "restaurant/getAllInventoryOrder",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_INVENTORY_SUMMARY_LIST: new ApiDef({
    path: "restaurant/getInventorySummaryList",
    requiresAuthentication: true
  }),

  API_ORDER_CONFIRMED_DISTRIBUTOR_LIST: new ApiDef({
    path: "restaurant/orderConfirmedByDistributorList",
    requiresAuthentication: true
  }),

  API_RESTAURANT_ADD_ORDER: new ApiDef({
    path: "restaurant/addOrder",
    requiresAuthentication: true
  }),

  API_RESTAURANT_SAVE_OR_FINALIZE_ORDER: new ApiDef({
    path: "restaurant/saveOrFinalizeOrder",
    requiresAuthentication: true
  }),

  API_RESTAURANT_GET_INVENTORY_TO_EDIT: new ApiDef({
    path: "restaurant/getInventoryToEdit",
    requiresAuthentication: true
  }),

  API_RESTAURANT_DELETE_INVENTORY: new ApiDef({
    path: "restaurant/deleteInventory",
    requiresAuthentication: true
  }),

  API_RESTAURANT_INVENTORY_ORDER_PRODUCTS: new ApiDef({
    path: "restaurant/editInventoryOrderProducts",
    requiresAuthentication: true
  }),

};




