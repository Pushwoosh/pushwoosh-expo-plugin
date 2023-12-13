import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';

import { withPushwooshAndroid } from './withPushwooshAndroid';
import { withPushwooshIOS } from './withPushwooshIOS';

const pkg = require('pushwoosh-expo-plugin/package.json');

export type PushwooshAndroidPluginProps = {
    icon: string;
};

export type PushwooshIOSPluginProps = {
    mode: 'development' | 'production';
}

export type PushwooshPluginProps = {
    android?: PushwooshAndroidPluginProps;
    ios?: PushwooshIOSPluginProps;
};

const withPushwoosh: ConfigPlugin<PushwooshPluginProps> = (config, props) => {
  if (props && props.android) {
    config = withPushwooshAndroid(config, props.android);
  }
  
  if (props && props.ios) {
    config = withPushwooshIOS(config, props.ios);
  }
  return config;
};

export default createRunOncePlugin(withPushwoosh, pkg.name, pkg.version);
