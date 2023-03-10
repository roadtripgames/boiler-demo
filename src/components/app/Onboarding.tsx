import Image from "next/image";
import companyLogo from "../../../public/logo.svg";
import { useCallback, useState } from "react";
import { Button } from "../design-system/Button";
import { Input } from "../design-system/Input";
import { ButtonGroup } from "../design-system/ButtonGroup";
import { api } from "../../utils/api";
import { useRouter } from "next/router";

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
    key: "name",
    title: "How should we greet you?",
    fieldType: "text",
    placeholder: "Jane Doe",
    result: "",
  },
  {
    key: "teamName",
    title: "What do you want to name your workspace?",
    fieldType: "text",
    placeholder: "ex: Personal or Acme Corp",
    result: "",
  },
];

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [response, setResponse] = useState<{ name: string; teamName: string }>({
    name: "",
    teamName: "",
  });
  const router = useRouter();

  const handleChangeResponse = useCallback((key: string, value: any) => {
    setResponse((prev: any) => ({ ...prev, [key]: value }));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const step = ONBOARDING_STEPS[stepIndex]!;

  const utils = api.useContext();
  const finishOnboardingMutation = api.user.finishOnboarding.useMutation({
    async onSuccess({ team }) {
      await router.push(`/${team.slug}`);
      utils.invalidate(undefined, { queryKey: [api.user.get.getQueryKey()] });
    },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="ml-24 mt-8">
            <Image src={companyLogo} alt={"company logo"} />
          </div>
          <div className="my-8 flex flex-auto py-24">
            <div className="ml-24 w-full max-w-lg">
              <div className="">
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
                      <Input
                        autoFocus
                        placeholder={step.placeholder}
                        variant="flush"
                        className="min-w-[300px]"
                        onChange={(e) =>
                          handleChangeResponse(step.key, e.target.value)
                        }
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
                    <Button
                      className="mt-4"
                      disabled={finishOnboardingMutation.isLoading}
                    >
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
              &ldquo;Neorepo has been the greatest help to our operations since
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
