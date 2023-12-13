import {
    ConfigPlugin,
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

async function writeNotificationIconImageFilesAsync(props: PushwooshAndroidPluginProps, projectRoot: string) {
  const fileName = basename(props.icon)
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
        src: props.icon,
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
      await writeNotificationIconImageFilesAsync(props, config.modRequest.projectRoot);
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

export const withPushwooshAndroid: ConfigPlugin<PushwooshAndroidPluginProps> = (config, props) => {  
  config = withCompileSDKVersionFix(config, props);
  config = withNotificationIcons(config, props);
  return config;
};