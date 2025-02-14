import { AccountCuratorSchema } from "@/lib/validation/types";
import useCurrentAccount from "./useCurrentAccount";

export default function useAccountCurator() {
    const { accountData, accountLoading: accountCuratorLoading, accountRefetching: accountCuratorRefetching } = useCurrentAccount();

    const accountCuratorData: AccountCuratorSchema[] = accountData?.earn || [];

    return {
        accountCuratorData,
        accountCuratorLoading,
        accountCuratorRefetching
    }
}
