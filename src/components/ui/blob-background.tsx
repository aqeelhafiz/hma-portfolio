/**
 * BlobBackground
 * A few large, heavily-blurred, softly-colored circles that drift
 * slowly behind the page content. Pure CSS (see the `.blob` /
 * `@keyframes drift-*` rules in globals.css), so it costs nothing
 * in JS and only animates `transform` (GPU-friendly).
 *
 * Drop it as the first child of any `relative`/`overflow-hidden`
 * container, before your real content.
 */
export default function BlobBackground() {
  return (
    <div className="blob-field" aria-hidden="true">
      <div className="blob blob--a" />
      <div className="blob blob--b" />
      <div className="blob blob--c" />
    </div>
  )
}
