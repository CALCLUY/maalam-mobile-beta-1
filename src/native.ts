/** Keep touch scrolling native; never intercept touchmove or cancel gestures. */
export function enableNativeTouch(): void {
  if (!window.matchMedia("(pointer: coarse)").matches) return;

  // Prevent long-press menus on controls, but preserve selection in lesson text
  // and the browser's native inertial scrolling everywhere.
  document.addEventListener("contextmenu", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, [role='button'], [role='tab']")) {
      event.preventDefault();
    }
  });
}
