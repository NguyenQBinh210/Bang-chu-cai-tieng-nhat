export interface Example {
  word: string;
  romaji: string;
  meaning: string;
}

export interface Character {
  japanese: string;
  romaji: string;
  mnemonic: string;
  strokeCount: number;
  examples: Example[];
}

export interface QuizQuestion {
  id: string;
  type: 'select-romaji' | 'select-character' | 'listen-select' | 'match-pairs';
  question: string;
  audioText?: string;
  options?: string[];
  correctAnswer?: string;
  pairs?: { left: string; right: string }[];
}

export interface WorksheetItem {
  romaji: string;
  kana: string;
}

export interface Lesson {
  id: number;
  title: string;
  type: 'hiragana' | 'katakana' | 'special';
  description: string;
  characters: Character[];
  quizzes: QuizQuestion[];
  worksheet?: WorksheetItem[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Bài 1: Hiragana - Hàng nguyên âm (あ, い, う, え, お)",
    type: "hiragana",
    description: "Năm nguyên âm cơ bản trong tiếng Nhật. Đây là nền tảng quan trọng nhất để học tất cả các âm tiếp theo.",
    characters: [
      {
        japanese: "あ",
        romaji: "a",
        mnemonic: "Trông giống như một chữ thập đứng cạnh một vòng tròn an toàn.",
        strokeCount: 3,
        examples: [
          { word: "あめ", romaji: "ame", meaning: "Cơn mưa" },
          { word: "あおい", romaji: "aoi", meaning: "Màu xanh da trời" }
        ]
      },
      {
        japanese: "い",
        romaji: "i",
        mnemonic: "Giống như hai miếng khoai tây chiên (french fries) đứng song song.",
        strokeCount: 2,
        examples: [
          { word: "いぬ", romaji: "inu", meaning: "Con chó" },
          { word: "いち", romaji: "ichi", meaning: "Số một" }
        ]
      },
      {
        japanese: "う",
        romaji: "u",
        mnemonic: "Hình dáng giống như một người đang còng lưng mang vật nặng.",
        strokeCount: 2,
        examples: [
          { word: "うmi", romaji: "umi", meaning: "Biển cả" },
          { word: "うた", romaji: "uta", meaning: "Bài hát" }
        ]
      },
      {
        japanese: "え",
        romaji: "e",
        mnemonic: "Trông giống như một người đàn ông kỳ lạ đang chạy trốn.",
        strokeCount: 2,
        examples: [
          { word: "えき", romaji: "eki", meaning: "Nhà ga" },
          { word: "えんぴつ", romaji: "enpitsu", meaning: "Bút chì" }
        ]
      },
      {
        japanese: "お",
        romaji: "o",
        mnemonic: "Giống như chữ 'a' nhưng có thêm dấu chấm như quả bóng golf rơi vào lỗ.",
        strokeCount: 3,
        examples: [
          { word: "おにぎり", romaji: "onigiri", meaning: "Cơm nắm" },
          { word: "おおきい", romaji: "ookii", meaning: "To lớn" }
        ]
      }
    ],
    quizzes: [
      {
        id: "q1_1",
        type: "select-romaji",
        question: "Chữ cái 'あ' được phát âm là gì?",
        options: ["a", "i", "u", "e"],
        correctAnswer: "a"
      },
      {
        id: "q1_2",
        type: "select-character",
        question: "Tìm chữ cái có phát âm là 'i'?",
        options: ["あ", "い", "う", "え"],
        correctAnswer: "い"
      },
      {
        id: "q1_3",
        type: "listen-select",
        question: "Nghe âm thanh và chọn chữ cái tương ứng:",
        audioText: "お",
        options: ["あ", "い", "う", "お"],
        correctAnswer: "お"
      },
      {
        id: "q1_4",
        type: "match-pairs",
        question: "Ghép cặp chữ cái với cách đọc đúng:",
        pairs: [
          { left: "あ", right: "a" },
          { left: "い", right: "i" },
          { left: "う", right: "u" },
          { left: "え", right: "e" },
          { left: "お", right: "o" }
        ]
      }
    ],
    worksheet: [
      { romaji: "iie", kana: "いいえ" },
      { romaji: "ai", kana: "あい" },
      { romaji: "ii", kana: "いい" },
      { romaji: "iu", kana: "いう" },
      { romaji: "ao", kana: "あお" },
      { romaji: "aoi", kana: "あおい" },
      { romaji: "ue", kana: "うえ" },
      { romaji: "ooi", kana: "おおい" },
      { romaji: "i", kana: "い" },
      { romaji: "iou", kana: "いおう" },
      { romaji: "ie", kana: "いえ" },
      { romaji: "oi", kana: "おい" },
      { romaji: "au", kana: "あう" }
    ]
  },
  {
    id: 2,
    title: "Bài 2: Hiragana - Hàng か (ka, ki, ku, ke, ko)",
    type: "hiragana",
    description: "Học các phụ âm K kết hợp với các nguyên âm.",
    characters: [
      { japanese: "か", romaji: "ka", mnemonic: "Nhìn giống như máy cắt cỏ.", strokeCount: 3, examples: [{ word: "かさ", romaji: "kasa", meaning: "Cái ô" }] },
      { japanese: "き", romaji: "ki", mnemonic: "Trông giống như chiếc chìa khóa (key).", strokeCount: 4, examples: [{ word: "き", romaji: "ki", meaning: "Cái cây" }] },
      { japanese: "く", romaji: "ku", mnemonic: "Mỏ chim cuckoo kêu 'ku-ku'.", strokeCount: 1, examples: [{ word: "くま", romaji: "kuma", meaning: "Con gấu" }] },
      { japanese: "け", romaji: "ke", mnemonic: "Trông giống như một thùng bia (keg).", strokeCount: 3, examples: [{ word: "けむり", romaji: "kemuri", meaning: "Khói" }] },
      { japanese: "こ", romaji: "ko", mnemonic: "Hai đồng tiền xu nhỏ xếp song song.", strokeCount: 2, examples: [{ word: "こえ", romaji: "koe", meaning: "Giọng nói" }] }
    ],
    quizzes: [
      { id: "q2_1", type: "select-romaji", question: "Chữ cái 'き' đọc là gì?", options: ["ka", "ki", "ku", "ko"], correctAnswer: "ki" }
    ],
    worksheet: [
      { romaji: "ikou", kana: "いこう" },
      { romaji: "kai", kana: "かい" },
      { romaji: "iku", kana: "いく" },
      { romaji: "kike", kana: "きけ" },
      { romaji: "kao", kana: "かお" },
      { romaji: "iki", kana: "いき" },
      { romaji: "kiku", kana: "きく" },
      { romaji: "kikai", kana: "きかい" },
      { romaji: "oke", kana: "おけ" },
      { romaji: "koko", kana: "ここ" },
      { romaji: "kakou", kana: "かこう" },
      { romaji: "kikou", kana: "きこう" },
      { romaji: "aka", kana: "あか" }
    ]
  },
  {
    id: 3,
    title: "Bài 3: Hiragana - Hàng さ (sa, shi, su, se, so)",
    type: "hiragana",
    description: "Nhóm phụ âm S đi với 5 nguyên âm chính.",
    characters: [
      { japanese: "さ", romaji: "sa", mnemonic: "Giống như chữ 'ki' nhưng chỉ có một nét gạch ngang.", strokeCount: 3, examples: [{ word: "さくら", romaji: "sakura", meaning: "Hoa anh đào" }] },
      { japanese: "し", romaji: "shi", mnemonic: "Giống cái móc câu cá.", strokeCount: 1, examples: [{ word: "しお", romaji: "shio", meaning: "Muối" }] },
      { japanese: "す", romaji: "su", mnemonic: "Có chiếc đuôi xoắn như xích đu.", strokeCount: 2, examples: [{ word: "すし", romaji: "sushi", meaning: "Món sushi" }] },
      { japanese: "せ", romaji: "se", mnemonic: "Hai người đang ngồi tựa lưng nhau.", strokeCount: 3, examples: [{ word: "せかい", romaji: "sekai", meaning: "Thế giới" }] },
      { japanese: "そ", romaji: "so", mnemonic: "Đường zig-zag uốn lượn.", strokeCount: 1, examples: [{ word: "そら", romaji: "sora", meaning: "Bầu trời" }] }
    ],
    quizzes: [
      { id: "q3_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'shi'?", options: ["さ", "し", "す", "せ"], correctAnswer: "し" }
    ],
    worksheet: [
      { romaji: "asa", kana: "あさ" },
      { romaji: "kasa", kana: "かさ" },
      { romaji: "sushi", kana: "すし" },
      { romaji: "ishi", kana: "いし" },
      { romaji: "isu", kana: "いす" },
      { romaji: "asu", kana: "あす" },
      { romaji: "ase", kana: "あせ" },
      { romaji: "sekai", kana: "せかい" },
      { romaji: "soko", kana: "そこ" },
      { romaji: "asoko", kana: "あそこ" },
      { romaji: "sai", kana: "さい" },
      { romaji: "saku", kana: "さく" },
      { romaji: "usui", kana: "うすい" },
      { romaji: "osoi", kana: "おそい" },
      { romaji: "suki", kana: "すき" }
    ]
  },
  {
    id: 4,
    title: "Bài 4: Hiragana - Hàng た (ta, chi, tsu, te, to)",
    type: "hiragana",
    description: "Nhóm phụ âm T đi với 5 nguyên âm. Chú ý cách phát âm đặc biệt 'chi' và 'tsu'.",
    characters: [
      { japanese: "た", romaji: "ta", mnemonic: "Trông giống chữ 'ta' viết cách điệu.", strokeCount: 4, examples: [{ word: "たまご", romaji: "tamago", meaning: "Trứng" }] },
      { japanese: "ち", romaji: "chi", mnemonic: "Giống số 5 viết ngược.", strokeCount: 2, examples: [{ word: "ちず", romaji: "chizu", meaning: "Bản đồ" }] },
      { japanese: "つ", romaji: "tsu", mnemonic: "Cơn sóng thần tsunami khổng lồ.", strokeCount: 1, examples: [{ word: "つくえ", romaji: "tsukue", meaning: "Cái bàn" }] },
      { japanese: "て", romaji: "te", mnemonic: "Giống như cái tai hoặc bàn tay te.", strokeCount: 1, examples: [{ word: "てがみ", romaji: "tegami", meaning: "Thư" }] },
      { japanese: "と", romaji: "to", mnemonic: "Giống như chiếc đinh đâm vào ngón chân toe.", strokeCount: 2, examples: [{ word: "ともだち", romaji: "tomodachi", meaning: "Bạn bè" }] }
    ],
    quizzes: [
      { id: "q4_1", type: "select-romaji", question: "Chữ cái 'ち' phát âm là gì?", options: ["ta", "chi", "tsu", "te"], correctAnswer: "chi" }
    ],
    worksheet: [
      { romaji: "uketsuke", kana: "うけつけ" },
      { romaji: "tokei", kana: "とけい" },
      { romaji: "uchi", kana: "うち" },
      { romaji: "ototoi", kana: "おととい" },
      { romaji: "atsui", kana: "あつい" },
      { romaji: "chikatetsu", kana: "ちかてつ" },
      { romaji: "suteki", kana: "すてき" },
      { romaji: "chichi", kana: "ちち" },
      { romaji: "otouto", kana: "おとうと" },
      { romaji: "shikata", kana: "しかた" },
      { romaji: "takai", kana: "たかい" },
      { romaji: "tatsu", kana: "たつ" },
      { romaji: "chikai", kana: "ちかい" },
      { romaji: "chiisai", kana: "ちいさい" },
      { romaji: "tsukue", kana: "つくえ" }
    ]
  },
  {
    id: 5,
    title: "Bài 5: Hiragana - Hàng な (na, ni, nu, ne, no)",
    type: "hiragana",
    description: "Nhóm phụ âm N đi với 5 nguyên âm chính.",
    characters: [
      { japanese: "な", romaji: "na", mnemonic: "Nữ tu nun cầu nguyện trước thánh giá.", strokeCount: 4, examples: [{ word: "なつ", romaji: "natsu", meaning: "Mùa hè" }] },
      { japanese: "に", romaji: "ni", mnemonic: "Giống kim và chỉ để khâu needle.", strokeCount: 3, examples: [{ word: "にく", romaji: "niku", meaning: "Thịt" }] },
      { japanese: "ぬ", romaji: "nu", mnemonic: "Đống mì sợi noodles rối.", strokeCount: 2, examples: [{ word: "ぬま", romaji: "numa", meaning: "Đầm lầy" }] },
      { japanese: "ね", romaji: "ne", mnemonic: "Chú mèo neko đang ngủ xoắn đuôi.", strokeCount: 2, examples: [{ word: "ねこ", romaji: "neko", meaning: "Con mèo" }] },
      { japanese: "の", romaji: "no", mnemonic: "Biển cấm đi vào No entry.", strokeCount: 1, examples: [{ word: "のり", romaji: "nori", meaning: "Rong biển" }] }
    ],
    quizzes: [
      { id: "q5_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'ne'?", options: ["ぬ", "ね", "の", "な"], correctAnswer: "ね" }
    ],
    worksheet: [
      { romaji: "nani", kana: "なに" },
      { romaji: "anata", kana: "あなた" },
      { romaji: "anoko", kana: "あのこ" },
      { romaji: "kinou", kana: "きのう" },
      { romaji: "inu", kana: "いぬ" },
      { romaji: "neko", kana: "ねこ" },
      { romaji: "sakana", kana: "さकाना" },
      { romaji: "ani", kana: "あに" },
      { romaji: "ane", kana: "あね" },
      { romaji: "sono", kana: "その" },
      { romaji: "okane", kana: "おかね" },
      { romaji: "kanai", kana: "かない" },
      { romaji: "niku", kana: "にく" },
      { romaji: "okuni", kana: "おくに" },
      { romaji: "naka", kana: "なか" }
    ]
  },
  {
    id: 6,
    title: "Bài 6: Hiragana - Hàng は (ha, hi, fu, he, ho)",
    type: "hiragana",
    description: "Nhóm phụ âm H đi với nguyên âm. Chú ý chữ fu đọc gần giống âm f.",
    characters: [
      { japanese: "は", romaji: "ha", mnemonic: "Chữ H đứng cạnh ly nước có ống hút.", strokeCount: 3, examples: [{ word: "はな", romaji: "hana", meaning: "Hoa" }] },
      { japanese: "ひ", romaji: "hi", mnemonic: "Một gương mặt đang cười híp mắt hehe.", strokeCount: 1, examples: [{ word: "ひかり", romaji: "hikari", meaning: "Ánh sáng" }] },
      { japanese: "ふ", romaji: "fu", mnemonic: "Hình ảnh núi Phú Sĩ Fuji.", strokeCount: 4, examples: [{ word: "ふね", romaji: "fune", meaning: "Con thuyền" }] },
      { japanese: "へ", romaji: "he", mnemonic: "Đường lên ngọn đồi hill dốc.", strokeCount: 1, examples: [{ word: "へya", romaji: "heya", meaning: "Căn phòng" }] },
      { japanese: "ほ", romaji: "ho", mnemonic: "Chữ ha đội mũ bảo hiểm.", strokeCount: 4, examples: [{ word: "ほし", romaji: "hoshi", meaning: "Ngôi sao" }] }
    ],
    quizzes: [
      { id: "q6_1", type: "select-romaji", question: "Chữ 'ふ' phát âm là gì?", options: ["ha", "hi", "fu", "ho"], correctAnswer: "fu" }
    ],
    worksheet: [
      { romaji: "anohito", kana: "あのひと" },
      { romaji: "hana", kana: "はな" },
      { romaji: "hachi", kana: "はち" },
      { romaji: "hitotsu", kana: "ひとつ" },
      { romaji: "futsuka", kana: "ふつか" },
      { romaji: "futsuu", kana: "ふつう" },
      { romaji: "hoshi", kana: "ほし" },
      { romaji: "hokanohito", kana: "ほかのひと" },
      { romaji: "hakase", kana: "はかせ" },
      { romaji: "fuku", kana: "ふく" },
      { romaji: "hako", kana: "はこ" },
      { romaji: "hai", kana: "はい" },
      { romaji: "hito", kana: "ひと" },
      { romaji: "hikui", kana: "ひくい" },
      { romaji: "fune", kana: "ふね" }
    ]
  },
  {
    id: 7,
    title: "Bài 7: Hiragana - Hàng ま (ma, mi, mu, me, mo)",
    type: "hiragana",
    description: "Nhóm phụ âm M đi với nguyên âm chính.",
    characters: [
      { japanese: "ま", romaji: "ma", mnemonic: "Chiếc mặt nạ mask ma quái.", strokeCount: 3, examples: [{ word: "まくら", romaji: "makura", meaning: "Cái gối" }] },
      { japanese: "み", romaji: "mi", mnemonic: "Giống số 21 cách điệu.", strokeCount: 2, examples: [{ word: "みみ", romaji: "mimi", meaning: "Cái tai" }] },
      { japanese: "む", romaji: "mu", mnemonic: "Chú bò sữa kêu moo moo.", strokeCount: 3, examples: [{ word: "むし", romaji: "mushi", meaning: "Côn trùng" }] },
      { japanese: "me", romaji: "me", mnemonic: "Giống con mắt me đang chớp.", strokeCount: 2, examples: [{ word: "めがね", romaji: "megane", meaning: "Kính mắt" }] },
      { japanese: "も", romaji: "mo", mnemonic: "Chiếc móc câu được nhiều cá more.", strokeCount: 3, examples: [{ word: "もり", romaji: "mori", meaning: "Khu rừng" }] }
    ],
    quizzes: [
      { id: "q7_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'me'?", options: ["ぬ", "ね", "め", "む"], correctAnswer: "め" }
    ],
    worksheet: [
      { romaji: "ikimasu", kana: "いきます" },
      { romaji: "ima", kana: "いま" },
      { romaji: "mimasu", kana: "みます" },
      { romaji: "mitai", kana: "みたい" },
      { romaji: "musuko", kana: "むすこ" },
      { romaji: "musume", kana: "むすめ" },
      { romaji: "momo", kana: "もも" },
      { romaji: "nomimono", kana: "のみもの" },
      { romaji: "ame", kana: "あめ" },
      { romaji: "homemasu", kana: "ほめます" },
      { romaji: "kakimasu", kana: "かきます" },
      { romaji: "komarimasu", kana: "こまります" },
      { romaji: "mimi", kana: "みみ" },
      { romaji: "kanashimi", kana: "かなしみ" },
      { romaji: "muika", kana: "むいか" }
    ]
  },
  {
    id: 8,
    title: "Bài 8: Hiragana - Hàng や (ya, yu, yo)",
    type: "hiragana",
    description: "Hàng Y khuyết âm, chỉ có 3 chữ cái chính.",
    characters: [
      { japanese: "や", romaji: "ya", mnemonic: "Chú bò Tây Tạng yak có hai sừng dài.", strokeCount: 3, examples: [{ word: "やま", romaji: "yama", meaning: "Núi" }] },
      { japanese: "ゆ", romaji: "yu", mnemonic: "Chú cá nhỏ đang bơi uốn lượn.", strokeCount: 2, examples: [{ word: "ゆき", romaji: "yuki", meaning: "Tuyết" }] },
      { japanese: "よ", romaji: "yo", mnemonic: "Người đang chơi nhảy yo-yo.", strokeCount: 2, examples: [{ word: "よる", romaji: "yoru", meaning: "Đêm" }] }
    ],
    quizzes: [
      { id: "q8_1", type: "select-romaji", question: "Chữ 'よ' phát âm là gì?", options: ["ya", "yu", "yo", "o"], correctAnswer: "yo" }
    ],
    worksheet: [
      { romaji: "yasemasu", kana: "やせます" },
      { romaji: "yasui", kana: "やすい" },
      { romaji: "yasai", kana: "やさい" },
      { romaji: "nayami", kana: "なやみ" },
      { romaji: "oyu", kana: "おゆ" },
      { romaji: "yome", kana: "よめ" },
      { romaji: "yomou", kana: "よもう" },
      { romaji: "yosakoi", kana: "よさこい" },
      { romaji: "yuki", kana: "ゆき" },
      { romaji: "mayu", kana: "まゆ" },
      { romaji: "yume", kana: "ゆめ" },
      { romaji: "yasumi", kana: "やすみ" },
      { romaji: "yuumei", kana: "ゆうめい" },
      { romaji: "yomu", kana: "よむ" },
      { romaji: "yomimasu", kana: "よみます" }
    ]
  },
  {
    id: 9,
    title: "Bài 9: Hiragana - Hàng ら (ra, ri, ru, re, ro)",
    type: "hiragana",
    description: "Nhóm phụ âm R kết hợp với 5 nguyên âm.",
    characters: [
      { japanese: "ら", romaji: "ra", mnemonic: "Mũ phi hành gia bay lơ lửng.", strokeCount: 2, examples: [{ word: "らいおん", romaji: "raion", meaning: "Sư tử" }] },
      { japanese: "り", romaji: "ri", mnemonic: "Hai dải lụa mỏng bay trong gió.", strokeCount: 2, examples: [{ word: "りんご", romaji: "ringo", meaning: "Táo" }] },
      { japanese: "る", romaji: "ru", mnemonic: "Số 3 có thêm xoắn nhỏ ở cuối.", strokeCount: 1, examples: [{ word: "るす", romaji: "rusu", meaning: "Vắng nhà" }] },
      { japanese: "れ", romaji: "re", mnemonic: "Người chạy vượt rào relay race.", strokeCount: 2, examples: [{ word: "れいぞうこ", romaji: "reizouko", meaning: "Tủ lạnh" }] },
      { japanese: "ろ", romaji: "ro", mnemonic: "Giống chữ ru nhưng không có xoắn cuối.", strokeCount: 1, examples: [{ word: "ろうそく", romaji: "rousoku", meaning: "Nến" }] }
    ],
    quizzes: [
      { id: "q9_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'ri'?", options: ["い", "り", "る", "れ"], correctAnswer: "り" }
    ],
    worksheet: [
      { romaji: "ikura", kana: "いくら" },
      { romaji: "shirase", kana: "しらせ" },
      { romaji: "kirimasu", kana: "きります" },
      { romaji: "irimasu", kana: "いります" },
      { romaji: "kaeru", kana: "かえる" },
      { romaji: "okuru", kana: "おくる" },
      { romaji: "rekishi", kana: "れきし" },
      { romaji: "shirenai", kana: "しれない" },
      { romaji: "tsukurou", kana: "つくろう" },
      { romaji: "zero", kana: "ぜろ" },
      { romaji: "erai", kana: "えらい" },
      { romaji: "shiranai", kana: "しらない" },
      { romaji: "kaerimasu", kana: "かえります" },
      { romaji: "tsukurimasu", kana: "つくります" },
      { romaji: "kakeru", kana: "かける" }
    ]
  },
  {
    id: 10,
    title: "Bài 10: Hiragana - Hàng わ (wa, wo, n)",
    type: "hiragana",
    description: "Nhóm phụ âm cuối cùng trong bảng chữ cái Hiragana.",
    characters: [
      { japanese: "わ", romaji: "wa", mnemonic: "Chú chim đang vỗ cánh bay lên.", strokeCount: 2, examples: [{ word: "わた", romaji: "wata", meaning: "Bông" }] },
      { japanese: "を", romaji: "wo", mnemonic: "Người chơi trượt tuyết bằng ván bay.", strokeCount: 3, examples: [{ word: "を", romaji: "wo", meaning: "Trợ từ" }] },
      { japanese: "ん", romaji: "n", mnemonic: "Trông giống chữ n viết nghiêng.", strokeCount: 1, examples: [{ word: "ほん", romaji: "hon", meaning: "Sách" }] }
    ],
    quizzes: [
      { id: "q10_1", type: "select-romaji", question: "Chữ cái 'ん' phát âm là gì?", options: ["wa", "wo", "n", "m"], correctAnswer: "n" }
    ],
    worksheet: [
      { romaji: "watashi", kana: "わたし" },
      { romaji: "wakai", kana: "わかい" },
      { romaji: "hon", kana: "ほん" },
      { romaji: "nihon", kana: "にほん" },
      { romaji: "yowai", kana: "よわい" },
      { romaji: "yakan", kana: "やかん" },
      { romaji: "iken", kana: "いけん" },
      { romaji: "minasan", kana: "みなさん" },
      { romaji: "hon wo yomu", kana: "ほんをよむ" },
      { romaji: "sake wo nomu", kana: "さけをのむ" },
      { romaji: "kaiwa", kana: "かいわ" },
      { romaji: "kankoku", kana: "かんこく" },
      { romaji: "nannen", kana: "なんねん" },
      { romaji: "nansai", kana: "なんさい" },
      { romaji: "wakarimasu", kana: "わかります" }
    ]
  },
  {
    id: 11,
    title: "Bài 11: Katakana - Hàng nguyên âm (ア, イ, ウ, エ, オ)",
    type: "katakana",
    description: "Nhóm 5 nguyên âm đầu tiên của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "ア", romaji: "a", mnemonic: "Góc nhọn kim tự tháp châu Phi Africa.", strokeCount: 2, examples: [{ word: "アメリカ", romaji: "amerika", meaning: "Mỹ" }] },
      { japanese: "イ", romaji: "i", mnemonic: "Giống một người man đang đứng nghiêng.", strokeCount: 2, examples: [{ word: "イギリス", romaji: "igirisu", meaning: "Anh" }] },
      { japanese: "ウ", romaji: "u", mnemonic: "Trông giống chữ u Hiragana nét cứng cáp.", strokeCount: 3, examples: [{ word: "ウール", romaji: "uuru", meaning: "Len" }] },
      { japanese: "エ", romaji: "e", mnemonic: "Giống khung thép thang máy elevator.", strokeCount: 3, examples: [{ word: "エアコン", romaji: "eakon", meaning: "Điều hòa" }] },
      { japanese: "オ", romaji: "o", mnemonic: "Ca sĩ opera dang rộng tay hát.", strokeCount: 3, examples: [{ word: "オレンジ", romaji: "orenji", meaning: "Cam" }] }
    ],
    quizzes: [
      { id: "q11_1", type: "select-romaji", question: "Chữ Katakana 'エ' đọc là gì?", options: ["a", "i", "u", "e"], correctAnswer: "e" }
    ],
    worksheet: [
      { romaji: "iie", kana: "イイエ" },
      { romaji: "ai", kana: "アイ" },
      { romaji: "iu", kana: "イウ" },
      { romaji: "ao", kana: "アオ" },
      { romaji: "aoi", kana: "アオイ" },
      { romaji: "ue", kana: "ウエ" },
      { romaji: "ooi", kana: "オオイ" },
      { romaji: "io", kana: "イオ" },
      { romaji: "i", kana: "イ" }
    ]
  },
  {
    id: 12,
    title: "Bài 12: Katakana - Hàng カ (カ, キ, ク, ケ, コ)",
    type: "katakana",
    description: "Nhóm phụ âm K của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "カ", romaji: "ka", mnemonic: "Rất giống chữ ka Hiragana bỏ phẩy.", strokeCount: 2, examples: [{ word: "カメラ", romaji: "kamera", meaning: "Máy ảnh" }] },
      { japanese: "キ", romaji: "ki", mnemonic: "Giống chữ ki Hiragana bỏ nét cong.", strokeCount: 3, examples: [{ word: "ギター", romaji: "gitaa", meaning: "Ghi ta" }] },
      { japanese: "ク", romaji: "ku", mnemonic: "Hình tam giác góc nghiêng mỏ chim.", strokeCount: 2, examples: [{ word: "クラス", romaji: "kurasu", meaning: "Lớp học" }] },
      { japanese: "ケ", romaji: "ke", mnemonic: "Một chiếc sừng động vật sắc nhọn.", strokeCount: 3, examples: [{ word: "ケーキ", romaji: "keeki", meaning: "Bánh ngọt" }] },
      { japanese: "コ", romaji: "ko", mnemonic: "Hình hộp vuông khuyết cạnh bên trái.", strokeCount: 2, examples: [{ word: "コーヒー", romaji: "koohii", meaning: "Cà phê" }] }
    ],
    quizzes: [
      { id: "q12_1", type: "select-romaji", question: "Chữ Katakana 'カ' đọc là gì?", options: ["ka", "ki", "ku", "ko"], correctAnswer: "ka" }
    ],
    worksheet: [
      { romaji: "kai", kana: "カイ" },
      { romaji: "iku", kana: "イク" },
      { romaji: "kike", kana: "キケ" },
      { romaji: "kao", kana: "カオ" },
      { romaji: "iki", kana: "イキ" },
      { romaji: "kiku", kana: "キク" },
      { romaji: "kikai", kana: "キカイ" },
      { romaji: "oke", kana: "オケ" },
      { romaji: "koko", kana: "ココ" },
      { romaji: "kaku", kana: "カク" },
      { romaji: "oku", kana: "オク" },
      { romaji: "aka", kana: "アカ" },
      { romaji: "ike", kana: "イケ" }
    ]
  },
  {
    id: 13,
    title: "Bài 13: Katakana - Hàng サ (サ, シ, ス, セ, ソ)",
    type: "katakana",
    description: "Nhóm phụ âm S của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "サ", romaji: "sa", mnemonic: "Giống chữ sa Hiragana viết vuông vắn.", strokeCount: 3, examples: [{ word: "サラダ", romaji: "sarada", meaning: "Salad" }] },
      { japanese: "シ", romaji: "shi", mnemonic: "Hai giọt nước bắn lên phía trên.", strokeCount: 3, examples: [{ word: "シャワー", romaji: "shawaa", meaning: "Vòi hoa sen" }] },
      { japanese: "ス", romaji: "su", mnemonic: "Một cái móc treo quần áo gọn nhẹ.", strokeCount: 2, examples: [{ word: "スポーツ", romaji: "supootsu", meaning: "Thể thao" }] },
      { japanese: "セ", romaji: "se", mnemonic: "Giống chữ se Hiragana nét thẳng cứng.", strokeCount: 2, examples: [{ word: "センター", romaji: "sentaa", meaning: "Trung tâm" }] },
      { japanese: "ソ", romaji: "so", mnemonic: "Một giọt nước rơi từ trên xuống.", strokeCount: 2, examples: [{ word: "ソフト", romaji: "sofuto", meaning: "Phần mềm" }] }
    ],
    quizzes: [
      { id: "q13_1", type: "select-character", question: "Chữ nào là 'shi' Katakana?", options: ["ツ", "シ", "ソ", "ン"], correctAnswer: "シ" }
    ],
    worksheet: [
      { romaji: "asa", kana: "アサ" },
      { romaji: "kasa", kana: "カサ" },
      { romaji: "sushi", kana: "スシ" },
      { romaji: "ishi", kana: "イシ" },
      { romaji: "isu", kana: "イス" },
      { romaji: "asu", kana: "アス" },
      { romaji: "ase", kana: "アセ" },
      { romaji: "sekai", kana: "セカイ" },
      { romaji: "soko", kana: "ソコ" },
      { romaji: "asoko", kana: "アソコ" },
      { romaji: "sai", kana: "サイ" },
      { romaji: "saku", kana: "サク" },
      { romaji: "usui", kana: "ウスイ" },
      { romaji: "osoi", kana: "オソイ" },
      { romaji: "suki", kana: "スキ" }
    ]
  },
  {
    id: 14,
    title: "Bài 14: Katakana - Hàng タ (タ, チ, ツ, テ, ト)",
    type: "katakana",
    description: "Nhóm phụ âm T của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "タ", romaji: "ta", mnemonic: "Giống chữ ta Hiragana nét thẳng đứng.", strokeCount: 3, examples: [{ word: "タクシー", romaji: "takushii", meaning: "Taxi" }] },
      { japanese: "チ", romaji: "chi", mnemonic: "Giống chữ chi Hiragana nét vuông vắn.", strokeCount: 3, examples: [{ word: "チケット", romaji: "chiketto", meaning: "Vé" }] },
      { japanese: "ツ", romaji: "tsu", mnemonic: "Ba giọt nước rơi chéo từ trên xuống.", strokeCount: 3, examples: [{ word: "ツアー", romaji: "tsuaa", meaning: "Tua du lịch" }] },
      { japanese: "テ", romaji: "te", mnemonic: "Ăng-ten truyền hình te.", strokeCount: 3, examples: [{ word: "테이블", romaji: "teiburu", meaning: "Bàn" }] },
      { japanese: "ト", romaji: "to", mnemonic: "Trông giống cành cây có nhánh chéo toe.", strokeCount: 2, examples: [{ word: "トイレ", romaji: "toire", meaning: "Nhà vệ sinh" }] }
    ],
    quizzes: [
      { id: "q14_1", type: "select-romaji", question: "Chữ cái Katakana 'チ' đọc là gì?", options: ["ta", "chi", "tsu", "te"], correctAnswer: "chi" }
    ],
    worksheet: [
      { romaji: "uketsuke", kana: "ウケツケ" },
      { romaji: "tokei", kana: "トケイ" },
      { romaji: "uchi", kana: "ウチ" },
      { romaji: "ototoi", kana: "オトトイ" },
      { romaji: "atsui", kana: "アツイ" },
      { romaji: "chikatetsu", kana: "チカテツ" },
      { romaji: "suteki", kana: "ステキ" },
      { romaji: "chichi", kana: "チチ" },
      { romaji: "otouto", kana: "オトウト" },
      { romaji: "shikata", kana: "シカタ" },
      { romaji: "takai", kana: "タカイ" },
      { romaji: "tatsu", kana: "タツ" },
      { romaji: "chikai", kana: "チカイ" },
      { romaji: "tskue", kana: "ツクエ" },
      { romaji: "itsu", kana: "イツ" }
    ]
  },
  {
    id: 15,
    title: "Bài 15: Katakana - Hàng ナ (ナ, ニ, ヌ, ネ, ノ)",
    type: "katakana",
    description: "Nhóm phụ âm N của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "ナ", romaji: "na", mnemonic: "Kiếm sĩ chém một nét ngang chéo.", strokeCount: 2, examples: [{ word: "ナイフ", romaji: "naifu", meaning: "Dao" }] },
      { japanese: "ニ", romaji: "ni", mnemonic: "Hai đường kẻ ngang song song.", strokeCount: 2, examples: [{ word: "ニュース", romaji: "nyuusu", meaning: "Tin tức" }] },
      { japanese: "ヌ", romaji: "nu", mnemonic: "Sợi mì gập chéo đầu chopsticks.", strokeCount: 2, examples: [{ word: "ヌードル", romaji: "nuudoru", meaning: "Mì sợi" }] },
      { japanese: "ネ", romaji: "ne", mnemonic: "Người đi bộ mang theo ô dù.", strokeCount: 4, examples: [{ word: "ネクタイ", romaji: "nekutai", meaning: "Cà vạt" }] },
      { japanese: "ノ", romaji: "no", mnemonic: "Một nét phẩy chéo nghiêng trái.", strokeCount: 1, examples: [{ word: "ノート", romaji: "nooto", meaning: "Vở ghi" }] }
    ],
    quizzes: [
      { id: "q15_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'ne'?", options: ["ヌ", "ネ", "ノ", "ナ"], correctAnswer: "ネ" }
    ],
    worksheet: [
      { romaji: "nani", kana: "ナニ" },
      { romaji: "anata", kana: "アナタ" },
      { romaji: "anoko", kana: "アノコ" },
      { romaji: "kinou", kana: "キノウ" },
      { romaji: "inu", kana: "イヌ" },
      { romaji: "neko", kana: "ネコ" },
      { romaji: "sakana", kana: "サカナ" },
      { romaji: "ani", kana: "アニ" },
      { romaji: "ane", kana: "アネ" },
      { romaji: "sono", kana: "ソノ" },
      { romaji: "okane", kana: "オカネ" },
      { romaji: "kanai", kana: "カナイ" },
      { romaji: "niku", kana: "ニク" },
      { romaji: "okuni", kana: "オクニ" },
      { romaji: "naka", kana: "ナカ" }
    ]
  },
  {
    id: 16,
    title: "Bài 16: Katakana - Hàng ハ (ハ, ヒ, フ, ヘ, ホ)",
    type: "katakana",
    description: "Nhóm phụ âm H của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "ハ", romaji: "ha", mnemonic: "Hai nét hướng xuống như mái nhà.", strokeCount: 2, examples: [{ word: "ハム", romaji: "hamu", meaning: "Thịt dăm bông" }] },
      { japanese: "ヒ", romaji: "hi", mnemonic: "Chiếc muỗng múc súp đặt nghiêng.", strokeCount: 2, examples: [{ word: "ヒーロー", romaji: "hiiroo", meaning: "Anh hùng" }] },
      { japanese: "フ", romaji: "fu", mnemonic: "Nét móc góc giống cờ hiệu lệnh.", strokeCount: 1, examples: [{ word: "フィルム", romaji: "firumu", meaning: "Phim cuộn" }] },
      { japanese: "ヘ", romaji: "he", mnemonic: "Giống chữ he Hiragana nét góc cạnh.", strokeCount: 1, examples: [{ word: "ヘリコプター", romaji: "herikoputaa", meaning: "Trực thăng" }] },
      { japanese: "ホ", romaji: "ho", mnemonic: "Khung thánh giá có hai nhánh hai bên.", strokeCount: 4, examples: [{ word: "ホテル", romaji: "hoteru", meaning: "Khách sạn" }] }
    ],
    quizzes: [
      { id: "q16_1", type: "select-romaji", question: "Chữ cái Katakana 'フ' đọc là gì?", options: ["ha", "hi", "fu", "ho"], correctAnswer: "fu" }
    ],
    worksheet: [
      { romaji: "anohito", kana: "アノヒト" },
      { romaji: "hana", kana: "ハナ" },
      { romaji: "hachi", kana: "ハチ" },
      { romaji: "hitotsu", kana: "ヒトツ" },
      { romaji: "futsuka", kana: "フツカ" },
      { romaji: "futsuu", kana: "フツウ" },
      { romaji: "hoshi", kana: "ホシ" },
      { romaji: "hokanohito", kana: "ホカノヒト" },
      { romaji: "hakase", kana: "ハカセ" },
      { romaji: "fuku", kana: "フク" },
      { romaji: "hako", kana: "ハコ" },
      { romaji: "hai", kana: "ハイ" },
      { romaji: "hito", kana: "ヒト" },
      { romaji: "hikui", kana: "ヒクイ" },
      { romaji: "fune", kana: "フネ" }
    ]
  },
  {
    id: 17,
    title: "Bài 17: Katakana - Hàng マ (マ, ミ, ム, メ, モ)",
    type: "katakana",
    description: "Nhóm phụ âm M của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "マ", romaji: "ma", mnemonic: "Góc nhọn giống đầu của một ly martini.", strokeCount: 2, examples: [{ word: "マフラー", romaji: "mafuraa", meaning: "Khăn quàng" }] },
      { japanese: "ミ", romaji: "mi", mnemonic: "Ba nét gạch chéo song song nhau.", strokeCount: 3, examples: [{ word: "ミルク", romaji: "miruku", meaning: "Sữa" }] },
      { japanese: "ム", romaji: "mu", mnemonic: "Hình tam giác mở có nét gạch ngang.", strokeCount: 2, examples: [{ word: "ムード", romaji: "muudo", meaning: "Tâm trạng" }] },
      { japanese: "メ", romaji: "me", mnemonic: "Giao lộ hai con đường chéo nhau.", strokeCount: 2, examples: [{ word: "メガネ", romaji: "megane", meaning: "Kính mắt" }] },
      { japanese: "モ", romaji: "mo", mnemonic: "Rất giống chữ mo Hiragana nét vuông.", strokeCount: 3, examples: [{ word: "モデル", romaji: "moderaru", meaning: "Người mẫu" }] }
    ],
    quizzes: [
      { id: "q17_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'me'?", options: ["ム", "メ", "モ", "マ"], correctAnswer: "メ" }
    ],
    worksheet: [
      { romaji: "ikimasu", kana: "イキマス" },
      { romaji: "ima", kana: "イマ" },
      { romaji: "mimasu", kana: "ミマス" },
      { romaji: "mitai", kana: "ミタイ" },
      { romaji: "musuko", kana: "ムスコ" },
      { romaji: "musume", kana: "ムスメ" },
      { romaji: "momo", kana: "モモ" },
      { romaji: "nomimono", kana: "ノミモノ" },
      { romaji: "ame", kana: "アメ" },
      { romaji: "homemasu", kana: "ホめます" },
      { romaji: "kakimasu", kana: "カキマス" },
      { romaji: "komarimasu", kana: "コマリマス" },
      { romaji: "mimi", kana: "ミミ" },
      { romaji: "kanashimi", kana: "カナシミ" },
      { romaji: "muika", kana: "ムイカ" }
    ]
  },
  {
    id: 18,
    title: "Bài 18: Katakana - Hàng や (ヤ, ユ, ヨ)",
    type: "katakana",
    description: "Nhóm phụ âm Y khuyết âm của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "ヤ", romaji: "ya", mnemonic: "Giống chữ ya Hiragana nét thẳng góc.", strokeCount: 2, examples: [{ word: "ヤング", romaji: "yangu", meaning: "Trẻ tuổi" }] },
      { japanese: "ユ", romaji: "yu", mnemonic: "Chiếc móc sắt câu cá góc vuông.", strokeCount: 2, examples: [{ word: "ユニフォーム", romaji: "yunifoomu", meaning: "Đồng phục" }] },
      { japanese: "ヨ", romaji: "yo", mnemonic: "Khung chữ E xoay ngược sang trái.", strokeCount: 3, examples: [{ word: "ヨーグルト", romaji: "yooguruto", meaning: "Sữa chua" }] }
    ],
    quizzes: [
      { id: "q18_1", type: "select-romaji", question: "Chữ cái Katakana 'ヨ' đọc là gì?", options: ["ya", "yu", "yo", "e"], correctAnswer: "yo" }
    ],
    worksheet: [
      { romaji: "yasemasu", kana: "ヤセます" },
      { romaji: "yasui", kana: "ヤスイ" },
      { romaji: "yasai", kana: "ヤサイ" },
      { romaji: "nayami", kana: "ナヤミ" },
      { romaji: "oyu", kana: "オユ" },
      { romaji: "yome", kana: "ヨメ" },
      { romaji: "yomou", kana: "ヨモウ" },
      { romaji: "yosakoi", kana: "ヨサコイ" },
      { romaji: "yuki", kana: "ユキ" },
      { romaji: "mayu", kana: "マユ" },
      { romaji: "yume", kana: "ユメ" },
      { romaji: "yasumi", kana: "ヤスミ" },
      { romaji: "yomu", kana: "ヨム" },
      { romaji: "yomimasu", kana: "ヨミマス" },
      { romaji: "yoko", kana: "ヨコ" }
    ]
  },
  {
    id: 19,
    title: "Bài 19: Katakana - Hàng ラ (ラ, リ, ル, レ, ロ)",
    type: "katakana",
    description: "Nhóm phụ âm R của bảng chữ cứng Katakana.",
    characters: [
      { japanese: "ラ", romaji: "ra", mnemonic: "Góc gập giống chiếc loa phát thanh.", strokeCount: 2, examples: [{ word: "ラジオ", romaji: "rajio", meaning: "Đài phát thanh" }] },
      { japanese: "リ", romaji: "ri", mnemonic: "Hai đường thẳng song song vát nét.", strokeCount: 2, examples: [{ word: "ライス", romaji: "raisu", meaning: "Cơm" }] },
      { japanese: "ル", romaji: "ru", mnemonic: "Hai nét cong hướng chéo ra hai bên.", strokeCount: 2, examples: [{ word: "ルール", romaji: "ruuru", meaning: "Quy tắc" }] },
      { japanese: "レ", romaji: "re", mnemonic: "Nét gạch chéo cong góc dưới.", strokeCount: 1, examples: [{ word: "レモン", romaji: "remon", meaning: "Chanh" }] },
      { japanese: "ロ", romaji: "ro", mnemonic: "Hình vuông đóng kín hoàn toàn.", strokeCount: 3, examples: [{ word: "ロボット", romaji: "robotto", meaning: "Rô bốt" }] }
    ],
    quizzes: [
      { id: "q19_1", type: "select-character", question: "Chọn chữ cái tương ứng với phát âm 'ro'?", options: ["ラ", "ル", "レ", "ロ"], correctAnswer: "ロ" }
    ],
    worksheet: [
      { romaji: "terebi", kana: "テレビ" },
      { romaji: "teburu", kana: "テーブル" },
      { romaji: "kujira", kana: "クジラ" },
      { romaji: "beruto", kana: "ベルト" },
      { romaji: "surippa", kana: "スリッパ" },
      { romaji: "irakku", kana: "イラク" },
      { romaji: "igirisu", kana: "イギリス" },
      { romaji: "kare-raisu", kana: "カレーライス" },
      { romaji: "raita", kana: "ライター" },
      { romaji: "rajio", kana: "ラジオ" },
      { romaji: "risu", kana: "リス" },
      { romaji: "maresia", kana: "マレーシア" },
      { romaji: "kare-", kana: "カレー" },
      { romaji: "raisu", kana: "ライス" },
      { romaji: "raosu", kana: "ラオス" }
    ]
  },
  {
    id: 20,
    title: "Bài 20: Katakana - Hàng ワ (ワ, ヲ, ン)",
    type: "katakana",
    description: "Nhóm phụ âm cuối cùng trong bảng Katakana.",
    characters: [
      { japanese: "ワ", romaji: "wa", mnemonic: "Giống chữ u lật nghiêng sang trái.", strokeCount: 2, examples: [{ word: "ワイン", romaji: "wain", meaning: "Rượu vang" }] },
      { japanese: "ヲ", romaji: "wo", mnemonic: "Hai gạch ngang có một nét móc chéo.", strokeCount: 3, examples: [{ word: "ヲ", romaji: "wo", meaning: "Trợ từ" }] },
      { japanese: "ン", romaji: "n", mnemonic: "Một giọt nước xiên chéo lên (phân biệt với shi).", strokeCount: 2, examples: [{ word: "ラーメン", romaji: "raamen", meaning: "Mì Ramen" }] }
    ],
    quizzes: [
      { id: "q20_1", type: "select-romaji", question: "Chữ cái Katakana 'ン' đọc là gì?", options: ["wa", "wo", "n", "m"], correctAnswer: "n" }
    ],
    worksheet: [
      { romaji: "watashi", kana: "ワタシ" },
      { romaji: "wakai", kana: "ワカイ" },
      { romaji: "hon", kana: "ホン" },
      { romaji: "nihon", kana: "ニホン" },
      { romaji: "yowai", kana: "ヨワイ" },
      { romaji: "yakan", kana: "ヤカン" },
      { romaji: "iken", kana: "イケン" },
      { romaji: "minasan", kana: "ミナサン" },
      { romaji: "bo-rupen", kana: "ボールペン" },
      { romaji: "furansu", kana: "フランス" },
      { romaji: "raamen", kana: "ラーメン" },
      { romaji: "raion", kana: "ライオン" }
    ]
  }
];
