import { merge } from "lodash";
import Tabs from "./props/Tabs";
import TextFields from "./props/TextFields";

function props(theme) {
  return merge(
    Tabs(theme),
    TextFields(theme),
  );
}

export default props;
