# Pushwoosh Expo Sample

Minimal Expo app showing how to wire Pushwoosh push notifications with
[`pushwoosh-expo-plugin`](https://www.npmjs.com/package/pushwoosh-expo-plugin) +
[`pushwoosh-react-native-plugin`](https://www.npmjs.com/package/pushwoosh-react-native-plugin).

It registers for push on launch and shows the device's HWID, push token, and the last
received push on screen.

> Pushwoosh needs native modules, so this runs as a custom Expo build (`expo run:*`) — **not**
> in Expo Go.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set your Pushwoosh credentials

Both values below are **required**.

1. In `App.tsx`, replace `YOUR_PUSHWOOSH_APP_CODE` with your app code from the Pushwoosh control
   panel (your app → Settings).
2. In `app.json`, set your Pushwoosh **API token** (`android.apiToken` / `ios.PW_API_TOKEN`) —
   get it from the control panel → API access. The config plugin writes this value into the
   native build as-is, so leaving the `YOUR_PUSHWOOSH_API_TOKEN` placeholder ships an invalid
   token.

### 3. Android — add `google-services.json` (required, not shipped)

Android push is delivered over Firebase Cloud Messaging.

1. In the [Firebase console](https://console.firebase.google.com/) open the project whose FCM
   credentials are connected to your Pushwoosh app (Pushwoosh → your app → Android/Firebase
   configuration).
2. Register an Android app whose **package name matches** `android.package` in `app.json`
   (`com.pushwoosh.sample` here — change it, together with the matching `ios.bundleIdentifier`,
   to your own app id), then download its `google-services.json`.
3. Place that `google-services.json` in this folder. `app.json` already points to it via
   `android.googleServicesFile`, and Expo applies the `com.google.gms.google-services` Gradle
   plugin during prebuild.

> `google-services.json` is git-ignored on purpose — never commit it. Without it Firebase can't
> initialize and pushes silently never arrive.

### 4. Run

```bash
# Android (emulator/device needs Google Play services for FCM)
npx expo run:android

# iOS (pushes don't work in the Simulator — use a real device)
npx expo run:ios
```

On Android 13+ the SDK requests the `POST_NOTIFICATIONS` permission on first launch.

> **iOS:** `app.json` sets the plugin `mode` to `"development"`, so the device registers against
> the **APNs sandbox**. Your Pushwoosh app's iOS platform must be configured with the matching
> development (sandbox) APNs certificate/key, or pushes silently never arrive. For release builds
> set `mode` to `"production"` and use the production APNs credentials in Pushwoosh.

## Sending a test push

Broadcast from the Pushwoosh control panel, or via the Messaging API, targeting your app code.
The notification appears in the tray and `App.tsx` updates "Last push" via the `pushReceived` /
`pushOpened` events.
