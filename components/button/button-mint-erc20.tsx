import { useMintERC20 } from "@/hooks/contract/write/useMintERC20";
import { Button } from "../ui/button";

export default function ButtonMintERC20({ tokenAddress }: { tokenAddress: HexAddress }) {
  const { mutation, txHash } = useMintERC20();

  const handleMint = async () => {
    try {
      await mutation.mutateAsync({ tokenAddress: tokenAddress });
    } catch (error) {
      console.error("Mint error:", error);
    }
  };

  return (
    <Button
      onClick={handleMint}
      disabled={mutation.isPending}
      className="w-full"
    >
      {mutation.isPending ? "Minting..." : "Mint"}
    </Button>
  );
}