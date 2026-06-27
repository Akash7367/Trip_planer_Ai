'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LocalLanguageHelperProps {
  destination?: string;
}

interface Phrase {
  phrase: string;
  native: string;
  roman: string;
  englishMeaning: string;
}

export default function LocalLanguageHelper({ destination = 'Maharashtra' }: LocalLanguageHelperProps) {
  const { currentLanguage, speakText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'phrases' | 'voice' | 'ocr' | 'emergency'>('phrases');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Voice simulator states
  const [voiceMode, setVoiceMode] = useState<'userToLocal' | 'localToUser'>('userToLocal');
  const [inputText, setInputText] = useState('');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isListening, setIsListening] = useState(false);

  // OCR Simulator states
  const [ocrImage, setOcrImage] = useState<'menu' | 'sign' | 'board'>('menu');
  const [ocrMode, setOcrMode] = useState<'original' | 'translated' | 'sideBySide'>('sideBySide');

  const destLower = destination.toLowerCase();

  // Dynamic local language selection based on destination
  const localLangInfo = useMemo(() => {
    if (destLower.includes('goa') || destLower.includes('maharashtra') || destLower.includes('mumbai') || destLower.includes('pune')) {
      return { name: 'Marathi', code: 'mr', native: 'मराठी' };
    } else if (destLower.includes('kyoto') || destLower.includes('tokyo') || destLower.includes('japan')) {
      return { name: 'Japanese', code: 'ja', native: '日本語' };
    } else if (destLower.includes('kolkata') || destLower.includes('bengal')) {
      return { name: 'Bengali', code: 'bn', native: 'বাংলা' };
    } else if (destLower.includes('chennai') || destLower.includes('tamil')) {
      return { name: 'Tamil', code: 'ta', native: 'தமிழ்' };
    }
    return { name: 'Hindi', code: 'hi', native: 'हिन्दी' };
  }, [destLower]);

  // Useful phrases matching the local language
  const phrasesList: Phrase[] = useMemo(() => {
    const lang = localLangInfo.code;
    if (lang === 'mr') {
      return [
        { phrase: 'Hello', native: 'नमस्कार', roman: 'Namaskar', englishMeaning: 'Hello / Greetings' },
        { phrase: 'Thank You', native: 'धन्यवाद', roman: 'Dhanyavaad', englishMeaning: 'Thank you' },
        { phrase: 'Where is the railway station?', native: 'रेल्वे स्टेशन कुठे आहे?', roman: 'Railway station kuthe aahe?', englishMeaning: 'Where is the railway station?' },
        { phrase: 'Bus Stop', native: 'बस थांबा', roman: 'Bus thamba', englishMeaning: 'Bus Stop' },
        { phrase: 'How much is this?', native: 'हे कितीला आहे?', roman: 'He kitila aahe?', englishMeaning: 'How much?' },
        { phrase: 'Need help.', native: 'मदत हवी आहे.', roman: 'Madat havi aahe.', englishMeaning: 'I need help.' },
        { phrase: 'Hotel / Restaurant', native: 'हॉटेल / उपहारगृह', roman: 'Hotel / Upahargruha', englishMeaning: 'Hotel / Eatery' },
        { phrase: 'Emergency', native: 'आणीबाणी', roman: 'Aanibaani', englishMeaning: 'Emergency situation' }
      ];
    } else if (lang === 'ja') {
      return [
        { phrase: 'Hello', native: 'こんにちは', roman: 'Konnichiwa', englishMeaning: 'Hello' },
        { phrase: 'Thank You', native: 'ありがとう', roman: 'Arigatou', englishMeaning: 'Thank you' },
        { phrase: 'Where is the station?', native: '駅はどこですか？', roman: 'Eki wa doko desu ka?', englishMeaning: 'Where is the station?' },
        { phrase: 'How much is this?', native: 'これはいくらですか？', roman: 'Kore wa ikura desu ka?', englishMeaning: 'How much is this?' },
        { phrase: 'Need help.', native: '助けてください。', roman: 'Tasukete kudasai.', englishMeaning: 'Please help me.' },
        { phrase: 'English Menu?', native: '英語のメニューはありますか？', roman: 'Eigo no menyu wa arimasu ka?', englishMeaning: 'Do you have an English menu?' }
      ];
    } else if (lang === 'bn') {
      return [
        { phrase: 'Hello', native: 'নমস্কার', roman: 'Nomoshkar', englishMeaning: 'Hello' },
        { phrase: 'Thank You', native: 'ধন্যবাদ', roman: 'Dhonnobaad', englishMeaning: 'Thank you' },
        { phrase: 'Where is the station?', native: 'স্টেশনটি কোথায়?', roman: 'Station ti kothay?', englishMeaning: 'Where is the station?' },
        { phrase: 'How much?', native: 'এটার দাম কত?', roman: 'Etar daam koto?', englishMeaning: 'How much is this?' },
        { phrase: 'Help me.', native: 'আমাকে সাহায্য করুন।', roman: 'Amake sahajjo korun.', englishMeaning: 'Please help me.' }
      ];
    } else if (lang === 'ta') {
      return [
        { phrase: 'Hello', native: 'வணக்கம்', roman: 'Vanakkam', englishMeaning: 'Hello' },
        { phrase: 'Thank You', native: 'நன்றி', roman: 'Nandri', englishMeaning: 'Thank you' },
        { phrase: 'Where is the station?', native: 'ஸ்டேஷன் எங்கே இருக்கிறது?', roman: 'Station engay irukkirathu?', englishMeaning: 'Where is the station?' },
        { phrase: 'How much?', native: 'இது என்ன விலை?', roman: 'Ithu enna vilai?', englishMeaning: 'How much does this cost?' },
        { phrase: 'Help.', native: 'உதவி செய்யுங்கள்.', roman: 'Uthavi seiyungal.', englishMeaning: 'Help me.' }
      ];
    }
    // Default Hindi
    return [
      { phrase: 'Hello', native: 'नमस्ते', roman: 'Namaste', englishMeaning: 'Hello / Welcome' },
      { phrase: 'Thank You', native: 'धन्यवाद / शुक्रिया', roman: 'Dhanyavaad / Shukriya', englishMeaning: 'Thank you' },
      { phrase: 'Where is the station?', native: 'स्टेशन कहाँ है?', roman: 'Station kahaan hai?', englishMeaning: 'Where is the station?' },
      { phrase: 'How much?', native: 'यह कितने का है?', roman: 'Yeh kitne ka hai?', englishMeaning: 'How much is this?' },
      { phrase: 'Need help.', native: 'मुझे मदद चाहिए।', roman: 'Mujhe madad chahiye.', englishMeaning: 'I need assistance.' }
    ];
  }, [localLangInfo]);

  // Quick emergency phrases
  const emergencyList = useMemo(() => {
    const lang = localLangInfo.code;
    const list = {
      mr: [
        { label: 'Call Police', native: 'पोलिसांना बोलवा!', roman: 'Polisanna bolva!' },
        { label: 'Need a Doctor', native: 'मला डॉक्टरांची गरज आहे.', roman: 'Mala doctoranchi garaj aahe.' },
        { label: 'I am lost', native: 'मी हरवलो आहे.', roman: 'Mi haravlo aahe.' },
        { label: 'Lost Passport', native: 'माझा पासपोर्ट हरवला आहे.', roman: 'Mazha passport haravla aahe.' }
      ],
      ja: [
        { label: 'Call Police', native: '警察を呼んでください！', roman: 'Keisatsu wo yonde kudasai!' },
        { label: 'Need a Doctor', native: '医者が必要です。', roman: 'Isha ga hitsuyou desu.' },
        { label: 'I am lost', native: '道に迷いました。', roman: 'Michi ni mayoimashita.' },
        { label: 'Lost Passport', native: 'パスポートを紛失しました。', roman: 'Pasupoto wo funshitsu shimashita.' }
      ],
      bn: [
        { label: 'Call Police', native: 'পুলিশ ডাকুন!', roman: 'Police daakun!' },
        { label: 'Need a Doctor', native: 'আমার ডাক্তার দরকার।', roman: 'Amar doctor dorkar.' },
        { label: 'I am lost', native: 'আমি হারিয়ে গেছি।', roman: 'Ami hariye gechi.' }
      ],
      ta: [
        { label: 'Call Police', native: 'போலீஸை கூப்பிடுங்கள்!', roman: 'Polisai kooppidungal!' },
        { label: 'Need a Doctor', native: 'எனக்கு மருத்துவர் தேவை.', roman: 'Enaku maruthuvar thevai.' },
        { label: 'I am lost', native: 'நான் வழிதவறிவிட்டேன்.', roman: 'Naan vazhi thavari vittaen.' }
      ]
    };
    return list[lang] || [
      { label: 'Call Police', native: 'पुलिस को बुलाओ!', roman: 'Police ko bulao!' },
      { label: 'Need a Doctor', native: 'मुझे डॉक्टर की आवश्यकता है।', roman: 'Mujhe doctor ki aavashyakta hai.' },
      { label: 'I am lost', native: 'मैं खो गया हूँ।', roman: 'Main kho gaya hoon.' }
    ];
  }, [localLangInfo]);

  // Copy phrase helper
  const handleCopyPhrase = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Voice Translation Speak simulation
  const handleVoiceTranslate = () => {
    if (!inputText.trim()) return;
    setIsListening(true);
    
    setTimeout(() => {
      let translation = '';
      if (voiceMode === 'userToLocal') {
        const lang = localLangInfo.code;
        if (lang === 'mr') {
          if (inputText.toLowerCase().includes('taxi')) translation = 'भाडे किती आहे? (How much is the fare?)';
          else translation = 'कृपया मला मदत करा. (Please help me.)';
        } else if (lang === 'ja') {
          translation = '助けてください (Tasukete kudasai)';
        } else {
          translation = 'कृपया मेरी मदद करें।';
        }
      } else {
        translation = `[English translation of local speech]: Hello, how can I help you today?`;
      }
      setTranslatedResult(translation);
      setIsListening(false);
      speakText(translation.split(' (')[0], localLangInfo.code);
    }, 1200);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">translate</span>
            Local Language Companion
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Traveling in <span className="font-bold text-primary">{destination}</span>. Local language: <span className="font-extrabold text-primary">{localLangInfo.name} ({localLangInfo.native})</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-container p-1 rounded-lg">
          {[
            { id: 'phrases', label: 'Phrases', icon: 'chat' },
            { id: 'emergency', label: 'Emergency', icon: 'emergency_home' },
            { id: 'voice', label: 'Voice Help', icon: 'mic' },
            { id: 'ocr', label: 'OCR Scan', icon: 'photo_camera' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB CONTENT 1: PHRASES HELPER --- */}
      {activeTab === 'phrases' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phrasesList.map((phrase, idx) => (
              <div
                key={idx}
                className="bg-surface-container p-4 rounded-xl border border-surface-variant/20 flex flex-col justify-between group hover:border-primary/20 transition-all"
              >
                <div>
                  <div className="text-[11px] font-extrabold text-primary uppercase tracking-widest">
                    {phrase.phrase}
                  </div>
                  <div className="text-[20px] font-black text-on-surface mt-2.5 font-heading">
                    {phrase.native}
                  </div>
                  <div className="text-[12px] text-on-surface-variant italic mt-1">
                    Pronunciation: <span className="font-bold text-on-surface">{phrase.roman}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-surface-variant/10">
                  <span className="text-[12px] font-bold text-on-surface-variant">
                    Meaning: {phrase.englishMeaning}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakText(phrase.native, localLangInfo.code)}
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all cursor-pointer"
                      title="Play Pronunciation"
                    >
                      <span className="material-symbols-outlined text-[18px]">volume_up</span>
                    </button>
                    <button
                      onClick={() => handleCopyPhrase(phrase.native, idx)}
                      className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-variant/40 flex items-center justify-center transition-all cursor-pointer text-on-surface-variant"
                      title="Copy Phrase"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copiedIndex === idx ? 'done' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: EMERGENCY TRANSLATOR --- */}
      {activeTab === 'emergency' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-[12px] text-red-800 font-medium leading-relaxed">
            <strong>⚠️ One-Tap Emergency Support:</strong> Click any button below to instantly broadcast and play aloud the phrase in the local language ({localLangInfo.name}) at maximum volume to grab attention or seek medical/police assistance.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => speakText(item.native, localLangInfo.code)}
                className="w-full bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer text-left border-none"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-100 block">
                    {item.label}
                  </span>
                  <span className="text-[20px] font-black block font-heading">{item.native}</span>
                  <span className="text-[12px] font-medium text-red-100/80 block italic">{item.roman}</span>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-[24px]">
                  <span className="material-symbols-outlined text-white text-[28px] animate-pulse">volume_up</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 3: VOICE TRANSLATOR --- */}
      {activeTab === 'voice' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex gap-2 bg-surface-container p-1 rounded-lg max-w-[280px]">
            <button
              onClick={() => {
                setVoiceMode('userToLocal');
                setTranslatedResult('');
              }}
              className={`flex-1 py-1 text-[11px] font-bold rounded cursor-pointer ${
                voiceMode === 'userToLocal' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
              }`}
            >
              Translate My Speech
            </button>
            <button
              onClick={() => {
                setVoiceMode('localToUser');
                setTranslatedResult('');
              }}
              className={`flex-1 py-1 text-[11px] font-bold rounded cursor-pointer ${
                voiceMode === 'localToUser' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
              }`}
            >
              Translate Local Speech
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                voiceMode === 'userToLocal'
                  ? 'Type or speak in your language (e.g., How much for a taxi ride to the station?)...'
                  : `Type or speak in ${localLangInfo.name}...`
              }
              className="w-full p-4 rounded-xl bg-surface-container border border-surface-variant/30 text-[13px] outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={handleVoiceTranslate}
                disabled={isListening}
                className="bg-primary text-on-primary font-bold text-[13px] px-6 py-2.5 rounded-xl hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isListening ? 'hourglass_empty' : 'translate'}
                </span>
                {isListening ? 'Translating...' : 'Translate & Speak'}
              </button>

              <button
                onClick={() => {
                  setInputText(voiceMode === 'userToLocal' ? 'Where is the nearest hospital?' : 'कृपया जवळचे रेल्वे स्टेशन सांगा.');
                }}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                Try Sample Speech
              </button>
            </div>

            {translatedResult && (
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2 animate-fade-in">
                <div className="text-[10px] font-extrabold uppercase text-primary tracking-widest">
                  Translation Output
                </div>
                <p className="text-[15px] font-black text-on-surface font-heading">{translatedResult}</p>
                <button
                  onClick={() => speakText(translatedResult.split(' (')[0], localLangInfo.code)}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer mt-2"
                >
                  <span className="material-symbols-outlined text-[16px]">volume_up</span> Play translation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 4: OCR OVERLAY TRANSLATOR --- */}
      {activeTab === 'ocr' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-2">
              {[
                { id: 'menu', label: 'Restaurant Menu' },
                { id: 'sign', label: 'Street Sign' },
                { id: 'board', label: 'Temple Warning' }
              ].map(img => (
                <button
                  key={img.id}
                  onClick={() => setOcrImage(img.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    ocrImage === img.id
                      ? 'bg-surface border-2 border-primary text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 bg-surface-container p-1 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setOcrMode('original')}
                className={`px-2.5 py-1 rounded cursor-pointer ${ocrMode === 'original' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
              >
                Original
              </button>
              <button
                onClick={() => setOcrMode('translated')}
                className={`px-2.5 py-1 rounded cursor-pointer ${ocrMode === 'translated' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
              >
                Translated Overlay
              </button>
              <button
                onClick={() => setOcrMode('sideBySide')}
                className={`px-2.5 py-1 rounded cursor-pointer ${ocrMode === 'sideBySide' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
              >
                Side-by-Side
              </button>
            </div>
          </div>

          {/* OCR Image Simulator Frame */}
          <div className="bg-surface border border-surface-variant/40 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 min-h-[220px] items-stretch justify-center">
            
            {/* Original Panel */}
            {(ocrMode === 'original' || ocrMode === 'sideBySide') && (
              <div className="flex-1 bg-surface-container p-5 rounded-xl border border-surface-variant/20 flex flex-col justify-between text-left">
                <span className="text-[10px] font-extrabold uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full self-start">
                  Local Script ({localLangInfo.name})
                </span>
                
                <div className="my-6">
                  {ocrImage === 'menu' && (
                    <div className="space-y-3 font-heading text-[18px] font-extrabold text-on-surface">
                      <div>१. पुरणपोळी - ₹१२०</div>
                      <div>२. थालीपीठ - ₹९०</div>
                      <div>३. वडापाव - ₹२०</div>
                    </div>
                  )}
                  {ocrImage === 'sign' && (
                    <div className="font-heading text-[24px] font-black text-on-surface tracking-wider text-center">
                      कृपया डाव्या बाजूने चाला
                    </div>
                  )}
                  {ocrImage === 'board' && (
                    <div className="font-heading text-[18px] font-bold text-error text-center space-y-2">
                      <div>⚠️ धोकादायक क्षेत्र</div>
                      <div className="text-[14px]">पुढे जाण्यास मनाई आहे</div>
                    </div>
                  )}
                </div>
                
                <div className="text-[10px] text-on-surface-variant italic">OCR camera simulated view.</div>
              </div>
            )}

            {/* Translated Panel */}
            {(ocrMode === 'translated' || ocrMode === 'sideBySide') && (
              <div className="flex-1 bg-primary/5 p-5 rounded-xl border border-primary/20 flex flex-col justify-between text-left relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                <span className="text-[10px] font-extrabold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full self-start z-10">
                  OCR Translated Overlay
                </span>
                
                <div className="my-6 z-10">
                  {ocrImage === 'menu' && (
                    <div className="space-y-3 text-[16px] font-extrabold text-on-surface">
                      <div className="text-emerald-700 dark:text-emerald-400">1. Puranpoli (Sweet Flatbread) - ₹120</div>
                      <div className="text-emerald-700 dark:text-emerald-400">2. Thalipeeth (Spiced Flatbread) - ₹90</div>
                      <div className="text-emerald-700 dark:text-emerald-400">3. Vada Pav (Spiced Potato Slider) - ₹20</div>
                    </div>
                  )}
                  {ocrImage === 'sign' && (
                    <div className="text-[20px] font-extrabold text-emerald-700 dark:text-emerald-400 text-center">
                      Please walk on the left side
                    </div>
                  )}
                  {ocrImage === 'board' && (
                    <div className="text-center space-y-2 z-10">
                      <div className="text-[18px] font-black text-error">⚠️ DANGER ZONE</div>
                      <div className="text-[13px] font-bold text-on-surface-variant">Further entry is strictly prohibited</div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-primary font-bold z-10 flex justify-between items-center">
                  <span>Translation complete (Accuracy: 99%).</span>
                  <button 
                    onClick={() => speakText(ocrImage === 'menu' ? 'Puranpoli Sweet Flatbread, Thalipeeth Spiced Flatbread' : ocrImage === 'sign' ? 'Please walk on the left side' : 'Danger Zone, Further entry is prohibited', 'en')}
                    className="text-[11px] hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">volume_up</span> Play
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
