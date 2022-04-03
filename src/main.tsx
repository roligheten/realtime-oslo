import { render } from "preact";
import { App } from "./app";
import "leaflet";
import "leaflet.marker.slideto";
import "leaflet.locatecontrol";
import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "./index.css";

render(<App />, document.getElementById("app")!);
