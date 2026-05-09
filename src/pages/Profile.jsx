import { useApp } from '../store/AppContext'

export default function Profile() {
  const { userName, userEmoji, muscleScores } = useApp()

  return (
    <div className="pb-4">
      <header className="pt-[52px] px-5 pb-7 flex flex-col items-center gap-2 bg-gradient-to-b from-accent/[0.1] to-transparent">
        <div className="text-[64px] leading-none mb-1">{userEmoji}</div>
        <h1 className="font-display text-2xl font-bold text-[#f0eeff]">{userName}</h1>
        <p className="text-[13px] text-[#a898ff] bg-accent/15 px-3 py-1 rounded-full">Atleta FitFlow</p>
      </header>

      <section className="py-2 px-5">
        <h2 className="font-display text-base font-semibold text-[#8b87a8] uppercase tracking-[0.08em] mb-4">Grupos Musculares</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(muscleScores).map(([muscle, score]) => (
            <div key={muscle} className="flex items-center gap-3">
              <span className="w-[72px] text-[13px] text-[#8b87a8] capitalize shrink-0">{muscle}</span>
              <div className="flex-1 h-[6px] bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-[width] duration-[400ms] ease-in-out"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="w-7 text-right text-[13px] font-semibold text-[#8b87a8] shrink-0">{score}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
