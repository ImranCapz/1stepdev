import { useState } from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";

//icons
import {
  MdOutlineVerified,
  MdOutlineAccountCircle,
  MdOutlineSettings,
} from "react-icons/md";

const ProgressBar = ({ currentStep }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      label: "Step 1",
      description: "Details about your account.",
      icon: MdOutlineVerified,
    },
    {
      label: "Step 2",
      description: "Verify your information.",
      icon: MdOutlineAccountCircle,
    },
    {
      label: "Step 3",
      description: "Complete your setup.",
      icon: MdOutlineSettings,
    },
  ];

  return (
    <div className="w-full px-24 py-4">
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <div className="flex flex-col items-center">
              <step.icon className="h-6 w-6" />
              <div className="text-center mt-6">
                <p
                  className={`text-slate-700 ${
                    activeStep === index + 1 ? "text-blue-500" : ""
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-slate-900 font-semibold">
                  {step.description}
                </p>
              </div>
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default ProgressBar;
