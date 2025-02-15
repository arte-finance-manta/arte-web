import { gql } from "graphql-request";

export const queryPool = gql`{
    pools(orderBy: blockTimestamp, orderDirection: desc) {
        id
        collateralAddress
        borrowRate
        irm
        lendingRate
        loanAddress
        lth
        ltv
        oracle
        supplyAPY
        borrowAPY
        totalBorrowAssets
        totalBorrowShares
        totalSupplyAssets
        totalSupplyShares
        transactionHash
        utilizationRate
        collateralToken {
            id
            collateralToken
        }
        loanToken {
            id
            loanToken
        }
    }
}`

export const querySupplyCollaterals = gql`{
    supplyCollaterals(orderBy: blockTimestamp, orderDirection: desc) {
        id
        poolId
        sender
        tokenId
        onBehalOf
    }
}`

export const queryLTV = gql`{
    ltvs(orderBy: blockTimestamp, orderDirection: desc) {
        ltv
    }
}`

export const queryIRM = gql`{
    interestRateModels(orderBy: blockTimestamp, orderDirection: desc) {
        irm
    }
}`

export const queryCurator = gql`{
    curatorDeployeds(orderBy: blockTimestamp, orderDirection: desc) {
        id
        name
        asset
        symbol
        curator
        allocations
        pools {
            id
        }
    }
}`

export const queryCollateralTokens = gql`{
    collaterals(orderBy: blockTimestamp, orderDirection: desc) {
        id
        collateralToken
        pool {
            id
        }
    }
}`

export const queryLoanTokens = gql`{
    loanTokens(orderBy: blockTimestamp, orderDirection: desc) {
        id
        loanToken
        pool {
            id
        }
    }
}`

export const queryPosition = (account: HexAddress, poolId: string) => gql`{
    positions(where: {account: "${account.toLowerCase()}", pool_: {id: "${poolId}"}}) {
        id
        bidder
        tokenId
        borrowShares
        pool {
            collateralAddress
            borrowRate
            collateralToken {
                collateralToken
                id
            }
            curator {
                name
                id
                curator
                asset
                allocations
                symbol
            }
            id
            irm
            lendingRate
            loanAddress
            loanToken {
                loanToken
                id
            }
            lth
            ltv
            oracle
            totalBorrowAssets
            totalBorrowShares
            totalSupplyAssets
            totalSupplyShares
            utilizationRate
        }
        token {
            id
            tokenId
        }
    }
}`

export const queryBorrow = gql`{
    borrows(orderBy: blockTimestamp, orderDirection: desc) {
        id
        onBehalfOf
        poolId
        receiver
        sender
        shares
        tokenId
        amount
    }
}`

export const queryTokens = gql`{
    tokens {
        id
        tokenId
        pool {
            id
        }
    }
}`

export const queryAccount = (address: HexAddress) => gql`{
    account(id: "${address.toLowerCase()}") {
        id
        lend {
            amount
            onBehalfOf
            pool {
                collateralAddress
                borrowRate
                collateralToken {
                    collateralToken
                    id
                }
                curator {
                    name
                    id
                    curator
                    asset
                    allocations
                    symbol
                }
                id
                irm
                lendingRate
                loanAddress
                loanToken {
                    loanToken
                    id
                }
                lth
                ltv
                oracle
                totalBorrowAssets
                totalBorrowShares
                totalSupplyAssets
                totalSupplyShares
                utilizationRate
            }
            poolId
            shares
            sender
            id
        }
        positions {
            id
            bidder
            tokenId
            borrowShares
            pool {
                collateralAddress
                borrowRate
                collateralToken {
                    collateralToken
                    id
                }
                curator {
                    name
                    id
                    curator
                    asset
                    allocations
                    symbol
                }
                id
                irm
                lendingRate
                loanAddress
                loanToken {
                    loanToken
                    id
                }
                lth
                ltv
                oracle
                totalBorrowAssets
                totalBorrowShares
                totalSupplyAssets
                totalSupplyShares
                utilizationRate
            }
            token {
                id
                tokenId
            }
        }
        earn {
            id
            balance
            curator
        }
    }
}`

export const queryBids = gql`{
    bids(orderBy: blockTimestamp, orderDirection: desc) {
        id
        poolId
        tokenId
        bidder
        amount
        blockTimestamp
    }
}`

export const querySupply = gql`{
    supplies(orderBy: blockTimestamp, orderDirection: desc) {
        id
        poolId
        tokenId
        sender
        onBehalfOf
        amount
    }
}`