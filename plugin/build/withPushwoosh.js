"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withPushwooshAndroid_1 = require("./withPushwooshAndroid");
const withPushwooshIOS_1 = require("./withPushwooshIOS");
const pkg = require('pushwoosh-expo-plugin/package.json');
const withPushwoosh = (config, props) => {
    config = (0, withPushwooshAndroid_1.withPushwooshAndroid)(config, {
        apiToken: props?.android?.apiToken,
        logLevel: props?.android?.logLevel,
        multiNotificationMode: true,
        icon: props?.android?.icon
    });
    config = (0, withPushwooshIOS_1.withPushwooshIOS)(config, {
        PW_API_TOKEN: props?.ios?.PW_API_TOKEN,
        Pushwoosh_LOG_LEVEL: props?.ios?.Pushwoosh_LOG_LEVEL,
        mode: props.mode
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withPushwoosh, pkg.name, pkg.version);
