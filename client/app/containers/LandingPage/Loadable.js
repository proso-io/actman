/**
 *
 * Asynchronously loads the component for LandingPage
 *
 */

import loadable from "utils/loadable";

export default loadable(() => import("./index"));
