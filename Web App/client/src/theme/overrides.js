import { merge } from "lodash";
import Lists from "./overrides/Lists";
import Pickers from "./overrides/Pickers";
import Tooltip from "./overrides/Tooltip";

function overrides(theme) {
  return merge(
    Lists(theme),
    Pickers(theme),
    Tooltip(theme),
  );
}

export default overrides;
