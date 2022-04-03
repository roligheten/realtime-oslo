import { FunctionalComponent } from "preact";
import { VehicleWithLine } from "../entur/api";
import Marker from "./Marker";

type RealTimeVehicleLayerProps = {
    vehicles: VehicleWithLine[];
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
                    title={vehicle.mode}
                    key={vehicle.vehicleId}
                    type={vehicle.mode}
                />
            ))}
        </>
    );
};

export default RealTimeVehicleLayer;
