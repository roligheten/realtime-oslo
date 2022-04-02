import { FunctionalComponent, RefObject } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import { Map as LeafletMap } from "leaflet";
import { MapProvider } from "./MapContext";

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

        setMap(new LeafletMap(mapRef.current));

        return () => map?.remove();
    }, []);

    useEffect(() => {
        map?.setView({ lat, lng: lon }, zoom);
    });

    return (
        <MapProvider value={map}>
            <div className={className} ref={mapRef}>
                {children}
            </div>
        </MapProvider>
    );
};

export default Map;
