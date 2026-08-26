/**
 * RAKSHA-AI Web Audio & Web Speech Synthesis IVR Service
 * Client-side audio alerts and multi-lingual voice dispatch simulator.
 */

// Synthesize emergency audio beep using Web Audio API
export function playEmergencyAudioBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz emergency tone
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    console.warn('Web Audio API unavailable:', err);
  }
}

// Native script IVR texts for clear multi-lingual announcements
export const IVR_ANNOUNCEMENTS = {
  hi: "चेतावनी: मंगन क्षेत्र में भूस्खलन का खतरा 80 प्रतिशत से अधिक है। कृपया सुरक्षित स्थान पर जाएं और निकासी आदेश का पालन करें।",
  ne: "चेतावनी: मङ्गन क्षेत्रमा पहिरोको जोखिम ८० प्रतिशतभन्दा बढी छ। कृपया सुरक्षित स्थानमा जानुहोस् र स्थानान्तरण आदेशको पालना गर्नुहोस्।",
  bn: "সতর্কবার্তা: মঙ্গন এলাকায় পাহাড় ধ্বসের ঝুঁকি ৮০ শতাংশের বেশি। অনুগ্রহ করে নিরাপদ স্থানে চলে যান এবং জরুরি নির্দেশ মেনে চলুন।",
  en: "Attention Emergency Responders: Landslide hazard risk in Mangan sector exceeds 80 percent. Execute immediate evacuation SOP."
};

// Speak emergency IVR notice using browser Web Speech Synthesis API
export function speakEmergencyIvrNotice(customText, lang = 'en') {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech Synthesis API not supported in this browser.');
    alert('Voice IVR Notice: ' + (customText || IVR_ANNOUNCEMENTS[lang] || IVR_ANNOUNCEMENTS.en));
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const textToSpeak = customText || IVR_ANNOUNCEMENTS[lang] || IVR_ANNOUNCEMENTS.en;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  let targetLangCode = 'en-US';
  switch (lang) {
    case 'hi': targetLangCode = 'hi-IN'; break;
    case 'ne': targetLangCode = 'ne-NP'; break;
    case 'bn': targetLangCode = 'bn-IN'; break;
    default: targetLangCode = 'en-US'; break;
  }
  utterance.lang = targetLangCode;

  // Search available browser voices for natural Indian/local voice engine
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => {
    if (lang === 'hi') return v.lang.includes('hi') || (v.lang.includes('IN') && v.name.toLowerCase().includes('hindi'));
    if (lang === 'ne') return v.lang.includes('ne');
    if (lang === 'bn') return v.lang.includes('bn');
    return v.lang.includes('en-IN') || v.lang.includes('en-US');
  }) || voices.find(v => v.lang.includes('IN'));

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.pitch = 1.0;
  utterance.rate = 0.9; // Slightly slower for clear emergency announcements
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}
