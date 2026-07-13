"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type TrackFn = (eventType: string, payload?: Record<string, unknown>) => void;

const TrackerContext = createContext<TrackFn>(() => {});

export function useTrack() {
  return useContext(TrackerContext);
}

function getVisitorKey(): { key: string; returning: boolean } {
  try {
    const existing = localStorage.getItem("tzv");
    if (existing) return { key: existing, returning: true };
    const key = crypto.randomUUID();
    localStorage.setItem("tzv", key);
    return { key, returning: false };
  } catch {
    return { key: crypto.randomUUID(), returning: false };
  }
}

/**
 * Creates the tap (session) on mount, exposes trackEvent to all blocks, and
 * reports duration + scroll depth on pagehide via sendBeacon.
 * `disabled` is used by the builder preview so editing never pollutes analytics.
 */
export function Tracker({
  pageId,
  businessId,
  cardId,
  medium,
  disabled = false,
  children,
}: {
  pageId: string;
  businessId: string;
  cardId: string | null;
  medium: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const tapIdRef = useRef<string | null>(null);
  const queueRef = useRef<Array<{ eventType: string; payload?: Record<string, unknown> }>>([]);
  const maxScrollRef = useRef(0);
  const startRef = useRef(Date.now());
  const endedRef = useRef(false);

  useEffect(() => {
    if (disabled) return;
    const { key, returning } = getVisitorKey();

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "tap",
        pageId,
        businessId,
        cardId,
        medium,
        visitorKey: key,
        isReturning: returning,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.tapId) {
          tapIdRef.current = d.tapId;
          // flush events fired before the tap row existed
          for (const e of queueRef.current) send(e.eventType, e.payload);
          queueRef.current = [];
        }
      })
      .catch(() => {});

    const onScroll = () => {
      const el = document.documentElement;
      const depth = Math.min(
        100,
        Math.round(((window.scrollY + window.innerHeight) / el.scrollHeight) * 100)
      );
      if (depth > maxScrollRef.current) maxScrollRef.current = depth;
    };
    const onHide = () => {
      if (endedRef.current || !tapIdRef.current) return;
      endedRef.current = true;
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          kind: "event",
          tapId: tapIdRef.current,
          businessId,
          eventType: "session_end",
          payload: {
            durationMs: Date.now() - startRef.current,
            scrollDepth: maxScrollRef.current,
          },
        })
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onHide();
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, pageId, businessId, cardId, medium]);

  function send(eventType: string, payload?: Record<string, unknown>) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "event",
        tapId: tapIdRef.current,
        businessId,
        eventType,
        payload: payload ?? {},
      }),
      keepalive: true,
    }).catch(() => {});
  }

  const track: TrackFn = (eventType, payload) => {
    if (disabled) return;
    if (!tapIdRef.current) {
      queueRef.current.push({ eventType, payload });
      return;
    }
    send(eventType, payload);
  };

  return <TrackerContext.Provider value={track}>{children}</TrackerContext.Provider>;
}
