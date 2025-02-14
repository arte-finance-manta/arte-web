import { AccountLendSchema } from "@/lib/validation/types";
import useCurrentAccount from "./useCurrentAccount";

export default function useAccountLend() {
    const { accountData, accountLoading: accountLendLoading, accountRefetching: accountLendRefetching } = useCurrentAccount();

    const accountLendData: AccountLendSchema[] = accountData?.lend || [];

    return {
        accountLendData,
        accountLendLoading,
        accountLendRefetching
    }
}
