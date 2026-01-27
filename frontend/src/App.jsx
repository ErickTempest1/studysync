import { useState, useEffect } from 'react'
import './App.css'
import bmoImg from './assets/BMO.png'
import { Book, Star, Trophy, Zap, Shield, Flame, Heart, Lock, Check } from 'lucide-react' // Adicionei Heart

// --- BACKGROUND COMPONENTS (Mantidos iguais) ---
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

  // --- ESTADOS DO JOGO (COM MEMÓRIA/PERSISTÊNCIA) ---
  // Tenta ler do localStorage ao iniciar, se não tiver, usa o padrão
  const [unlockedIndex, setUnlockedIndex] = useState(() => parseInt(localStorage.getItem('duo_progress')) || 0);
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('duo_xp')) || 0);
  const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('duo_hearts')) || 5);

  // Efeito para Salvar sempre que mudar
  useEffect(() => { localStorage.setItem('duo_progress', unlockedIndex) }, [unlockedIndex]);
  useEffect(() => { localStorage.setItem('duo_xp', xp) }, [xp]);
  useEffect(() => { localStorage.setItem('duo_hearts', hearts) }, [hearts]);

  // Relógio do Céu
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 17) setTimeTheme('day')
      else if (hour >= 17 && hour < 19) setTimeTheme('sunset')
      else setTimeTheme('night')
    }
    updateTime()
  }, [])

  // Buscar Curso
  useEffect(() => {
    fetch('http://localhost:8080/courses')
      .then(res => res.json())
      .then(data => { if (data.length > 0) setCourse(data[0]) })
      .catch(err => console.error("Erro Backend:", err))
  }, [])

  // --- LÓGICA DO JOGO ---

  const handleLessonStart = (lesson, index) => {
      // Trava de Segurança: Não deixa abrir lições bloqueadas
      if (index > unlockedIndex) {
          setBmoMessage("Essa fase ainda está bloqueada! 🔒");
          return;
      }

      // Trava de Vidas: Sem coração, sem jogo
      if (hearts <= 0) {
          setBmoMessage("Você precisa descansar! (Sem vidas) 💔");
          alert("Você está sem vidas! Espere recarregar (ou reinicie o progresso no console).");
          return;
      }

      if (lesson.exercises && lesson.exercises.length > 0) {
          startLessonGame(lesson);
      } else {
          gerarLicaoIA(lesson);
      }
  }

  const gerarLicaoIA = (lesson) => {
    setLoadingAI(true);
    setBmoMessage("O BMO está criando um desafio...");
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
        setBmoMessage("Mandou bem! +10 XP 💎");
        setXp(prev => prev + 10); // Ganha XP
        const snd = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
        snd.volume = 0.2;
        snd.play().catch(()=>{});
    } else {
        setBmoMessage("Ah não! -1 Vida 💔");
        setHearts(prev => Math.max(0, prev - 1)); // Perde Vida
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < activeLesson.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setStatus('none');
        setSelectedOption(null);
        setBmoMessage("Próximo desafio...");
    } else {
        setBmoMessage("Lição Completada! 🏆");

        // Lógica de Desbloqueio: Só desbloqueia se for a última lição feita
        const currentLessonGlobalIndex = activeLesson.orderIndex - 1; // Ajuste simples, idealmente viria do map index
        // Simplificação: Se completou, tenta aumentar o index desbloqueado
        // Como não temos o index global aqui dentro fácil, vamos incrementar se não estivermos repetindo
        setUnlockedIndex(prev => prev + 1);

        setActiveLesson(null);
    }
  }

  // Cheat para resetar (útil pra testar)
  const resetProgress = () => {
      if(confirm("Reiniciar todo o progresso?")) {
          setUnlockedIndex(0);
          setXp(0);
          setHearts(5);
          setBmoMessage("Memória apagada! 😵‍💫");
      }
  }

  const pokeBmo = () => {
    const falas = ["Bip Bop!", "JavaScript é vida!", "Não esqueça o ponto e vírgula!", "🐧💻"]
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

      {/* BMO */}
      <div className="alive-bmo" onClick={pokeBmo}>
        <div className={`bmo-speech ${status}`}>{bmoMessage}</div>
        <img src={bmoImg} alt="BMO" className="bmo-img animate-float" />
      </div>

      <div className="content-wrapper">
        {activeLesson ? (
            <div className="game-card">
                <div className="game-header">
                    <button onClick={() => setActiveLesson(null)}>✕</button>
                    <div className="progress-bar"><div className="fill" style={{ width: `${((currentExerciseIndex + 1) / (activeLesson.exercises.length || 1)) * 100}%` }}></div></div>
                    {/* Vida no jogo */}
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
            <div className="map-view">
                <header className="map-header">
                    <span className="course-title" onClick={resetProgress}>🐧 {course.title}</span>
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
        )}
      </div>
    </div>
  )
}

export default App