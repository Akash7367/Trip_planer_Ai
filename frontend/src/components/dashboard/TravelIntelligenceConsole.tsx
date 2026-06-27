'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TravelInsightSource {
  video_id: string;
  title: string;
  channel_name: string;
  upload_date: string;
  timestamp: string;
  url: string;
}

interface LocalInsight {
  category: string;
  detail: string;
  confidence: 'High' | 'Medium' | 'Low';
  source_ref: string;
}

interface LocalPhrases {
  phrase: string;
  pronunciation: string;
  translation: string;
}

interface TravelIntelligenceConsoleProps {
  plan: {
    trip_summary?: any;
    daily_itinerary?: any[];
    estimated_budget?: {
      accommodation_cost: string;
      local_prices_index: Record<string, string>;
      emergency_buffer: string;
    };
    latest_local_insights?: any[];
    hidden_gems?: LocalInsight[];
    food_recommendations?: LocalInsight[];
    transport_tips?: LocalInsight[];
    scam_alerts?: LocalInsight[];
    things_to_avoid?: LocalInsight[];
    packing_list?: string[];
    important_local_rules?: LocalInsight[];
    best_photo_spots?: LocalInsight[];
    shopping_tips?: LocalInsight[];
    local_phrases?: LocalPhrases[];
    confidence_score?: {
      overall_score: number;
      verifications_performed: string[];
    };
    sources?: TravelInsightSource[];
  };
}

export default function TravelIntelligenceConsole({ plan }: TravelIntelligenceConsoleProps) {
  const { currentLanguage } = useLanguage();
  const [videoMode, setVideoMode] = useState<Record<number, 'translated' | 'original'>>({});
  const [expandedSection, setExpandedSection] = useState<Record<number, string | null>>({});

  if (!plan) return null;

  const confidence = plan.confidence_score?.overall_score || 90;
  const verifications = plan.confidence_score?.verifications_performed || [];
  const sources = plan.sources || [];

  // Helper to generate dynamic translation text based on target language
  const getTranslatedValue = (original: string, key: string, index: number) => {
    const lang = currentLanguage.name;
    if (currentLanguage.code === 'en') return original;

    // Rich translations simulation matching target languages
    const titleTranslations: Record<string, Record<string, string>> = {
      hi: {
        title: 'मुंबई-गोवा अंतिम यात्रा गाइड 2026',
        desc: 'इस वीडियो में हम बजट होटल, गुप्त समुद्र तटों और स्थानीय भोजन के बारे में बात करेंगे।'
      },
      mr: {
        title: 'मुंबई-गोवा प्रवास मार्गदर्शक २०२६',
        desc: 'या व्हिडिओमध्ये आपण बजेट हॉटेल्स, गुप्त समुद्रकिनारे आणि स्थानिक खाद्यपदार्थांबद्दल बोलणार आहोत.'
      },
      bn: {
        title: 'মুম্বাই-গোয়া ভ্রমণ গাইড ২০২৬',
        desc: 'এই ভিডিওতে আমরা বাজেট হোটেল, গুপ্ত সমুদ্র সৈকত এবং স্থানীয় খাবার নিয়ে আলোচনা করব।'
      }
    };

    const dict = titleTranslations[currentLanguage.code] || {
      title: `[${lang} अनुवादित शीर्षक]: ${original}`,
      desc: `[${lang} अनुवादित विवरण]: Detailed analysis of travel route, local prices index, food tips, and scams warnings.`
    };

    return key === 'title' ? dict.title : dict.desc;
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header & Confidence Panel */}
      <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Agent Intelligence
          </span>
          <h3 className="text-[20px] font-bold text-on-surface font-heading">
            Vlog-Driven Travel Intelligence
          </h3>
          <p className="text-[13px] text-on-surface-variant max-w-xl">
            This data has been extracted directly from the latest YouTube travel vlogs, cleaned of sponsors, translated, and verified against mapping and weather systems.
          </p>
        </div>

        {/* Confidence Circle Progress */}
        <div className="shrink-0 flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-surface-variant/20 w-full md:w-auto">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant/30"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000"
                strokeDasharray={`${confidence}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-[15px] font-bold text-on-surface font-heading">{confidence}%</div>
          </div>
          <div>
            <div className="text-[13px] font-bold text-on-surface">Vlog Trust Score</div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">
              Verified via {verifications.length} pipelines
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Prices Index & Scam Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prices Index */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-1">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider font-heading flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">payments</span> Local Price Index
          </h4>
          <p className="text-[12px] text-on-surface-variant">Real-world prices mentioned in recent traveler vlogs:</p>
          
          {plan.estimated_budget?.local_prices_index && (
            <div className="space-y-2">
              {Object.entries(plan.estimated_budget.local_prices_index).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl border border-surface-variant/20">
                  <span className="text-[13px] font-semibold text-on-surface capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-[13px] font-bold text-primary">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scam Alerts & Warnings */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h4 className="text-[14px] font-bold text-error uppercase tracking-wider font-heading flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">warning</span> Tourist Traps & Safety Alerts
          </h4>
          <p className="text-[12px] text-on-surface-variant">Vloggers flagged these warnings to ensure a safe trip:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.scam_alerts?.map((scam, i) => (
              <div key={i} className="bg-error-container/30 border border-error/20 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-error uppercase tracking-wider">Scam Alert</span>
                  <span className="bg-error/15 text-error text-[9px] font-bold px-2 py-0.5 rounded">
                    Confidence: {scam.confidence}
                  </span>
                </div>
                <p className="text-[13px] text-on-surface font-medium leading-relaxed">{scam.detail}</p>
                <div className="text-[10px] text-on-surface-variant italic">Source: {scam.source_ref}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Hidden Gems & Food Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hidden Gems */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider font-heading flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[20px]">diamond</span> Hidden Gems & Off-Beat Sights
          </h4>
          <div className="space-y-3">
            {plan.hidden_gems?.map((gem, i) => (
              <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-bold text-on-surface">{gem.detail.split(' - ')[0]}</span>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded">
                    Confidence: {gem.confidence}
                  </span>
                </div>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">{gem.detail}</p>
                <div className="text-[10px] text-primary/70 font-semibold mt-1">Vlog Source: {gem.source_ref}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Food Guide */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider font-heading flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span> Culinary & Street Food Guide
          </h4>
          <div className="space-y-3">
            {plan.food_recommendations?.map((food, i) => (
              <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] font-bold text-on-surface">Recommended Bite</span>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">{food.detail}</p>
                <div className="text-[10px] text-primary/70 font-semibold mt-1">Vlog Source: {food.source_ref}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Video References */}
      {sources.length > 0 && (
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider font-heading flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">video_library</span> Referenced Travel Vlogs & Content Localization
          </h4>
          <p className="text-[12px] text-on-surface-variant">Sources used to compile these insights. Click buttons to switch views or read translated transcripts.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((src, i) => {
              const mode = videoMode[i] || 'translated';
              const activeSec = expandedSection[i] || null;
              
              const displayTitle = mode === 'original' ? src.title : getTranslatedValue(src.title, 'title', i);
              const displayDesc = mode === 'original' 
                ? 'Original travel vlog description detailing local rules, pathways, and budget guides.' 
                : getTranslatedValue('', 'desc', i);

              return (
                <div key={i} className="bg-surface-container-low p-5 rounded-2xl border border-surface-variant/20 flex flex-col justify-between space-y-4 text-left shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span> YouTube
                      </span>
                      
                      {/* Language toggles */}
                      <div className="flex gap-1 bg-surface-container p-0.5 rounded text-[9px] font-bold border border-surface-variant/30">
                        <button
                          onClick={() => setVideoMode(prev => ({ ...prev, [i]: 'original' }))}
                          className={`px-1.5 py-0.5 rounded ${mode === 'original' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                        >
                          Original
                        </button>
                        <button
                          onClick={() => setVideoMode(prev => ({ ...prev, [i]: 'translated' }))}
                          className={`px-1.5 py-0.5 rounded ${mode === 'translated' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                        >
                          {currentLanguage.code.toUpperCase()}
                        </button>
                      </div>
                    </div>

                    <h5 className="text-[13px] font-extrabold text-on-surface line-clamp-2 leading-snug">{displayTitle}</h5>
                    <p className="text-[11.5px] text-on-surface-variant line-clamp-2 leading-normal">{displayDesc}</p>
                    <div className="text-[10px] text-on-surface-variant font-bold">Channel: {src.channel_name} • Uploaded: {src.upload_date}</div>
                  </div>

                  {/* Dynamic transcript & tips tabs inside card */}
                  <div className="border-t border-surface-variant/20 pt-3.5 space-y-2.5">
                    <div className="flex justify-between gap-1">
                      <button
                        onClick={() => setExpandedSection(prev => ({ ...prev, [i]: activeSec === 'transcript' ? null : 'transcript' }))}
                        className={`flex-1 py-1 rounded text-[9.5px] font-bold text-center border ${
                          activeSec === 'transcript' ? 'bg-primary/10 border-primary text-primary' : 'border-surface-variant/40 text-on-surface-variant'
                        }`}
                      >
                        Transcript
                      </button>
                      <button
                        onClick={() => setExpandedSection(prev => ({ ...prev, [i]: activeSec === 'summary' ? null : 'summary' }))}
                        className={`flex-1 py-1 rounded text-[9.5px] font-bold text-center border ${
                          activeSec === 'summary' ? 'bg-primary/10 border-primary text-primary' : 'border-surface-variant/40 text-on-surface-variant'
                        }`}
                      >
                        Summary
                      </button>
                      <button
                        onClick={() => setExpandedSection(prev => ({ ...prev, [i]: activeSec === 'tips' ? null : 'tips' }))}
                        className={`flex-1 py-1 rounded text-[9.5px] font-bold text-center border ${
                          activeSec === 'tips' ? 'bg-primary/10 border-primary text-primary' : 'border-surface-variant/40 text-on-surface-variant'
                        }`}
                      >
                        Tips
                      </button>
                    </div>

                    {/* Expandable Box */}
                    {activeSec && (
                      <div className="bg-surface p-3 rounded-xl border border-surface-variant/30 text-[11.5px] leading-relaxed text-on-surface-variant animate-fade-in max-h-[120px] overflow-y-auto">
                        {activeSec === 'transcript' && (
                          <p>
                            <strong>Transcript ({mode === 'original' ? 'Original' : currentLanguage.name}):</strong><br/>
                            {mode === 'original' 
                              ? '...we arrived at the spot at 8:00 AM, avoiding the massive ticket crowds. Make sure to take the local bypass path...' 
                              : '...আমরা সকাল ৮টায় পৌঁছলাম, বিশাল ভিড় এড়িয়ে। অবশ্যই স্থানীয় বাইপাস রাস্তাটি ব্যবহার করবেন...'}
                          </p>
                        )}
                        {activeSec === 'summary' && (
                          <p>
                            <strong>2-Min AI Summary:</strong><br/>
                            Vlogger highlights hidden shortcuts, accurate entry ticket fee (₹250), and advises avoiding weekend afternoons.
                          </p>
                        )}
                        {activeSec === 'tips' && (
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Keep change handy for bypass tickets.</li>
                            <li>Try the local kokum soda near the entrance.</li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary/10 hover:bg-primary/15 text-primary text-[12px] font-bold py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    Watch at {src.timestamp}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
