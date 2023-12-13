"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withPushwooshAndroid_1 = require("./withPushwooshAndroid");
const withPushwooshIOS_1 = require("./withPushwooshIOS");
const pkg = require('pushwoosh-expo-plugin/package.json');
const withPushwoosh = (config, props) => {
    if (props && props.android) {
        config = (0, withPushwooshAndroid_1.withPushwooshAndroid)(config, props.android);
    }
    if (props && props.ios) {
        config = (0, withPushwooshIOS_1.withPushwooshIOS)(config, props.ios);
    }
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withPushwoosh, pkg.name, pkg.version);
