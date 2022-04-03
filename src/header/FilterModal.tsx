import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import styled from "styled-components";
import { LineResult, VehicleWithLine } from "../entur/api";
import LineButton from "./LineButton";

const ModalContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: #00000087;
    z-index: 10000;
    padding: 3vh 3vw;
`;

const Modal = styled.div`
    background: white;
    flex: 1 1 0;
    max-width: 500px;
    background: white;
    z-index: 1000;
    align-self: baseline;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    background: #2a2859;
    width: 100%;
    padding: 10px;
`;

const Title = styled.span`
    font-size: 12pt;
    color: white;
    flex: 1 1 auto;
`;

const Button = styled.button`
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

const LineContainer = styled.div`
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    gap: 5px;
`;

type FilterModalProps = {
    vehicles: VehicleWithLine[] | undefined;
    onClose: () => void;
    onLineToggled: (lineId: string) => void;
    filteredLineIds: string[];
};

const FilterModal: FunctionalComponent<FilterModalProps> = ({
    children,
    vehicles,
    onClose,
    filteredLineIds,
    onLineToggled,
}) => {
    const lines = useMemo(() => {
        return Object.values(
            vehicles?.reduce((acc, vehicle) => {
                if (vehicle?.line?.id) {
                    acc[vehicle.line.id] = vehicle.line;
                }
                return acc;
            }, {} as Record<string, LineResult>) ?? {}
        );
    }, [vehicles]);

    return (
        <ModalContainer>
            <Modal>
                <ModalHeader>
                    <Title>Click line(s) to show</Title>
                    <Button onClick={onClose}>Close</Button>
                </ModalHeader>
                <LineContainer>
                    {lines?.map(({ id, mode, publicCode }) => (
                        <LineButton
                            active={
                                filteredLineIds.length === 0 ||
                                filteredLineIds.includes(id)
                            }
                            lineRef={id}
                            mode={mode}
                            publicCode={publicCode}
                            onClick={onLineToggled}
                        />
                    ))}
                </LineContainer>
            </Modal>
        </ModalContainer>
    );
};

export default FilterModal;
