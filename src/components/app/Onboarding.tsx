import Image from "next/image";
import companyLogo from "../../../public/logo.svg";
import { useCallback, useState } from "react";
import { Button } from "../shared/Button";
import { DropdownMenu } from "../shared/Dropdown";
import { TextInput } from "../shared/TextInput";
import { ButtonGroup } from "../shared/ButtonGroup";
import { useFinishOnboarding, UserOnboardingInformation } from "../../lib/user";

type BaseStep = {
  key: string;
  title: string;
};

type TextInputStep = BaseStep & {
  fieldType: "text";
  placeholder: string;
  result: string;
};

type SelectStep = BaseStep & {
  fieldType: "select";
  options: string[];
  placeholder: string;
  result: string;
};

type ButtonGroupStep = BaseStep & {
  fieldType: "button-group";
  selectMultiple?: boolean;
  options: string[];
  result: string | string[];
};

type Step = TextInputStep | SelectStep | ButtonGroupStep;

const ONBOARDING_STEPS: Step[] = [
  {
    key: "full_name",
    title: "How should we greet you?",
    fieldType: "text",
    placeholder: "Jane Doe",
    result: "",
  },
  {
    key: "job_title",
    title: "What is your job title?",
    fieldType: "button-group",
    selectMultiple: false,
    options: [
      "Entrepreneur",
      "Designer",
      "Software Engineer",
      "Marketer",
      "Other",
    ],
    result: "",
  },
  {
    key: "interests",
    title: "What tools are you interested in?",
    fieldType: "button-group",
    selectMultiple: true,
    options: ["React", "TypeScript", "Planetscale", "Vercel", "Supabase"],
    result: [],
  },
];

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [response, setResponse] = useState<UserOnboardingInformation>({
    full_name: "",
    job_title: "",
    interests: [],
  });

  const handleChangeResponse = useCallback(
    (key: string, value: any) => {
      setResponse((prev) => ({ ...prev, [key]: value }));
    },
    [response]
  );

  const step = ONBOARDING_STEPS[stepIndex]!;

  const finishOnboardingMutation = useFinishOnboarding();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="ml-24 mt-8">
            <Image src={companyLogo} alt={"company logo"} />
          </div>
          <div className="my-8 flex flex-auto py-24">
            <div className="ml-24 w-full max-w-lg">
              <div className="rounded-md bg-white">
                <p className="mb-4 text-sm text-slate-400">
                  {stepIndex + 1} of {ONBOARDING_STEPS.length}
                </p>
                <div key={step.key} className={"mb-8"}>
                  <h2 className="mb-4 text-xl font-medium">{step.title}</h2>
                  <form
                    className="flex flex-col items-start gap-y-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const newIndex = stepIndex + 1;
                      if (newIndex === ONBOARDING_STEPS.length) {
                        await finishOnboardingMutation.mutateAsync(response);
                      } else {
                        setStepIndex(newIndex);
                      }
                    }}
                  >
                    {step.fieldType === "text" && (
                      <TextInput
                        autoFocus
                        placeholder={step.placeholder}
                        variant="flush"
                        className="text-lg"
                        onValueChange={(v) => handleChangeResponse(step.key, v)}
                      />
                    )}
                    {step.fieldType === "button-group" && (
                      <ButtonGroup
                        values={step.options}
                        className="w-full max-w-[300px]"
                        selectMultiple={step.selectMultiple}
                        onChange={(indexes) => {
                          const value = step.selectMultiple
                            ? indexes.map((i) => step.options[i])
                            : step.options[indexes[0] ?? 0];

                          handleChangeResponse(step.key, value);
                        }}
                      />
                    )}
                    {step.fieldType === "select" && (
                      <DropdownMenu
                        className="text-lg"
                        placeholder={step.placeholder}
                        values={step.options}
                      />
                    )}
                    <Button className="mt-4">
                      <span className="px-4">
                        {stepIndex === ONBOARDING_STEPS.length - 1
                          ? "Done"
                          : "Next"}
                      </span>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-slate-50 lg:flex">
          <div className="mx-8 flex flex-col gap-y-4">
            <h2 className="max-w-lg text-3xl">
              &ldquo;Selene has been the greatest help to our operations since
              we started our business.&rdquo;
            </h2>
            <div>
              <p className="text-xl">Jeremy Allen White</p>
              <p className="text-slate-500">Head of Operations, RouterWalk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
