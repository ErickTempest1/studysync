import { useEffect, useState } from 'react'

function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)

  // Estados do Jogo
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none')

  // Estado do Tempo (Dia, Tarde, Noite)
  const [timeTheme, setTimeTheme] = useState('day')

  // 1. Detectar Hora do Dia
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 17) setTimeTheme('day')        // 06:00 as 17:00
    else if (hour >= 17 && hour < 19) setTimeTheme('sunset') // 17:00 as 19:00
    else setTimeTheme('night')                               // 19:00 as 06:00
  }, [])

  // 2. Busca dados do Java
  useEffect(() => {
    fetch('http://localhost:8081/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
  }, [])

  // Funções do Jogo
  const startLesson = (lesson) => {
    setActiveLesson(lesson); setCurrentExerciseIndex(0); setStatus('none'); setSelectedOption(null)
  }
  const checkAnswer = () => {
    const isCorrect = selectedOption.isCorrect
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  // CONFIGURAÇÃO DOS TEMAS VISUAIS
  const themes = {
    day: {
      sky: 'from-sky-400 to-blue-300',
      sea: 'bg-blue-500',
      hill: 'bg-emerald-500',
      text: 'text-tech-black'
    },
    sunset: {
      sky: 'from-orange-400 via-red-400 to-purple-600',
      sea: 'bg-indigo-600',
      hill: 'bg-emerald-700',
      text: 'text-white'
    },
    night: {
      sky: 'from-slate-900 via-purple-900 to-slate-900',
      sea: 'bg-blue-900',
      hill: 'bg-emerald-900',
      text: 'text-gray-200'
    }
  }

  const currentTheme = themes[timeTheme]

  // TELA DE CARREGAMENTO (Com o BMO)
  if (!course) return (
    <div className={`min-h-screen flex items-center justify-center font-mono text-white bg-gradient-to-b ${currentTheme.sky}`}>
      <div className="text-center animate-pulse">
        <div className="text-6xl mb-4">🐧</div>
        <p className="text-xl">BMO está compilando o mundo...</p>
      </div>
    </div>
  )

  // === MODO JOGO (Lição) ===
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex]
    if (!exercise) return <div>Erro</div>

    return (
      <div className="min-h-screen bg-tech-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Fundo Matrix discreto no modo foco */}
        <div className="absolute inset-0 opacity-10 font-mono text-green-500 text-xs p-4 break-words overflow-hidden pointer-events-none">
          {Array(500).fill('10 ').map((bit, i) => <span key={i} style={{opacity: Math.random()}}>{Math.random() > 0.5 ? '1' : '0'}</span>)}
        </div>

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col z-10">
          {/* Barra Superior */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-6">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 hover:text-tech-black font-bold text-2xl">✕</button>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="bg-tech-blue h-full transition-all duration-500" style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Pergunta */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-tech-black mb-10 text-center">{exercise.prompt}</h1>
            <div className="grid grid-cols-1 gap-4 w-full">
              {exercise.options.map((option) => (
                <div
                  key={option.id} onClick={() => status === 'none' && setSelectedOption(option)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 text-lg font-medium shadow-sm hover:shadow-md ${selectedOption?.id === option.id ? 'bg-blue-50 border-tech-blue text-tech-blue' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-bold ${selectedOption?.id === option.id ? 'bg-tech-blue text-white border-tech-blue' : 'border-gray-300 text-gray-400'}`}>
                    {String.fromCharCode(64 + option.id)}
                  </div>
                  {option.text}
                </div>
              ))}
            </div>
          </div>

          {/* Botão Verificar */}
          <div className={`p-6 border-t border-gray-100 ${status === 'correct' ? 'bg-green-50' : ''} ${status === 'wrong' ? 'bg-red-50' : ''}`}>
             <button onClick={checkAnswer} disabled={!selectedOption} className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg transition ${status === 'none' ? 'bg-tech-blue hover:bg-blue-600' : status === 'correct' ? 'bg-tech-green' : 'bg-red-500'} ${!selectedOption ? '!bg-gray-300 !shadow-none' : ''}`}>
                {status === 'none' ? 'Verificar Código' : 'Próximo'}
             </button>
          </div>
        </div>
      </div>
    )
  }

  // === MODO MAPA (Horizonte Dinâmico) ===
  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.sky} font-sans relative overflow-hidden transition-colors duration-1000`}>

      {/* --- CENÁRIO DE FUNDO (CSS PURO) --- */}

      {/* Sol / Lua */}
      <div className={`absolute top-10 right-20 w-32 h-32 rounded-full blur-2xl opacity-80 transition-all duration-1000
        ${timeTheme === 'night' ? 'bg-white shadow-[0_0_50px_white]' : 'bg-yellow-300 shadow-[0_0_80px_orange]'}
      `}></div>

      {/* Mar (Fundo) */}
      <div className={`absolute bottom-0 left-0 right-0 h-48 ${currentTheme.sea} opacity-80 z-0`}></div>

      {/* Colina Esquerda */}
      <div className={`absolute bottom-20 -left-20 w-[60%] h-64 rounded-tr-[100%] rounded-tl-[50%] ${currentTheme.hill} z-0 opacity-90`}></div>

      {/* Colina Direita */}
      <div className={`absolute bottom-10 -right-20 w-[70%] h-80 rounded-tl-[100%] rounded-tr-[50%] ${currentTheme.hill} z-0`}></div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl min-h-screen shadow-2xl border-x border-white/20 relative z-10 flex flex-col">

        {/* Cabeçalho */}
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 p-6 z-20 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
             <span className="text-3xl animate-bounce">🐧</span>
             <span className="font-bold text-gray-500 uppercase tracking-widest text-sm font-mono">{course.title}</span>
          </div>
          <div className="flex gap-6 text-lg">
             <span className="text-tech-blue font-bold flex gap-2">💎 500</span>
             <span className="text-tech-orange font-bold flex gap-2">🔥 12</span>
          </div>
        </header>

        {/* Lista de Unidades */}
        <div className="p-8 pb-32 flex-1">
          {course.units.map((unit) => (
            <div key={unit.id} className="mb-16">
              <div className="p-6 text-white flex justify-between items-center rounded-2xl mb-10 shadow-lg transform hover:-translate-y-1 transition duration-300" style={{ backgroundColor: unit.color || '#3B82F6' }}>
                <div>
                  <h2 className="font-bold text-2xl mb-1">{unit.title}</h2>
                  <p className="opacity-90 font-mono text-sm">Unidade {unit.orderIndex}</p>
                </div>
                <button className="bg-white/20 px-6 py-3 rounded-xl font-bold border-2 border-transparent hover:bg-white/30 transition backdrop-blur-sm flex items-center gap-2">
                  <span>📜</span> GUIA
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 relative">
                 <div className="absolute top-0 bottom-0 w-2 bg-gray-100 rounded-full -z-10"></div>
                 {unit.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id} onClick={() => startLesson(lesson)}
                      className={`
                        w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer
                        hover:scale-110 hover:rotate-3 transition-all duration-300 z-10 group relative
                        ${index % 2 === 0 ? '-ml-16' : 'ml-16'} bg-tech-green
                      `}
                    >
                      <span className="text-4xl filter drop-shadow-md">🚀</span>
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