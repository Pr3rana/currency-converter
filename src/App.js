import {useState, useEffect, useCallback} from 'react'
import CurrencyRow from './currency-row/CurrencyRow'
import LineChart from './line-chart/LineChart'
import './App.css';


function App() {
  const [availableCurrencyList, setAvailableCurrencyList] = useState([])
  const [fromCurrencyType, setFromCurrencyType] = useState()
  const [toCurrencyType, setToCurrencyType] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [inputAmount, setInputAmount] = useState(1)
  const [isAmountInFromCurrency, setIsAmountInFromCurrency] = useState(true)
  const [labels, setLabels] = useState([])
  const [chartData, setChartData] = useState([])

  const BASE_URL = process.env.REACT_APP_BASE_URL
  const API_KEY = process.env.REACT_APP_API_KEY
  const currentDateTime = new Date().toString() 

  let toAmount ,fromAmount
  if (isAmountInFromCurrency) {
    fromAmount = inputAmount
    toAmount = inputAmount * exchangeRate
  } else {
    toAmount = inputAmount
    fromAmount = inputAmount / exchangeRate
  }
  


//fetch list of currency and setting default values
  useEffect(()=>{
    fetch(`${BASE_URL}latest?apikey=${API_KEY}`).then(response=>response.json())
    .then(data=>{
      const firstCurrency = Object.keys(data.data)[0];
      setAvailableCurrencyList([data.query.base_currency,...Object.keys(data.data)])
      setFromCurrencyType(data.query.base_currency)
      setToCurrencyType(firstCurrency)
    })
    .catch(error => {
      console.error("Snapped while fetching base data!!!",'\n', error)
    })
  },[BASE_URL,API_KEY])

//fetch exchange-rate as per base currency
  useEffect(() => {
    if (fromCurrencyType != null) {
      fetch(`${BASE_URL}latest?apikey=${API_KEY}&base_currency=${fromCurrencyType}`).then(response=>response.json())
      .then(data => setExchangeRate(data.data[toCurrencyType]))
      .catch(error => {
        console.error("Snapped while fetching exchange rate!!!", '\n', error)
      })
    }
  }, [fromCurrencyType, toCurrencyType,BASE_URL,API_KEY])

  const filterDataForCurrentCurrency = useCallback((data)=>{
    let chartData = []
    for(let key in data){
      chartData.push(data[key][toCurrencyType])
    }
    return chartData
  },[toCurrencyType])


//fetch historic data
useEffect(()=>{
  const todayDate = new Date().toISOString().slice(0, 10)
  let pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 1)
  const fromDate = pastDate.toISOString().slice(0, 10)
  if (fromCurrencyType != null && toCurrencyType !=null) {
    fetch(`${BASE_URL}historical?apikey=${API_KEY}&base_currency=${fromCurrencyType}&date_from=${fromDate}&date_to=${todayDate}`).then(response=>response.json())
    .then(data => {
      setLabels([...Object.keys(data.data)])
      const dataForCurrentCurrency = filterDataForCurrentCurrency(data.data)
      setChartData(dataForCurrentCurrency)
    })
    .catch(error => {
      console.error("Snapped while fetching historical data!!!", '\n', error)
    })
  }
},[fromCurrencyType, toCurrencyType,filterDataForCurrentCurrency,BASE_URL,API_KEY])


//handle change of FROM dropdown
  function handleFromAmountChange(e) {
    setInputAmount(e.target.value)
    setIsAmountInFromCurrency(true)
  }

//handle change of TO dropdown
  function handleToAmountChange(e) {
    setInputAmount(e.target.value)
    setIsAmountInFromCurrency(false)
  }
  
  return (
    <>
    <div className="converter-wrapper">
    <h1>Convert</h1>
    <p>{currentDateTime}</p>
    <CurrencyRow selectedCurrencyType={fromCurrencyType} 
        availableCurrencyList={availableCurrencyList}
        onChangeCurrency={e => setFromCurrencyType(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
        />
    <div className="equals">=</div>
    <CurrencyRow selectedCurrencyType={toCurrencyType}
      availableCurrencyList={availableCurrencyList}
      onChangeCurrency={e => setToCurrencyType(e.target.value)}
      onChangeAmount={handleToAmountChange}
      amount={toAmount}
      />
    </div>
    <LineChart labels={labels} data={chartData} type={toCurrencyType}/>
    </>
  );
}

export default App;
