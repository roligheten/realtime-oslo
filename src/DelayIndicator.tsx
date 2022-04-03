import { FunctionalComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
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

const calculateMedianDelay = (vehicles: VehicleWithLine[]) => {
    if (vehicles.length === 0) {
        return 0;
    }

    const now = Date.now();
    const sorted = vehicles
        .map((vehicle) => (now - +new Date(vehicle.lastUpdated)) / 1000)
        ?.sort((v1, v2) => {
            return v1 - v2;
        });

    var half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];

    return (sorted[half - 1] + sorted[half]) / 2.0;
};

const DelayIndicator: FunctionalComponent<DelayIndicatorProps> = ({
    vehicles,
}) => {
    const [delay, setDelay] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setDelay(calculateMedianDelay(vehicles)),
            1000
        );
        return () => {
            clearInterval(interval);
        };
    }, []);

    let delayText;
    if (delay < 1) {
        delayText = `${Math.round(delay)}s`;
    } else {
        const mins = Math.floor(delay / 60);
        delayText = `${mins}m${Math.floor(delay) - mins * 60}s`;
    }

    return (
        <Container>
            <Title>Median time delay: {delayText}</Title>
        </Container>
    );
};

export default DelayIndicator;
