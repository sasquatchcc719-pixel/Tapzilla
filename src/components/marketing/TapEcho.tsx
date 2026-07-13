/** Site background: NFC tap ripples radiating from one point — the moment of
 * the tap, echoed forever. Pure CSS (see globals: .tz-echo-*), server-safe. */
export function TapEcho() {
  return (
    <div aria-hidden className="tz-echo">
      <div className="tz-echo-tint" />
      <div className="tz-echo-origin">
        <span className="tz-echo-ring" />
        <span className="tz-echo-ring" />
        <span className="tz-echo-ring" />
        <span className="tz-echo-dot" />
      </div>
    </div>
  );
}
