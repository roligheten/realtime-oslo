import { FunctionalComponent } from "preact";
import styled from "styled-components";

const Title = styled.span`
    font-size: 12pt;
    color: white;
    flex: 1 1 auto;
`;

const LineButtonInner = styled.button<{
    type: "BUS" | "FERRY" | "TRAM";
    active: boolean;
}>`
    font-size: 14pt;
    color: white;
    width: 50px;
    background: ${(props) =>
        props.type === "BUS"
            ? "rgb(230 0 0)"
            : props.type === "TRAM"
            ? "rgb(11, 145, 239)"
            : "rgb(104, 44, 136)"};
    border: unset;
    opacity: ${(props) => (props.active ? "1" : "0.5")};
    padding: 2px 10px;
    cursor: pointer;
`;

type LineButtonProps = {
    lineRef: string;
    publicCode: string;
    mode: "BUS" | "FERRY" | "TRAM";
    onClick: (lineRef: string) => void;
    active: boolean;
};

const LineButton: FunctionalComponent<LineButtonProps> = ({
    publicCode,
    mode,
    lineRef,
    onClick,
    active,
}) => (
    <LineButtonInner
        active={active}
        onClick={() => onClick(lineRef)}
        type={mode}
    >
        <Title>{publicCode}</Title>
    </LineButtonInner>
);

export default LineButton;
