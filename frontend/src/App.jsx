import { useState, useEffect } from 'react'
import './App.css'
import bmoImg from './assets/BMO.png'
import { Book, Star, Trophy, Zap, Shield, Flame, Heart, Lock, Check, X } from 'lucide-react'

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

// --- COMPONENTE: TELA DE VITÓRIA ---
const VictoryScreen = ({ xpGained, onContinue }) => {
    return (
        <div className="victory-overlay">
            <div className="victory-card">
                <div className="victory-header">
                    <div className="star-burst">⭐</div>
                    <div className="star-burst small">✨</div>
                </div>
                <h2>Lição Completa!</h2>
                <img src={bmoImg} className="victory-img" alt="BMO Happy" />

                <div className="stats-row">
                    <div className="stat-pill xp">
                        <span>💎</span> +{xpGained} XP
                    </div>
                    <div className="stat-pill speed">
                        <span>⚡</span> Super Rápido!
                    </div>
                </div>

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
  const [status, setStatus] = useState('none')
  const [loadingAI, setLoadingAI] = useState(false);
  const [timeTheme, setTimeTheme] = useState('day')
  const [bmoMessage, setBmoMessage] = useState("Vamos codar!")

  // ESTADOS DE JOGO
  const [showVictory, setShowVictory] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);

  // --- PERSISTÊNCIA (SAVE SYSTEM) ---
  const [unlockedIndex, setUnlockedIndex] = useState(() => parseInt(localStorage.getItem('duo_progress')) || 0);
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('duo_xp')) || 0);
  const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('duo_hearts')) || 5);

  // Salva no navegador sempre que mudar
  useEffect(() => { localStorage.setItem('duo_progress', unlockedIndex) }, [unlockedIndex]);
  useEffect(() => { localStorage.setItem('duo_xp', xp) }, [xp]);
  useEffect(() => { localStorage.setItem('duo_hearts', hearts) }, [hearts]);

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
      if (hearts <= 0) { setBmoMessage("Sem vidas! 💔"); alert("Sem vidas! Espere ou reinicie."); return; }

      setSessionXp(0);
      setShowVictory(false);

      if (lesson.exercises && lesson.exercises.length > 0) {
          startLessonGame(lesson);
      } else {
          gerarLicaoIA(lesson);
      }
  }

  const gerarLicaoIA = (lesson) => {
    setLoadingAI(true);
    setBmoMessage("Criando desafio...");
    fetch('http://localhost:8080/courses/test-ai')
      .then(res => res.json())
      .then(novaQuestao => {
        const licaoIA = { ...lesson, exercises: [novaQuestao] };
        startLessonGame(licaoIA);
        setLoadingAI(false);
      })
      .catch(err => {
        console.error("Erro IA:", err);
        setLoadingAI(false);
        const fallback = { ...lesson, exercises: [{ prompt: "Modo Offline: Qual comando imprime no Java?", correctAnswer: "System.out.println", options: [{text:"echo", correct:false}, {text:"System.out.println", correct:true}] }] };
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
        setBmoMessage("Boa! +10 XP 💎");
        setXp(prev => prev + 10);
        setSessionXp(prev => prev + 10);
        const snd = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
        snd.volume = 0.2;
        snd.play().catch(()=>{});
    } else {
        setBmoMessage("Errou! -1 Vida 💔");
        setHearts(prev => Math.max(0, prev - 1));
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < activeLesson.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setStatus('none');
        setSelectedOption(null);
        setBmoMessage("Próximo...");
    } else {
        finishLesson(); // Chama a vitória
    }
  }

  const finishLesson = () => {
      setShowVictory(true);
      // Avança apenas se for a lição atual
      if (unlockedIndex < course.units.length * 3) {
          // Lógica simplificada de avanço
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
          setUnlockedIndex(0); setXp(0); setHearts(5);
          setBmoMessage("Memória apagada! 😵‍💫");
      }
  }

  const pokeBmo = () => {
    const falas = ["Bip Bop!", "Java é vida!", "Não esqueça o ;", "🐧💻"]
    setBmoMessage(falas[Math.floor(Math.random() * falas.length)])
  }

  if (!course) return <div className={`app-container ${timeTheme} loading`}>Carregando o mundo...</div>

  return (
    <div className={`app-container ${timeTheme}`}>

      <div className="background-layer">
         {timeTheme === 'day' && <><Sun /><Clouds /></>}
         {timeTheme === 'sunset' && <><Sun isSunset /><Clouds /></>}
         {timeTheme === 'night' && <><Moon /><Stars /></>}
         <div className="waves">
            <svg className="wave-back" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            <svg className="wave-front" viewBox="0 0 1440 320" preserveAspectRatio="none"><path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
         </div>
      </div>

      <div className="alive-bmo" onClick={pokeBmo}>
        <div className={`bmo-speech ${status}`}>{bmoMessage}</div>
        <img src={bmoImg} alt="BMO" className="bmo-img animate-float" />
      </div>

      <div className="content-wrapper">

        {/* --- TELA DE VITÓRIA (MODAL) --- */}
        {showVictory && (
            <VictoryScreen xpGained={sessionXp} onContinue={closeVictory} />
        )}

        {/* --- MODO JOGO --- */}
        {activeLesson && !showVictory ? (
            <div className="game-card">
                <div className="game-header">
                    <button onClick={() => setActiveLesson(null)}><X size={24} color="#afafaf"/></button>
                    <div className="progress-bar"><div className="fill" style={{ width: `${((currentExerciseIndex + 1) / (activeLesson.exercises.length || 1)) * 100}%` }}></div></div>
                    <div className="hearts-display"><Heart fill="red" color="red" size={20} /> {hearts}</div>
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
                    <button className="action-btn" onClick={status === 'none' ? checkAnswer : nextExercise} disabled={!selectedOption && status === 'none'}>
                        {status === 'none' ? 'VERIFICAR' : 'PRÓXIMO'}
                    </button>
                </div>
            </div>
        ) : (
            /* --- MAPA --- */
            !showVictory && (
            <div className="map-view">
                <header className="map-header">
                    <span className="course-title" onClick={resetProgress} style={{cursor:'pointer'}}>🐧 {course.title}</span>
                    <div className="stats">
                        <span className="stat-box">💎 {xp} XP</span>
                        <span className="stat-box"><Heart fill="#ff4b4b" color="#ff4b4b" size={18}/> {hearts}</span>
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