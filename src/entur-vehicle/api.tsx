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
import { useEffect } from "preact/hooks";
import { keyBy } from "./utils";

const RUTER_VEHICLE_POS_QUERY = gql`
    query {
        vehicles(codespaceId: "RUT") {
            lastUpdated
            vehicleId
            mode
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
            location {
                latitude
                longitude
            }
        }
    }
`;

export type VehicleResult = {
    lastUpdate: number;
    vehicleId: string;
    mode: "AIR" | "BUS" | "RAIL" | "TRAM" | "COACH" | "FERRY" | "METRO";
    location: {
        latitude: number;
        longitude: number;
    };
};

export type VehicleQueryResult = {
    vehicles: VehicleResult[];
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

export const useVehicleQuery = (client: EnturVehicleApiClient) => {
    const { data, loading, error, subscribeToMore } =
        useQuery<VehicleQueryResult>(RUTER_VEHICLE_POS_QUERY, { client });

    useEffect(() => {
        const unsub = subscribeToMore({
            document: RUTER_VEHICLE_POS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData: { data } }) => {
                return {
                    vehicles: Object.values(
                        keyBy(
                            [...prev.vehicles, ...data.vehicles],
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
