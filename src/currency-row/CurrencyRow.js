import React from 'react'
import './CurrencyRow.css'

export default function CurrencyRow({availableCurrencyList, 
    selectedCurrencyType,
    onChangeCurrency,
    onChangeAmount,
    amount }) { 
    return (
        <div>
            <input className="currency-input" type="number" value={amount || 0} onChange={onChangeAmount} />
            <select value={selectedCurrencyType} className="currency-selector" onChange={onChangeCurrency}>
                {availableCurrencyList && availableCurrencyList.length>0 &&
                    availableCurrencyList.map(currency=>(
                        <option key={currency} value={currency}>{currency}</option>
                    ))
                }
            </select>
        </div>
    )
}
