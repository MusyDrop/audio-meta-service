import { Schema } from 'joi';

export type JoiConfigProps<ValueType> = {
  value: ValueType;
  schema?: Schema;
};

export type JoiConfigValue<ValueType> = ValueType extends object
  ? JoiConfig<ValueType>
  : JoiConfigProps<ValueType>;

export type JoiConfig<ConfigType> = {
  [K in keyof ConfigType]: JoiConfigValue<ConfigType[K]>;
};

export type JoiAppConfig<Interface> = {
  [K in keyof Interface]: JoiConfig<unknown>;
};
