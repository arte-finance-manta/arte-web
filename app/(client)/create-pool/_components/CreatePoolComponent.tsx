"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { poolSchema } from "@/lib/validation/schemas";
import { useCreatePool } from "@/hooks/contract/write/useCreatePool";
import { LoadingTransaction } from "@/components/loader/LoadingTransaction";
import SuccessDialog from "@/components/dialog/SuccessDialog";
import { Progress } from "@/components/ui/progress";
import { CreatePoolSteps } from "./CreatePoolSteps";
import { z } from "zod";
import { useOracle } from "@/hooks/useOracle";
import { useCryptoToken } from "@/hooks/useCryptoToken";
import { useLTV } from "@/hooks/graphql/useLTV";
import PreviewDialogPool from "./PreviewDialogPool";
import { useIRM } from "@/hooks/graphql/useIRM";
import { WarningConnectWallet } from "@/components/web3/warning-connect-wallet";
import { useAccount } from "wagmi";
import { toast } from "sonner";

type FormData = z.infer<typeof poolSchema>;

const CreatePoolComponent = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const { address } = useAccount()

    const steps = [
        { title: "Token Selection", fields: ["collateralAddress", "loanAddress"] },
        { title: "Risk Parameters & Oracle", fields: ["irm", "oracle"] },
        { title: "Loan to Value (LTV) & Liquidation Threshold (LTH)", fields: ["ltv", "lth"] }
    ];

    const { oracleData, oracleLoading } = useOracle()
    const { cryptoTokenData, cryptoTokenLoading } = useCryptoToken()
    const { ltvData, ltvLoading } = useLTV()
    const { irmData, irmLoading } = useIRM()

    const form = useForm<FormData>({
        resolver: zodResolver(poolSchema),
        defaultValues: {
            collateralAddress: "",
            loanAddress: "",
            irm: "",
            oracle: "",
            ltv: "",
            lth: "",
        }
    });

    const {
        mutation,
        txHash
    } = useCreatePool();

    const validateCurrentStep = async () => {
        const currentFields = steps[activeStep].fields as Array<keyof FormData>;
        setValidationError(null);

        const result = await form.trigger(currentFields);
        if (!result) {
            const errors = form.formState.errors;
            const firstError = currentFields.find(field => errors[field]);
            if (firstError) {
                setValidationError(errors[firstError]?.message as string || `${firstError} is required`);
                return false;
            }
        }

        return true;
    };

    const nextStep = async () => {
        const isValid = await validateCurrentStep();
        if (!isValid) return;

        setIsAnimating(true);
        setTimeout(() => {
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
            setValidationError(null);
            setIsAnimating(false);
        }, 300);
    };

    const prevStep = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveStep((prev) => Math.max(prev - 1, 0));
            setValidationError(null);
            setIsAnimating(false);
        }, 300);
    };

    const handleConfirmCreatePool = async () => {
        try {
            const formData = form.getValues();

            const findCollateralAddress = cryptoTokenData?.find(
                (token) => token.platform?.token_address === formData.collateralAddress
            );
            const findLoanAddress = cryptoTokenData?.find(
                (token) => token.platform?.token_address === formData.loanAddress
            );

            if (!findCollateralAddress || !findLoanAddress) {
                console.error("Missing token data");
                return;
            }

            if (formData.lth && formData.ltv && parseFloat(formData.lth) <= parseFloat(formData.ltv)) {
                setValidationError("Liquidation Threshold (LTH) must be higher than Loan to Value (LTV)");
                return;
            }

            mutation.mutate(
                {
                    collateralToken: formData.collateralAddress as HexAddress,
                    loanToken: formData.loanAddress as HexAddress,
                    oracle: formData.oracle as HexAddress,
                    irm: formData.irm as HexAddress,
                    ltv: formData.ltv as string,
                    lth: formData.lth as string,
                },
                {
                    onSuccess: () => {
                        setShowSuccessDialog(true);
                        form.reset();
                    },
                    onError: (error) => {
                        toast.error(`Error borrowing: ${error}`);
                        console.error("Error borrowing:", error);
                    },
                }
            );

            setShowPreviewDialog(false);
        } catch (error) {
            setValidationError("An error occurred while creating the pool.");
            console.error(error);
        }
    };

    const onSubmit = async () => {
        try {
            const isValid = await validateCurrentStep();
            if (!isValid) return;

            setValidationError(null);
            setShowPreviewDialog(true);
        } catch (error) {
            setValidationError("An error occurred while submitting the form.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (mutation.isSuccess) {
            setActiveStep(0);
        }
    }, [form]);

    return (
        <>
            {address ? (
                <>
                    {mutation.isPending && <LoadingTransaction message={"Loading.."} />}
                    <PreviewDialogPool
                        isOpen={showPreviewDialog}
                        onClose={() => setShowPreviewDialog(false)}
                        onConfirm={handleConfirmCreatePool}
                        formData={form.getValues()}
                        oracleData={oracleData}
                        isLoading={mutation.isPending}
                    />
                    <SuccessDialog
                        isOpen={showSuccessDialog}
                        onClose={() => setShowSuccessDialog(false)}
                        txHash={txHash as HexAddress || ""}
                        processName="Create Pool"
                    />
                    <Card className="w-full max-w-xl mx-auto bg-white/5 backdrop-blur-lg border-none shadow-2xl">
                        <CardHeader className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <CardTitle>Create Pool</CardTitle>
                                <CardDescription>
                                    Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
                                </CardDescription>
                            </div>
                            <Progress value={(activeStep + 1) * 100 / steps.length} />
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                                    <CreatePoolSteps
                                        form={form}
                                        validationError={validationError}
                                        activeStep={activeStep}
                                        isAnimating={isAnimating}
                                        oracleData={oracleData}
                                        isOracleLoading={oracleLoading}
                                        cryptoTokenData={cryptoTokenData}
                                        cryptoTokenLoading={cryptoTokenLoading}
                                        ltvData={ltvData}
                                        ltvLoading={ltvLoading}
                                        irmData={irmData}
                                        irmLoading={irmLoading}
                                    />

                                    <div className="flex justify-between mt-8">
                                        <Button
                                            type="button"
                                            onClick={prevStep}
                                            disabled={activeStep === 0}
                                            variant="outline"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Back
                                        </Button>
                                        {activeStep === steps.length - 1 ? (
                                            <Button
                                                type="submit"
                                                disabled={mutation.isPending}
                                            >
                                                Preview Pool
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                            >
                                                Next <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <WarningConnectWallet />
            )}
        </>
    );
};

export default CreatePoolComponent;