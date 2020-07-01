import StepConnector from "@material-ui/core/StepConnector";
import { withStyles } from "@material-ui/core/styles";

const RegisterStepConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient(95deg, #2196F3 30%, #21CBF3 90%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient(95deg, #2196F3 30%, #21CBF3 90%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}))(StepConnector);

export default RegisterStepConnector;
