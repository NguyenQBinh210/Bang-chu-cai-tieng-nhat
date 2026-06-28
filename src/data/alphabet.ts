export interface AlphabetCharacter {
  japanese: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category: 'basic' | 'dakuon' | 'yoon';
  row: 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'special';
}

export const hiraganaAlphabet: AlphabetCharacter[] = [
  // Basic Gojūon (46)
  { japanese: "あ", romaji: "a", type: "hiragana", category: "basic", row: "a" },
  { japanese: "い", romaji: "i", type: "hiragana", category: "basic", row: "a" },
  { japanese: "う", romaji: "u", type: "hiragana", category: "basic", row: "a" },
  { japanese: "え", romaji: "e", type: "hiragana", category: "basic", row: "a" },
  { japanese: "お", romaji: "o", type: "hiragana", category: "basic", row: "a" },
  
  { japanese: "か", romaji: "ka", type: "hiragana", category: "basic", row: "ka" },
  { japanese: "き", romaji: "ki", type: "hiragana", category: "basic", row: "ka" },
  { japanese: "く", romaji: "ku", type: "hiragana", category: "basic", row: "ka" },
  { japanese: "け", romaji: "ke", type: "hiragana", category: "basic", row: "ka" },
  { japanese: "こ", romaji: "ko", type: "hiragana", category: "basic", row: "ka" },
  
  { japanese: "さ", romaji: "sa", type: "hiragana", category: "basic", row: "sa" },
  { japanese: "し", romaji: "shi", type: "hiragana", category: "basic", row: "sa" },
  { japanese: "す", romaji: "su", type: "hiragana", category: "basic", row: "sa" },
  { japanese: "せ", romaji: "se", type: "hiragana", category: "basic", row: "sa" },
  { japanese: "そ", romaji: "so", type: "hiragana", category: "basic", row: "sa" },
  
  { japanese: "た", romaji: "ta", type: "hiragana", category: "basic", row: "ta" },
  { japanese: "ち", romaji: "chi", type: "hiragana", category: "basic", row: "ta" },
  { japanese: "つ", romaji: "tsu", type: "hiragana", category: "basic", row: "ta" },
  { japanese: "て", romaji: "te", type: "hiragana", category: "basic", row: "ta" },
  { japanese: "と", romaji: "to", type: "hiragana", category: "basic", row: "ta" },
  
  { japanese: "な", romaji: "na", type: "hiragana", category: "basic", row: "na" },
  { japanese: "に", romaji: "ni", type: "hiragana", category: "basic", row: "na" },
  { japanese: "ぬ", romaji: "nu", type: "hiragana", category: "basic", row: "na" },
  { japanese: "ね", romaji: "ne", type: "hiragana", category: "basic", row: "na" },
  { japanese: "の", romaji: "no", type: "hiragana", category: "basic", row: "na" },
  
  { japanese: "は", romaji: "ha", type: "hiragana", category: "basic", row: "ha" },
  { japanese: "ひ", romaji: "hi", type: "hiragana", category: "basic", row: "ha" },
  { japanese: "ふ", romaji: "fu", type: "hiragana", category: "basic", row: "ha" },
  { japanese: "へ", romaji: "he", type: "hiragana", category: "basic", row: "ha" },
  { japanese: "ほ", romaji: "ho", type: "hiragana", category: "basic", row: "ha" },
  
  { japanese: "ま", romaji: "ma", type: "hiragana", category: "basic", row: "ma" },
  { japanese: "み", romaji: "mi", type: "hiragana", category: "basic", row: "ma" },
  { japanese: "む", romaji: "mu", type: "hiragana", category: "basic", row: "ma" },
  { japanese: "め", romaji: "me", type: "hiragana", category: "basic", row: "ma" },
  { japanese: "も", romaji: "mo", type: "hiragana", category: "basic", row: "ma" },
  
  { japanese: "や", romaji: "ya", type: "hiragana", category: "basic", row: "ya" },
  { japanese: "ゆ", romaji: "yu", type: "hiragana", category: "basic", row: "ya" },
  { japanese: "よ", romaji: "yo", type: "hiragana", category: "basic", row: "ya" },
  
  { japanese: "ら", romaji: "ra", type: "hiragana", category: "basic", row: "ra" },
  { japanese: "り", romaji: "ri", type: "hiragana", category: "basic", row: "ra" },
  { japanese: "る", romaji: "ru", type: "hiragana", category: "basic", row: "ra" },
  { japanese: "れ", romaji: "re", type: "hiragana", category: "basic", row: "ra" },
  { japanese: "ろ", romaji: "ro", type: "hiragana", category: "basic", row: "ra" },
  
  { japanese: "わ", romaji: "wa", type: "hiragana", category: "basic", row: "wa" },
  { japanese: "を", romaji: "wo", type: "hiragana", category: "basic", row: "wa" },
  { japanese: "ん", romaji: "n", type: "hiragana", category: "basic", row: "wa" },

  // Dakuon & Han-dakuon (25)
  { japanese: "が", romaji: "ga", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぎ", romaji: "gi", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぐ", romaji: "gu", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "げ", romaji: "ge", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ご", romaji: "go", type: "hiragana", category: "dakuon", row: "special" },
  
  { japanese: "ざ", romaji: "za", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "じ", romaji: "ji", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ず", romaji: "zu", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぜ", romaji: "ze", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぞ", romaji: "zo", type: "hiragana", category: "dakuon", row: "special" },
  
  { japanese: "だ", romaji: "da", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぢ", romaji: "ji", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "づ", romaji: "zu", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "で", romaji: "de", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ど", romaji: "do", type: "hiragana", category: "dakuon", row: "special" },
  
  { japanese: "ば", romaji: "ba", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "び", romaji: "bi", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぶ", romaji: "bu", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "べ", romaji: "be", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぼ", romaji: "bo", type: "hiragana", category: "dakuon", row: "special" },
  
  { japanese: "ぱ", romaji: "pa", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぴ", romaji: "pi", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぷ", romaji: "pu", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぺ", romaji: "pe", type: "hiragana", category: "dakuon", row: "special" },
  { japanese: "ぽ", romaji: "po", type: "hiragana", category: "dakuon", row: "special" },

  // Yōon (36)
  { japanese: "きゃ", romaji: "kya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "きゅ", romaji: "kyu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "きょ", romaji: "kyo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "しゃ", romaji: "sha", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "しゅ", romaji: "shu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "しょ", romaji: "sho", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "ちゃ", romaji: "cha", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ちゅ", romaji: "chu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ちょ", romaji: "cho", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "にゃ", romaji: "nya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "にゅ", romaji: "nyu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "にょ", romaji: "nyo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "ひゃ", romaji: "hya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ひゅ", romaji: "hyu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ひょ", romaji: "hyo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "みゃ", romaji: "mya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "みゅ", romaji: "myu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "みょ", romaji: "myo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "りゃ", romaji: "rya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "りゅ", romaji: "ryu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "りょ", romaji: "ryo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "ぎゃ", romaji: "gya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ぎゅ", romaji: "gyu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ぎょ", romaji: "gyo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "じゃ", romaji: "ja", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "じゅ", romaji: "ju", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "じょ", romaji: "jo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "びゃ", romaji: "bya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "びゅ", romaji: "byu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "びょ", romaji: "byo", type: "hiragana", category: "yoon", row: "special" },
  
  { japanese: "ぴゃ", romaji: "pya", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ぴゅ", romaji: "pyu", type: "hiragana", category: "yoon", row: "special" },
  { japanese: "ぴょ", romaji: "pyo", type: "hiragana", category: "yoon", row: "special" }
];

export const katakanaAlphabet: AlphabetCharacter[] = [
  // Basic Gojūon (46)
  { japanese: "ア", romaji: "a", type: "katakana", category: "basic", row: "a" },
  { japanese: "イ", romaji: "i", type: "katakana", category: "basic", row: "a" },
  { japanese: "ウ", romaji: "u", type: "katakana", category: "basic", row: "a" },
  { japanese: "エ", romaji: "e", type: "katakana", category: "basic", row: "a" },
  { japanese: "オ", romaji: "o", type: "katakana", category: "basic", row: "a" },
  
  { japanese: "カ", romaji: "ka", type: "katakana", category: "basic", row: "ka" },
  { japanese: "キ", romaji: "ki", type: "katakana", category: "basic", row: "ka" },
  { japanese: "ク", romaji: "ku", type: "katakana", category: "basic", row: "ka" },
  { japanese: "ケ", romaji: "ke", type: "katakana", category: "basic", row: "ka" },
  { japanese: "コ", romaji: "ko", type: "katakana", category: "basic", row: "ka" },
  
  { japanese: "サ", romaji: "sa", type: "katakana", category: "basic", row: "sa" },
  { japanese: "シ", romaji: "shi", type: "katakana", category: "basic", row: "sa" },
  { japanese: "ス", romaji: "su", type: "katakana", category: "basic", row: "sa" },
  { japanese: "セ", romaji: "se", type: "katakana", category: "basic", row: "sa" },
  { japanese: "ソ", romaji: "so", type: "katakana", category: "basic", row: "sa" },
  
  { japanese: "タ", romaji: "ta", type: "katakana", category: "basic", row: "ta" },
  { japanese: "チ", romaji: "chi", type: "katakana", category: "basic", row: "ta" },
  { japanese: "ツ", romaji: "tsu", type: "katakana", category: "basic", row: "ta" },
  { japanese: "テ", romaji: "te", type: "katakana", category: "basic", row: "ta" },
  { japanese: "ト", romaji: "to", type: "katakana", category: "basic", row: "ta" },
  
  { japanese: "ナ", romaji: "na", type: "katakana", category: "basic", row: "na" },
  { japanese: "ニ", romaji: "ni", type: "katakana", category: "basic", row: "na" },
  { japanese: "ヌ", romaji: "nu", type: "katakana", category: "basic", row: "na" },
  { japanese: "ネ", romaji: "ne", type: "katakana", category: "basic", row: "na" },
  { japanese: "ノ", romaji: "no", type: "katakana", category: "basic", row: "na" },
  
  { japanese: "ハ", romaji: "ha", type: "katakana", category: "basic", row: "ha" },
  { japanese: "ヒ", romaji: "hi", type: "katakana", category: "basic", row: "ha" },
  { japanese: "フ", romaji: "fu", type: "katakana", category: "basic", row: "ha" },
  { japanese: "ヘ", romaji: "he", type: "katakana", category: "basic", row: "ha" },
  { japanese: "ホ", romaji: "ho", type: "katakana", category: "basic", row: "ha" },
  
  { japanese: "マ", romaji: "ma", type: "katakana", category: "basic", row: "ma" },
  { japanese: "ミ", romaji: "mi", type: "katakana", category: "basic", row: "ma" },
  { japanese: "ム", romaji: "mu", type: "katakana", category: "basic", row: "ma" },
  { japanese: "メ", romaji: "me", type: "katakana", category: "basic", row: "ma" },
  { japanese: "モ", romaji: "mo", type: "katakana", category: "basic", row: "ma" },
  
  { japanese: "ヤ", romaji: "ya", type: "katakana", category: "basic", row: "ya" },
  { japanese: "ユ", romaji: "yu", type: "katakana", category: "basic", row: "ya" },
  { japanese: "ヨ", romaji: "yo", type: "katakana", category: "basic", row: "ya" },
  
  { japanese: "ラ", romaji: "ra", type: "katakana", category: "basic", row: "ra" },
  { japanese: "リ", romaji: "ri", type: "katakana", category: "basic", row: "ra" },
  { japanese: "ル", romaji: "ru", type: "katakana", category: "basic", row: "ra" },
  { japanese: "レ", romaji: "re", type: "katakana", category: "basic", row: "ra" },
  { japanese: "ロ", romaji: "ro", type: "katakana", category: "basic", row: "ra" },
  
  { japanese: "ワ", romaji: "wa", type: "katakana", category: "basic", row: "wa" },
  { japanese: "ヲ", romaji: "wo", type: "katakana", category: "basic", row: "wa" },
  { japanese: "ン", romaji: "n", type: "katakana", category: "basic", row: "wa" },

  // Dakuon & Han-dakuon (25)
  { japanese: "ガ", romaji: "ga", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ギ", romaji: "gi", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "グ", romaji: "gu", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ゲ", romaji: "ge", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ゴ", romaji: "go", type: "katakana", category: "dakuon", row: "special" },
  
  { japanese: "ザ", romaji: "za", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ジ", romaji: "ji", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ズ", romaji: "zu", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ゼ", romaji: "ze", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ゾ", romaji: "zo", type: "katakana", category: "dakuon", row: "special" },
  
  { japanese: "ダ", romaji: "da", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ヂ", romaji: "ji", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ヅ", romaji: "zu", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "デ", romaji: "de", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ド", romaji: "do", type: "katakana", category: "dakuon", row: "special" },
  
  { japanese: "バ", romaji: "ba", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ビ", romaji: "bi", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ブ", romaji: "bu", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ベ", romaji: "be", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ボ", romaji: "bo", type: "katakana", category: "dakuon", row: "special" },
  
  { japanese: "パ", romaji: "pa", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ピ", romaji: "pi", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "プ", romaji: "pu", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ペ", romaji: "pe", type: "katakana", category: "dakuon", row: "special" },
  { japanese: "ポ", romaji: "po", type: "katakana", category: "dakuon", row: "special" },

  // Yōon (36)
  { japanese: "キャ", romaji: "kya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "キュ", romaji: "kyu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "キョ", romaji: "kyo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "シャ", romaji: "sha", type: "katakana", category: "yoon", row: "special" },
  { japanese: "シュ", romaji: "shu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ショ", romaji: "sho", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "チャ", romaji: "cha", type: "katakana", category: "yoon", row: "special" },
  { japanese: "チュ", romaji: "chu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "チョ", romaji: "cho", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ニャ", romaji: "nya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ニュ", romaji: "nyu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ニョ", romaji: "nyo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ヒャ", romaji: "hya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ヒュ", romaji: "hyu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ヒョ", romaji: "hyo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ミャ", romaji: "mya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ミュ", romaji: "myu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ミョ", romaji: "myo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "リャ", romaji: "rya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "リュ", romaji: "ryu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "リョ", romaji: "ryo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ギャ", romaji: "gya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ギュ", romaji: "gyu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ギョ", romaji: "gyo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ジャ", romaji: "ja", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ジュ", romaji: "ju", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ジョ", romaji: "jo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ビャ", romaji: "bya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ビュ", romaji: "byu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ビョ", romaji: "byo", type: "katakana", category: "yoon", row: "special" },
  
  { japanese: "ピャ", romaji: "pya", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ピュ", romaji: "pyu", type: "katakana", category: "yoon", row: "special" },
  { japanese: "ピョ", romaji: "pyo", type: "katakana", category: "yoon", row: "special" }
];

export const fullAlphabetList = [...hiraganaAlphabet, ...katakanaAlphabet];
