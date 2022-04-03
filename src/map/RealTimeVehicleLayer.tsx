import { FunctionalComponent } from "preact";
import { VehicleWithLine } from "../entur/api";
import Marker from "./Marker";

type RealTimeVehicleLayerProps = {
    vehicles: VehicleWithLine[];
};

const getMarkerTitle = (vehicle: VehicleWithLine) => {
    return `Line: ${vehicle?.line?.publicCode} Direction: "${
        vehicle?.direction === "2" ? "Forward" : "Backward"
    }"`;
};

const RealTimeVehicleLayer: FunctionalComponent<RealTimeVehicleLayerProps> = ({
    vehicles,
}) => {
    return (
        <>
            {vehicles.map((vehicle) => (
                <Marker
                    lat={vehicle.location.latitude}
                    long={vehicle.location.longitude}
                    title={getMarkerTitle(vehicle)}
                    key={vehicle.vehicleId}
                    type={vehicle.mode}
                />
            ))}
        </>
    );
};

export default RealTimeVehicleLayer;
