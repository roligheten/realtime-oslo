import Map from "./map";
import styled from "styled-components";
import TileLayer from "./map/TileLayer";
import { useEnturVehicleApiClient } from "./entur/EnturVehicleApiProvider";
import RealTimeVehicleLayer from "./map/RealTimeVehicleLayer";
import "leaflet.marker.slideto";
import { Header } from "./header/Header";
import { useVehiclesLineData } from "./entur/api";
import { useMemo, useState } from "preact/hooks";
import { useEnturJourneyPlannerApiClient } from "./entur/EnturJourneyPlannerApiProvider";
import DelayIndicator from "./DelayIndicator";

const FullscreenMap = styled(Map)`
    flex: 1 1 auto;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
`;

const Controller = () => {
    const [filteredLineIds, setFilteredLineIds] = useState<string[]>([]);

    const vehiclesClient = useEnturVehicleApiClient();
    const journeyPlannerClient = useEnturJourneyPlannerApiClient();
    const { data: vehicles } = useVehiclesLineData(
        vehiclesClient,
        journeyPlannerClient
    );

    const filteredVehicles = useMemo(() => {
        if (filteredLineIds.length === 0) {
            return vehicles;
        }
        return vehicles?.filter((vehicle) =>
            filteredLineIds.includes(vehicle.line.id)
        );
    }, [vehicles, filteredLineIds]);

    const handleLineIdToggle = (lineId: string) => {
        if (filteredLineIds.includes(lineId)) {
            setFilteredLineIds(
                filteredLineIds.filter((entryLineId) => lineId !== entryLineId)
            );
        } else {
            setFilteredLineIds(filteredLineIds.concat([lineId]));
        }
    };

    return (
        <Container>
            <Header
                onLineToggled={handleLineIdToggle}
                filteredLineIds={filteredLineIds}
            />
            <FullscreenMap lat={59.911491} lon={10.757933} zoom={15}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                ></TileLayer>
                {!!filteredVehicles && (
                    <RealTimeVehicleLayer vehicles={filteredVehicles} />
                )}
            </FullscreenMap>
            {!!filteredVehicles && (
                <DelayIndicator vehicles={filteredVehicles} />
            )}
        </Container>
    );
};

export default Controller;
