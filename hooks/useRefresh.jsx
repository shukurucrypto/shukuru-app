import { useDispatch, useSelector } from 'react-redux'
import { fetchBalance } from '../features/balances/balancesSlice'
import { fetchUserGas } from '../features/gas/gasSlice'
import { fetchCheckreward } from '../features/rewards/rewardsSlice'
import { fetchTransactions } from '../features/transactions/transactionsSlice'

const useRefresh = () => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { token, bolt } = useSelector((state) => state.tokenState)

  const refresh = () => {
    fetchCheckreward(dispatch, token)
    fetchBalance(dispatch, user.userId, token, bolt)
    fetchTransactions(dispatch, user.userId)
    fetchUserGas(dispatch, user.userId, token)
  }

  // fetchBalance(dispatch, user.userId, tokenState.token, tokenState.bolt)
  // fetchTransactions(dispatch, user.userId)

  // fetchCheckreward(dispatch, user.token)

  // fetchUserGas(dispatch, user.userId, tokenState.token)

  return { refresh }
}

export default useRefresh
