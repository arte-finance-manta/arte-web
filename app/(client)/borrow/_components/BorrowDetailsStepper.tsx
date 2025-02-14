import React, { useMemo } from "react";
import { Coins, ShieldAlert, TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CoinMarketCapSchema, PoolSchema, SupplyCollateralAndBorrow } from "@/lib/validation/types";
import { UseFormReturn } from "react-hook-form";
import { formatNumberWithDots } from "@/lib/utils";
import { normalize } from "@/lib/helper/bignumber";

interface BorrowDetailsStepperProps {
  form: UseFormReturn<SupplyCollateralAndBorrow>;
  selectedPool?: PoolSchema;
  selectedBorrowToken?: CoinMarketCapSchema | null;
  priceOracle?: number;
  decimal?: number;
}

const BorrowDetailsStepper: React.FC<BorrowDetailsStepperProps> = ({
  form,
  selectedPool,
  selectedBorrowToken,
  priceOracle,
  decimal
}) => {
  const borrowAmount = form.watch("borrowAmount");
  const maxBorrow = useMemo(() =>
    Number(normalize(Number(selectedPool?.ltv) * Number(priceOracle), decimal ?? 0)),
    [selectedPool, priceOracle, decimal]
  );

  const liquidationValue = useMemo(() =>
    Number(selectedPool?.lth) * Number(borrowAmount || "0") / 100,
    [selectedPool, borrowAmount]
  );

  const riskLevelCalculation = useMemo(() => {
    if (!borrowAmount || !maxBorrow) return 0;
    const borrowPercentage = (parseFloat(borrowAmount) / Number(maxBorrow)) * 100;
    return Math.min(borrowPercentage, 100);
  }, [borrowAmount, maxBorrow]);

  return (
    <Card className="sticky top-4 border-2 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="text-primary" /> Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-lg flex items-center gap-2">
            Borrow Rate <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Annual Percentage Rate (APR) for borrowing
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="text-4xl font-bold mt-2 flex items-center gap-2">
            {normalize(selectedPool?.borrowRate || 0, 16)}% <TrendingUp className="text-blue-500" />
          </div>
          <Label className="font-normal text-muted-foreground mt-2">
            Borrowing {selectedBorrowToken?.name} rate
          </Label>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <ShieldAlert size={16} /> Liquidation Risk
            </Label>
            <Progress
              value={riskLevelCalculation}
              className="mt-2"
              indicatorColor={
                riskLevelCalculation < 33 ? "bg-green-500" :
                  riskLevelCalculation < 66 ? "bg-yellow-500" :
                    "bg-red-500"
              }
            />
            <Label className="text-sm text-muted-foreground mt-1">
              {riskLevelCalculation < 33 ? "Low" :
                riskLevelCalculation < 66 ? "Medium" :
                  "High"} Risk
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>LTV</Label>
              <div className="font-bold">{selectedPool?.ltv || "0"}%</div>
            </div>
            <div>
              <Label>LTH</Label>
              <div className="font-bold">{selectedPool?.lth || "0"}%</div>
            </div>
            <div>
              <Label>Max Borrow</Label>
              <div className="font-bold">{formatNumberWithDots(maxBorrow || 0) || "0"}</div>
            </div>
            <div>
              <Label>Liquidation Value</Label>
              <div className="font-bold">{formatNumberWithDots(liquidationValue || 0) || "0"}</div>
            </div>
            <div>
              <Label>Collateral Value</Label>
              <div className="font-bold">
                {formatNumberWithDots(Number(normalize(priceOracle?.toString() || "0", 6))) || "0"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BorrowDetailsStepper;