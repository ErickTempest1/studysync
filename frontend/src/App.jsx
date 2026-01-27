import { useState, useEffect } from 'react'
import './App.css'
import bmoImg from './assets/BMO.png'
import { Star, Lock, Check, X } from 'lucide-react'

// --- BACKGROUNDS ---
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
      <svg className="cloud cloud-1" viewBox="0 0 100 50"><path fill="white" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" /></svg>
      <svg className="cloud cloud-2" viewBox="0 0 100 50"><path fill="white" d="M20,35 Q30,10 55,25 Q75,15 90,30 Q95,40 80,45 L20,45 Q5,45 20,35 Z" /></svg>
    </div>
)
const Stars = () => (
    <div className="stars-container">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="star" style={{width: Math.random()*3+'px', height: Math.random()*3+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', animationDelay: Math.random()*3+'s'}}></div>
      ))}
    </div>
)

// --- TELA DE VITÓRIA (LIMPA) ---
const VictoryScreen = ({ onContinue }) => {
    return (
        <div className="victory-overlay">
            <div className="victory-card">
                <div className="victory-header">
                    <div className="star-burst">⭐</div>
                    <div className="star-burst small">✨</div>
                </div>
                <h2>Lição Completa!</h2>
                <img src={bmoImg} className="victory-img" alt="BMO Happy" />

                {/* Removi os stats de XP e Vidas */}
                <p style={{color: '#666', fontWeight: 'bold', margin: '10px 0'}}>
                    Você está mandando muito bem!
                </p>

                <button className="action-btn victory-btn" onClick={onContinue}>
                    CONTINUAR
                </button>
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
function App() {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [status, setStatus] = useState('none') // 'none', 'correct', 'wrong'
  const [loadingAI, setLoadingAI] = useState(false);
  const [timeTheme, setTimeTheme] = useState('day')
  const [bmoMessage, setBmoMessage] = useState("Vamos codar!")

  // Save System (Apenas Progresso agora, sem XP/Vidas)
  const [showVictory, setShowVictory] = useState(false);
  const [unlockedIndex, setUnlockedIndex] = useState(() => parseInt(localStorage.getItem('duo_progress')) || 0);

  useEffect(() => { localStorage.setItem('duo_progress', unlockedIndex) }, [unlockedIndex]);

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

  const handleLessonStart = (lesson, index) => {
      if (index > unlockedIndex) { setBmoMessage("Fase bloqueada! 🔒"); return; }

      // Removida a verificação de vidas (hearts <= 0)

      setShowVictory(false);

      if (lesson.exercises && lesson.exercises.length > 0) {
          startLessonGame(lesson);
      } else {
          gerarLicaoIA(lesson);
      }
  }

  const gerarLicaoIA = (lesson) => {
    setLoadingAI(true);
    setBmoMessage("BMO está baixando questões...");
    fetch('http://localhost:8080/courses/test-ai')
      .then(res => res.json())
      .then(novasQuestoes => {
        const listaExercicios = Array.isArray(novasQuestoes) ? novasQuestoes : [novasQuestoes];
        const licaoIA = { ...lesson, exercises: listaExercicios };
        startLessonGame(licaoIA);
        setLoadingAI(false);
      })
      .catch(err => {
        console.error("Erro IA:", err);
        setLoadingAI(false);
        const fallback = { ...lesson, exercises: [{ prompt: "Offline: console.log imprime?", correctAnswer: "Sim", explanation:"É a função padrão.", options: [{text:"Não", correct:false}, {text:"Sim", correct:true}] }] };
        startLessonGame(fallback);
      });
  };

  const startLessonGame = (lesson) => {
    setActiveLesson(lesson);
    setCurrentExerciseIndex(0);
    setStatus('none');
    setSelectedOption(null)
    setBmoMessage("Foco total!")
  }

  const checkAnswer = () => {
    if(!selectedOption) return;
    const isRight = selectedOption.isCorrect !== undefined ? selectedOption.isCorrect : selectedOption.correct;
    setStatus(isRight ? 'correct' : 'wrong')

    if (isRight) {
        setBmoMessage("Correto!");
        const snd = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
        snd.volume = 0.2;
        snd.play().catch(()=>{});
    } else {
        setBmoMessage("Ops! Veja a explicação.");
        // Não removemos mais vidas aqui
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < activeLesson.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setStatus('none');
        setSelectedOption(null);
        setBmoMessage("Próxima...");
    } else {
        finishLesson();
    }
  }

  const finishLesson = () => {
      setShowVictory(true);
      if (unlockedIndex < course.units.length * 3) {
          setUnlockedIndex(prev => prev + 1);
      }
  };

  const closeVictory = () => {
      setShowVictory(false);
      setActiveLesson(null);
      setBmoMessage("Vamos para a próxima!");
  };

  const resetProgress = () => {
      if(confirm("Reiniciar progresso?")) {
          setUnlockedIndex(0);
          setBmoMessage("Memória apagada! 😵‍💫");
      }
  }

  const pokeBmo = () => {
    const falas = ["Bip Bop!", "Java é vida!", "Não esqueça o ;", "🐧💻"]
    setBmoMessage(falas[Math.floor(Math.random() * falas.length)])
  }

  if (!course) return <div className={`app-container ${timeTheme} loading`}>Carregando o mundo...</div>

  // --- RENDER ---
  const currentExercise = activeLesson?.exercises[currentExerciseIndex];

  return (
    <div className={`app-container ${timeTheme}`}>

      {/* Background Layers */}
      <div className="background-layer">
         {timeTheme === 'day' && <><Sun /><Clouds /></>}
         {timeTheme === 'sunset' && <><Sun isSunset /><Clouds /></>}
         {timeTheme === 'night' && <><Moon /><Stars /></>}
         <div className="waves">
            <svg className="wave-layer-1" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,202.7C672,181,768,139,864,138.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            <svg className="wave-layer-2" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            <svg className="wave-layer-3" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,266.7C840,277,960,267,1080,245.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
         </div>
      </div>

      <div className="alive-bmo" onClick={pokeBmo}>
        <div className={`bmo-speech ${status}`}>{bmoMessage}</div>
        <img src={bmoImg} alt="BMO" className="bmo-img animate-float" />
      </div>

      <div className="content-wrapper">

        {showVictory && <VictoryScreen onContinue={closeVictory} />}

        {/* --- TELA DE JOGO --- */}
        {activeLesson && !showVictory ? (
            <div className="game-card">
                <div className="game-header">
                    <button onClick={() => setActiveLesson(null)}><X size={24} color="#afafaf"/></button>
                    {/* Barra de Progresso Real */}
                    <div className="progress-bar">
                        <div className="fill" style={{ width: `${((currentExerciseIndex) / (activeLesson.exercises.length)) * 100}%` }}></div>
                    </div>
                    {/* Removida a exibição de Vidas aqui */}
                </div>

                <div className="game-body">
                    <h2>{currentExercise?.prompt}</h2>
                    <div className="options-list">
                        {currentExercise?.options.map((opt, idx) => (
                            <div key={idx}
                                 className={`option-item ${selectedOption === opt ? 'selected' : ''} ${status === 'correct' && (opt.isCorrect || opt.correct) ? 'correct' : ''} ${status === 'wrong' && selectedOption === opt ? 'wrong' : ''}`}
                                 onClick={() => status === 'none' && setSelectedOption(opt)}>
                                {opt.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- FOOTER / FEEDBACK SHEET --- */}
                <div className={`game-footer ${status}`}>
                    {status === 'none' ? (
                        <button className="action-btn" onClick={checkAnswer} disabled={!selectedOption}>
                            VERIFICAR
                        </button>
                    ) : (
                        <div className="feedback-sheet">
                            <div className="feedback-header">
                                {status === 'correct' ? (
                                    <><div className="icon-circle correct"><Check size={30}/></div> <span>Correto!</span></>
                                ) : (
                                    <><div className="icon-circle wrong"><X size={30}/></div> <span>Incorreto...</span></>
                                )}
                            </div>

                            {/* EXPLICAÇÃO AQUI */}
                            <div className="feedback-text">
                                <strong>Explicação:</strong><br/>
                                {currentExercise?.explanation || "A resposta correta é: " + currentExercise?.correctAnswer}
                            </div>

                            <button className={`action-btn ${status === 'correct' ? 'btn-correct' : 'btn-wrong'}`} onClick={nextExercise}>
                                CONTINUAR
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            /* --- MAPA --- */
            !showVictory && (
            <div className="map-view">
                <header className="map-header">
                    <span className="course-title" onClick={resetProgress} style={{cursor:'pointer'}}>🐧 {course.title}</span>
                    <div className="stats">
                        {/* Apenas o ícone de engrenagem ou vazio, já que não temos mais stats */}
                        <span className="stat-box" style={{opacity:0.6}}>Modo Estudo 📚</span>
                    </div>
                </header>
                <div className="units-list">
                    {course.units.map((unit, unitIdx) => (
                        <div key={unit.id} className="unit-section">
                            <div className="unit-banner" style={{backgroundColor: unit.color}}>
                                <h3>{unit.title}</h3>
                                <p>Unidade {unit.orderIndex}</p>
                            </div>
                            <div className="lessons-path">
                                {unit.lessons.map((lesson, idx) => {
                                    const globalIndex = idx + (unitIdx * 3);
                                    let nodeStatus = 'locked';
                                    if (globalIndex < unlockedIndex) nodeStatus = 'completed';
                                    else if (globalIndex === unlockedIndex) nodeStatus = 'current';
                                    return (
                                    <div key={lesson.id} className={`lesson-node ${idx % 2 !== 0 ? 'right' : 'left'}`}>
                                        <button
                                            className={`lesson-btn ${nodeStatus}`}
                                            onClick={() => handleLessonStart(lesson, globalIndex)}
                                            style={{backgroundColor: nodeStatus === 'locked' ? '#e5e7eb' : unit.color}}
                                        >
                                            {nodeStatus === 'locked' ? <Lock size={20}/> : nodeStatus === 'completed' ? <Check size={28}/> : <Star fill="white" size={24}/>}
                                        </button>
                                        {nodeStatus === 'current' && <div className="start-label">COMEÇAR</div>}
                                    </div>
                                )})}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )
        )}
      </div>
    </div>
  )
}

export default App