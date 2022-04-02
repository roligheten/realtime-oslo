import Map from "./map";
import styled from "styled-components";
import TileLayer from "./map/TileLayer";
import { EnturVehicleApiProvider } from "./entur-vehicle/EnturVehicleApiProvider";
import RealTimeVehicleLayer from "./map/RealTimeVehicleLayer";
import "leaflet.marker.slideto";

const FullscreenMap = styled(Map)`
    width: 100%;
    height: 100vh;
`;

export function App() {
    return (
        <FullscreenMap lat={59.911491} lon={10.757933} zoom={15}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            ></TileLayer>
            <EnturVehicleApiProvider>
                <RealTimeVehicleLayer />
            </EnturVehicleApiProvider>
        </FullscreenMap>
    );
}
