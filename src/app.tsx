import styled from "styled-components";
import { EnturVehicleApiProvider } from "./entur/EnturVehicleApiProvider";
import Controller from "./Controller";
import { EnturJourneyPlannerApiProvider } from "./entur/EnturJourneyPlannerApiProvider";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
`;

export function App() {
    return (
        <EnturVehicleApiProvider>
            <EnturJourneyPlannerApiProvider>
                <Controller />
            </EnturJourneyPlannerApiProvider>
        </EnturVehicleApiProvider>
    );
}
