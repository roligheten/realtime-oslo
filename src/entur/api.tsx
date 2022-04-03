import {
    ApolloClient,
    gql,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
    split,
    useQuery,
    useSubscription,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useEffect, useMemo } from "preact/hooks";
import { keyBy } from "./utils";

const RUTER_LINES_QUERY = gql`
    query {
        authority(id: "RUT:Authority:RUT") {
            lines {
                id
                publicCode
                transportMode
            }
        }
    }
`;

const RUTER_VEHICLE_POS_QUERY = gql`
    query {
        vehicles(codespaceId: "RUT") {
            lastUpdated
            vehicleId
            mode
            direction
            line {
                lineRef
            }
            location {
                latitude
                longitude
            }
        }
    }
`;

const RUTER_VEHICLE_POS_SUBSCRIPTION = gql`
    subscription {
        vehicles(codespaceId: "RUT") {
            lastUpdated
            vehicleId
            mode
            direction
            line {
                lineRef
            }
            location {
                latitude
                longitude
            }
        }
    }
`;

export type VehicleResult = {
    lastUpdated: string;
    vehicleId: string;
    direction: string;
    line: {
        lineRef: string;
    };
    mode: "BUS" | "TRAM" | "FERRY";
    location: {
        latitude: number;
        longitude: number;
    };
};

export type VehicleQueryResult = {
    vehicles: VehicleResult[];
};

export type LineResult = {
    id: string;
    publicCode: string;
    mode: "BUS" | "TRAM" | "FERRY";
};

export type LinesQueryResult = {
    lines: LineResult[];
};

export type LinesRawQueryResult = {
    authority: {
        lines: {
            id: string;
            publicCode: string;
            transportMode: "bus" | "water" | "tram";
        }[];
    };
};

export type EnturVehicleApiClient = ApolloClient<any>;
export type EnturJourneyPlannerApiClient = ApolloClient<any>;

export const createVehicleApiClient = () => {
    const wsLink = new WebSocketLink(
        new SubscriptionClient(
            "wss://api.entur.io/realtime/v1/vehicles/subscriptions",
            { reconnect: true, reconnectionAttempts: 5 }
        )
    );

    const httpLink = new HttpLink({
        uri: "https://api.entur.io/realtime/v1/vehicles/graphql",
    });

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            );
        },
        wsLink,
        httpLink
    );

    return new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache(),
    }) as EnturVehicleApiClient;
};

export const createJourneyPlannerApiClient = () => {
    return new ApolloClient({
        link: new HttpLink({
            uri: "https://api.entur.io/journey-planner/v3/graphql",
        }),
        cache: new InMemoryCache(),
    }) as EnturJourneyPlannerApiClient;
};

export const useVehicleSubscription = (client: EnturVehicleApiClient) => {
    const { data, loading, error, subscribeToMore } =
        useQuery<VehicleQueryResult>(RUTER_VEHICLE_POS_QUERY, { client });

    useEffect(() => {
        const unsub = subscribeToMore({
            document: RUTER_VEHICLE_POS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData: { data } }) => {
                return {
                    vehicles: Object.values(
                        keyBy(
                            [
                                ...(prev?.vehicles ?? []),
                                ...(data?.vehicles ?? []),
                            ],
                            ({ vehicleId }: VehicleResult) => vehicleId
                        )
                    ),
                };
            },
        });

        return unsub;
    }, [subscribeToMore]);

    return { data, loading, error };
};

export const useVehicleQuery = (client: EnturVehicleApiClient) => {
    const { data, loading, error } = useQuery<VehicleQueryResult>(
        RUTER_VEHICLE_POS_QUERY,
        { client }
    );

    return { data, loading, error };
};

const convertTransportMode = (transportMode: string) => {
    switch (transportMode) {
        case "bus":
            return "BUS";
        case "tram":
            return "TRAM";
        case "water":
            return "FERRY";
        default:
            return "BUS";
    }
};

export const useLinesQuery = (client: EnturVehicleApiClient) => {
    const { data, loading, error } = useQuery<LinesRawQueryResult>(
        RUTER_LINES_QUERY,
        { client }
    );

    const flattenedData = useMemo(() => {
        return data?.authority?.lines?.map(
            (line) =>
                ({
                    id: line.id,
                    publicCode: line.publicCode,
                    mode: convertTransportMode(line.transportMode),
                } as LineResult)
        );
    }, [data]);

    return {
        data:
            flattenedData !== undefined
                ? ({ lines: flattenedData } as LinesQueryResult)
                : undefined,
        loading,
        error,
    };
};

export type VehicleWithLine = Omit<VehicleResult, "line"> & {
    line: LineResult;
};

export const useVehiclesLineData = (
    vehiclesClient: EnturVehicleApiClient,
    journeyPlannerClient: EnturJourneyPlannerApiClient
) => {
    const {
        data: linesData,
        error: linesError,
        loading: linesLoading,
    } = useLinesQuery(journeyPlannerClient);

    const {
        data: vehiclesData,
        error: vehiclesError,
        loading: vehiclesLoading,
    } = useVehicleSubscription(vehiclesClient);

    const indexedLines = useMemo(() => {
        return linesData?.lines?.reduce((acc, line) => {
            acc[line.id] = line;

            return acc;
        }, {} as Record<string, LineResult>);
    }, [linesData]);

    const vehiclesWithLines = useMemo(() => {
        if (indexedLines && vehiclesData) {
            return vehiclesData.vehicles.map(
                (vehicle) =>
                    ({
                        ...vehicle,
                        line: indexedLines[vehicle.line.lineRef],
                    } as VehicleWithLine)
            );
        }
    }, [indexedLines, vehiclesData]);

    return {
        data: vehiclesWithLines,
        loading: vehiclesLoading || linesLoading,
        error: vehiclesError || linesError,
    };
};
