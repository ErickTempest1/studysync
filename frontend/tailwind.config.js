/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta StudySync 2.0
        'tech-blue': '#3B82F6',    // Azul Code (Principal)
        'tech-green': '#10B981',   // Verde Success (Acertos)
        'tech-yellow': '#F59E0B',  // Amarelo Warning
        'tech-orange': '#F97316',  // Laranja Fire (Streak)
        'tech-black': '#111827',   // Preto Terminal (Textos)
        'tech-dark': '#1F2937',    // Cinza Escuro (Fundos)
        'tech-paper': '#F3F4F6',   // Cinza Claro (Fundo dos cards)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fonte mais limpa (se tiver instalada, senão usa padrão)
      }
    },
  },
  plugins: [],
}