import { useState, useEffect } from 'react'
import './App.css'
import { Book, Star, Trophy, Zap, Shield, Flame, MoreHorizontal } from 'lucide-react'

// --- Componentes (Header, Sidebar, LessonButton) continuam iguais ---
// (Vou resumir para caber aqui, mas mantenha os que você já tem ou copie do código anterior se precisar)

// Componente Sidebar (Menu Lateral)
const Sidebar = () => (
  <div className="sidebar">
    <div className="logo-container">
      <h1 className="logo-text">duolingo</h1>
    </div>
    <nav className="nav-menu">
      <a href="#" className="nav-item active"><Book size={24} /> <span>APRENDER</span></a>
      <a href="#" className="nav-item"><Star size={24} /> <span>PRATICAR</span></a>
      <a href="#" className="nav-item"><Trophy size={24} /> <span>RANKING</span></a>
      <a href="#" className="nav-item"><MoreHorizontal size={24} /> <span>MAIS</span></a>
    </nav>
  </div>
);

// Componente Header (Topo)
const Header = () => (
  <div className="header">
    <div className="flag-icon">🇧🇷</div>
    <div className="stats-container">
      <div className="stat-item"><Flame size={20} className="text-orange-500" /> <span>0</span></div>
      <div className="stat-item"><Shield size={20} className="text-blue-500" /> <span>5</span></div>
      <div className="stat-item"><Zap size={20} className="text-yellow-500" /> <span>400</span></div>
    </div>
  </div>
);

// Componente Botão da Lição (Bolinha no mapa)
const LessonButton = ({ icon, active, onClick, color }) => (
  <div className="lesson-path-item">
    <div
      className={`lesson-circle ${active ? 'active' : ''}`}
      style={{ backgroundColor: active ? color : '#e5e7eb' }}
      onClick={onClick}
    >
      {active ? <Star fill="white" size={32} color="white" /> : <Star size={32} color="#afafaf" />}
    </div>
  </div>
);

function App() {
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)

  // Estado para Loading da IA
  const [loadingAI, setLoadingAI] = useState(false);

  // 1. Carregar dados do Backend ao iniciar
  useEffect(() => {
    fetch('http://localhost:8080/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
      .catch(err => console.error("Erro backend:", err))
  }, [])

  // 2. Função para Gerar Lição Nova com IA
  const gerarLicaoIA = () => {
    setLoadingAI(true);
    fetch('http://localhost:8080/courses/test-ai')
      .then(res => res.json()) // O Backend devolve o JSON da pergunta
      .then(novaQuestao => {
        alert("IA Gerou: " + novaQuestao.prompt); // Mostra num alerta por enquanto
        setLoadingAI(false);
      })
      .catch(err => {
        console.error("Erro IA:", err);
        setLoadingAI(false);
        alert("Erro ao chamar o BMO. Veja o console.");
      });
  };

  // Funções do Jogo (Iniciar, Verificar, Próximo)
  const startLesson = (lesson) => {
    setCurrentLesson(lesson)
    setCurrentExerciseIndex(0)
    setSelectedOption(null)
    setIsCorrect(null)
  }

  const checkAnswer = () => {
    if (!selectedOption) return
    const exercise = currentLesson.exercises[currentExerciseIndex]
    const correct = selectedOption.correct
    setIsCorrect(correct)
  }

  const nextExercise = () => {
    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setSelectedOption(null)
      setIsCorrect(null)
    } else {
      alert("Lição Completa! 🎉")
      setCurrentLesson(null)
    }
  }

  if (!course) return <div className="loading-screen">Carregando o mundo...</div>

  // Tela do Jogo (Perguntas)
  if (currentLesson) {
    const exercise = currentLesson.exercises[currentExerciseIndex]
    return (
      <div className="game-screen">
        <div className="progress-bar-container">
          <div className="close-btn" onClick={() => setCurrentLesson(null)}>✕</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentExerciseIndex + 1) / currentLesson.exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="exercise-container">
          <h1 className="question-text">{exercise.prompt}</h1>

          <div className="options-grid">
            {exercise.options.map((opt) => (
              <div
                key={opt.id}
                className={`option-card ${selectedOption === opt ? 'selected' : ''} ${isCorrect !== null && opt.correct ? 'correct' : ''} ${isCorrect === false && selectedOption === opt ? 'wrong' : ''}`}
                onClick={() => !isCorrect && setSelectedOption(opt)}
              >
                <div className="option-key">{String.fromCharCode(65 + exercise.options.indexOf(opt))}</div>
                <div className="option-text">{opt.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`footer-feedback ${isCorrect !== null ? (isCorrect ? 'success' : 'error') : ''}`}>
          <div className="feedback-content">
            {isCorrect === true && (
              <div className="feedback-message">
                <div className="check-icon">✓</div>
                <div>
                  <h3>Bom trabalho!</h3>
                </div>
              </div>
            )}
            {isCorrect === false && (
              <div className="feedback-message">
                <div className="check-icon">✕</div>
                <div>
                  <h3>A resposta correta é:</h3>
                  <p>{exercise.correctAnswer}</p>
                </div>
              </div>
            )}

            <button
              className={`check-btn ${selectedOption ? 'active' : ''}`}
              onClick={isCorrect !== null ? nextExercise : checkAnswer}
            >
              {isCorrect !== null ? 'CONTINUAR' : 'VERIFICAR'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Tela do Mapa (Home)
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="map-container">
          {/* Unidade 1 */}
          <div className="unit-header" style={{ backgroundColor: course.units[0].color }}>
            <div className="unit-info">
              <h2>Unidade 1</h2>
              <p>{course.units[0].title}</p>
            </div>
            <button className="guide-btn"><Book size={16} /> Guia</button>
          </div>

          <div className="path-container">
            {/* O BOTÃO MÁGICO DA IA */}
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <button
                    onClick={gerarLicaoIA}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#58cc02', color: 'white', border: 'none', borderRadius: '10px', boxShadow: '0 4px 0 #58a700' }}
                    disabled={loadingAI}
                >
                    {loadingAI ? "BMO Pensando... 🧠" : "✨ Gerar Nova Lição (IA)"}
                </button>
            </div>

            {course.units[0].lessons.map((lesson, index) => (
              <LessonButton
                key={lesson.id}
                active={true}
                color={course.units[0].color}
                onClick={() => startLesson(lesson)}
              />
            ))}
            <div className="bmo-character">
              <img src="https://upload.wikimedia.org/wikipedia/en/5/52/BMO_Adventure_Time.png" alt="BMO" width="80" />
            </div>
          </div>
        </div>
      </main>

      <div className="ranking-sidebar">
        <div className="ranking-card">
          <h3>Divisão Bronze</h3>
          <p>Você está na zona de promoção!</p>
          <div className="ranking-list">
            <div className="ranking-item active">
              <div className="rank-num">1</div>
              <div className="rank-avatar">🐧</div>
              <div className="rank-name">Você</div>
              <div className="rank-xp">400 XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App