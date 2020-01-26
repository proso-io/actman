/**
 *
 * Asynchronously loads the component for SearchActivities
 *
 */

import loadable from "utils/loadable";

export default loadable(() => import("./index"));
