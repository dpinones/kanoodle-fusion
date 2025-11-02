/**
 * UI Text Configuration for Kanoodle Fusion
 *
 * This file contains all user-facing text strings used throughout the application.
 * Edit this file to update copy without searching through multiple components.
 */

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export type Language = 'en' | 'es' | 'ja';

// Get current language from localStorage or default to 'en'
export function getCurrentLanguage(): Language {
  const saved = localStorage.getItem('language') as Language;
  return saved || 'en';
}

// ============================================================================
// KANOODLE FUSION TEXT
// ============================================================================

export const KANOODLE_TEXT = {
  en: {
    // Login screen
    login: {
      loginButton: "LOGIN",
      disconnectButton: "DISCONNECT",
      settingsButton: "SETTINGS",
    },
    // Home screen
    home: {
      title: "KANOODLE FUSION",
      subtitle: "PUZZLE YOUR WAY THROUGH",
      playButton: "PLAY",
      tutorialButton: "TUTORIAL",
      shareButton: "SHARE ON X",
    },
    // Game screen
    game: {
      level: "LEVEL",
      moves: "MOVES",
      rotateButton: "ROTATE",
      flipButton: "FLIP",
      resetButton: "RESET",
      backButton: "BACK",
      instructions: "Drag pieces to the board",
      success: "LEVEL COMPLETE!",
      nextLevel: "NEXT LEVEL",
      allComplete: "ALL LEVELS COMPLETE!",
    },
    // Tutorial
    tutorial: {
      title: "HOW TO PLAY",
      step1: "1. Select a piece from the spawn area",
      step2: "2. Rotate and flip the piece",
      step3: "3. Drag to the board",
      step4: "4. Match all colors to win!",
      startButton: "GOT IT!",
    },
    // Settings
    settings: {
      title: "SETTINGS",
      music: "MUSIC",
      soundEffects: "SOUND EFFECTS",
      language: "LANGUAGE",
      colorblind: "COLORBLIND MODE",
      on: "ON",
      off: "OFF",
    },
  },
  es: {
    // Login screen
    login: {
      loginButton: "INICIAR SESIÓN",
      disconnectButton: "DESCONECTAR",
      settingsButton: "CONFIGURACIÓN",
    },
    // Home screen
    home: {
      title: "KANOODLE FUSION",
      subtitle: "RESUELVE LOS PUZZLES",
      playButton: "JUGAR",
      tutorialButton: "TUTORIAL",
      shareButton: "COMPARTIR EN X",
    },
    // Game screen
    game: {
      level: "NIVEL",
      moves: "MOVIMIENTOS",
      rotateButton: "ROTAR",
      flipButton: "VOLTEAR",
      resetButton: "REINICIAR",
      backButton: "VOLVER",
      instructions: "Arrastra las piezas al tablero",
      success: "¡NIVEL COMPLETADO!",
      nextLevel: "SIGUIENTE NIVEL",
      allComplete: "¡TODOS LOS NIVELES COMPLETADOS!",
    },
    // Tutorial
    tutorial: {
      title: "CÓMO JUGAR",
      step1: "1. Selecciona una pieza del área de spawn",
      step2: "2. Rota y voltea la pieza",
      step3: "3. Arrástrala al tablero",
      step4: "4. ¡Coincide todos los colores para ganar!",
      startButton: "¡ENTENDIDO!",
    },
    // Settings
    settings: {
      title: "CONFIGURACIÓN",
      music: "MÚSICA",
      soundEffects: "EFECTOS DE SONIDO",
      language: "IDIOMA",
      colorblind: "MODO DALTÓNICO",
      on: "SÍ",
      off: "NO",
    },
  },
  ja: {
    // Login screen
    login: {
      loginButton: "ログイン",
      disconnectButton: "切断",
      settingsButton: "設定",
    },
    // Home screen
    home: {
      title: "KANOODLE FUSION",
      subtitle: "パズルをクリアしよう",
      playButton: "プレイ",
      tutorialButton: "チュートリアル",
      shareButton: "Xでシェア",
    },
    // Game screen
    game: {
      level: "レベル",
      moves: "手数",
      rotateButton: "回転",
      flipButton: "反転",
      resetButton: "リセット",
      backButton: "戻る",
      instructions: "ピースをボードにドラッグ",
      success: "レベルクリア！",
      nextLevel: "次のレベル",
      allComplete: "全レベルクリア！",
    },
    // Tutorial
    tutorial: {
      title: "遊び方",
      step1: "1. スポーンエリアからピースを選択",
      step2: "2. ピースを回転・反転",
      step3: "3. ボードにドラッグ",
      step4: "4. 全ての色を揃えて勝利！",
      startButton: "わかった！",
    },
    // Settings
    settings: {
      title: "設定",
      music: "音楽",
      soundEffects: "効果音",
      language: "言語",
      colorblind: "色覚補正モード",
      on: "オン",
      off: "オフ",
    },
  },
} as const;

// Helper to get current language text
export function getKanoodleText() {
  const lang = getCurrentLanguage();
  return KANOODLE_TEXT[lang];
}
