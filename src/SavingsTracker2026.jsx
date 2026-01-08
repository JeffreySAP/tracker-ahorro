import React, { useState, useEffect } from 'react'; 
import { PiggyBank, TrendingUp, Calendar, DollarSign, ChevronUp, ChevronDown, Moon, Sun } from 'lucide-react'; 

export default function SavingsTracker2026() { 
  const [goalAmount, setGoalAmount] = useState(0); 
  const [currency, setCurrency] = useState('$'); 
  const [darkMode, setDarkMode] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); 
  const [months, setMonths] = useState([ 
    { name: 'Enero', saved: 0, planned: 0 }, 
    { name: 'Febrero', saved: 0, planned: 0 }, 
    { name: 'Marzo', saved: 0, planned: 0 }, 
    { name: 'Abril', saved: 0, planned: 0 }, 
    { name: 'Mayo', saved: 0, planned: 0 }, 
    { name: 'Junio', saved: 0, planned: 0 }, 
    { name: 'Julio', saved: 0, planned: 0 }, 
    { name: 'Agosto', saved: 0, planned: 0 }, 
    { name: 'Septiembre', saved: 0, planned: 0 }, 
    { name: 'Octubre', saved: 0, planned: 0 }, 
    { name: 'Noviembre', saved: 0, planned: 0 }, 
    { name: 'Diciembre', saved: 0, planned: 0 } 
  ]); 
  
  useEffect(() => { 
    const savedData = JSON.parse(localStorage.getItem('savingsTracker2026') || 'null'); 
    const localstorageConsent = localStorage.getItem('localstorageConsent');
    
    if (localstorageConsent === 'accepted') {
      setShowCookieBanner(false);
    }
    
    if (savedData) { 
      setGoalAmount(savedData.goalAmount || 0); 
      setCurrency(savedData.currency || '$'); 
      setMonths(savedData.months || months); 
      setDarkMode(savedData.darkMode || false);
    } 
    setIsLoaded(true);
  }, []);
  
  useEffect(() => { 
    if (isLoaded) {
      const dataToSave = { goalAmount, currency, months, darkMode }; 
      localStorage.setItem('savingsTracker2026', JSON.stringify(dataToSave)); 
    }
  }, [goalAmount, currency, months, darkMode, isLoaded]); 
  
  useEffect(() => {
    if (isLoaded && goalAmount > 0) {
      const baseAmount = Math.floor(goalAmount / 12);
      const remainder = goalAmount - (baseAmount * 12);

      setMonths(prevMonths =>
        prevMonths.map((month, index) => ({
          ...month,
          planned: index < remainder ? baseAmount + 1 : baseAmount
        }))
      );
    }
  }, [goalAmount, isLoaded]);

  const totalSaved = months.reduce((sum, month) => sum + Number(month.saved), 0); 
  const totalPlanned = months.reduce((sum, month) => sum + Number(month.planned), 0); 
  const progressPercentage = goalAmount > 0 ? (totalSaved / goalAmount) * 100 : 0;  
  const remaining = goalAmount - totalSaved; 

  // Función de actualización corregida para evitar el "0" persistente
  const updateMonth = (index, field, value) => { 
    const newMonths = [...months]; 
    // Si el valor está vacío, ponemos 0. Si no, convertimos a número.
    // Esto evita que al borrar se quede un campo vacío o con ceros extra.
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    newMonths[index][field] = isNaN(numericValue) ? 0 : numericValue; 
    setMonths(newMonths); 
  }; 
  
  const handleInputFocus = (e) => { 
    if (e.target.value === '0') { 
      e.target.select(); // Selecciona el texto para que al escribir se borre el 0
    } 
  }; 

  const acceptLocalStorage = () => {
    localStorage.setItem('localstorageConsent', 'accepted');
    setShowCookieBanner(false);
  };
  
  return ( 
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}> 
      <style>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style> 
      <div className="max-w-6xl mx-auto"> 
        <div className={`rounded-xl shadow-lg p-5 md:p-8 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <PiggyBank className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} /> 
              <h1 className={`text-xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tracker de Ahorro</h1>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 md:p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div> 

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"> 
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-5 md:p-6 text-white"> 
              <div className="flex items-center gap-2 mb-2"> 
                <DollarSign className="w-5 h-5" /> 
                <p className="text-sm opacity-90">Meta Anual</p> 
              </div> 
              <div className="flex items-center gap-2"> 
                <input 
                  type="number" 
                  value={goalAmount === 0 ? '' : goalAmount} 
                  placeholder="0"
                  onChange={(e) => setGoalAmount(e.target.value === '' ? 0 : Number(e.target.value))} 
                  onFocus={handleInputFocus} 
                  className="text-2xl md:text-3xl font-bold bg-transparent border-none flex-1 focus:outline-none w-full placeholder-white/50" 
                /> 
                <div className="flex flex-col gap-1"> 
                  <button onClick={() => setGoalAmount(goalAmount + 100)} className="p-1 hover:bg-white/20 rounded"><ChevronUp className="w-5 h-5" /></button> 
                  <button onClick={() => setGoalAmount(Math.max(0, goalAmount - 100))} className="p-1 hover:bg-white/20 rounded"><ChevronDown className="w-5 h-5" /></button> 
                </div> 
              </div> 
            </div> 

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-5 md:p-6 text-white"> 
              <div className="flex items-center gap-2 mb-2"> 
                <TrendingUp className="w-5 h-5" /> 
                <p className="text-sm opacity-90">Total Ahorrado</p> 
              </div> 
              <p className="text-2xl md:text-3xl font-bold">{currency}{totalSaved.toLocaleString()}</p> 
              <p className="text-sm mt-2 opacity-90">{progressPercentage.toFixed(1)}% completado</p> 
            </div> 

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-5 md:p-6 text-white"> 
              <div className="flex items-center gap-2 mb-2"> 
                <Calendar className="w-5 h-5" /> 
                <p className="text-sm opacity-90">Restante</p> 
              </div> 
              <p className="text-2xl md:text-3xl font-bold">{currency}{remaining.toLocaleString()}</p> 
              <p className="text-sm mt-2 opacity-90">{currency}{(remaining / 12).toFixed(0)}/mes</p> 
            </div> 
          </div> 

          <div className="mb-2"> 
            <div className="flex justify-between mb-2"> 
              <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progreso del Año</span> 
              <span className={`text-xs md:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{progressPercentage.toFixed(1)}%</span> 
            </div> 
            <div className={`w-full rounded-full h-3 md:h-4 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}> 
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }} 
              /> 
            </div> 
          </div> 
        </div> 

        <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
          <div className="overflow-x-auto"> 
            <table className="w-full min-w-[600px]"> 
              <thead className={darkMode ? 'bg-indigo-900 text-white' : 'bg-indigo-600 text-white'}> 
                <tr> 
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-sm font-semibold">Mes</th> 
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-sm font-semibold">Planeado</th> 
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-sm font-semibold">Ahorrado</th> 
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-sm font-semibold">Diferencia</th> 
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-sm font-semibold">%</th> 
                </tr> 
              </thead> 
              <tbody> 
                {months.map((month, index) => { 
                  const difference = month.saved - month.planned; 
                  const monthProgress = month.planned > 0 ? (month.saved / month.planned) * 100 : 0; 
                  return ( 
                    <tr key={index} className={`border-b transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'}`}> 
                      <td className={`px-4 py-3 md:px-6 md:py-4 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{month.name}</td> 
                      <td className="px-4 py-3 md:px-6 md:py-4"> 
                        <div className="flex items-center gap-1"> 
                          <input 
                            type="number" 
                            value={month.planned === 0 ? '' : month.planned} 
                            placeholder="0"
                            onChange={(e) => updateMonth(index, 'planned', e.target.value)} 
                            onFocus={handleInputFocus}
                            className={`w-20 md:w-28 px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                          /> 
                          <div className="flex flex-col"> 
                            <button onClick={() => updateMonth(index, 'planned', month.planned + 50)} className="text-indigo-600"><ChevronUp className="w-4 h-4" /></button> 
                            <button onClick={() => updateMonth(index, 'planned', Math.max(0, month.planned - 50))} className="text-indigo-600"><ChevronDown className="w-4 h-4" /></button> 
                          </div> 
                        </div> 
                      </td> 
                      <td className="px-4 py-3 md:px-6 md:py-4"> 
                        <div className="flex items-center gap-1"> 
                          <input 
                            type="number" 
                            value={month.saved === 0 ? '' : month.saved} 
                            placeholder="0"
                            onChange={(e) => updateMonth(index, 'saved', e.target.value)} 
                            onFocus={handleInputFocus}
                            className={`w-20 md:w-28 px-2 py-1 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} 
                          /> 
                          <div className="flex flex-col"> 
                            <button onClick={() => updateMonth(index, 'saved', month.saved + 50)} className="text-green-600"><ChevronUp className="w-4 h-4" /></button> 
                            <button onClick={() => updateMonth(index, 'saved', Math.max(0, month.saved - 50))} className="text-green-600"><ChevronDown className="w-4 h-4" /></button> 
                          </div> 
                        </div> 
                      </td> 
                      <td className={`px-4 py-3 md:px-6 md:py-4 text-sm font-semibold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}> 
                        {difference >= 0 ? '+' : ''}{currency}{difference.toLocaleString()} 
                      </td> 
                      <td className="px-4 py-3 md:px-6 md:py-4"> 
                        <div className="flex items-center gap-2"> 
                          <div className={`w-12 md:w-16 rounded-full h-1.5 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                            <div className={`h-full transition-all ${monthProgress >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(monthProgress, 100)}%` }} /> 
                          </div> 
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{monthProgress.toFixed(0)}%</span> 
                        </div> 
                      </td> 
                    </tr> 
                  ); 
                })} 
              </tbody>
            </table>
          </div>
        </div>
        
        {showCookieBanner && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4">
            <div className={`max-w-4xl mx-auto rounded-lg shadow-2xl p-5 md:p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-start gap-4">
                <PiggyBank className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <div className="flex-1">
                  <h3 className={`text-sm md:text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔒 Tus Datos son Privados</h3>
                  <p className={`text-xs md:text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Todo se guarda solo en tu navegador. Nada se envía a internet.</p>
                  <button onClick={acceptLocalStorage} className="px-4 py-1.5 md:px-6 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors">Entendido</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}