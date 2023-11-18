import { WALLET_ADAPTERS } from "@web3auth/base";

export const modalConfig = {
    [WALLET_ADAPTERS.METAMASK]: {
        label: "metamask",
        showOnModal: false,
    },
    [WALLET_ADAPTERS.OPENLOGIN]: {
        label: "openlogin",
        loginMethods: {
        // Disable facebook and reddit
        facebook: {
            name: "facebook",
            showOnModal: false,
        },
        reddit: {
            name: "reddit",
            showOnModal: false,
        },
        email_passwordless: {
            name: "email_passwordless",
            showOnModal: false,
        },
        sms_passwordless: {
            name: "sms_passwordless",
            showOnModal: false,
        },
        discord: {
            name: "discord",
            showOnModal: false,
        },
        twitch: {
            name: "twitch",
            showOnModal: false,
        },
        apple: {
            name: "apple",
            showOnModal: false,
        },
        line: {
            name: "line",
            showOnModal: false,
        },
        github: {
            name: "github",
            showOnModal: false,
        },
        kakao: {
            name: "kakao",
            showOnModal: false,
        },
        linkedin: {
            name: "linkedin",
            showOnModal: false,
        },
        weibo: {
            name: "weibo",
            showOnModal: false,
        },
        wechat: {
            name: "wechat",
            showOnModal: false,
        },
        google: {
            name: "google",
            showOnModal: false,
        },
        twitter: {
            name: "twitter",
            showOnModal: true,
        },
        },
    },
  };