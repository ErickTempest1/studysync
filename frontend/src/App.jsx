import { useEffect, useState } from 'react'

function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null) // Guarda a lição que está sendo jogada

  // Estados do Jogo
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none') // 'none', 'correct', 'wrong'

  // 1. Busca os dados no Java ao abrir
  useEffect(() => {
    fetch('http://localhost:8081/courses')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setCourse(data[0])
      })
  }, [])

  // 2. Função para começar uma lição (clique na estrela)
  const startLesson = (lesson) => {
    setActiveLesson(lesson)
    setCurrentExerciseIndex(0)
    setStatus('none')
    setSelectedOption(null)
  }

  // 3. Função para verificar a resposta
  const checkAnswer = () => {
    const currentExercise = activeLesson.exercises[currentExerciseIndex]
    const isCorrect = selectedOption.isCorrect
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  // TELA DE CARREGAMENTO
  if (!course) return <div className="p-10 text-center text-gray-500">Carregando dados do servidor...</div>

  // === MODO LIÇÃO (O JOGO) ===
  if (activeLesson) {
    const exercise = activeLesson.exercises[currentExerciseIndex]

    // Se não tiver exercícios na lição (proteção contra erros)
    if (!exercise) return <div className="p-10">Lição vazia! Volte para o mapa.</div>

    return (
      <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto h-screen">
        {/* Barra de Progresso */}
        <div className="p-4 flex items-center gap-4">
          <button onClick={() => setActiveLesson(null)} className="text-gray-400 font-bold text-xl">✕</button>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-duo-green h-full transition-all duration-500"
              style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* A Pergunta */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-8">{exercise.prompt}</h1>

          <div className="space-y-4">
            {exercise.options.map((option) => (
              <div
                key={option.id}
                onClick={() => status === 'none' && setSelectedOption(option)} // Só clica se não tiver verificado
                className={`
                  p-4 rounded-xl border-2 cursor-pointer transition flex items-center gap-4
                  ${selectedOption?.id === option.id ? 'bg-blue-50 border-duo-blue' : 'border-gray-200 hover:bg-gray-50'}
                  ${status === 'correct' && option.isCorrect ? 'bg-green-100 border-duo-green' : ''}
                  ${status === 'wrong' && selectedOption?.id === option.id ? 'bg-red-100 border-red-500' : ''}
                `}
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold
                   ${selectedOption?.id === option.id ? 'bg-duo-blue text-white border-duo-blue' : 'border-gray-300 text-gray-400'}
                `}>
                  {option.id}
                </div>
                <span className="text-gray-700 font-medium">{option.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé (Botão Verificar) */}
        <div className={`
          p-6 border-t border-gray-200
          ${status === 'correct' ? 'bg-green-100 border-none' : ''}
          ${status === 'wrong' ? 'bg-red-100 border-none' : ''}
        `}>
          {status === 'correct' && (
             <div className="mb-4 text-duo-green font-bold text-xl flex gap-2">✨ Mandou bem!</div>
          )}
          {status === 'wrong' && (
             <div className="mb-4 text-red-600 font-bold text-xl">Resposta correta: {exercise.options.find(o => o.isCorrect)?.text}</div>
          )}

          <button
            onClick={checkAnswer}
            disabled={!selectedOption}
            className={`
              w-full py-3 rounded-xl font-bold text-white uppercase tracking-widest shadow-b-4 transition
              ${status === 'none' ? 'bg-duo-green hover:bg-green-500 shadow-[0_4px_0_#46a302]' : ''}
              ${status === 'correct' ? 'bg-duo-green' : ''}
              ${status === 'wrong' ? 'bg-red-500 shadow-[0_4px_0_#cc0000]' : ''}
              ${!selectedOption ? 'bg-gray-300 shadow-none cursor-not-allowed' : ''}
            `}
          >
            {status === 'none' ? 'Verificar' : 'Continuar'}
          </button>
        </div>
      </div>
    )
  }

  // === MODO MAPA (TRILHA) ===
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md border-x border-gray-200 min-h-screen">

        {/* Cabeçalho */}
        <header className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-200 p-4 z-10 flex justify-between items-center">
          <span className="font-bold text-gray-400 uppercase tracking-widest text-sm">{course.title}</span>
          <div className="flex gap-2">
             <span className="text-duo-blue font-bold">💎 500</span>
             <span className="text-orange-500 font-bold">🔥 12</span>
          </div>
        </header>

        {/* Lista de Unidades */}
        <div className="pb-20">
          {course.units.map((unit) => (
            <div key={unit.id} className="mt-6 mb-10">
              <div
                className="p-4 text-white flex justify-between items-center mx-4 rounded-xl mb-6 shadow-b-4"
                style={{ backgroundColor: unit.color }}
              >
                <div>
                  <h2 className="font-bold text-xl">{unit.title}</h2>
                  <p className="opacity-90">Unidade {unit.orderIndex}</p>
                </div>
                <button className="bg-white/20 px-4 py-2 rounded-xl font-bold border-2 border-transparent hover:bg-white/30 transition">GUIA</button>
              </div>

              {/* Caminho das Lições */}
              <div className="flex flex-col items-center gap-4">
                 {/* Agora usamos os dados reais das lições vindas do Java! */}
                 {unit.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      onClick={() => startLesson(lesson)} // <--- CLIQUE AQUI INICIA O JOGO
                      className="w-20 h-20 rounded-full bg-duo-green shadow-[0_6px_0_#46a302] flex items-center justify-center cursor-pointer hover:scale-105 transition transform active:scale-95 active:shadow-none"
                    >
                      <span className="text-3xl text-white">★</span>
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