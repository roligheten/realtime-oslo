import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import styled from "styled-components";
import { VehicleWithLine } from "./entur/api";

const Title = styled.span``;

const Container = styled.div`
    position: absolute;
    z-index: 1000;
    bottom: 0;
    background: white;
    padding: 7px;
`;

type DelayIndicatorProps = {
    vehicles: VehicleWithLine[];
};

const DelayIndicator: FunctionalComponent<DelayIndicatorProps> = ({
    vehicles,
}) => {
    const medianDelay = useMemo(() => {
        if (vehicles.length === 0) {
            return 0;
        }

        const now = Date.now();
        const sorted = vehicles
            .map((vehicle) => (now - +new Date(vehicle.lastUpdated)) / 60000)
            ?.sort((v1, v2) => {
                return v1 - v2;
            });

        var half = Math.floor(sorted.length / 2);
        if (sorted.length % 2) return sorted[half];

        return (sorted[half - 1] + sorted[half]) / 2.0;
    }, [vehicles]);

    let delayText;
    if (medianDelay < 1) {
        delayText = `${Math.round(medianDelay * 60)}s`;
    } else {
        delayText = `${Math.round(medianDelay)}m`;
    }

    return (
        <Container>
            <Title>Median time delay: {delayText}</Title>
        </Container>
    );
};

export default DelayIndicator;
