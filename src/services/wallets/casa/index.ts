import {
  CasaFamigliaProvider as Provider,
  type WalletConnectOptions,
} from "./provider";
import { ASSETS } from "./assets";

export default {
  Provider,
  Assets: ASSETS,
};

export type { WalletConnectOptions };
