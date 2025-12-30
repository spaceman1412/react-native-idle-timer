// Library entrypoint - exports only the public API
export { useIdleTimer } from "./useIdleTimer";
export {
    IdleTimerProvider,
    useIdleTimerContext,
} from "./IdleTimerContext";

// Export types
export type { UseIdleTimerProps } from "./types/useIdleTimerProps";
export type { IdleTimerHandle } from "./types/IdleTimerProps";

