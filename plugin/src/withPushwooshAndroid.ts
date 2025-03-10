import {
    ConfigPlugin,
    withAndroidManifest,
    withDangerousMod,
    withProjectBuildGradle
} from '@expo/config-plugins';

import { generateImageAsync, ImageOptions } from '@expo/image-utils';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, basename } from 'path';
import { PushwooshAndroidPluginProps } from './withPushwoosh';

const iconSizeMap: Record<string, number> = {
  mdpi: 24,
  hdpi: 32,
  xhdpi: 48,
  xxhdpi: 72,
  xxxhdpi: 96,
};

async function writeNotificationIconImageFilesAsync(icon: string, projectRoot: string) {
  const fileName = basename(icon)
  await Promise.all(
    Object.entries(iconSizeMap).map(async (entry) => {
      const iconSizePx = entry[1]
      const resourceDir = resolve(projectRoot, 'android/app/src/main/res/', "drawable-" + entry[0]);

      if (!existsSync(resourceDir)) {
        mkdirSync(resourceDir, { recursive: true });
      }

      const options = {
        projectRoot: projectRoot,
        cacheType: 'pushwoosh'
      };

      const imageOptions: ImageOptions = {
        src: icon,
        width: iconSizePx,
        height: iconSizePx,
        resizeMode: 'cover',
        backgroundColor: 'transparent',
      };

      const result = await generateImageAsync(options, imageOptions);
      writeFileSync(resolve(resourceDir, fileName), result.source);
    })
  );
};

const withNotificationIcons: ConfigPlugin<PushwooshAndroidPluginProps> = (config, props) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (props.icon) {
        await writeNotificationIconImageFilesAsync(props.icon, config.modRequest.projectRoot);
      }
      return config;
    },
  ]);
};

const withCompileSDKVersionFix: ConfigPlugin<PushwooshAndroidPluginProps> = (config, props) => {
  return withProjectBuildGradle(config, (gradle) => {
    if (!gradle.modResults.contents.includes(`compileSdkVersion = 30`)) {
      return gradle;
    }

    gradle.modResults.contents = gradle.modResults.contents.replace(
      'compileSdkVersion = 30',
      'compileSdkVersion = 31'
    );
    return gradle;
  });
};

const withManifestConfig: ConfigPlugin<PushwooshAndroidPluginProps> = (config, props) => {
  return withAndroidManifest(config, config => {
    const application = config.modResults.manifest.application;
    if (!application?.[0]) return config;

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
      
      const existingIndex = metaDataArray.findIndex(
        (item: any) => item.$['android:name'] === entry.name
      );
      
      if (existingIndex !== -1) {
        metaDataArray[existingIndex] = metaData;
      } else {
        metaDataArray.push(metaData);
      }
    });

    return config;
  });
};

export const withPushwooshAndroid: ConfigPlugin<PushwooshAndroidPluginProps> = (config, props) => {  
  config = withCompileSDKVersionFix(config, props);
  config = withManifestConfig(config, props);
  
  if (props?.icon) {
    config = withNotificationIcons(config, props);
  }
  
  return config;
};