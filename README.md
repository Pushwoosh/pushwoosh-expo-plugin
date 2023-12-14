Expo Pushwoosh Push Notifications module
===================================================

[![GitHub release](https://img.shields.io/github/release/Pushwoosh/pushwoosh-expo-plugin.svg?style=flat-square)](https://github.com/Pushwoosh/pushwoosh-expo-plugin/releases)
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
You can pass props to the plugin config object to configure:

| Plugin props |              |                                                                               |
|--------------|--------------|-------------------------------------------------------------------------------|
| `mode`       | **required** | Used to configure [APNs environment](https://developer.apple.com/documentation/bundleresources/entitlements/aps-environment) entitlement. "development" or "production" |


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

Copyright © 2023 [Pushwoosh](https://github.com/Pushwoosh).
This project is [MIT](https://github.com/Pushwoosh/pushwoosh-expo-plugin/blob/main/LICENSE) licensed.
