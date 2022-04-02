import { useContext } from "preact/hooks";
import MapContext from "./MapContext";
import { FunctionalComponent } from "preact";
import { useVehicleQuery } from "../entur-vehicle/api";
import { useEnturVehicleApiClient } from "../entur-vehicle/EnturVehicleApiProvider";
import Marker from "./Marker";

type RealTimeVehicleLayerProps = {};

const RealTimeVehicleLayer: FunctionalComponent<RealTimeVehicleLayerProps> = ({
    children,
}) => {
    const map = useContext(MapContext);

    const client = useEnturVehicleApiClient();

    const { data } = useVehicleQuery(client);

    return (
        <>
            {data?.vehicles?.map((vehicle) => (
                <Marker
                    lat={vehicle.location.latitude}
                    long={vehicle.location.longitude}
                    title={vehicle.mode}
                    key={vehicle.vehicleId}
                    type={vehicle.mode}
                />
            ))}
        </>
    );
};

export default RealTimeVehicleLayer;
