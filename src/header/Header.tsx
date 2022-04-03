import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import styled from "styled-components";
import { useVehiclesLineData } from "../entur/api";
import { useEnturJourneyPlannerApiClient } from "../entur/EnturJourneyPlannerApiProvider";
import { useEnturVehicleApiClient } from "../entur/EnturVehicleApiProvider";
import FilterModal from "./FilterModal";

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 2px solid white;
    background: #2a2859;
    padding: 5px;
`;

const Title = styled.span`
    font-size: 14pt;
    color: white;
    flex: 1 1 auto;
`;

const FilterButton = styled.button`
    font-size: 14pt;
    color: white;
    justify-self: flex-end;
    background: #f96c4b;
    border: unset;
    padding: 2px 10px;
    cursor: pointer;

    &:hover {
        background: #ec5737;
    }
`;

type HeaderProps = {
    onLineToggled: (lineId: string) => void;
    filteredLineIds: string[];
};

export const Header: FunctionalComponent<HeaderProps> = ({
    filteredLineIds,
    onLineToggled,
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    const vehiclesClient = useEnturVehicleApiClient();
    const journeyPlannerClient = useEnturJourneyPlannerApiClient();
    const { data } = useVehiclesLineData(vehiclesClient, journeyPlannerClient);

    return (
        <>
            <HeaderContainer>
                <Title>Oslo Realtime</Title>
                <FilterButton onClick={() => setModalOpen(true)}>
                    + Filters
                </FilterButton>
            </HeaderContainer>
            {modalOpen && (
                <FilterModal
                    filteredLineIds={filteredLineIds}
                    vehicles={data}
                    onClose={() => setModalOpen(false)}
                    onLineToggled={onLineToggled}
                />
            )}
        </>
    );
};
