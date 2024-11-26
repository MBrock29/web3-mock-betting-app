'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import toast, { Toaster } from 'react-hot-toast';
import { contractConfig } from '../../alchemy';
import './globals.css';
import Header from './components/Header';
import { formatUnits } from 'ethers';
import { odds, homeWin, awayWin, draw } from './components/Odds';
import { useAppContext } from './AppContext';

const Home = () => {
  const { writeContract, data: hash, error } = useWriteContract();
  const { address, chain } = useAccount();
  const [loggedIn, setLoggedIn] = useState(false);
  const [betAmount, setBetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultIn, setResultIn] = useState(false);
  const [result, setResult] = useState(null);
  const [teamSelected, setTeamSelected] = useState('');
  const [displayResultOutcome, setDisplayResultOutcome] = useState('');
  const [betDisabled, setBetDisabled] = useState(true);
  const { fractions, handleChange, setDepositing } = useAppContext();
  const [selection, setSelection] = useState({});
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
  };

  const weiConv = 1000000000000000000;
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: playerBalance, refetch } = useReadContract({
    abi: contractConfig.abi,
    address: contractConfig.address,
    functionName: 'getBalance',
    args: [address],
  });

  const balance = playerBalance
    ? parseFloat(formatUnits(playerBalance, 'ether')) * 10000
    : 0;

  const { refetch: refetchBetOutcome } = useReadContract({
    address: contractConfig.address,
    abi: contractConfig.abi,
    functionName: 'getResult',
  });

  useEffect(() => {
    let toastTimer;
    if (chain !== 11155111n && loggedIn) {
      toastTimer = setTimeout(() => {
        toast.error('Please connect to the Sepolia test network.', {
          duration: 10000,
          style: {
            marginTop: '50px',
          },
        });
      }, 1000);
    }
    return () => clearTimeout(toastTimer);
  }, [chain, loggedIn]);

  useEffect(() => {
    if (betAmount > 1000 || betAmount > balance || loading) {
      setBetDisabled(true);
    } else {
      setBetDisabled(false);
    }
  }, [betAmount, balance, loading]);

  const handleTeamClicked = (team, x) => {
    console.log(team, x);
    setResultIn(false);

    if (team === x.homeTeam) {
      betTeam(x.homeOddsDec, x.homePerc, 'betHomeTeam', 'home');
    } else if (team === x.draw) {
      betTeam(x.drawOddsDec, x.drawPerc, 'betDraw', 'draw');
    } else {
      betTeam(x.awayOddsDec, x.awayPerc, 'betAwayTeam', 'away');
    }
    setSelection({
      teamSelected: team,
      homeTeam: x.homeTeam,
      awayTeam: x.awayTeam,
    });
  };

  const betTeam = async (odds, perc, selectedOutcome, selectedOutcomeType) => {
    try {
      const convertedBetAmount = ((betAmount * weiConv) / 10000).toString();
      const oddsRounded = Math.round(odds * 100);
      setTeamSelected(selectedOutcomeType);
      writeContract({
        abi: contractConfig.abi,
        address: contractConfig.address,
        functionName: selectedOutcome,
        args: [convertedBetAmount, oddsRounded, perc],
      });
    } catch (err) {
      setLoading(false);
      toast.error('Transaction failed, no money was taken. Please try again.', {
        duration: 6000,
        style: { marginTop: '50px' },
      });
    }
  };

  useEffect(() => {
    const handleBetResult = async () => {
      if (hash) {
        toast.loading('Bet submitted', { id: hash });
        setLoading(true);
        setDepositing(false);
      }
      if (isConfirming) {
        toast.loading('Confirming bet...', { id: hash });
      }
      if (isConfirmed) {
        toast.success(
          <div>
            <span className='mb-2'>Bet successful!</span>
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

        try {
          const result = await refetchBetOutcome();
          setResult(result.data);
          setResultIn(true);
          await refetch();
        } catch (error) {
          console.error(
            'An error occurred during the async operations:',
            error
          );
        }
      }
      if (error) {
        toast.error('Deposit failed', { id: hash });
      }
    };

    handleBetResult();
  }, [hash, isConfirming, isConfirmed, error]);

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  useEffect(() => {
    setLoading(false);
    setBetAmount('');
    const displayResult = () => {
      if (result) {
        switch (teamSelected) {
          case 'home':
            return <span>{getRandomElement(homeWin)}</span>;
          case 'draw':
            return <span>{getRandomElement(draw)}</span>;
          case 'away':
            return <span>{getRandomElement(awayWin)}</span>;
          default:
            return null;
        }
      } else {
        let otherOptions = [];
        if (teamSelected !== 'home')
          otherOptions = otherOptions.concat(homeWin);
        if (teamSelected !== 'draw') otherOptions = otherOptions.concat(draw);
        if (teamSelected !== 'away')
          otherOptions = otherOptions.concat(awayWin);
        return <span>{getRandomElement(otherOptions)}</span>;
      }
    };

    setDisplayResultOutcome(displayResult());
  }, [resultIn]);

  const changeInput = (e) => {
    setResultIn(false);
    setBetAmount(e.target.value);
  };

  return (
    <div className='flex flex-col items-center min-h-screen text-white'>
      <Toaster />
      <Header
        balance={balance}
        fractions={fractions}
        handleChange={handleChange}
        refetch={refetch}
        handleDisconnect={handleDisconnect}
      />

      <div className='flex w-11/12 justify-evenly mx-auto text-sm sm:text-lg flex-col sm:flex-row '>
        <div className='flex w-fit mx-auto h-fit mb-5 sm:mb-0 sm:w-4/12 flex-col sm:mr-5 sm:items-center bg-[#311b61] p-5 rounded-lg sm:min-h-[430px] text-center'>
          <div>
            <h4 className='mb-6'>Enter an amount and select a result!</h4>
            <h4 className='mb-6'>Maximum bet amount: 1000</h4>
            <h4 className='mb-6'>Good luck!</h4>
            <input
              type='number'
              placeholder='Enter bet amount'
              className='flex text-center rounded-full mx-auto text-black pl-4'
              max={balance}
              value={betAmount}
              onChange={(e) => changeInput(e)}
            />
          </div>

          {loading && (
            <img
              src='https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDRubG84am9rMXpqdmNrNHljNGp2NjFjYnJveG1kajRucTRkOGN5diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1itbXhSnMBkYEztiMQ/giphy.gif'
              width={190}
              height={142}
              alt='Loading...'
              className=' mt-4 rounded-xl mx-auto '
            />
          )}

          {resultIn && (
            <div className='mt-6 md:text-2xl text-center'>
              <h2 className='mb-4 font-bold'>
                Your selection is {selection.teamSelected}
              </h2>
              <h2 className='mb-4 md:text-xl'>
                Result is... <br />
                <div className='mt-4'>
                  {selection.homeTeam} {displayResultOutcome}{' '}
                  {selection.awayTeam}
                </div>
              </h2>
              <h2 className='md:text-xl'>
                {result
                  ? 'Congratulations!'
                  : 'Unlucky, better luck next time!'}
              </h2>
            </div>
          )}
        </div>

        <div className='flex w-fit xs:w-full text-xs max-w-[1000px] sm:text-sm sm:w-8/12 mb-6 flex-col mx-auto sm:ml-5 bg-[#311b61] p-5 rounded-lg h-full overflow-auto'>
          {odds.map((x, index) => (
            <div
              className='flex w-full flex-col xs:flex-row mb-8 xs:mb-0'
              key={index}
            >
              <div className='w-full xs:w-1/2 flex justify-center items-center font-bold text-md'>
                <span className='mx-1 xs:w-1/3 flex justify-end text-right'>
                  {x.homeTeam}
                </span>
                <div className='mx-2 flex justify-center items-center'>
                  <img
                    src={x.homeTeamImage}
                    className='w-[30px] h-[30px] mx-1'
                  />
                  <span className='mx-2'>Vs</span>
                  <img src={x.awayTeamImage} className='w-[30px] h-[30px]' />
                </div>
                <span className='mx-1 xs:w-1/3'>{x.awayTeam}</span>
              </div>
              <div className='w-full xs:w-1/2 flex-col xs:flex-row xs:justify-end'>
                <button
                  className='border-2 border-opacity-40 rounded-lg mx-2 w-full xs:w-auto xs:min-w-[124px] border-white font-bold py-2 px-5 my-2 bg-[#361e65] odds-box'
                  onClick={() => handleTeamClicked(x.homeTeam, x)}
                  disabled={betDisabled}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm mb-1  opacity-50'>1</span>
                    {fractions ? x.homeOddsFrac : x.homeOddsDec.toFixed(2)}
                  </div>
                </button>

                <button
                  className='border-2 border-opacity-40 rounded-lg mx-2 w-full xs:w-auto xs:min-w-[124px] font-bold py-2 px-5 my-2 bg-[#361e65] border-white odds-box'
                  onClick={() => handleTeamClicked(x.draw, x)}
                  disabled={betDisabled}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm mb-1 opacity-50'>X</span>
                    {fractions ? x.drawOddsFrac : x.drawOddsDec.toFixed(2)}
                  </div>
                </button>

                <button
                  className='border-2 border-opacity-40 rounded-lg mx-2 border-r-2 w-full xs:w-auto xs:min-w-[124px] border-white  font-bold py-2 px-5 my-2 bg-[#361e65] odds-box overflow-hidden whitespace-nowrap text-ellipses'
                  onClick={() => handleTeamClicked(x.awayTeam, x)}
                  disabled={betDisabled}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm mb-1 opacity-50'>2</span>
                    {fractions ? x.awayOddsFrac : x.awayOddsDec.toFixed(2)}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
