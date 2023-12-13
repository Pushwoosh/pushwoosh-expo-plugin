import { ConfigPlugin } from '@expo/config-plugins';
export type PushwooshAndroidPluginProps = {
    icon: string;
};
export type PushwooshIOSPluginProps = {
    mode: 'development' | 'production';
};
export type PushwooshPluginProps = {
    android?: PushwooshAndroidPluginProps;
    ios?: PushwooshIOSPluginProps;
};
declare const _default: ConfigPlugin<PushwooshPluginProps>;
export default _default;
