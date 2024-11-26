import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { TiTickOutline } from 'react-icons/ti';
import { parseEther } from 'viem';
import { contractConfig } from '../../../alchemy';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAppContext } from '../AppContext';

export const Deposit = ({ refetch }) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { depositing, setDepositing, depositFunction, refetchBalance } =
    useAppContext();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const submitDeposit = () => {
    try {
      const depositAmountInEther = parseEther(depositAmount.toString());
      console.log(depositAmount, depositAmountInEther);
      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'deposit',
        value: depositAmountInEther,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (hash) {
      toast.loading('Deposit submitted', { id: hash });
      setDepositing(false);
    }
    if (isConfirming) {
      toast.loading('Confirming deposit...', { id: hash });
    }
    if (isConfirmed) {
      toast.success(
        <div>
          Deposit successful!{''}
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
      toast.error('Deposit failed', { id: hash });
    }
  }, [hash, isConfirming, isConfirmed, error]);

  if (!depositing) return <button onClick={depositFunction}>Deposit</button>;

  return (
    <div>
      <p className='pb-2'>Enter amount (in credits)</p>
      <div className='flex justify-center'>
        <button
          className='flex justify-center w-[40px] my-auto'
          onClick={() => setDepositing(false)}
        >
          <MdOutlineCancel size='25px' />
        </button>
        <input
          type='number'
          placeholder='0'
          onChange={(e) => setDepositAmount(e.target.value / 10000)}
          className='rounded-full text-center pl-2 border-2 border-[#323546] text-black w-[50%] text-md flex justify-center'
        />
        <button
          className='flex justify-center w-[40px] my-auto disabled:opacity-20 disabled:hover:cursor-not-allowed'
          onClick={submitDeposit}
          disabled={depositAmount <= 0}
        >
          <TiTickOutline size='28px' />
        </button>
      </div>
    </div>
  );
};
