import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [step, setStep] = useState<'start' | 'espresso_shot' | 'espresso_instruction' | 'filter_cups' | 'filter_slider' | 'filter_ready' | 'filter_brew' | 'coldbrew_grams' | 'coldbrew_instruction'>('start');
  const [shot, setShot] = useState<'single' | 'double' | ''>('');
  const [cups, setCups] = useState(1);
  const [grams, setGrams] = useState(20);
  const [timer, setTimer] = useState(0);
  const [initialTimer, setInitialTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const bellSoundRef = useRef<HTMLAudioElement | null>(null);

  const reset = () => {
    setStep('start');
    setShot('');
    setGrams(20);
    setCups(1);
    setTimer(0);
    setInitialTimer(0);
    setRunning(false);
    setFinished(false);
  };

  useEffect(() => {
    if (!running || timer <= 0) return;
    if (tickSoundRef.current?.canPlayType('audio/mpeg')) {
      tickSoundRef.current?.play().catch(() => { });
    }
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setRunning(false);
          setFinished(true);
          if (bellSoundRef.current?.canPlayType('audio/mpeg')) {
            bellSoundRef.current?.play().catch(() => { });
          }
          return 0;
        }
        if (tickSoundRef.current?.canPlayType('audio/mpeg')) {
          tickSoundRef.current?.play().catch(() => { });
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, timer]);

  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
      <div
        className="h-full bg-[#9c6644] rounded"
        style={{
          width: `${initialTimer > 0 ? ((initialTimer - timer) / initialTimer) * 100 : 0}%`,
          transition: 'width 1s linear'
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefae0] to-[#faedcd] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6 mx-auto">
        <audio ref={tickSoundRef} src="/sounds/tick.mp3" preload="auto" />
        <audio ref={bellSoundRef} src="/sounds/bell.mp3" preload="auto" />
        <img src="/src/assets/logo.png" alt="Логотип" className="w-24 mx-auto mb-6" />

        {step === 'start' && (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-[#432818]">Какой напиток готовим?</h1>
            <div className="space-y-2">
              <button onClick={() => { setStep('espresso_shot'); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Эспрессо</button>
              <button onClick={() => { setStep('filter_cups'); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Фильтр</button>
              <button onClick={() => { setStep('coldbrew_grams'); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Колд-брю</button>
            </div>
          </div>
        )}

        {step === 'espresso_shot' && (
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-semibold text-[#432818]">Какой объём?</h2>
            <button onClick={() => { setShot('single'); setStep('espresso_instruction'); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Одиночный шот</button>
            <button onClick={() => { setShot('double'); setStep('espresso_instruction'); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Двойной шот</button>
          </div>
        )}

        {step === 'espresso_instruction' && (
          <div className="space-y-4 text-center">
            <p>Возьмите {shot === 'single' ? 9 : 18} грамм молотого кофе и утрамбуйте</p>
            {!running && !finished && (
              <button onClick={() => { setTimer(30); setInitialTimer(30); setRunning(true); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Начать</button>
            )}
            {running && timer > 0 && (
              <>
                <p>Заваривание... Осталось {timer} секунд</p>
                {renderProgressBar()}
              </>
            )}
            {!running && finished && (
              <>
                <p>Напиток готов.</p>
                <p>Ваш напиток должен быть объёмом {shot === 'single' ? 18 : 36} грамм.</p>
                <p>Если меньше — увеличьте помол, если больше — уменьшите объём.</p>
              </>
            )}
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'coldbrew_grams' && (
          <div className="space-y-4 text-center">
            <p>Сколько грамм кофе будем заваривать? Рекомендуется от 60 до 80 грамм.</p>
            <input
              type="range"
              min={40}
              max={80}
              step={2}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full"
            />
            <p className="font-semibold">{grams} г кофе</p>
            <p>Вам понадобится {grams * 8} мл. воды</p>
            <button onClick={() => setStep('coldbrew_instruction')} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white font-semibold py-2 rounded-lg transition">Начать заваривание</button>
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'coldbrew_instruction' && (
          <div className="space-y-4 text-center">
            <p>Залейте бутылку водой, взболтайте аккуратно круговыми движениями. Уберите в холодильник на 8 часов.</p>
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'filter_cups' && (
          <div className="space-y-4 text-center">
            <p>Сколько чашек кофе будем заваривать?</p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => { setCups(num); setGrams(num === 1 ? 10 : 20); setStep('filter_slider'); }}
                  className={`px-4 py-2 rounded-lg font-semibold ${cups === num ? 'bg-[#9c6644] text-white' : 'bg-gray-200'}`}
                >
                  {num} чашка{num > 1 ? 'и' : ''}
                </button>
              ))}
            </div>
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'filter_slider' && (
          <div className="space-y-4 text-center">
            <p>Выберите количество кофе (грамм):</p>
            <input
              type="range"
              min={cups === 1 ? 10 : 20}
              max={cups === 1 ? 20 : 40}
              step={2}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full"
            />
            <p className="font-semibold">{grams} г кофе</p>
            <p>Вам понадобится {Math.round(grams * 16)} мл. кипяченой воды<br />(светлая обжарка: 100°C, средняя: 90–95°C, тёмная: 80–90°C)</p>
            <button onClick={() => setStep('filter_ready')} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white py-2 rounded-lg">Далее</button>
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'filter_ready' && (
          <div className="space-y-4 text-center">
            <p>Промочите фильтр небольшим количеством воды.</p>
            <p>Положите кофе в вашу V60 и сделайте небольшое отверстие в середине слоя.</p>
            <button onClick={() => { setStep('filter_brew'); setTimer(180); setInitialTimer(180); setRunning(true); }} className="w-full bg-[#7f5539] hover:bg-[#9c6644] text-white py-2 rounded-lg">Всё готово</button>
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}

        {step === 'filter_brew' && (
          <div className="space-y-4 text-center">
            <p>Налейте 50 г воды для цветения и подождите 10 секунд.</p>
            <p>Медленно круговыми движениями от центра к краям вливайте воду по 100 мл и делайте паузы.</p>
            <p>К концу таймера вся вода должна оказаться в сервировочном чайнике (допустимы отклонения).</p>
            {timer > 0 && (
              <>
                <p>Осталось {timer} секунд</p>
                {renderProgressBar()}
              </>
            )}
            {!running && timer === 0 && <p>Заваривание завершено!</p>}
            <button onClick={reset} className="w-full bg-gray-200 py-2 rounded">Начать сначала</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;