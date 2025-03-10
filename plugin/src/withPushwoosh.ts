import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

import { withPushwooshAndroid } from './withPushwooshAndroid';
import { withPushwooshIOS } from './withPushwooshIOS';

const pkg = require('pushwoosh-expo-plugin/package.json');

export type PushwooshAndroidPluginProps = {
    icon?: string;
    apiToken?: string;
    logLevel?: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'NOISE';
    multiNotificationMode?: boolean;
};

export type PushwooshIOSPluginProps = {
    PW_API_TOKEN?: string;
    Pushwoosh_LOG_LEVEL?: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'NOISE';
}

export type PushwooshPluginProps = {
    mode: 'development' | 'production';
    android?: PushwooshAndroidPluginProps;
    ios?: PushwooshIOSPluginProps;
};

const withPushwoosh: ConfigPlugin<PushwooshPluginProps> = (config, props) => {
  config = withPushwooshAndroid(config, {
    apiToken: props?.android?.apiToken,
    logLevel: props?.android?.logLevel,
    multiNotificationMode: true,
    icon: props?.android?.icon
  });
  
  config = withPushwooshIOS(config, {
    PW_API_TOKEN: props?.ios?.PW_API_TOKEN,
    Pushwoosh_LOG_LEVEL: props?.ios?.Pushwoosh_LOG_LEVEL,
    mode: props.mode
  });
  return config;
};

export default createRunOncePlugin(withPushwoosh, pkg.name, pkg.version);