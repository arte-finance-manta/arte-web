import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAccount } from "wagmi";
import { DialogSelectNft } from "@/components/dialog/DialogSelectNft";
import { AlchemyNftSchema, PoolSchema } from "@/lib/validation/types";
import { useSupplyCollateral } from "@/hooks/contract/write/useSupplyCollateral";
import { LoadingTransaction } from "@/components/loader/LoadingTransaction";
import SuccessDialog from "@/components/dialog/SuccessDialog";
import { useEffect, useState } from "react";
import { NftImage } from "@/components/nft/NftImage";
import SkeletonWrapper from "@/components/loader/SkeletonWrapper";
import { toast } from "sonner";
import { useMintNFT } from "@/hooks/contract/write/useMintNFT";

interface SupplyCollateralProps {
  nftData?: AlchemyNftSchema[];
  filteredData?: PoolSchema;
  nftLoading: boolean;
}

interface FormData {
  tokenId: string;
}

export default function SupplyCollateral({ nftData, filteredData, nftLoading }: SupplyCollateralProps) {
  const { address } = useAccount();

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showSuccessDialog2, setShowSuccessDialog2] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<AlchemyNftSchema | null>(null);

  const filterNFTIP = nftData ? nftData?.filter((nft) => nft.contract.address.toLowerCase() === filteredData?.collateralAddress?.toLowerCase()) : []

  const form = useForm<FormData>({
    defaultValues: {
      tokenId: ""
    }
  });

  useEffect(() => {
    if (filterNFTIP && filterNFTIP.length > 0 && !selectedNft) {
      setSelectedNft(filterNFTIP[0]);
      form.setValue("tokenId", filterNFTIP[0].tokenId);
    }
  }, [filterNFTIP, selectedNft, form]);

  const {
    mutation,
    txHash
  } = useSupplyCollateral();

  const handleSubmit = async (data: FormData) => {
    if (!filteredData?.id || !data.tokenId || !address) {
      return;
    }

    mutation.mutate(
      {
        id: filteredData?.id,
        tokenId: data.tokenId,
        onBehalfOf: address,
        tokenAddress: filteredData?.collateralAddress as HexAddress
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
  };

  const { mutation: mintMutation, txHash: mintTxHash } = useMintNFT();

  const handleMintNft = async () => {
    mintMutation.mutate(
      {
        ipAddress: filteredData!.collateralAddress as HexAddress
      },
      {
        onSuccess: () => {
          setShowSuccessDialog2(true);
          form.reset();
        },
        onError: (error) => {
          toast.error(`Error borrowing: ${error}`);
          console.error("Error borrowing:", error);
        },
      }
    );
  };

  const handleSelectNft = (nft: AlchemyNftSchema) => {
    setSelectedNft(nft);
    setIsDialogOpen(false);
    form.setValue("tokenId", nft.tokenId);
  };

  if (!filteredData) {
    return (
      <Card className="w-full p-5">
        <CardContent className="flex justify-center items-center p-4">
          <Label>No data available</Label>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {mutation.isPending && <LoadingTransaction message={"Loading.."} />}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        txHash={txHash as HexAddress || ""}
        processName="Supply Collateral"
      />
      <SuccessDialog
        isOpen={showSuccessDialog2}
        onClose={() => setShowSuccessDialog2(false)}
        txHash={mintTxHash as HexAddress || ""}
        processName="Minting NFT"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
          <Card className="w-full p-5">
            <CardContent className="flex flex-col gap-5 p-0">
              <div className="flex flex-row justify-between items-center">
                <Label>Supply Collateral</Label>
              </div>
              <FormField
                control={form.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="w-full pr-10 py-7 rounded-xl hidden"
                          type="text"
                          placeholder="Enter token id"
                        />
                        <SkeletonWrapper isLoading={nftLoading}>
                          <DialogSelectNft
                            nftData={filterNFTIP || []}
                            isDialogOpen={isDialogOpen}
                            setDialogOpen={setIsDialogOpen}
                            handleSelect={handleSelectNft}
                            nftLoading={nftLoading}
                            trigger={
                              <Button
                                value={selectedNft?.tokenId}
                                variant={"outline"}
                                className="w-full h-auto flex justify-start items-center gap-4 py-4"
                              >
                                <NftImage path={selectedNft?.contract?.openSeaMetadata?.imageUrl &&
                                  selectedNft.contract.openSeaMetadata.imageUrl !== "null"
                                  ? selectedNft.contract.openSeaMetadata.imageUrl
                                  : ""} />
                                <div className="flex flex-col items-start justify-center gap-1">
                                  <Label className="cursor-pointer">{selectedNft?.contract?.symbol}</Label>
                                  <Label className="cursor-pointer text-gray-500 text-xs">Token id: {selectedNft?.tokenId}</Label>
                                </div>
                              </Button>
                            }
                          />
                        </SkeletonWrapper>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                Add Collateral
              </Button>
              <Label className="text-xs text-gray-500 mt-2">Don't have any NFT? Mint one in below, for test only!</Label>

              <Button
                onClick={handleMintNft}
                className="w-full"
                disabled={mintMutation.isPending}
              >
                Mint NFT
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}