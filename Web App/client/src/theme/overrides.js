import { merge } from "lodash";
import Autocomplete from "./overrides/Autocomplete";
import Button from "./overrides/Button";
import Fab from "./overrides/Fab";
import IconButton from "./overrides/IconButton";
import Lists from "./overrides/Lists";
import Pickers from "./overrides/Pickers";
import Tabs from "./overrides/Tabs";
import TextFields from "./overrides/TextFields";
import Tooltip from "./overrides/Tooltip";

function overrides(theme) {
  return merge(
    Autocomplete(theme),
    Button(theme),
    Fab(theme),
    IconButton(theme),
    Lists(theme),
    Pickers(theme),
    Tabs(theme),
    TextFields(theme),
    Tooltip(theme),
  );
}

export default overrides;
