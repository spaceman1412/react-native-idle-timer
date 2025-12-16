import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
    Button,
    Keyboard,
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { IdleTimerProvider, useIdleTimerContext } from "./src/IdleTimerContext";
import { DemoScreen } from "./src";

export default function App() {
    // Show prompt

    return (
        <IdleTimerProvider>
            <DemoScreen />
        </IdleTimerProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
