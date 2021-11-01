import { merge } from "lodash";
import Select from "./props/Select";
import Tabs from "./props/Tabs";
import TextFields from "./props/TextFields";

function props(theme) {
  return merge(
    Select(theme),
    Tabs(theme),
    TextFields(theme),
  );
}

export default props;
