import React, { useEffect, useRef, useState } from "react";
import { Keyboard, PanResponder } from "react-native";

export function useIdleTimer() {
    const startTime = useRef<number>(Date.now());
    const lastReset = useRef<number>(Date.now());
    const lastIdle = useRef<number>(null);
    const lastActive = useRef<number>(null);
    const idleTime = useRef<number>(0);
    const totalIdleTime = useRef<number>(0);
    const promptTime = useRef<number>(0);
    const remaining = useRef<number>(0);

    // State References
    const idle = useRef<boolean>(false);
    const prompted = useRef<boolean>(false);
    const paused = useRef<boolean>(false);
    const firstLoad = useRef<boolean>(true);
    const eventsBound = useRef<boolean>(false);
    const tId = useRef<number>(null);

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
        start();
    }, []);

    const start = () => {
        destroyTimeout();

        // Set state
        idle.current = false;
        prompted.current = false;
        paused.current = false;
        remaining.current = 0;
        promptTime.current = 0;

        createTimeout();
    };

    const reset = () => {
        startTime.current = Date.now();
    };

    const createTimeout = () => {
        destroyTimeout();

        setTimeout(toggleIdleState, 1000);
    };

    const toggleIdleState = () => {
        idle.current = !idle.current;
    };

    const destroyTimeout = () => {
        if (tId.current !== null) {
            clearTimeout(tId.current);
            tId.current = null;
        }
    };

    useEffect(() => {
        // --- A. Listen for Keyboard Appearance ---

        // Fired when keyboard starts sliding up
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            console.log("Keyboard is OPEN");
        });

        // Fired when keyboard is fully closed
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            console.log("Keyboard is CLOSED");
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const idleTimer = {
        panResponder,
        start,
        reset,
    };

    return idleTimer;
}
