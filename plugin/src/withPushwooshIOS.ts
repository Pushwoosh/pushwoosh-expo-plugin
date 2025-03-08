import {
  ConfigPlugin,
  withEntitlementsPlist,
  withInfoPlist
} from '@expo/config-plugins';

import { PushwooshIOSPluginProps } from './withPushwoosh';  

const withCapabilities: ConfigPlugin = (config) => {
  return withInfoPlist(config, (plist) => {
    if (!Array.isArray(plist.modResults.UIBackgroundModes)) {
      plist.modResults.UIBackgroundModes = [];
    }

    if (!plist.modResults.UIBackgroundModes.includes("remote-notification")) {
      plist.modResults.UIBackgroundModes.push("remote-notification");
    }
    
    return plist;
  });
};

const withAPNSEnvironment: ConfigPlugin<{ mode: string }> = (config, props) => {
  return withEntitlementsPlist(config, (plist) => {
    plist.modResults['aps-environment'] = props.mode
    return plist;
  });
};

export const withPushwooshIOS: ConfigPlugin<{ mode: string } & PushwooshIOSPluginProps> = (config, props) => {
  config = withCapabilities(config)
  
  config = withInfoPlist(config, (plist) => {
    plist.modResults['PW_API_TOKEN'] = props?.PW_API_TOKEN || '__YOUR_API_TOKEN__';
    plist.modResults['Pushwoosh_LOG_LEVEL'] = props?.Pushwoosh_LOG_LEVEL || 'INFO';
    return plist;
  });
  
  config = withAPNSEnvironment(config, props)
  return config;
};