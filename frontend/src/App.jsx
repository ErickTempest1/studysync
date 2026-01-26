/* Reset básico */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Din Round', sans-serif; /* Fonte parecida com Duo */
}

body {
  background-color: #ffffff;
  color: #3c3c3c;
}

/* Layout Principal */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar (Menu Lateral) */
.sidebar {
  width: 256px;
  background: #fff;
  border-right: 2px solid #e5e5e5;
  padding: 24px;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-text {
  color: #58cc02;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: -1px;
  margin-bottom: 30px;
  padding-left: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  color: #777;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.8px;
  border: 2px solid transparent;
  transition: background 0.2s;
}

.nav-item:hover {
  background-color: #f7f7f7;
}

.nav-item.active {
  color: #1cb0f6;
  background-color: #ddf4ff;
  border-color: #84d8ff;
}

.nav-item span {
  margin-left: 20px;
}

/* Conteúdo Principal */
.main-content {
  margin-left: 256px;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin-right: 350px; /* Espaço para o ranking */
}

/* Header (Topo) */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.flag-icon {
  font-size: 24px;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  padding: 4px 8px;
}

.stats-container {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #afafaf;
}

.stat-item span {
  color: #afafaf;
}

/* Mapa das Lições */
.map-container {
  padding: 20px 40px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unit-header {
  width: 100%;
  border-radius: 16px;
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 6px 0 rgba(0,0,0,0.2);
}

.unit-info h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.guide-btn {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.4);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Caminho das Lições (Cobra) */
.path-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
}

.lesson-path-item {
  position: relative;
  z-index: 2;
}

/* Fazendo o zigue-zague simples */
.lesson-path-item:nth-child(odd) { transform: translateX(-30px); }
.lesson-path-item:nth-child(even) { transform: translateX(30px); }

.lesson-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 8px 0 rgba(0,0,0,0.2);
  transition: transform 0.1s, box-shadow 0.1s;
  position: relative;
}

.lesson-circle:active {
  transform: translateY(4px);
  box-shadow: 0 4px 0 rgba(0,0,0,0.2);
}

/* BMO */
.bmo-character {
  position: absolute;
  bottom: 20px;
  left: -120px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Ranking Sidebar */
.ranking-sidebar {
  width: 350px;
  position: fixed;
  right: 0;
  height: 100%;
  padding: 24px;
  background-color: white;
}

.ranking-card {
  border: 2px solid #e5e5e5;
  border-radius: 16px;
  padding: 20px;
}

.ranking-card h3 {
  color: #3c3c3c;
  margin-bottom: 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 12px;
}

.ranking-item.active {
  background-color: #ddf4ff;
  border: 2px solid #84d8ff;
}

.rank-avatar {
  font-size: 24px;
  margin: 0 15px;
}

.rank-name {
  font-weight: bold;
  flex: 1;
}

.rank-xp {
  color: #777;
}

/* --- TELA DO JOGO --- */
.game-screen {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.close-btn {
  font-size: 24px;
  color: #e5e5e5;
  cursor: pointer;
}

.progress-bar {
  flex: 1;
  height: 16px;
  background-color: #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #58cc02;
  transition: width 0.3s ease;
}

.question-text {
  font-size: 32px;
  color: #3c3c3c;
  margin-bottom: 40px;
  text-align: center;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.option-card {
  border: 2px solid #e5e5e5;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 0 #e5e5e5;
}

.option-card:hover {
  background-color: #f7f7f7;
}

.option-card.selected {
  border-color: #84d8ff;
  background-color: #ddf4ff;
  box-shadow: 0 2px 0 #84d8ff;
}

.option-card.correct {
  border-color: #58cc02;
  background-color: #d7ffb8;
  color: #58a700;
}

.option-card.wrong {
  border-color: #ff4b4b;
  background-color: #ffdfe0;
  color: #ea2b2b;
}

.option-key {
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
  color: #777;
}

.option-card.selected .option-key {
  border-color: #84d8ff;
  color: #1cb0f6;
}

/* Footer de Feedback */
.footer-feedback {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  border-top: 2px solid #e5e5e5;
  background: white;
}

.footer-feedback.success {
  background-color: #d7ffb8;
  border-color: #58cc02;
  color: #58a700;
}

.footer-feedback.error {
  background-color: #ffdfe0;
  border-color: #ff4b4b;
  color: #ea2b2b;
}

.feedback-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-message {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 24px;
  font-weight: bold;
}

.check-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.footer-feedback.success .check-icon { color: #58cc02; }
.footer-feedback.error .check-icon { color: #ff4b4b; }

.check-btn {
  background-color: #e5e5e5;
  color: #afafaf;
  border: none;
  padding: 15px 40px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: not-allowed;
  box-shadow: none;
}

.check-btn.active {
  background-color: #58cc02;
  color: white;
  box-shadow: 0 4px 0 #58a700;
  cursor: pointer;
}

.footer-feedback.error .check-btn {
  background-color: #ff4b4b;
  box-shadow: 0 4px 0 #ea2b2b;
}