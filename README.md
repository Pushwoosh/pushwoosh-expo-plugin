Expo Pushwoosh Push Notifications module
===================================================

[![GitHub release](https://img.shields.io/github/release/Pushwoosh/pushwoosh-expo-plugin.svg?style=flat-square)](https://github.com/Pushwoosh/pushwoosh-react-native-plugin/releases)
[![npm](https://img.shields.io/npm/v/pushwoosh-expo-plugin.svg)](https://www.npmjs.com/package/pushwoosh-expo-plugin)
[![license](https://img.shields.io/npm/l/pushwoosh-expo-plugin.svg)]()

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-yellowgreen.svg)

### SUPPORTED ENVIRONMENTS:

* [The Expo run commands](https://docs.expo.dev/workflow/customizing/) (`expo run:[android|ios]`)

---

### INSTALL

You need both the `pushwoosh-expo-plugin` and the `pushwoosh-react-native-plugin` npm package.

```bash
npx expo install pushwoosh-expo-plugin

# npm
npm install pushwoosh-react-native-plugin

```

### CONFIGURATION IN app.json / app.config.js
## 
### Plugin

Add the plugin to the front of the plugin array.

```javascript
{
  "plugins": [
    [
      "pushwoosh-expo-plugin",
      {
        "mode": "development",
      }
    ]
  ]
}

```
### Plugin Prop
You can pass prop to the plugin config object to configure:

| Plugin prop |              |                                                                               |
|--------------|--------------|-------------------------------------------------------------------------------|
| `mode`       | **required** | Used to configure [APNs environment](https://developer.apple.com/documentation/bundleresources/entitlements/aps-environment) entitlement. "development" or "production" |

#### iOS Props
The following props can be configured under the `ios` key:

| iOS props | Required | Default | Description |
|-----------|----------|---------|-------------|
| `PW_API_TOKEN` | Yes | `__YOUR_API_TOKEN__` | Your Pushwoosh API token for iOS. You can get the API token in the Pushwoosh control panel (Select an app -> "Settings" -> "API access" |
| `Pushwoosh_LOG_LEVEL` | No | `INFO` | Log level for iOS. Possible values: `NONE`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `NOISE` |

> **Note**: Remote notifications in Background Modes are automatically configured in the Signing & Capabilities section through the `withEntitlementsPlist` function. You don't need to manually configure this in Info.plist.

#### Android Props
The following props can be configured under the `android` key:

| Android props | Required | Default | Description |
|---------------|----------|---------|-------------|
| `apiToken` | Yes | `__YOUR_API_TOKEN__` | Your Pushwoosh API token for Android. You can get the API token in the Pushwoosh control panel (Select an app -> "Settings" -> "API access" |
| `logLevel` | No | `INFO` | Log level for Android. One of: `NONE`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `NOISE` |
| `multiNotificationMode` | No | `true` | Can be changed to false in case you want to display only the last notification for the user |
| `icon` | No | - | Path to a custom notification icon for Android |

### Example Configuration
Here's an example of how to configure the plugin in your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "pushwoosh-expo-plugin",
        {
          "mode": "development",
          "ios": {
            "PW_API_TOKEN": "YOUR_API_TOKEN",
            "Pushwoosh_LOG_LEVEL": "DEBUG"
          },
          "android": {
            "apiToken": "YOUR_API_TOKEN",
            "logLevel": "DEBUG",
            "icon": "./assets/notification-icon.png"
          }
        }
      ]
    ]
  }
}
```

### Initialize Pushwoosh

```javascript
import Pushwoosh from 'pushwoosh-react-native-plugin';

```

```javascript

Pushwoosh.init({ 
    "pw_appid" : "YOUR_PUSHWOOSH_PROJECT_ID" , 
    "project_number" : "YOUR_GCM_PROJECT_NUMBER" 
});
Pushwoosh.register();

```

See [Pushwoosh React Native](https://docs.pushwoosh.com/platform-docs/pushwoosh-sdk/cross-platform-frameworks/react-native/integrating-react-native-plugin) integration

##
### Prebuild (optional)

Prebuilding within Expo entails the generation of native runtime code for the project, resulting in the construction of the 'ios' and 'android' directories. Through prebuilding, the native modules that utilize CocoaPods, autolinking, and other configuration plugins are automatically linked and configured. You can conceptualize prebuild as a bundler for native code.

Executing expo prebuild initiates a custom managed workflow that combines the advantages of both bare workflows and managed workflows simultaneously.

Why is prebuilding recommended?

Prebuilding locally can be beneficial for inspecting changes in config plugins and assisting in the debugging of issues.

### Running

```bash
npx expo prebuild

```

### RUN
##
Executing the provided commands will prebuild and run your application. It's important to note that push notifications will not function in the iOS Simulator.

```bash

# Build and run your native iOS project
npx expo run:ios

# Build and run your native Android project
npx expo run:android

```
---

### LICENCE

Copyright © 2024 [Pushwoosh](https://github.com/Pushwoosh).
This project is [MIT](https://github.com/Pushwoosh/pushwoosh-expo-plugin/blob/main/LICENSE) licensed.
