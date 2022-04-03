import { FunctionalComponent } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import { Map as LeafletMap } from "leaflet";
import { MapProvider } from "./MapContext";
import LocateControl from "leaflet.locatecontrol";

type MapProps = {
    className?: string;
    lon: number;
    lat: number;
    zoom: number;
};

const Map: FunctionalComponent<MapProps> = ({
    lat,
    lon,
    zoom,
    className,
    children,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<LeafletMap>();

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const map = new LeafletMap(mapRef.current);
        setMap(map);
        map.setView({ lat, lng: lon }, zoom);
        // @ts-ignore Broken type defs
        new LocateControl().addTo(map);
        return () => map.remove();
    }, []);

    useEffect(() => {
        map?.setView({ lat, lng: lon }, zoom);
    }, [zoom, lat, lon]);

    return (
        <MapProvider value={map}>
            <div className={className} ref={mapRef}>
                {children}
            </div>
        </MapProvider>
    );
};

export default Map;
