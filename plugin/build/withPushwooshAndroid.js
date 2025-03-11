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
async function writeNotificationIconImageFilesAsync(icon, projectRoot) {
    const fileName = (0, path_1.basename)(icon);
    await Promise.all(Object.entries(iconSizeMap).map(async (entry) => {
        const iconSizePx = entry[1];
        const resourceDir = (0, path_1.resolve)(projectRoot, 'android/app/src/main/res/', "drawable-" + entry[0]);
        if (!(0, fs_1.existsSync)(resourceDir)) {
            (0, fs_1.mkdirSync)(resourceDir, { recursive: true });
        }
        const options = {
            projectRoot: projectRoot,
            cacheType: 'pushwoosh'
        };
        const imageOptions = {
            src: icon,
            width: iconSizePx,
            height: iconSizePx,
            resizeMode: 'cover',
            backgroundColor: 'transparent',
        };
        const result = await (0, image_utils_1.generateImageAsync)(options, imageOptions);
        (0, fs_1.writeFileSync)((0, path_1.resolve)(resourceDir, fileName), result.source);
    }));
}
;
const withNotificationIcons = (config, props) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            if (props.icon) {
                await writeNotificationIconImageFilesAsync(props.icon, config.modRequest.projectRoot);
            }
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
const withManifestConfig = (config, props) => {
    return (0, config_plugins_1.withAndroidManifest)(config, config => {
        const application = config.modResults.manifest.application;
        if (!application?.[0])
            return config;
        const metaDataArray = application[0]['meta-data'] = application[0]['meta-data'] || [];
        const entries = [
            {
                name: 'com.pushwoosh.apitoken',
                value: props?.apiToken || '__YOUR_API_TOKEN__'
            },
            {
                name: 'com.pushwoosh.log_level',
                value: props?.logLevel || 'INFO'
            },
            {
                name: 'com.pushwoosh.multi_notification_mode',
                value: 'true'
            }
        ];
        entries.forEach(entry => {
            const metaData = {
                $: {
                    'android:name': entry.name,
                    'android:value': entry.value
                }
            };
            const existingIndex = metaDataArray.findIndex((item) => item.$['android:name'] === entry.name);
            if (existingIndex !== -1) {
                metaDataArray[existingIndex] = metaData;
            }
            else {
                metaDataArray.push(metaData);
            }
        });
        return config;
    });
};
const withPushwooshAndroid = (config, props) => {
    config = withCompileSDKVersionFix(config, props);
    config = withManifestConfig(config, props);
    if (props?.icon) {
        config = withNotificationIcons(config, props);
    }
    return config;
};
exports.withPushwooshAndroid = withPushwooshAndroid;
