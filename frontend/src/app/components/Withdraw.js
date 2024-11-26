import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { TiTickOutline } from 'react-icons/ti';
import { parseEther } from 'viem';
import { contractConfig } from '../../../alchemy';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAppContext } from '../AppContext';

export const Withdraw = ({ refetch, balance }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const { withdrawing, setWithdrawing, withdrawFunction } = useAppContext();

  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  console.log(parseInt(balance));
  console.log(withdrawalAmount);

  const submitWithdrawal = async () => {
    try {
      const withdrawalAmountInWei = parseEther(withdrawalAmount.toString());

      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'withdraw',
        args: [withdrawalAmountInWei],
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (hash) {
      toast.loading('Withdrawal submitted', { id: hash });
    }
    if (isConfirming) {
      toast.loading('Confirming Withdrawal...', { id: hash });
      setWithdrawing(false);
    }
    if (isConfirmed) {
      toast.success(
        <div>
          Withdrawal successful!
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-green-500 hover:underline'
          >
            <br />
            View on Etherscan
          </a>
        </div>,
        { duration: 5000, id: hash }
      );
      refetch();
    }
    if (error) {
      toast.error('Withdrawal failed', { id: hash });
    }
  }, [hash, isConfirming, isConfirmed, error]);

  if (!withdrawing) return <button onClick={withdrawFunction}>Withdraw</button>;

  return (
    <div>
      <p className='pb-2'>Enter amount (in credits)</p>
      <div className='flex justify-center'>
        <button
          className='flex justify-center w-[40px] my-auto'
          onClick={() => setWithdrawing(false)}
        >
          <MdOutlineCancel size='25px' />
        </button>
        <input
          type='number'
          placeholder='0'
          onChange={(e) => setWithdrawalAmount(e.target.value / 10000)}
          className='rounded-full text-center pl-2 border-2 border-[#323546] text-black w-[50%] text-md flex justify-center'
        />
        <button
          className='flex justify-center w-[40px] my-auto disabled:opacity-20 disabled:hover:cursor-not-allowed'
          onClick={submitWithdrawal}
          disabled={withdrawalAmount * 10000 > balance}
        >
          <TiTickOutline size='28px' />
        </button>
      </div>
    </div>
  );
};
