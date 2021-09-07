import StepConnector from "@material-ui/core/StepConnector";
import { withStyles } from "@material-ui/core/styles";

const RegisterStepConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: "22px",
  },
  active: {
    "& $line": {
      backgroundImage: "linear-gradient(95deg, #2196F3 30%, #21CBF3 90%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage: "linear-gradient(95deg, #2196F3 30%, #21CBF3 90%)",
    },
  },
  line: {
    height: "3px",
    border: 0,
    backgroundColor: "#EAEAF0",
    borderRadius: "1px",
  },
}))(StepConnector);

export default RegisterStepConnector;
