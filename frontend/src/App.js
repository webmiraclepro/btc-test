import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from '@mui/icons-material/Check';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { green } from '@mui/material/colors';
import { formatWalletAddress } from './utils';

const App = () => {
  const interval = 10;
  const [address, setAddress] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState("");
  const [btcPrice, setBtcPrice] = useState(0);
  const [result, setResult] = useState(0);

  const handleWallet = () => {
    if (!!address) {
      disconnectWallet();
    } else {
      conectWallet();
    }
  }

  const conectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => setAddress(res[0]));
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }]
      }).then((res) => setAddress(""));
    }
  }

  const handleTimer = () => {
    setTimer((timer) => timer + 1);
  };

  const fetchBtcPrice = async () => {
    const res = await axios.get("https://api.coindesk.com/v1/bpi/currentprice.json");
    return res.data.bpi.USD.rate_float;
  };

  const handleBtcPrice = async () => {
    setLoading(true);

    const newPrice = await fetchBtcPrice();
    setResult(Math.sign(newPrice - btcPrice));
    setBtcPrice(newPrice);
    setLoading(false);
    setChoice("");

    if (!!choice) {
      if (newPrice > btcPrice && choice === "Up") {
        plusScore();
      } else if (newPrice < btcPrice && choice === "Down") {
        plusScore();
      } else {
        minusScore();
      }
    }
  };

  const plusScore = () => {
    axios.post("/api/plus-score", { address }).then(({ data }) => {
      if (data.success) {
        setScore(score => score + 1);
      }
    });
  }

  const minusScore = () => {
    axios.post("/api/minus-score", { address }).then(({ data }) => {
      if (data.success) {
        setScore(score => score - 1);
      }
    });
  }

  useEffect(() => {
    fetchBtcPrice().then(price => setBtcPrice(price));
    const interval = setInterval(handleTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.post('/api/get-score', { address }).then(({ data }) => {
      setScore(data.score);
    });

    setTimer(0);
    setChoice("");
  }, [address]);

  useEffect(() => {
    if (timer > interval) {
      handleBtcPrice();
      setTimer(0);
    }

  // eslint-disable-next-line
  }, [timer]);

  const handleUpClick = () => {
    if (!choice) {
      setChoice("Up");
    }
  };

  const handleDownClick = () => {
    if (!choice) {
      setChoice("Down");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      marginTop={20}
    >
      <Button sx={{ mb: 2 }} size="large" variant="contained" onClick={handleWallet}>{!!address ? `Disconnect from ${formatWalletAddress(address)}` : 'Connect Wallet'}</Button>

      <Typography variant="h2" sx={{ mb: 2 }}>
        Score: <span>{score}</span>
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <CircularProgress sx={{ mr: 1, visibility: loading ? 'visible' : 'hidden' }} />
        <Typography variant="h4" sx={{ mr: 1 }}>BTC Price: <span>{btcPrice}</span></Typography>
        <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
          {result === -1 && <TrendingDownIcon />}
          {result === 0 && <TrendingFlatIcon />}
          {result === 1 && <TrendingUpIcon />}
        </Avatar>
      </Box>

      <Box display="flex" mb={2}>
        <Typography variant="h5" sx={{ mr: 2 }}>
          Choice:
        </Typography>

        <Button
          sx={{ mr: 2 }}
          variant="contained"
          color="primary"
          onClick={handleUpClick}
          disabled={!!choice}
          endIcon={choice === 'Up' && <CheckIcon />}
        >
          Up
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownClick}
          disabled={!!choice}
          endIcon={choice === 'Down' && <CheckIcon />}
        >
          Down
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mr: 2 }}>
        Please wait for {interval - timer} seconds
      </Typography>
    </Box>
  );
};

export default App;
