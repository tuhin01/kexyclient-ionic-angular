import { constants } from "./shared";

export const getConfig = () => {
    let appType = window.localStorage.getItem(constants.USER_APP_TYEP);
    let isDev = window.localStorage.getItem("--kexy--is-dev");

    if (isDev === null) {
        if (window.location.href.indexOf("localhost:8100") > 0) {
            isDev = "YES";
        }
    }
    if (isDev === "YES") {
        if (appType === constants.RESTAURANT) {
            return {
                baseUri: "https://api.getkexy.com/devkexyapi/v1/",
                socketUri: "https://api.getkexy.com:3002",
                mockSocketUri: "https://api.getkexy.com:4002",
            };
        } else {
            return {
                baseUri: "https://api.getkexy.com/devcannabisapi/v1/",
                socketUri: "https://api.getkexy.com:3002",
                mockSocketUri: "https://api.getkexy.com:4002",
            };
        }
    } else {
        if (appType === constants.RESTAURANT) {
            return {
                baseUri: "https://api.getkexy.com/kexyapi/v1/",
                socketUri: "https://api.getkexy.com:3001",
                mockSocketUri: "https://api.getkexy.com:4001",
            };
        } else {
            return {
                baseUri: "https://api.getkexy.com/cannabisapi/v1/",
                socketUri: "https://api.getkexy.com:3005",
                mockSocketUri: "https://api.getkexy.com:4002",
            };
        }
    }
};
