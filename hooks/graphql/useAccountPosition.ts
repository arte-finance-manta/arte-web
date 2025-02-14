import { AccountPositionSchema } from "@/lib/validation/types";
import useCurrentAccount from "./useCurrentAccount";

export default function useAccountPosition() {
    const { accountData, accountLoading: accountPositionLoading, accountRefetching: accountPositionRefetching } = useCurrentAccount();

    const accountPositionData: AccountPositionSchema[] = accountData?.positions || [];

    return {
        accountPositionData,
        accountPositionLoading,
        accountPositionRefetching
    }
}
