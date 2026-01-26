import { useState, useEffect } from 'react'
import './App.css'
// IMPORTANTE: Importando a imagem local
import bmoImg from './assets/BMO.png'

// --- COMPONENTES DO CÉU (SVGs) ---
const Sun = ({ isSunset }) => (
  <div className={`celestial-body ${isSunset ? 'sunset-sun' : 'day-sun'}`}>
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="50" r="30" fill={isSunset ? "#FDB813" : "#FDE047"} />
      {!isSunset && [0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <rect key={deg} x="48" y="5" width="4" height="15" fill="#FDE047" transform={`rotate(${deg} 50 50)`} />
      ))}
    </svg>
  </div>
)

const Moon = () => (
  <div className="celestial-body moon">
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M50 10 C 30 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z" fill="#F3F4F6" />
      <circle cx="35" cy="35" r="8" fill="#E5E7EB" />
      <circle cx="55" cy="65" r="12" fill="#E5E7EB" />
    </svg>
  </div>
)

const Clouds = () => (
  <div className="clouds-container">
    <svg className="cloud cloud-1" viewBox="0 0 100 50">
      <path fill="white" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" />
    </svg>
    <svg className="cloud cloud-2" viewBox="0 0 100 50">
      <path fill="white" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" />
    </svg>
  </div>
)

const Stars = () => (
  <div className="stars-container">
    {[...Array(30)].map((_, i) => (
      <div key={i} className="star" style={{
         width: Math.random() * 3 + 'px',
         height: Math.random() * 3 + 'px',
         top: Math.random() * 100 + '%',
         left: Math.random() * 100 + '%',
         animationDelay: Math.random() * 3 + 's'
      }}></div>
    ))}
  </div>
)

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none')
  const [loadingAI, setLoadingAI] = useState(false);

  const [timeTheme, setTimeTheme] = useState('day')
  const [bmoMessage, setBmoMessage] = useState("Vamos codar!")

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 17) setTimeTheme('day')
      else if (hour >= 17 && hour < 19) setTimeTheme('sunset')
      else setTimeTheme('night')
    }
    updateTime()
  }, [])

  useEffect(() => {
    fetch('http://localhost:8080/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
      .catch(err => console.error("Erro Backend:", err))
  }, [])

  const gerarLicaoIA = () => {
    setLoadingAI(true);
    setBmoMessage("Processando na nuvem...");
    fetch('http://localhost:8080/courses/test-ai')
      .then(res => res.json())
      .then(novaQuestao => {
        const licaoIA = { id: 999, title: "Desafio BMO (IA)", exercises: [novaQuestao] };
        startLesson(licaoIA);
        setLoadingAI(false);
      })
      .catch(err => {
        console.error("Erro IA:", err);
        setLoadingAI(false);
        const fallback = {
            id: 999,
            title: "Modo Offline",
            exercises: [{
                prompt: "O BMO perdeu o sinal da IA. Quanto é 1 + 1 em Java?",
                correctAnswer: "2",
                options: [
                    {text: "11", isCorrect: false},
                    {text: "2", isCorrect: true},
                    {text: "NaN", isCorrect: false}
                ]
            }]
        };
        startLesson(fallback);
        setBmoMessage("Sem sinal... Modo Offline ativado!");
      });
  };

  const pokeBmo = () => {
    const falas = ["Bip Bop!", "Java é legal!", "Eu amo baterias!", "Você consegue!", "🐧💻"]
    setBmoMessage(falas[Math.floor(Math.random() * falas.length)])
  }

  const startLesson = (lesson) => {
    setActiveLesson(lesson); setCurrentExerciseIndex(0); setStatus('none'); setSelectedOption(null)
    setBmoMessage("Concentre-se!")
  }

  const checkAnswer = () => {
    if(!selectedOption) return;
    const isRight = selectedOption.isCorrect !== undefined ? selectedOption.isCorrect : selectedOption.correct;
    setStatus(isRight ? 'correct' : 'wrong')
    setBmoMessage(isRight ? "Compilado com sucesso! 🎉" : "Erro de sintaxe... 🐛")
  }

  if (!course) return <div className={`app-container ${timeTheme} loading`}>Carregando o mundo...</div>

  return (
    <div className={`app-container ${timeTheme}`}>

      <div className="background-layer">
         {timeTheme === 'day' && <><Sun /><Clouds /></>}
         {timeTheme === 'sunset' && <><Sun isSunset /><Clouds /></>}
         {timeTheme === 'night' && <><Moon /><Stars /></>}

         <div className="waves">
            <svg className="wave-back" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg className="wave-front" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
         </div>
      </div>

      {/* AQUI ESTÁ A MUDANÇA DA IMAGEM */}
      <div className="alive-bmo" onClick={pokeBmo}>
        <div className={`bmo-speech ${status}`}>
            {bmoMessage}
        </div>
        <img
            src={bmoImg}
            alt="BMO"
            className="bmo-img animate-float"
        />
      </div>

      <div className="content-wrapper">
        {activeLesson ? (
            <div className="game-card">
                <div className="game-header">
                    <button onClick={() => setActiveLesson(null)}>✕</button>
                    <div className="progress-bar"><div className="fill" style={{ width: `${((currentExerciseIndex + 1) / activeLesson.exercises.length) * 100}%` }}></div></div>
                </div>
                <div className="game-body">
                    <h2>{activeLesson.exercises[currentExerciseIndex].prompt}</h2>
                    <div className="options-list">
                        {activeLesson.exercises[currentExerciseIndex].options.map((opt, idx) => (
                            <div key={idx}
                                 className={`option-item ${selectedOption === opt ? 'selected' : ''} ${status === 'correct' && (opt.isCorrect || opt.correct) ? 'correct' : ''} ${status === 'wrong' && selectedOption === opt ? 'wrong' : ''}`}
                                 onClick={() => status === 'none' && setSelectedOption(opt)}>
                                {opt.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="game-footer">
                    <button className="action-btn" onClick={checkAnswer} disabled={!selectedOption}>
                        {status === 'none' ? 'VERIFICAR' : 'PRÓXIMO'}
                    </button>
                </div>
            </div>
        ) : (
            <div className="map-view">
                <header className="map-header">
                    <span className="course-title">🐧 {course.title}</span>
                    <div className="stats">💎 500 🔥 12</div>
                </header>

                <div className="units-list">
                    {course.units.map(unit => (
                        <div key={unit.id} className="unit-section">
                            <div className="unit-banner" style={{backgroundColor: unit.color}}>
                                <h3>{unit.title}</h3>
                                <p>Unidade {unit.orderIndex}</p>
                            </div>
                            <div className="lessons-path">
                                <div className="lesson-node ai-node">
                                    <button onClick={gerarLicaoIA} disabled={loadingAI} className="ai-btn">
                                        {loadingAI ? "🧠..." : "✨ IA"}
                                    </button>
                                </div>

                                {unit.lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className={`lesson-node ${idx % 2 !== 0 ? 'right' : 'left'}`}>
                                        <button className="lesson-btn" onClick={() => startLesson(lesson)} style={{backgroundColor: unit.color}}>
                                            ★
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default App