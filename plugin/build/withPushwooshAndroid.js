"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPushwooshAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const fs_1 = require("fs");
const path_1 = require("path");

const iconSizeMap = {
    mdpi: 24,
    hdpi: 32,
    xhdpi: 48,
    xxhdpi: 72,
    xxxhdpi: 96,
};

async function writeNotificationIconImageFilesAsync(props, projectRoot) {
    const fileName = (0, path_1.basename)(props.icon);
    await Promise.all(Object.entries(iconSizeMap).map(async (entry) => {
        const iconSizePx = entry[1];
        const resourceDir = (0, path_1.resolve)(projectRoot, 'android/app/src/main/res/', "drawable-" + entry[0]);
        if (!(0, fs_1.existsSync)(resourceDir)) {
            (0, fs_1.mkdirSync)(resourceDir, { recursive: true });
        }
        const options = {
            projectRoot: projectRoot,
            cacheType: 'pushwoosh',
        };
        const imageOptions = {
            src: props.icon,
            width: iconSizePx,
            height: iconSizePx,
            resizeMode: 'cover',
            backgroundColor: 'transparent',
        };
        const result = await (0, image_utils_1.generateImageAsync)(options, imageOptions);
        (0, fs_1.writeFileSync)((0, path_1.resolve)(resourceDir, fileName), result.source);
    }));
}

const withNotificationIcons = (config, props) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            await writeNotificationIconImageFilesAsync(props, config.modRequest.projectRoot);
            return config;
        },
    ]);
};

const withCompileSDKVersionFix = (config, props) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (gradle) => {
        if (!gradle.modResults.contents.includes(`compileSdkVersion = 30`)) {
            return gradle;
        }
        gradle.modResults.contents = gradle.modResults.contents.replace('compileSdkVersion = 30', 'compileSdkVersion = 31');
        return gradle;
    });
};

const withPushwooshAndroidManifest = (config, props) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (androidManifest) => {
        const apiToken = props.apiToken || "YOUR_API_TOKEN";
        const logLevel = props.logLevel || "DEBUG";

        const appManifest = androidManifest.modResults.manifest.application[0];

        // Add Pushwoosh API token and log level
        appManifest["meta-data"] = appManifest["meta-data"] || [];
        appManifest["meta-data"].push({
            $: { "android:name": "com.pushwoosh.apitoken", "android:value": apiToken },
        });
        appManifest["meta-data"].push({
            $: { "android:name": "com.pushwoosh.log_level", "android:value": logLevel },
        });

        // Add multi-notification mode
        appManifest["meta-data"].push({
            $: { "android:name": "com.pushwoosh.multi_notification_mode", "android:value": "true" },
        });

        return androidManifest;
    });
};

const withPushwooshAndroid = (config, props) => {
    config = withCompileSDKVersionFix(config, props);
    config = withNotificationIcons(config, props);
    config = withPushwooshAndroidManifest(config, props);
    return config;
};

exports.withPushwooshAndroid = withPushwooshAndroid;
