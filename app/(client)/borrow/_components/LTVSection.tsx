import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { PoolSchema, SupplyCollateralAndBorrow } from "@/lib/validation/types";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { calculateMaxBorrowAmount } from "@/lib/helper/helper";

interface Props {
  form: UseFormReturn<SupplyCollateralAndBorrow>;
  poolLoading: boolean;
  selectedPool?: PoolSchema;
  priceOracle?: number;
  decimal?: number;
}

export const LTVSection = ({ form, poolLoading, selectedPool, priceOracle, decimal }: Props) => {
  const maxLTV = selectedPool?.ltv ? Number(selectedPool.ltv) : 0;
  const currentLTV = form.watch("ltv");

  const getLTVStatusColor = () => {
    if (!currentLTV) return "text-gray-500";
    if (currentLTV <= 30) return "text-green-500";
    if (currentLTV <= 60) return "text-yellow-500";
    if (currentLTV <= 80) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Card className="p-5">
      <CardContent className="p-2">
        <FormField
          control={form.control}
          name="ltv"
          render={({ field }) => (
            <FormItem className="w-full py-5 flex flex-col gap-3 space-y-0">
              <div className="flex flex-row justify-between items-center">
                <FormLabel className="text-xl">Loan to Value (LTV)</FormLabel>
                <SkeletonWrapper isLoading={poolLoading}>
                  <FormLabel className={`text-xl font-bold ${getLTVStatusColor()}`}>
                    {field.value?.toFixed(2)}%
                  </FormLabel>
                </SkeletonWrapper>
              </div>
              <div className="flex flex-row justify-between">
                <FormDescription>
                  Ratio of the collateral value to the borrowed value
                </FormDescription>
                <SkeletonWrapper isLoading={poolLoading}>
                  <FormDescription>
                    Max. {maxLTV.toFixed(2)}%
                  </FormDescription>
                </SkeletonWrapper>
              </div>
              <FormControl>
                <SkeletonWrapper isLoading={poolLoading}>
                  <Slider
                    value={[field.value || 0]}
                    max={maxLTV}
                    disabled={poolLoading || form.getValues("supplyPool") === ""}
                    step={1}
                    onValueChange={(values) => {
                      field.onChange(values[0]);
                      if (selectedPool && priceOracle) {
                        const maxBorrowAmount = calculateMaxBorrowAmount(priceOracle as number, values[0], decimal as number);
                        form.setValue("borrowAmount", maxBorrowAmount.toString());
                      }
                    }}
                    className="cursor-pointer pt-5"
                  />
                </SkeletonWrapper>
              </FormControl>
              <div className="flex justify-between text-xs text-textGraycustom">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
                <span>Liquidation</span>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default LTVSection;