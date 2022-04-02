import { useContext, useEffect } from "preact/hooks";
import MapContext from "./MapContext";
import { TileLayer as LeafletTileLayer } from "leaflet";
import { FunctionalComponent } from "preact";

type TileLayerProps = {
  attribution?: string;
  url: string;
};

const TileLayer: FunctionalComponent<TileLayerProps> = ({ url, attribution, children }) => {
  const map = useContext(MapContext);

  useEffect(() => {
    map?.addLayer(new LeafletTileLayer(url, { attribution }));
  }, [map]);

  return <>{children}</>;
};

export default TileLayer;
