import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Keyboard, PanResponder } from "react-native";
import { UseIdleTimerProps } from "./types/useIdleTimerProps";

export function useIdleTimer(props: UseIdleTimerProps = {}) {
    const startTime = useRef<number>(Date.now());
    const currentTime = useRef<number>(Date.now());
    const lastIdle = useRef<number>(null);
    const lastReset = useRef<number>(null);

    const pauseTime = useRef<number>(null);

    const isIdle = useRef<boolean>(false);

    const remainingTime = useRef<number>(props.timeout ?? 10); // Time countdown to trigger onIdle

    const currentState = useRef<"running" | "paused" | "idle">("running");

    const tid = useRef<NodeJS.Timeout | null>(null);

    const onIdle = () => {
        console.log("onIdle");
        props.onIdle?.();
    };

    const getCurrentState = () => {
        return currentState.current;
    };

    const getRemainingTime = () => {
        // Handle for special case when user pause the timer
        if (currentState.current === "paused" && pauseTime.current) {
            if (pauseTime.current > 0) {
                return Math.round(pauseTime.current / 1000);
            } else {
                return 0;
            }
        } else {
            const timeOutTime =
                currentTime.current + remainingTime.current * 1000;
            const remainingTimeValue = timeOutTime - Date.now();
            if (remainingTimeValue > 0) {
                return Math.round(remainingTimeValue / 1000);
            } else {
                return 0;
            }
        }
    };

    const pause = () => {
        // We need to clear the timeout and pause the remainingTime
        if (tid.current) {
            clearTimeout(tid.current);
        }

        currentState.current = "paused";
        pauseTime.current =
            currentTime.current + remainingTime.current * 1000 - Date.now();
    };

    const handleIdle = () => {
        isIdle.current = true;

        // Trigger action
        onIdle();
    };

    const resume = () => {
        currentState.current = "running";
        pauseTime.current = null;

        if (!tid.current) {
            tid.current = setTimeout(() => {
                handleIdle();
            }, remainingTime.current * 1000);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                console.log("User touched the screen!");

                reset();
                return false;
            },
        })
    ).current;

    useEffect(() => {
        // On mount
        console.log("mounting");
        tid.current = setTimeout(() => {
            handleIdle();
        }, remainingTime.current * 1000);

        return () => {
            if (tid.current) {
                clearTimeout(tid.current);
            }
        };
    }, []);

    const reset = () => {
        currentTime.current = Date.now();
        lastReset.current = Date.now();
        // isIdle.current = false;

        if (tid.current) {
            clearTimeout(tid.current);
        }

        tid.current = setTimeout(() => {
            handleIdle();
        }, remainingTime.current * 1000);
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            console.log("Keyboard is OPEN");
            reset();
            pause();
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            resume();
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const getIsIdle = useCallback(() => {
        return isIdle.current;
    }, [isIdle.current]);

    const setIsIdle = useCallback(
        (value: boolean) => {
            isIdle.current = value;
        },
        [isIdle.current]
    );

    const idleTimer = {
        panResponder,
        reset,
        currentTime: currentTime.current,
        startTime: startTime.current,
        getRemainingTime,
        pause,
        resume,
        getIsIdle,
        getLastReset: () => lastReset.current,
        getCurrentState,
    };

    return idleTimer;
}
