import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Keyboard, PanResponder, View } from "react-native";
import { IdleTimerProps } from "./types/IdleTimerProps";
import { useIdleTimer } from "./useIdleTimer";
import React from "react";

const IdleTimerContext = createContext(null);

export const useIdleTimerContext = () => {
    const context = useContext(IdleTimerContext);

    return context;
};

export function IdleTimerProvider(props: PropsWithChildren) {
    const idleTimer = useIdleTimer();

    return (
        <IdleTimerContext.Provider value={null}>
            <View style={{ flex: 1 }} {...idleTimer.panResponder.panHandlers}>
                {props.children}
            </View>
        </IdleTimerContext.Provider>
    );
}
