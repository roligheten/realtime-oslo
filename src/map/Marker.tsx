import { useContext, useEffect, useState } from "preact/hooks";
import MapContext from "./MapContext";
import { Icon, LatLngExpression, Marker as LeafletMarker } from "leaflet";
import { FunctionalComponent } from "preact";
import busUrl from "/assets/bus.svg";
import tramUrl from "/assets/tram.svg";
import ferryUrl from "/assets/ferry.svg";

type VehicleType =
    | "AIR"
    | "BUS"
    | "RAIL"
    | "TRAM"
    | "COACH"
    | "FERRY"
    | "METRO";

type MarkerProps = {
    lat: number;
    long: number;
    title?: string;
    type: VehicleType;
};

const getMarkerIcon = (type: VehicleType) => {
    switch (type) {
        case "FERRY":
            return ferryUrl;
        case "TRAM":
            return tramUrl;
        case "BUS":
            return busUrl;
        default:
            return busUrl;
    }
};

type ExtendedLeafletMarker = LeafletMarker & {
    slideTo: (
        latLng: LatLngExpression,
        options?: {
            duration?: number;
        }
    ) => void;
};

const Marker: FunctionalComponent<MarkerProps> = ({
    lat,
    long,
    title,
    type,
}) => {
    const map = useContext(MapContext);
    const [marker, setMarker] = useState<ExtendedLeafletMarker>();

    useEffect(() => {
        if (map) {
            const icon = new Icon({
                iconUrl: getMarkerIcon(type),
                iconSize: [50, 50],
                iconAnchor: [25, 30],
            });

            const marker = new LeafletMarker(
                { lat, lng: long },
                { title, icon }
            ) as ExtendedLeafletMarker;
            title && marker.bindTooltip(title, { direction: "top" });
            map.addLayer(marker);
            setMarker(marker);

            return () => map.removeLayer(marker);
        }
    }, [map, setMarker]);

    useEffect(() => {
        marker?.slideTo({ lat, lng: long }, { duration: 2000 });
    }, [lat, long]);

    useEffect(() => {
        marker?.unbindTooltip();
        title && marker?.bindTooltip(title, { direction: "top" });
    }, [title]);

    return <></>;
};

export default Marker;
