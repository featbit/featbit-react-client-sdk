import { FlagKeyMap, IFlagSet } from "./types";
import { IFbClient } from "@featbit/js-client-sdk";

export interface ProviderState {
  error?: Error;
  flagKeyMap: FlagKeyMap;
  flags: IFlagSet;
  fbClient?: IFbClient;
  unproxiedFlags: IFlagSet;
}