import { CoinImage } from "@/components/coin/CoinImage"
import SuccessDialog from "@/components/dialog/SuccessDialog"
import { LoadingTransaction } from "@/components/loader/LoadingTransaction"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDepositCurator } from "@/hooks/contract/write/useDepositCurator"
import { EarnSchema } from "@/lib/validation/types"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAccount } from "wagmi"
import { useERC20Balance } from "@/hooks/contract/useERC20Balance"
import SkeletonWrapper from "@/components/loader/SkeletonWrapper"
import { useAssetCurator } from "@/hooks/contract/useAssetCurator"
import { toast } from "sonner"
import { normalize, normalizeBN } from "@/lib/helper/bignumber"
import BigNumber from "bignumber.js"
import { useDecimal } from "@/hooks/contract/useDecimal"

const depositFormSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number(val)),
      "Amount must be a valid number"
    )
    .refine(
      (val) => new BigNumber(val).isGreaterThan(0),
      "Amount must be greater than 0"
    )
    .refine(
      (val) => !val.includes('-'),
      "Negative amounts are not allowed"
    )
})

type DepositFormData = z.infer<typeof depositFormSchema>

interface DepositProps {
  filteredData?: EarnSchema
}

export default function Deposit({ filteredData }: DepositProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { address } = useAccount()

  const { assetCurator } = useAssetCurator(filteredData?.curator as HexAddress)

  const {
    mutation,
    txHash
  } = useDepositCurator(assetCurator as HexAddress, filteredData?.curator as HexAddress)

  const {
    decimal
  } = useDecimal(filteredData?.asset as HexAddress)

  const {
    balance,
    balanceLoading
  } = useERC20Balance(address as HexAddress, filteredData?.asset as HexAddress || "")

  const form = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: "",
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = form

  const amount = watch("amount")

  const validateMaxDeposit = (inputAmount: string) => {
    if (!balance) {
      setError("amount", {
        type: "manual",
        message: "Unable to determine available balance"
      })
      return false
    }

    const inputAmountBN = decimal && normalizeBN(inputAmount, decimal ?? 0)
    const balanceBN = decimal && normalizeBN(balance.toString(), decimal ?? 0)

    if (inputAmountBN instanceof BigNumber && balanceBN instanceof BigNumber && inputAmountBN.isGreaterThan(balanceBN)) {
      setError("amount", {
        type: "manual",
        message: "Amount exceeds available balance"
      })
      return false
    }

    clearErrors("amount")
    return true
  }

  const handleMaxDeposit = () => {
    if (!balance) return

    const maxAmount = decimal ? normalize(balance.toString(), decimal ?? 0).toString() : ""
    setValue("amount", maxAmount, {
      shouldValidate: true
    })
    validateMaxDeposit(maxAmount)
  }

  const onSubmit = async (data: DepositFormData) => {
    if (!validateMaxDeposit(data.amount)) {
      return
    }

    mutation.mutate(
      {
        amount: data.amount,
        decimal: decimal,
        tokenAddress: filteredData?.asset as HexAddress
      },
      {
        onSuccess: () => {
          setShowSuccessDialog(true)
          form.reset()
        },
        onError: (error) => {
          toast.error(`Error depositing: ${error}`)
          console.error("Error depositing:", error)
        },
      }
    )
  }

  const formattedBalance = balance
    ? Number(normalize(balance.toString(), decimal ?? 0)).toFixed(2)
    : "0.00"

  return (
    <>
      {mutation.isPending && <LoadingTransaction message={"Loading.."} />}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        txHash={txHash as `0x${string}` || ""}
        processName="Deposit"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Card className="w-full p-5">
          <CardContent className="flex flex-col gap-5 p-0">
            <div className="flex flex-row justify-between items-center">
              <Label>Deposit</Label>
              <SkeletonWrapper isLoading={balanceLoading} fullWidth={false}>
                <div className="flex flex-row gap-2 items-center">
                  <Wallet />
                  <Label>{formattedBalance}</Label>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="cursor-pointer px-3"
                    onClick={handleMaxDeposit}
                    disabled={mutation.isPending || balanceLoading}
                  >
                    <Label className="text-[11px] cursor-pointer">Max</Label>
                  </Button>
                </div>
              </SkeletonWrapper>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative flex flex-row justify-between items-center">
                <Input
                  className="w-full pr-10 text-sm"
                  type="number"
                  step="any"
                  min={0}
                  disabled={mutation.isPending}
                  {...register("amount", {
                    onChange: (e) => {
                      validateMaxDeposit(e.target.value)
                    }
                  })}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-fit">
                  <CoinImage symbol={"USDC"} />
                </div>
              </div>
              {errors.amount && (
                <span className="text-red-500 text-sm">
                  {errors.amount.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Button
          type="submit"
          className="w-full"
          disabled={
            mutation.isPending ||
            !amount ||
            !!errors.amount
          }
        >
          Deposit
        </Button>
        <Card className="w-full">
          <CardContent className="p-5 space-y-5">
            <Label className="font-bold">Transaction Overview</Label>
            <div className="flex flex-row justify-between">
              <Label className="text-textSecondary">Gas Fee</Label>
              <Label>-</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
}