import { useEffect, useState } from 'react'
import bmoImg from './assets/bmo.png'

function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)

  // Estados do Jogo
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none')

  // Estado do Tempo e Mascote
  const [timeTheme, setTimeTheme] = useState('day')
  const [bmoMessage, setBmoMessage] = useState("Vamos codar!")
  const [isBmoHappy, setIsBmoHappy] = useState(false)

  // 1. Detectar Hora
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 17) setTimeTheme('day')
      else if (hour >= 17 && hour < 19) setTimeTheme('sunset')
      else setTimeTheme('night')
    }
    updateTime()
  }, [])

  // 2. Busca dados do Java
  useEffect(() => {
    fetch('http://localhost:8081/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
  }, [])

  // Interação com o BMO
  const pokeBmo = () => {
    setIsBmoHappy(true)
    const falas = ["Bip Bop!", "Isso é JavaScript!", "Você é incrível!", "Não esqueça o ponto e vírgula!", "🐧💻"]
    setBmoMessage(falas[Math.floor(Math.random() * falas.length)])
    setTimeout(() => setIsBmoHappy(false), 1000)
  }

  // Funções do Jogo
  const startLesson = (lesson) => {
    setActiveLesson(lesson); setCurrentExerciseIndex(0); setStatus('none'); setSelectedOption(null)
    setBmoMessage("Hora do show!")
  }

  const checkAnswer = () => {
    const isCorrect = selectedOption.isCorrect
    setStatus(isCorrect ? 'correct' : 'wrong')
    if(isCorrect) {
      setBmoMessage("Compilado com sucesso! 🚀")
      setIsBmoHappy(true)
      setTimeout(() => setIsBmoHappy(false), 1500)
    } else {
      setBmoMessage("Erro de sintaxe... Tente de novo! 🐛")
    }
  }

  // TEMAS VISUAIS (Cores dos gradientes)
  const themes = {
    day: { bg: 'bg-gradient-to-b from-sky-300 via-sky-100 to-white', text: 'text-tech-black' },
    sunset: { bg: 'bg-gradient-to-b from-orange-400 via-rose-300 to-indigo-100', text: 'text-tech-black' },
    night: { bg: 'bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800', text: 'text-white' }
  }
  const currentTheme = themes[timeTheme]

  // COMPONENTE: O Horizonte (SVG Ondulado)
  const HorizonBackground = () => (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
      {/* Camada do Mar (Fundo) */}
      <svg className="absolute bottom-0 w-full h-64 opacity-80" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill={timeTheme === 'night' ? '#1e3a8a' : '#3b82f6'} fillOpacity="0.6" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      {/* Camada das Colinas (Frente) */}
      <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
         <path fill={timeTheme === 'night' ? '#064e3b' : '#10b981'} fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  )

  // COMPONENTE: O BMO Interativo
  const BmoMascot = () => (
    <div className="fixed bottom-10 left-10 z-50 group cursor-pointer hidden md:block" onClick={pokeBmo}>
      {/* Balão de Fala */}
      <div className="absolute -top-20 left-10 bg-white text-tech-black px-4 py-2 rounded-2xl rounded-bl-none shadow-lg border-2 border-gray-100 transform transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 w-48 text-sm font-bold">
        {bmoMessage}
      </div>
      {/* Imagem do BMO */}
      <img
        src={bmoImg}
        alt="BMO"
        className={`w-32 h-32 drop-shadow-2xl transition-transform duration-300 hover:scale-110 ${isBmoHappy ? 'animate-bounce' : 'animate-pulse'}`}
      />
    </div>
  )

  if (!course) return <div className="min-h-screen flex items-center justify-center bg-tech-blue text-white font-bold">Carregando o mundo...</div>

  // === MODO JOGO ===
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex]
    return (
      <div className="min-h-screen bg-tech-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Matrix Rain Fundo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none font-mono text-green-500 text-xs break-all">
          {Array(2000).fill(0).map(() => Math.random() > 0.5 ? '1 ' : '0 ')}
        </div>

        <BmoMascot /> {/* BMO te acompanha na prova */}

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col z-10">
          <div className="p-6 border-b border-gray-100 flex items-center gap-6">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 hover:text-red-500 font-bold text-2xl">✕</button>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="bg-tech-blue h-full transition-all duration-500" style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-tech-black mb-10 text-center">{exercise.prompt}</h1>
            <div className="grid grid-cols-1 gap-4 w-full">
              {exercise.options.map((option) => (
                <div key={option.id} onClick={() => status === 'none' && setSelectedOption(option)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 text-lg font-medium ${selectedOption?.id === option.id ? 'bg-blue-50 border-tech-blue text-tech-blue' : 'border-gray-200 hover:bg-gray-50'} ${status === 'correct' && option.isCorrect ? '!bg-green-100 !border-tech-green !text-tech-green' : ''} ${status === 'wrong' && selectedOption?.id === option.id ? '!bg-red-100 !border-red-500 !text-red-500' : ''}`}>
                  <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-bold ${selectedOption?.id === option.id ? 'bg-tech-blue text-white' : 'border-gray-300 text-gray-400'}`}>{String.fromCharCode(64 + option.id)}</div>
                  {option.text}
                </div>
              ))}
            </div>
          </div>
          <div className={`p-6 border-t border-gray-100 ${status === 'correct' ? 'bg-green-50' : status === 'wrong' ? 'bg-red-50' : ''}`}>
             <button onClick={checkAnswer} disabled={!selectedOption} className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg ${status === 'none' ? 'bg-tech-blue hover:bg-blue-600' : status === 'correct' ? 'bg-tech-green' : 'bg-red-500'}`}>
                {status === 'none' ? 'VERIFICAR' : 'PRÓXIMO'}
             </button>
          </div>
        </div>
      </div>
    )
  }

  // === MODO MAPA ===
  return (
    <div className={`min-h-screen ${currentTheme.bg} font-sans relative overflow-x-hidden transition-colors duration-1000`}>
      <HorizonBackground /> {/* O Novo Fundo SVG */}
      <BmoMascot /> {/* O Novo Mascote Flutuante */}

      <div className="max-w-4xl mx-auto min-h-screen relative z-10 flex flex-col">
        {/* Cabeçalho Limpo */}
        <header className="sticky top-0 bg-white/60 backdrop-blur-md p-4 mx-4 mt-4 rounded-2xl flex justify-between items-center shadow-sm border border-white/40">
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-600 uppercase tracking-widest text-sm font-mono flex items-center gap-2">
               <span className="text-xl">🐧</span> {course.title}
             </span>
           </div>
           <div className="flex gap-4 font-bold text-lg">
             <span className="text-tech-blue">💎 500</span>
             <span className="text-tech-orange">🔥 12</span>
           </div>
        </header>

        <div className="p-8 pb-32 flex-1 flex flex-col items-center">
          {course.units.map((unit) => (
            <div key={unit.id} className="w-full mb-12">
              <div className="p-6 text-white flex justify-between items-center rounded-2xl mb-8 shadow-lg transform hover:scale-[1.01] transition duration-300 relative overflow-hidden" style={{ backgroundColor: unit.color || '#3B82F6' }}>
                <div className="relative z-10">
                  <h2 className="font-bold text-2xl">{unit.title}</h2>
                  <p className="opacity-90 font-mono text-sm">Unidade {unit.orderIndex}</p>
                </div>
                <button className="relative z-10 bg-black/20 px-4 py-2 rounded-lg font-bold hover:bg-black/30 transition text-sm">GUIA</button>
              </div>

              <div className="flex flex-col items-center gap-4">
                 {unit.lessons.map((lesson, index) => (
                    <div key={lesson.id} onClick={() => startLesson(lesson)}
                      className={`w-20 h-20 rounded-full border-[6px] border-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all z-10 relative bg-tech-green ${index % 2 !== 0 ? 'ml-20' : '-ml-20'}`}>
                      <span className="text-3xl drop-shadow-md">🚀</span>
                      {/* Tooltip da lição */}
                      <div className="absolute top-20 bg-white text-tech-black text-xs font-bold py-1 px-2 rounded shadow opacity-0 hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                        {lesson.title}
                      </div>
                    </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App