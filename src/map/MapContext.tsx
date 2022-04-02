import { createContext } from "preact";
import { Map } from "leaflet";

const context = createContext<Map | undefined>(undefined);

export const { Consumer: MapConsumer, Provider: MapProvider } = context;
export default context;
