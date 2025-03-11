import { ConfigPlugin } from '@expo/config-plugins';
export type PushwooshAndroidPluginProps = {
    icon?: string;
    apiToken?: string;
    logLevel?: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'NOISE';
    multiNotificationMode?: boolean;
};
export type PushwooshIOSPluginProps = {
    PW_API_TOKEN?: string;
    Pushwoosh_LOG_LEVEL?: 'NONE' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'NOISE';
};
export type PushwooshPluginProps = {
    mode: 'development' | 'production';
    android?: PushwooshAndroidPluginProps;
    ios?: PushwooshIOSPluginProps;
};
declare const _default: ConfigPlugin<PushwooshPluginProps>;
export default _default;
