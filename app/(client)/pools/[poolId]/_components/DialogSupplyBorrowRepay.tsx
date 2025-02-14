import React from "react"
import Borrow from "./Borrow"
import Repay from "./Repay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountPositionSchema, AlchemyNftSchema, PoolSchema } from "@/lib/validation/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { OverviewNFT } from "./OverviewNFT"
import WithdrawCollateral from "./WithdrawCollateral"

interface Props {
	filteredData?: PoolSchema
	nftData?: AlchemyNftSchema
	trigger: React.ReactNode
	filteredPosition?: AccountPositionSchema
}

export const DialogSupplyBorrowRepay = ({ filteredData, nftData, trigger, filteredPosition }: Props) => {
	return (
		<Dialog>
			<DialogTrigger>
				{trigger}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg">Details</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="overview" className="w-full">Overview</TabsTrigger>
						<TabsTrigger value="borrow" className="w-full">Borrow</TabsTrigger>
						<TabsTrigger value="repay" className="w-full">Repay</TabsTrigger>
						<TabsTrigger value="withdraw" className="w-full">Withdraw Collateral</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<OverviewNFT nftData={nftData} filteredPosition={filteredPosition} filteredData={filteredData} />
					</TabsContent>
					<TabsContent value="borrow">
						<Borrow filteredData={filteredData} nftData={nftData} />
					</TabsContent>
					<TabsContent value="repay">
						<Repay filteredData={filteredData} nftData={nftData} />
					</TabsContent>
					<TabsContent value="withdraw">
						<WithdrawCollateral filteredData={filteredData} nftData={nftData} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}