import { useEffect, useState } from 'react'
import bmoImg from './assets/bmo.png'

// --- COMPONENTES DO CÉU ESTILO KURZGESAGT (SVGs FLAT) ---

const Sun = ({ isSunset }) => (
  <div className={`absolute top-10 right-20 w-32 h-32 pointer-events-none ${isSunset ? 'animate-pulse' : 'animate-spin-slow'}`}>
    {/* Círculo central */}
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="30" fill={isSunset ? "#FDB813" : "#FDE047"} className="drop-shadow-lg" />
      {/* Raios simples */}
      {!isSunset && [0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <rect key={deg} x="48" y="5" width="4" height="15" fill="#FDE047" transform={`rotate(${deg} 50 50)`} rounded="true" />
      ))}
    </svg>
  </div>
)

const Moon = () => (
  <div className="absolute top-10 right-20 w-28 h-28 pointer-events-none animate-float">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
      <path d="M50 10 C 30 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z" fill="#F3F4F6" />
      <circle cx="35" cy="35" r="8" fill="#E5E7EB" />
      <circle cx="55" cy="65" r="12" fill="#E5E7EB" />
    </svg>
  </div>
)

const Clouds = () => (
  <div className="absolute inset-0 pointer-events-none opacity-80">
    <svg className="absolute top-20 left-0 w-48 h-24 text-white animate-drift-slow" viewBox="0 0 100 50" style={{animationDelay: '0s'}}>
      <path fill="currentColor" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" />
    </svg>
    <svg className="absolute top-40 -left-64 w-64 h-32 text-white animate-drift-medium" viewBox="0 0 100 50" style={{animationDelay: '-20s', opacity: 0.6}}>
      <path fill="currentColor" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" />
    </svg>
  </div>
)

const Stars = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div key={i}
           className="absolute bg-white rounded-full animate-twinkle"
           style={{
             width: Math.random() * 4 + 2 + 'px',
             height: Math.random() * 4 + 2 + 'px',
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             animationDelay: Math.random() * 3 + 's'
           }}>
      </div>
    ))}
  </div>
)

// --- COMPONENTE PRINCIPAL ---

function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)

  // Estados do Jogo
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none') // 'none', 'correct', 'wrong'

  // Estado do Tempo e Mascote
  const [timeTheme, setTimeTheme] = useState('day')
  const [bmoMessage, setBmoMessage] = useState("Vamos codar!")

  // 1. Detectar Hora
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 17) setTimeTheme('day')
      else if (hour >= 17 && hour < 19) setTimeTheme('sunset')
      else setTimeTheme('night')
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // 2. Busca dados do Java
  useEffect(() => {
    fetch('http://localhost:8081/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
  }, [])

  // Interação com o BMO
  const pokeBmo = () => {
    if (status !== 'none') return
    const falas = ["Bip Bop!", "JavaScript é vida!", "Você consegue!", "Não esqueça o ponto e vírgula ;)", "🐧💻"]
    setBmoMessage(falas[Math.floor(Math.random() * falas.length)])
    // Efeito de "pulo" rápido ao clicar
    const bmo = document.getElementById('bmo-mascot')
    bmo.classList.remove('animate-float')
    bmo.classList.add('animate-bounce')
    setTimeout(() => {
        bmo.classList.remove('animate-bounce')
        bmo.classList.add('animate-float')
    }, 500)
  }

  // Funções do Jogo
  const startLesson = (lesson) => {
    setActiveLesson(lesson); setCurrentExerciseIndex(0); setStatus('none'); setSelectedOption(null)
    setBmoMessage("Concentre-se no código!")
  }

  const checkAnswer = () => {
    const isCorrect = selectedOption.isCorrect
    setStatus(isCorrect ? 'correct' : 'wrong')
    setBmoMessage(isCorrect ? "Compilado com sucesso! 🎉" : "Erro de sintaxe... Tente de novo! 🐛")
  }

  // TEMAS VISUAIS (Gradientes vibrantes estilo flat)
  const themes = {
    day: { bg: 'bg-gradient-to-b from-[#00C6FF] to-[#0072FF]', text: 'text-tech-black', sea: '#005bea', hill: '#00b09b' },
    sunset: { bg: 'bg-gradient-to-b from-[#FF512F] via-[#F09819] to-[#FF512F]', text: 'text-tech-black', sea: '#9333EA', hill: '#166534' },
    night: { bg: 'bg-gradient-to-b from-[#141E30] to-[#243B55]', text: 'text-white', sea: '#1e3a8a', hill: '#064e3b' }
  }
  const currentTheme = themes[timeTheme]

  // BACKGROUND COMPLETO (Ondas + Céu)
  const KurzgesagtBackground = () => (
    <div className="absolute bottom-0 left-0 right-0 top-0 pointer-events-none z-0 overflow-hidden">
       {/* Elementos do Céu */}
       {timeTheme === 'day' && <><Sun /><Clouds /></>}
       {timeTheme === 'sunset' && <><Sun isSunset /><Clouds /></>}
       {timeTheme === 'night' && <><Moon /><Stars /></>}

      {/* Camada do Mar (Ondas Fundo) */}
      <svg className="absolute bottom-0 w-full h-64 opacity-80 transition-all duration-1000" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{fill: currentTheme.sea}}>
        <path fillOpacity="0.6" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      {/* Camada das Colinas (Ondas Frente) */}
      <svg className="absolute bottom-0 w-full h-48 transition-all duration-1000" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{fill: currentTheme.hill}}>
         <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  )

  // MASCOTE BMO VIVO
  const AliveBmo = () => (
    <div className="fixed bottom-10 left-10 z-50 group cursor-pointer hidden md:block" onClick={pokeBmo}>
      <div className={`absolute -top-24 left-10 bg-white text-tech-black px-6 py-3 rounded-2xl rounded-bl-none shadow-xl border-2 border-gray-100 transform transition-all duration-300 origin-bottom-left scale-0 group-hover:scale-100 w-56 text-sm font-bold ${status === 'correct' ? 'bg-green-100 border-green-200 text-green-700 scale-100' : ''} ${status === 'wrong' ? 'bg-red-100 border-red-200 text-red-600 scale-100' : ''}`}>
        {bmoMessage}
      </div>
      <img
        id="bmo-mascot"
        src={bmoImg}
        alt="BMO"
        className={`w-40 h-40 drop-shadow-2xl transition-all duration-300 hover:scale-105 ${status === 'correct' ? 'animate-bounce' : status === 'wrong' ? 'animate-shake' : 'animate-float'}`}
      />
    </div>
  )

  if (!course) return <div className={`min-h-screen flex items-center justify-center ${currentTheme.bg} text-white font-bold`}>Carregando o mundo...</div>

  // === MODO JOGO ===
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex]
    return (
      <div className={`min-h-screen ${currentTheme.bg} flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-1000`}>
        <KurzgesagtBackground />
        <AliveBmo />

        <div className="w-full max-w-3xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col z-10 border border-white/30">
          <div className="p-6 border-b border-gray-100 flex items-center gap-6">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition">✕</button>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="bg-tech-blue h-full transition-all duration-500" style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-tech-black mb-10 text-center">{exercise.prompt}</h1>
            <div className="grid grid-cols-1 gap-4 w-full">
              {exercise.options.map((option) => (
                <div key={option.id} onClick={() => status === 'none' && setSelectedOption(option)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 text-lg font-medium shadow-sm ${selectedOption?.id === option.id ? 'bg-blue-50 border-tech-blue text-tech-blue' : 'border-gray-200 hover:bg-gray-50'} ${status === 'correct' && option.isCorrect ? '!bg-green-100 !border-tech-green !text-tech-green !shadow-green-200' : ''} ${status === 'wrong' && selectedOption?.id === option.id ? '!bg-red-100 !border-red-500 !text-red-500 !shadow-red-200' : ''}`}>
                  <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-bold ${selectedOption?.id === option.id ? 'bg-tech-blue text-white' : 'border-gray-300 text-gray-400'}`}>{String.fromCharCode(64 + option.id)}</div>
                  {option.text}
                </div>
              ))}
            </div>
          </div>
          <div className={`p-6 border-t border-gray-100 ${status === 'correct' ? 'bg-green-50' : status === 'wrong' ? 'bg-red-50' : ''}`}>
             <button onClick={checkAnswer} disabled={!selectedOption} className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg transform transition active:scale-95 ${status === 'none' ? 'bg-tech-blue hover:bg-blue-600 shadow-blue-200' : status === 'correct' ? 'bg-tech-green shadow-green-200' : 'bg-red-500 shadow-red-200'}`}>
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
      <KurzgesagtBackground />
      <AliveBmo />

      <div className="max-w-4xl mx-auto min-h-screen relative z-10 flex flex-col">
        <header className="sticky top-0 bg-white/60 backdrop-blur-md p-4 mx-4 mt-4 rounded-2xl flex justify-between items-center shadow-lg border border-white/40">
           <div className="flex items-center gap-3">
             <span className="font-bold text-gray-700 uppercase tracking-widest text-sm font-mono flex items-center gap-2">
               <span className="text-xl filter drop-shadow">🐧</span> {course.title}
             </span>
           </div>
           <div className="flex gap-4 font-bold text-lg bg-white/50 px-4 py-2 rounded-xl">
             <span className="text-tech-blue flex items-center gap-1">💎 500</span>
             <span className="text-tech-orange flex items-center gap-1">🔥 12</span>
           </div>
        </header>

        <div className="p-8 pb-32 flex-1 flex flex-col items-center">
          {course.units.map((unit) => (
            <div key={unit.id} className="w-full mb-12">
              <div className="p-6 text-white flex justify-between items-center rounded-2xl mb-8 shadow-xl transform hover:scale-[1.02] transition duration-300 relative overflow-hidden border-b-4 border-black/10" style={{ backgroundColor: unit.color || '#3B82F6' }}>
                <div className="relative z-10">
                  <h2 className="font-bold text-2xl filter drop-shadow-sm">{unit.title}</h2>
                  <p className="opacity-90 font-mono text-sm">Unidade {unit.orderIndex}</p>
                </div>
                <button className="relative z-10 bg-black/20 px-4 py-2 rounded-lg font-bold hover:bg-black/30 transition text-sm flex items-center gap-2 shadow-inner">
                  <span>📜</span> GUIA
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                 {unit.lessons.map((lesson, index) => (
                    <div key={lesson.id} onClick={() => startLesson(lesson)}
                      className={`w-20 h-20 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all z-10 relative bg-tech-green hover:bg-green-400 ${index % 2 !== 0 ? 'ml-24' : '-ml-24'}`}>
                      <span className="text-3xl drop-shadow-md">🚀</span>
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