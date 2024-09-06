import { useState } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { MdVerifiedUser } from "react-icons/md";

//icons
import {
  MdOutlineVerified,
  MdOutlineAccountCircle,
  MdOutlineSettings,
} from "react-icons/md";

const ProgressBar = ({ currentStep }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: "Claim",
      description: "Details about your account.",
      icon: MdOutlineVerified,
    },
    {
      label: "Experience & Skills",
      description: "Verify your information.",
      icon: MdVerifiedUser,
    },
    {
      label: "Step3",
      description: "Complete your setup.",
      icon: MdOutlineSettings,
    },
    {
      label: "Step3",
      description: "Complete your setup.",
      icon: MdOutlineSettings,
    },
  ];

  return (
    <div className="w-full flex items-center px-24 py-4 mb-20">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index} className="h-5 w-5 bg-slate-300">
            <div className="flex items-center justify-center">{step.label}</div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default ProgressBar;
