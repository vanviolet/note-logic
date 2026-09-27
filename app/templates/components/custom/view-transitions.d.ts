/**
 * Type definitions for View Transitions API
 * https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

interface ViewTransition {
  /**
   * A Promise that fulfills once the transition animation is finished, and the new page view is visible and interactive to the user.
   */
  finished: Promise<void>;

  /**
   * A Promise that fulfills once the pseudo-element tree is created and the transition animation is about to start.
   */
  ready: Promise<void>;

  /**
   * A Promise that fulfills when the promise returned by the document.startViewTransition()'s callback fulfills.
   */
  updateCallbackDone: Promise<void>;

  /**
   * Skips the animation part of the view transition, but doesn't skip running the document.startViewTransition() callback that updates the DOM.
   */
  skipTransition(): void;
}

interface Document {
  /**
   * Starts a new view transition.
   * @param updateCallback A callback function typically invoked to update the DOM during the view transition process, which returns a Promise. The callback is invoked once the API has taken a screenshot of the current page. When the promise returned by the callback fulfills, the view transition begins in the next frame. If the promise returned by the callback rejects, the transition is abandoned.
   */
  startViewTransition(
    updateCallback?: () => Promise<void> | void,
  ): ViewTransition;
}
