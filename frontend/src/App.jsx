import { useEffect, useState } from 'react'

function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)

  // Estados do Jogo
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none') // 'none', 'correct', 'wrong'

  useEffect(() => {
    fetch('http://localhost:8081/courses')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setCourse(data[0])
      })
  }, [])

  const startLesson = (lesson) => {
    setActiveLesson(lesson)
    setCurrentExerciseIndex(0)
    setStatus('none')
    setSelectedOption(null)
  }

  const checkAnswer = () => {
    const currentExercise = activeLesson.exercises[currentExerciseIndex]
    const isCorrect = selectedOption.isCorrect
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center bg-tech-dark text-white font-mono">
      <div className="text-center">
        <div className="text-4xl animate-bounce mb-4">🐧</div>
        <p>BMO está carregando os módulos...</p>
      </div>
    </div>
  )

  // === MODO LIÇÃO (JOGO) ===
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex]
    if (!exercise) return <div className="p-10">Erro: Lição vazia.</div>

    return (
      <div className="min-h-screen bg-tech-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">

          {/* Barra Superior */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-6">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 hover:text-tech-black font-bold text-2xl transition">✕</button>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-tech-blue h-full transition-all duration-500"
                style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-tech-black mb-10 text-center">{exercise.prompt}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {exercise.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => status === 'none' && setSelectedOption(option)}
                  className={`
                    p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 text-lg font-medium shadow-sm hover:shadow-md
                    ${selectedOption?.id === option.id ? 'bg-blue-50 border-tech-blue text-tech-blue' : 'border-gray-200 hover:bg-gray-50 text-tech-black'}
                    ${status === 'correct' && option.isCorrect ? '!bg-green-100 !border-tech-green !text-tech-green' : ''}
                    ${status === 'wrong' && selectedOption?.id === option.id ? '!bg-red-100 !border-red-500 !text-red-500' : ''}
                  `}
                >
                  <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-bold
                     ${selectedOption?.id === option.id ? 'bg-tech-blue text-white border-tech-blue' : 'border-gray-300 text-gray-400'}
                  `}>
                    {String.fromCharCode(64 + option.id)} {/* A, B, C... */}
                  </div>
                  {option.text}
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé */}
          <div className={`
            p-6 border-t border-gray-100
            ${status === 'correct' ? 'bg-green-50' : ''}
            ${status === 'wrong' ? 'bg-red-50' : ''}
          `}>
            <div className="max-w-3xl mx-auto flex justify-between items-center">
              <div>
                {status === 'correct' && <div className="text-tech-green font-bold text-xl flex gap-2">✨ Compilado com sucesso!</div>}
                {status === 'wrong' && <div className="text-red-500 font-bold text-xl">❌ Erro de Sintaxe (Resposta Errada)</div>}
              </div>

              <button
                onClick={checkAnswer}
                disabled={!selectedOption}
                className={`
                  px-10 py-4 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg transition transform active:scale-95
                  ${status === 'none' ? 'bg-tech-blue hover:bg-blue-600 shadow-blue-900/20' : ''}
                  ${status === 'correct' ? 'bg-tech-green shadow-green-900/20' : ''}
                  ${status === 'wrong' ? 'bg-red-500 shadow-red-900/20' : ''}
                  ${!selectedOption ? '!bg-gray-300 !shadow-none cursor-not-allowed' : ''}
                `}
              >
                {status === 'none' ? 'Verificar Código' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === MODO MAPA (HOME) ===
  return (
    // Fundo Gradiente Temporário (Logo vamos deixar dinâmico)
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 font-sans text-tech-black selection:bg-tech-blue selection:text-white pb-20">

      {/* Container Centralizado (Layout de Site) */}
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl min-h-screen shadow-2xl border-x border-white/20 relative">

        {/* Cabeçalho */}
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200 p-6 z-10 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
             <span className="text-3xl">🐧</span> {/* BMO Provisório */}
             <span className="font-bold text-gray-500 uppercase tracking-widest text-sm font-mono">
               {course.title}
             </span>
          </div>
          <div className="flex gap-6 text-lg">
             <div className="flex items-center gap-2" title="Gemas">
                <span className="text-2xl">💎</span>
                <span className="text-tech-blue font-bold">500</span>
             </div>
             <div className="flex items-center gap-2" title="Ofensiva">
                <span className="text-2xl">🔥</span>
                <span className="text-tech-orange font-bold">12</span>
             </div>
          </div>
        </header>

        {/* Lista de Unidades */}
        <div className="p-8">
          {course.units.map((unit) => (
            <div key={unit.id} className="mb-16">

              {/* Cabeçalho da Unidade */}
              <div
                className="p-6 text-white flex justify-between items-center rounded-2xl mb-10 shadow-lg transform hover:-translate-y-1 transition duration-300"
                style={{ backgroundColor: unit.color || '#3B82F6' }}
              >
                <div>
                  <h2 className="font-bold text-2xl mb-1">{unit.title}</h2>
                  <p className="opacity-90 font-mono text-sm">Unidade {unit.orderIndex}</p>
                </div>
                <button className="bg-white/20 px-6 py-3 rounded-xl font-bold border-2 border-transparent hover:bg-white/30 transition backdrop-blur-sm">
                  📚 GUIA DA SINTAXE
                </button>
              </div>

              {/* Trilha de Lições */}
              <div className="flex flex-col items-center gap-6 relative">
                 {/* Linha conectora (SVG simples) */}
                 <div className="absolute top-0 bottom-0 w-2 bg-gray-100 rounded-full -z-10"></div>

                 {unit.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      onClick={() => startLesson(lesson)}
                      className={`
                        w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer
                        hover:scale-110 hover:rotate-3 transition-all duration-300 z-10 group relative
                        ${index % 2 === 0 ? '-ml-16' : 'ml-16'} /* Efeito Zigue-Zague */
                        bg-tech-green
                      `}
                    >
                      {/* Efeito de brilho no hover */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition"></div>
                      <span className="text-4xl filter drop-shadow-md">🚀</span>

                      {/* Tooltip flutuante */}
                      <div className="absolute -bottom-10 bg-tech-dark text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
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