import { Language } from './translations';

/**
 * Category Translations
 */
const CATEGORY_MAP: Record<string, Partial<Record<Language, string>>> = {
  All: {
    ko: '전체 카테고리',
    en: 'All Categories',
    ja: 'すべてのカテゴリー',
    fr: 'Toutes les catégories',
    zh: '全部分类',
    es: 'Todas las Categorías',
  },
  Window: {
    ko: '윈도우 디스플레이',
    en: 'Window Display',
    ja: 'ウィンドウディスプレイ',
    fr: 'Vitrine',
    zh: '橱窗陈列',
    es: 'Escaparate',
  },
  'Store Interior': {
    ko: '매장 인테리어',
    en: 'Store Interior',
    ja: '店舗内装',
    fr: 'Intérieur de Magasin',
    zh: '店铺室内',
    es: 'Interior de Tienda',
  },
  'Store Exterior': {
    ko: '매장 파사드 (익스테리어)',
    en: 'Store Exterior (Facade)',
    ja: '店舗外観',
    fr: 'Façade de Magasin',
    zh: '店铺外观',
    es: 'Exterior de Tienda',
  },
  'Pop-up Store': {
    ko: '팝업 스토어',
    en: 'Pop-up Store',
    ja: 'ポップアップストア',
    fr: 'Boutique Éphémère',
    zh: '快闪店',
    es: 'Tienda Pop-up',
  },
  Street: {
    ko: '스트리트 씬',
    en: 'Street Scene',
    ja: 'ストリート',
    fr: 'Scène de Rue',
    zh: '街景/都市',
    es: 'Calle / Urbano',
  },
  Exhibition: {
    ko: '전시 공간',
    en: 'Exhibition',
    ja: '展示空間',
    fr: 'Exposition',
    zh: '展览空间',
    es: 'Espacio de Exposición',
  },
};

/**
 * Country Translations
 */
const COUNTRY_MAP: Record<string, Partial<Record<Language, string>>> = {
  All: {
    ko: '글로벌 (전체 국가)',
    en: 'Global (All Countries)',
    ja: 'グローバル (すべての国)',
    fr: 'Mondial (Tous les pays)',
    zh: '全球 (所有国家)',
    es: 'Global (Todos los Países)',
  },
  Japan: {
    ko: '일본',
    en: 'Japan',
    ja: '日本',
    fr: 'Japon',
    zh: '日本',
    es: 'Japón',
  },
  France: {
    ko: '프랑스',
    en: 'France',
    ja: 'フランス',
    fr: 'France',
    zh: '法国',
    es: 'Francia',
  },
  'South Korea': {
    ko: '대한민국',
    en: 'South Korea',
    ja: '韓国',
    fr: 'Corée du Sud',
    zh: '韩国',
    es: 'Corea del Sur',
  },
  'United States': {
    ko: '미국',
    en: 'United States',
    ja: 'アメリカ',
    fr: 'États-Unis',
    zh: '美国',
    es: 'Estados Unidos',
  },
  'United Kingdom': {
    ko: '영국',
    en: 'United Kingdom',
    ja: 'イギリス',
    fr: 'Royaume-Uni',
    zh: '英国',
    es: 'Reino Unido',
  },
  Italy: {
    ko: '이탈리아',
    en: 'Italy',
    ja: 'イタリア',
    fr: 'Italie',
    zh: '意大利',
    es: 'Italia',
  },
  Global: {
    ko: '글로벌',
    en: 'Global',
    ja: 'グローバル',
    fr: 'Mondial',
    zh: '全球',
    es: 'Global',
  },
};

/**
 * City Translations
 */
const CITY_MAP: Record<string, Partial<Record<Language, string>>> = {
  All: {
    ko: '전체 도시',
    en: 'All Cities',
    ja: 'すべての都市',
    fr: 'Toutes les villes',
    zh: '所有城市',
    es: 'Todas las Ciudades',
  },
  Tokyo: {
    ko: '도쿄',
    en: 'Tokyo',
    ja: '東京',
    fr: 'Tokyo',
    zh: '东京',
    es: 'Tokio',
  },
  Paris: {
    ko: '파리',
    en: 'Paris',
    ja: 'パリ',
    fr: 'Paris',
    zh: '巴黎',
    es: 'París',
  },
  Seoul: {
    ko: '서울',
    en: 'Seoul',
    ja: 'ソウル',
    fr: 'Séoul',
    zh: '首尔',
    es: 'Seúl',
  },
  'New York': {
    ko: '뉴욕',
    en: 'New York',
    ja: 'ニューヨーク',
    fr: 'New York',
    zh: '纽约',
    es: 'Nueva York',
  },
  London: {
    ko: '런던',
    en: 'London',
    ja: 'ロンドン',
    fr: 'Londres',
    zh: '伦敦',
    es: 'Londres',
  },
  Milan: {
    ko: '밀라노',
    en: 'Milan',
    ja: 'ミラノ',
    fr: 'Milan',
    zh: '米兰',
    es: 'Milán',
  },
};

/**
 * Design Material / Style / Lighting / Composition term Translations
 */
const ATTRIBUTE_MAP: Record<string, Partial<Record<Language, string>>> = {
  // Styles
  'Cyberpunk Industrial': {
    ko: '사이버펑크 인더스트리얼',
    en: 'Cyberpunk Industrial',
    ja: 'サイバーパンク・インダストリアル',
    fr: 'Industriel Cyberpunk',
    zh: '赛博朋克工业风',
    es: 'Industrial Cyberpunk',
  },
  'Biophilic Luxury': {
    ko: '바이오필릭 럭셔리',
    en: 'Biophilic Luxury',
    ja: 'バイオフィリック・ラグジュアリー',
    fr: 'Luxe Biophilique',
    zh: '亲自然奢华风',
    es: 'Lujo Biofílico',
  },
  'Minimalist Brutalism': {
    ko: '미니멀리스트 브루탈리즘',
    en: 'Minimalist Brutalism',
    ja: 'ミニマリスト・ブルータリズム',
    fr: 'Brutalisme Minimaliste',
    zh: '极简野兽主义',
    es: 'Brutalismo Minimalista',
  },
  'Soft Sculptural Surrealism': {
    ko: '소프트 조형 초현실주의',
    en: 'Soft Sculptural Surrealism',
    ja: 'ソフト彫刻超現実主義',
    fr: 'Surréalisme Sculptural Doux',
    zh: '柔和雕塑超现实主义',
    es: 'Surrealismo Escultórico Suave',
  },
  'Neo-Heritage Expressionism': {
    ko: '네오 헤리티지 표현주의',
    en: 'Neo-Heritage Expressionism',
    ja: 'ネオ・ヘリテージ表現主義',
    fr: 'Expressionnisme Néotraditionnel',
    zh: '新传统表现主义',
    es: 'Expresionismo Neo-Patrimonial',
  },
  'Craft Rationalism': {
    ko: '크래프트 합리주의',
    en: 'Craft Rationalism',
    ja: 'クラフト・ラショナリズム',
    fr: 'Rationalisme Artisanal',
    zh: '匠心理性主义',
    es: 'Racionalismo Artesanal',
  },
  'Minimalist Oriental Modernism': {
    ko: '미니멀 동양 모더니즘',
    en: 'Minimalist Oriental Modernism',
    ja: 'ミニマル東洋モダニズム',
    fr: 'Modernisme Oriental Minimaliste',
    zh: '极简东方现代主义',
    es: 'Modernismo Oriental Minimalista',
  },
  'Surrealist Pop Minimalism': {
    ko: '초현실 팝 미니멀리즘',
    en: 'Surrealist Pop Minimalism',
    ja: 'シュルレアリスム・ポップ',
    fr: 'Minimalisme Pop Surréaliste',
    zh: '超现实波普极简主义',
    es: 'Minimalismo Pop Surrealista',
  },
  'Minimalist Asian Serenity': {
    ko: '미니멀 아시안 동양미',
    en: 'Minimalist Asian Serenity',
    ja: '東洋の静寂ミニマリズム',
    fr: 'Sérénité Asiatique Minimaliste',
    zh: '极简东方禅意',
    es: 'Serenidad Asiática Minimalista',
  },
  'Monumental Art Deco Modernism': {
    ko: '웅장한 아르데코 모더니즘',
    en: 'Monumental Art Deco Modernism',
    ja: 'モニュメンタル・アールデコ',
    fr: 'Modernisme Art Déco Monumental',
    zh: '宏伟装饰艺术现代主义',
    es: 'Modernismo Art Déco Monumental',
  },

  // Lighting
  'Dynamic Spot Accent & Linear Cove': {
    ko: '다이내믹 스폿 핀조명 및 라인 코브',
    en: 'Dynamic Spot Accent & Linear Cove',
    ja: 'ダイナミック・スポット照明＆ライン間接',
    fr: 'Éclairage d\'Accentuation Dynamique',
  },
  'Warm Concealed Ambient & Precise Spotlight': {
    ko: '따뜻한 은폐 간접 조명 및 정밀 핀조명',
    en: 'Warm Concealed Ambient & Precise Spotlight',
    ja: '温色建築化間接照明＆スポット',
    fr: 'Ambiance Chaude Encastrée',
  },
  'Linear LED Outline & Soft Floor Wash': {
    ko: '라인 LED 아웃라인 및 소프트 바닥 워시',
    en: 'Linear LED Outline & Soft Floor Wash',
    ja: 'リニアLEDライン照明＆フロアウォッシュ',
    fr: 'Ligne LED Linéaire',
  },
  'Diffused Ceiling Lightbox & Vanity Ring Lights': {
    ko: '천장 천 조명 디퓨저 및 링 라이트',
    en: 'Diffused Ceiling Lightbox & Vanity Ring Lights',
    ja: '天井拡散ライトボックス',
    fr: 'Boîte à Lumière Diffuse',
  },
  'Integrated Kinetic LED Pixel Facade': {
    ko: '통합 키네틱 LED 피셀 파사드',
    en: 'Integrated Kinetic LED Pixel Facade',
    ja: 'キネティックLEDピクセル照明',
    fr: 'Façade LED Cinétique',
  },
  'Low-key Warm Accent & Spot Highlights': {
    ko: '로우키 웜 액센트 및 스폿 하이라이트',
    en: 'Low-key Warm Accent & Spot Highlights',
    ja: 'ローキー温色スポットハイライト',
    fr: 'Accent Chaud Discret',
  },
  'Internal Paper Lantern Glow & Exterior Narrow Spot': {
    ko: '내부 은은한 한지 등 조명 및 외각 스폿',
    en: 'Internal Paper Lantern Glow & Exterior Narrow Spot',
    ja: '和紙提灯内部照明',
    fr: 'Lueur de Lanterne Intérieure',
  },
  'High-luminance Soft Overhead Diffusion': {
    ko: '고휘도 천장 소프트 확산 조명',
    en: 'High-luminance Soft Overhead Diffusion',
    ja: '高輝度天井拡散照明',
    fr: 'Diffusion Douce Haute Luminosité',
  },
  'Warm Ambient Cove & Indirect Floor Spotlights': {
    ko: '따뜻한 은폐 코브 및 간접 바닥 핀조명',
    en: 'Warm Ambient Cove & Indirect Floor Spotlights',
    ja: '温色建築化間接＆フロアスポット',
    fr: 'Cove Ambiante Chaude',
  },
  'Custom RGBW Architectural Glow': {
    ko: '커스텀 RGBW 건축 아키텍처 조명',
    en: 'Custom RGBW Architectural Glow',
    ja: 'カスタムRGBW建築照明',
    fr: 'Éclat Architectural RGBW',
  },

  // Composition
  'Monolithic Kinetic Focus': {
    ko: '단일 덩어리감 키네틱 구도',
    en: 'Monolithic Kinetic Focus',
    ja: 'モノリシック・キネティック構図',
    fr: 'Focus Cinétique Monolithique',
  },
  'Symmetrical Curved Depth': {
    ko: '대칭형 곡면 깊이감 구도',
    en: 'Symmetrical Curved Depth',
    ja: '対称型曲面奥行き構図',
    fr: 'Profondeur Courbe Symétrique',
  },
  'Asymmetrical Monolithic Aperture': {
    ko: '비대칭 덩어리감 개구부 구도',
    en: 'Asymmetrical Monolithic Aperture',
    ja: '非対称開口部構図',
    fr: 'Ouverture Monolithique Asymétrique',
  },
  'Curvilinear Fluid Flow': {
    ko: '유선형 유기적 동선 구도',
    en: 'Curvilinear Fluid Flow',
    ja: '流線型流体動線構図',
    fr: 'Flux Fluide Curviligne',
  },
  'Grid Pattern Disruption': {
    ko: '격자 패턴 해체 구도',
    en: 'Grid Pattern Disruption',
    ja: 'グリッドパターン解体構図',
    fr: 'Disruption de Motif en Grille',
  },
  'Concentric Pavilion Enclosure': {
    ko: '동심원 파빌리온 서라운드 구도',
    en: 'Concentric Pavilion Enclosure',
    ja: '同心円パビリオン構図',
    fr: 'Enceinte de Pavillon Concentrique',
  },
  'Floating Geometric Balance': {
    ko: '공중 부유 기하학적 균형 구도',
    en: 'Floating Geometric Balance',
    ja: '浮遊幾何学バランス構図',
    fr: 'Équilibre Géométrique Flottant',
  },
  'Monochromatic Sculptural Blocks': {
    ko: '모노크롬 조형 덩어리 구도',
    en: 'Monochromatic Sculptural Blocks',
    ja: '単色彫刻ブロック構図',
    fr: 'Blocs Sculpturaux Monochromes',
  },
  'Asymmetrical Serene Voids': {
    ko: '비대칭 여백의 미 구도',
    en: 'Asymmetrical Serene Voids',
    ja: '非対称余白の静寂構図',
    fr: 'Vides Sereins Asymétriques',
  },
  'Vertical Tower Symmetry': {
    ko: '수직 타워 대칭 구도',
    en: 'Vertical Tower Symmetry',
    ja: '垂直タワー対称構図',
    fr: 'Symétrie de Tour Verticale',
  },

  // Materials
  'Brushed Stainless Steel': {
    ko: '헤어라인 스테인리스 스틸',
    en: 'Brushed Stainless Steel',
    ja: 'ヘアライン・ステンレススチール',
    fr: 'Acier Inoxydable Brossé',
  },
  'Fluted Acrylic': {
    ko: '플루티드 아크릴 패널',
    en: 'Fluted Acrylic',
    ja: 'フルーテッドアクリル',
    fr: 'Acrylique Cannelé',
  },
  'Unfinished Concrete': {
    ko: '노출 마감 콘크리트',
    en: 'Unfinished Concrete',
    ja: '打放しコンクリート',
    fr: 'Béton Brut',
  },
  'Neon Quartz': {
    ko: '네온 석영 글래스',
    en: 'Neon Quartz',
    ja: 'ネオンクォーツ',
    fr: 'Quartz Néon',
  },
  'Steam-bent Walnut Wood': {
    ko: '곡면 증기 원목 (월넛)',
    en: 'Steam-bent Walnut Wood',
    ja: '曲げ木ウォールナット',
    fr: 'Noyer Cintre à la Vapeur',
  },
  'Polished Brass Rim': {
    ko: '폴리싱 황동 프레임',
    en: 'Polished Brass Rim',
    ja: '研磨真鍮リム',
    fr: 'Rebord en Laiton Poli',
  },
  'Low-iron Optical Glass': {
    ko: '저철분 광학 유리가공',
    en: 'Low-iron Optical Glass',
    ja: '高透過光学ガラス',
    fr: 'Verre Optique Extra-Clair',
  },
  'Silk Velvet': {
    ko: '실크 벨벳 천',
    en: 'Silk Velvet',
    ja: 'シルクベルベット',
    fr: 'Velours de Soie',
  },
  'Board-formed Concrete': {
    ko: '노출 콘크리트 패널',
    en: 'Board-formed Concrete',
    ja: '杉板打放しコンクリート',
    fr: 'Béton Brut Coffré',
  },
  'Blackized Steel Frames': {
    ko: '블랙착색 스틸 프레임',
    en: 'Blackized Steel Frames',
    ja: '黒染めスチールフレーム',
    fr: 'Cadres en Acier Noirci',
  },
  'Suspended Moss': {
    ko: '공중 이끼 가공 캐노피',
    en: 'Suspended Moss Canopy',
    ja: '吊り下げモスカノピー',
    fr: 'Canopée de Mousse Suspendue',
  },
  'Frosted Glass Panel': {
    ko: '에칭 사틴 유리 패널',
    en: 'Frosted Glass Panel',
    ja: 'フロストガラスパネル',
    fr: 'Panneau de Verre Dépoli',
  },
  'Venetian Soft Plaster': {
    ko: '베네치아 스투코 플라스터',
    en: 'Venetian Soft Plaster',
    ja: 'ベネチアン・スタッコ漆喰',
    fr: 'Stuc Vénitien Doux',
  },
  'Mirror-polished Chrome': {
    ko: '미러 폴리싱 크롬',
    en: 'Mirror-polished Chrome',
    ja: '鏡面クローム',
    fr: 'Chrome Poli Miroir',
  },
  'Cast Resin': {
    ko: '캐스팅 레진 성형',
    en: 'Cast Resin',
    ja: 'キャスト樹脂',
    fr: 'Résine Moulée',
  },
  'Terrazzo Flooring': {
    ko: '테라조 도막 바닥',
    en: 'Terrazzo Flooring',
    ja: 'テラゾー床材',
    fr: 'Sol en Terrazzo',
  },
  'Specular Anodized Aluminum': {
    ko: '아노다이징 알루미늄 타일',
    en: 'Specular Anodized Aluminum',
    ja: 'アルマイトアルミ',
    fr: 'Aluminium Anodisé Spéculaire',
  },
  'Tempered Reflected Glass': {
    ko: '반사 강화유리',
    en: 'Tempered Reflected Glass',
    ja: '強化反射ガラス',
    fr: 'Verre Réfléchissant Trempé',
  },
  'Portland Stone Trim': {
    ko: '포틀랜드 대리석 석조',
    en: 'Portland Stone Trim',
    ja: 'ポートランド石材トリム',
    fr: 'Pierre de Portland',
  },
  'Intrecciato Nappa Leather': {
    ko: '인트레치아토 나파 가죽',
    en: 'Intrecciato Nappa Leather',
    ja: 'イントレチャートナッパレザー',
    fr: 'Cuir Nappa Tressé Intrecciato',
  },
  'Basalt Volcanic Stone': {
    ko: '현무암 화산석',
    en: 'Basalt Volcanic Stone',
    ja: '玄武岩火山石',
    fr: 'Pierre Volcanique de Basalte',
  },
  'Brushed Warm Bronze': {
    ko: '브러시드 웜 브론즈',
    en: 'Brushed Warm Bronze',
    ja: 'ブラッシュド・ウォームブロンズ',
    fr: 'Bronze Chaud Brossé',
  },
  'Raw Linen': {
    ko: '천연 린넨 섬유',
    en: 'Raw Linen',
    ja: '天然リネン',
    fr: 'Lin Brut',
  },
  'Handmade Washi Paper': {
    ko: '전통 수제 한지/와시',
    en: 'Handmade Washi Paper',
    ja: '手漉き和紙',
    fr: 'Papier Washi Fait Main',
  },
  'Fine Brass Rods': {
    ko: '정밀 황동 로드 프레임',
    en: 'Fine Brass Rods',
    ja: '極細真鍮ロッド',
    fr: 'Tiges de Laiton Fins',
  },
  'Ultra-clear Glass': {
    ko: '고투명 디스플레이 유리',
    en: 'Ultra-clear Glass',
    ja: '高透過クリアガラス',
    fr: 'Verre Ultra-Clair',
  },
  'Black Ash Wood': {
    ko: '블랙 애쉬 원목',
    en: 'Black Ash Wood',
    ja: 'ブラックアッシュ材',
    fr: 'Bois de Frêne Noir',
  },
  'High-density Molded Foam': {
    ko: '고밀도 조형 폼',
    en: 'High-density Molded Foam',
    ja: '高密度成形フォーム',
    fr: 'Mousse Moulée Haute Densité',
  },
  'Matte Lacquered Steel': {
    ko: '매트 분체도장 스틸',
    en: 'Matte Lacquered Steel',
    ja: 'マット塗装スチール',
    fr: 'Acier Laqué Mat',
  },
  'Frosted Yellow Glass': {
    ko: '프로스테드 옐로우 유리',
    en: 'Frosted Yellow Glass',
    ja: 'フロストイエローガラス',
    fr: 'Verre Jaune Dépoli',
  },
  'Warm Micro-cement Plaster': {
    ko: '웜 마이크로시멘트 플라스터',
    en: 'Warm Micro-cement Plaster',
    ja: '温色マイクロセメント',
    fr: 'Béton Ciré Chaud',
  },
  'Handmade Hanji Paper': {
    ko: '전통 수제 한지',
    en: 'Handmade Hanji Paper',
    ja: '手漉き韓紙',
    fr: 'Papier Hanji Fait Main',
  },
  'Hairline Stainless Steel': {
    ko: '헤어라인 스테인리스 스틸',
    en: 'Hairline Stainless Steel',
    ja: 'ヘアライン・ステンレス',
    fr: 'Acier Inoxydable Brossé',
  },
  'Natural Travertine Stone': {
    ko: '천연 트라버틴 대리석',
    en: 'Natural Travertine Stone',
    ja: '天然トラバーチン石材',
    fr: 'Pierre de Travertin Naturelle',
  },
};

/**
 * Safe Locale Code helper
 */
export function getLocale(lang: Language): string {
  switch (lang) {
    case 'ko': return 'ko-KR';
    case 'ja': return 'ja-JP';
    case 'fr': return 'fr-FR';
    case 'zh': return 'zh-CN';
    case 'es': return 'es-ES';
    default: return 'en-US';
  }
}

/**
 * Generic Bidirectional / Multi-language Lookup Helper
 */
function lookupTranslation(
  map: Record<string, Partial<Record<Language, string>>>,
  term: string,
  lang: Language
): string {
  if (!term || typeof term !== 'string') return term;
  const trimmed = term.trim();
  if (!trimmed) return term;

  // 1. Direct Key Match (e.g. term === 'Minimalist Brutalism')
  if (map[trimmed]) {
    const entry = map[trimmed];
    if (entry && entry[lang]) return entry[lang]!;
    if (entry && entry.en) return entry.en!;
  }

  // 2. Bidirectional / Reverse Match across any language value (e.g. term === '野兽主义工业风' or '미니멀리스트 브루탈리즘')
  const lowerTerm = trimmed.toLowerCase();
  for (const key of Object.keys(map)) {
    const entry = map[key];
    if (!entry) continue;
    for (const val of Object.values(entry)) {
      if (val && val.toLowerCase() === lowerTerm) {
        if (entry[lang]) return entry[lang]!;
        if (entry.en) return entry.en!;
      }
    }
  }

  return term;
}

/**
 * Translate Category
 */
export function translateCategory(cat: string, lang: Language): string {
  return lookupTranslation(CATEGORY_MAP, cat, lang);
}

/**
 * Translate Country
 */
export function translateCountry(country: string, lang: Language): string {
  return lookupTranslation(COUNTRY_MAP, country, lang);
}

/**
 * Translate City
 */
export function translateCity(city: string, lang: Language): string {
  return lookupTranslation(CITY_MAP, city, lang);
}

/**
 * Translate Location Pair (City, Country)
 */
export function translateLocation(city: string, country: string, lang: Language): string {
  const cCity = translateCity(city, lang);
  const cCountry = translateCountry(country, lang);
  if (lang === 'ko' || lang === 'ja') {
    return `${cCountry} ${cCity}`;
  }
  return `${cCity}, ${cCountry}`;
}

/**
 * Translate Design Attribute (Style, Material, Lighting, Composition)
 */
export function translateAttribute(term: string, lang: Language): string {
  return lookupTranslation(ATTRIBUTE_MAP, term, lang);
}

const DESCRIPTION_MAP: Record<string, Partial<Record<Language, string>>> = {
  'Hyper-real kinetic sculpture installation integrated with brushed steel retail counters in Ginza.': {
    ko: '긴자 매장에 설치된 극실사 키네틱 조형물 및 헤어라인 스틸 전시대의 미래지향적 공간 디스플레이.',
    en: 'Hyper-real kinetic sculpture installation integrated with brushed steel retail counters in Ginza.',
    ja: '銀座店舗に設置されたハイパーリアルなキネティック彫刻とヘアラインスチール什器の近未来空間。',
    fr: 'Installation de sculpture cinétique hyperréaliste intégrée à des comptoirs en acier brossé à Ginza.',
    zh: '银座店铺中结合拉丝钢陈列台的超写实动态雕塑装置。',
    es: 'Instalación de escultura cinética hiperrealista integrada con mostradores de acero cepillado en Ginza.',
  },
  'Champs-Élysées summer window concept featuring multi-layered organic timber arcs with warm spotlighting.': {
    ko: '샹젤리제 메인 윈도우에 연출된 곡면 유기적 원목 아치와 따뜻한 골드 황동 핀조명 연출.',
    en: 'Champs-Élysées summer window concept featuring multi-layered organic timber arcs with warm spotlighting.',
    ja: 'シャンゼリゼ通りのメインウィンドウに演出された曲面木製アーチと温かみのある真鍮照明。',
    fr: 'Concept de vitrine estivale aux Champs-Élysées avec des arcs en bois massif et un éclairage laiton chaud.',
    zh: '香榭丽舍大街夏季橱窗，采用多层有机木弧与暖色射灯。',
    es: 'Concepto de escaparate de verano en los Campos Elíseos con arcos de madera orgánica e iluminación cálida.',
  },
  'Raw concrete flagship façade in Seongsu with dramatic suspended botanical installation and LED wall.': {
    ko: '성수 플래그십 파사드에 적용된 노출 콘크리트 구조와 공중 식물 캐노피의 웅장한 연출.',
    en: 'Raw concrete flagship façade in Seongsu with dramatic suspended botanical installation and LED wall.',
    ja: '聖水（ソンス）フラッグシップ外観に適用された打ち放しコンクリート構造と吊り下げ植物キャノピー。',
    fr: 'Façade en béton brut à Seongsu avec une spectaculaire installation botanique suspendue et mur LED.',
    zh: '圣水洞旗舰店外立面，采用清水混凝土结构与悬挂植物装置及LED墙。',
    es: 'Fachada insignia de hormigón en Seongsu con una dramática instalación botánica suspendida y pared LED.',
  },
  'SoHo flagship interior featuring soft millennial pink plaster walls, oversized foam pedestals, and chrome detailing.': {
    ko: '소호 플래그십 내부에 적용된 은은한 핑크 스투코 플라스터와 대형 폼 전시대 및 크롬 포인트.',
    en: 'SoHo flagship interior featuring soft millennial pink plaster walls, oversized foam pedestals, and chrome detailing.',
    ja: 'SOHOフラッグシップ内に適用されたピンクスタッコ仕上げと大型フォーム什器、クロームのアクセント。',
    fr: 'Intérieur du magasin phare de SoHo avec des murs en plâtre rose doux, des piédestaux en mousse et des détails en chrome.',
    zh: 'SoHo 旗舰店室内，带有柔和千禧粉抹灰墙、超大泡沫展台与镀铬细节。',
    es: 'Interior de la tienda insignia de SoHo con paredes de yeso rosa suave, pedestales de espuma y detalles en cromo.',
  },
  'Bond Street flagship façade completely wrapped in dynamic mirrored check tiles that reflect heritage London brickwork.': {
    ko: '리젠트 스트리트 파사드를 감싼 거울 체크 미러 타일과 헤리티지 런던 벽돌의 입체 반사 연출.',
    en: 'Bond Street flagship façade completely wrapped in dynamic mirrored check tiles that reflect heritage London brickwork.',
    ja: 'ボンドストリート外観を包み込む鏡面チェックタイルとロンドンの伝統的なレンガ造りの反射。',
    fr: 'Façade du magasin phare de Bond Street enveloppée de carreaux miroirs à carreaux réfléchissant la brique londonienne.',
    zh: '邦德街旗舰店外立面，完全包覆在镜像格纹砖中，反射出伦敦传统砖墙。',
    es: 'Fachada insignia de Bond Street envuelta en azulejos de espejo a cuadros que reflejan los ladrillos tradicionales de Londres.',
  },
  'Salone del Mobile immersive lounge pavilion constructed with woven leather acoustic panels and volcanic stone seats.': {
    ko: '밀라노 가구박람회에 연출된 인트레치아토 가죽 아쿠스틱 패널과 화산석 라운지 쉼터.',
    en: 'Salone del Mobile immersive lounge pavilion constructed with woven leather acoustic panels and volcanic stone seats.',
    ja: 'ミラノサローネに展示されたイントレチャートレザー壁面パネルと火山岩ラウンジチェア。',
    fr: 'Pavillon d\'exposition au Salone del Mobile avec des panneaux muraux en cuir tressé et des sièges en pierre volcanique.',
    zh: '米兰家具展沉浸式休息亭，由编织皮革吸音板与火山石座椅打造。',
    es: 'Pabellón de exposición en Salone del Mobile construido con paneles acústicos de cuero tejido y asientos de piedra volcánica.',
  },
  'Omotesando storefront window utilizing traditional Japanese Washi paper lanterns with modern geometric brass wireframes.': {
    ko: '오모테산도 윈도우 디스플레이에 연출된 은은한 전통 한지 등과 프레임 입체 조형물.',
    en: 'Omotesando storefront window utilizing traditional Japanese Washi paper lanterns with modern geometric brass wireframes.',
    ja: '表参道ウィンドウディスプレイに演出された和紙提灯と現代的な真鍮フレーム。',
    fr: 'Vitrine d\'Omotesando utilisant des lanternes traditionnelles en papier Washi et des structures en laiton.',
    zh: '表参道临街橱窗，结合传统和纸灯笼与现代几何黄铜线框。',
    es: 'Escaparate en Omotesando con linternas de papel Washi tradicionales y marcos geométricos de latón.',
  },
  'Le Marais pop-up concept featuring monochromatic butter yellow foam structures and curved retail racks.': {
    ko: '르 마레 팝업 공간을 채운 단색 버터 옐로우 폼 조형물과 유선형 행거 구조.',
    en: 'Le Marais pop-up concept featuring monochromatic butter yellow foam structures and curved retail racks.',
    ja: 'マレ地区のポップアップ空間を彩るバターイエローのフォーム造形と曲面ハンガーラック。',
    fr: 'Concept éphémère au Marais avec des structures en mousse jaune beurre et des portants à vêtements cintrés.',
    zh: '玛黑区快闪店概念，特色为单色奶油黄泡沫结构与弧形陈列架。',
    es: 'Concepto pop-up en Le Marais con estructuras de espuma amarillo mantequilla y estantes curvados.',
  },
  'Hannam-dong boutique interior displaying warm micro-cement plaster walls, hand-carved hanji light shades, and minimalist stainless hangers.': {
    ko: '한남동 부티크 내부에 연출된 따뜻한 마이크로시멘트 질감과 손수 만든 한지 등, 트라버틴 카운터.',
    en: 'Hannam-dong boutique interior displaying warm micro-cement plaster walls, hand-carved hanji light shades, and minimalist stainless hangers.',
    ja: '漢南洞ブティック内に演出された温かみのあるマイクロセメント仕上げと手作り韓紙照明、トラバーチンカウンター。',
    fr: 'Intérieur de la boutique de Hannam-dong avec des murs en béton ciré chaud, des suspensions en papier Hanji et un comptoir en travertin.',
    zh: '汉南洞精品店室内，展示暖色微水泥墙面、手工韩纸灯罩与极简不锈钢衣架。',
    es: 'Interior de boutique en Hannam-dong con paredes de microcemento cálido, pantallas de papel hanji y colgadores de acero.',
  },
  'Jonathan Anderson curated Casa Loewe interior featuring ceramic art, oak shelves, and custom hand-woven rugs.': {
    ko: '오모테산도 카사 로에베 내부에 연출된 조형 도자기 아트와 오크 원목 선반.',
    en: 'Jonathan Anderson curated Casa Loewe interior featuring ceramic art, oak shelves, and custom hand-woven rugs.',
    ja: 'カサ・ロエベ表参道内部のセラミックアートとオーク材什器の空間。',
    fr: 'Intérieur de Casa Loewe présentant de l\'art céramique, des étagères en chêne et des tapis tissés main.',
    zh: '乔纳森·安德森策划的 Casa Loewe 室内，呈现陶瓷艺术、橡木货架与手工地毯。',
    es: 'Interior de Casa Loewe con arte cerámico, estantes de roble y alfombras tejidas a mano.',
  },
  'Fifth Avenue neo-renaissance mansion storefront with gold panther sculpture accents.': {
    ko: '5번가 까르띠에 랜드마크 맨션 파사드와 골드 팬더 조형물 연출.',
    en: 'Fifth Avenue neo-renaissance mansion storefront with gold panther sculpture accents.',
    ja: '5番街カルティエ・マンション外観の金色のパンサー彫刻。',
    fr: 'Façade de manoir néo-renaissance de la Cinquième Avenue avec des sculptures de panthères dorées.',
    zh: '第五大道新文艺复兴大厦门面，带有金色猎豹雕塑装饰。',
    es: 'Escaparate de mansión neorenacentista en la Quinta Avenida con esculturas de panteras doradas.',
  },
  'Pastel yellow damask silk window nook with brass framing in the Milan fashion quadrant.': {
    ko: '밀라노 미우미우 윈도우의 패스텔 옐로우 실크 다마스크 쇼케이스.',
    en: 'Pastel yellow damask silk window nook with brass framing in the Milan fashion quadrant.',
    ja: 'ミラノ・ミウミウのパステルイエローの絹ダマスク布地ウィンドウ。',
    fr: 'Vitrine en soie damassée jaune pastel avec cadre en laiton dans le quartier de la mode à Milan.',
    zh: '米兰时尚区柔黄色织锦缎丝绸橱窗，配黄铜边框。',
    es: 'Vitrine de seda damascada amarillo pastel con marco de latón en el distrito de la moda de Milán.',
  },
  'Ginza Maison Hermès paper origami installation window with golden sunlight projections.': {
    ko: '긴자 메종 에르메스 윈도우의 입체 종이 오리가미 조형물과 골드 햇살 투사 연출.',
    en: 'Ginza Maison Hermès paper origami installation window with golden sunlight projections.',
    ja: '銀座メゾンエルメスのウィンドウに飾られた和紙折り紙インスタレーションと黄金の光。',
    fr: 'Vitrine de Maison Hermès à Ginza avec installation d\'origami en papier et projections dorées.',
    zh: '银座爱马仕之家折纸艺术橱窗，伴有金色日光投影。',
    es: 'Escaparate con instalación de origami de papel en Maison Hermès Ginza con proyecciones doradas.',
  },
  'Sculptural marble podiums with brass mirror panels.': {
    ko: '조각 같은 마블 포디움과 황동 미러 패널이 조화를 이루는 프리미엄 쇼룸.',
    en: 'Sculptural marble podiums with brass mirror panels.',
    ja: '彫刻的な大理石ポディウムと真鍮ミラーパネルで構成された空間。',
    fr: 'Piédestaux en marbre sculpturaux avec des panneaux miroir en laiton.',
    zh: '雕塑大理石展台与黄铜镜面板。',
    es: 'Podios de mármol esculpidos con paneles de espejo de latón.',
  },
  'Custom footwear archway constructed from 500 cast white sneaker molds with marble countertops.': {
    ko: '뉴욕 키스(Kith) 매장에 설치된 500개의 스니커즈 백색 석고 몰드 아치 및 마블 전시대.',
    en: 'Custom footwear archway constructed from 500 cast white sneaker molds with marble countertops.',
    ja: 'ニューヨークKith店舗内の500個のスニーカー金型で作られた彫刻アーチ。',
    fr: 'Arche de chaussures sur mesure construite à partir de 500 moules de baskets blanches en plâtre.',
    zh: '由500个白色球鞋铸模构成的定制鞋履拱门，配大理石台面。',
    es: 'Arco de calzado personalizado construido con 500 moldes de zapatillas blancas con mostradores de mármol.',
  },
  'Sneaker mold archway retail layout in Williamsburg.': {
    ko: '윌리엄스버그 매장의 스니커즈 캐스팅 몰드 아치 입체 디스플레이.',
    en: 'Sneaker mold archway retail layout in Williamsburg.',
    ja: 'ウィリアムズバーグの500個のスニーカー金型アーチディスプレイ。',
    fr: 'Présentation commerciale d\'arche en moule de basket à Williamsburg.',
    zh: '威廉斯堡球鞋铸模拱门零售布局。',
    es: 'Diseño comercial con arco de moldes de zapatillas en Williamsburg.',
  },
  'Golden paper origami installation in Ginza window display.': {
    ko: '긴자 윈도우 디스플레이에 연출된 황금빛 한지 종이 오리가미 디스플레이.',
    en: 'Golden paper origami installation in Ginza window display.',
    ja: '銀座のウィンドウに輝く金色の和紙折り紙インスタレーション。',
    fr: 'Installation d\'origami en papier doré dans la vitrine de Ginza.',
  },
  'Monolithic noir octagonal storefront framing the historic Place Vendôme column reflection.': {
    ko: '방돔 광장 기둥이 반사되는 흑색 옥타곤 팔각형 조형의 샤넬 부티크 파사드.',
    en: 'Monolithic noir octagonal storefront framing the historic Place Vendôme column reflection.',
    ja: 'ヴァンドーム広場の記念柱が映り込むブラック八角形モチーフのショップ外観。',
    fr: 'Devanture octogonale noire monolithique encadrant le reflet de la colonne de la Place Vendôme.',
  },
  'Blackized steel octagonal storefront on Place Vendôme.': {
    ko: '방돔 광장에 위치한 블랙 착색 스틸 팔각형 구조의 웅장한 익스테리어.',
    en: 'Blackized steel octagonal storefront on Place Vendôme.',
    ja: 'ヴァンドーム広場に位置する黒染めスチール八角形ファサード。',
    fr: 'Devanture octogonale en acier noirci sur la Place Vendôme.',
  },
  'SoHo wave wooden staircase integrated with transparent glass display pods and green marble.': {
    ko: '소호 프라다 매장 내부에 연출된 웨이브 곡면 원목 계단과 투명 글래스 포드 전시대.',
    en: 'SoHo wave wooden staircase integrated with transparent glass display pods and green marble.',
    ja: 'SOHOプラダ店内のウェーブ木製階段と透明ガラスのディスプレイポッド。',
    fr: 'Escalier en bois ondulé à SoHo intégré à des présentoirs en verre transparent et marbre vert.',
  },
  'Iconic wave staircase in SoHo with green marble highlights.': {
    ko: '그린 대리석 포인트와 소호 프라다의 상징적인 웨이브 원목 계단 연출.',
    en: 'Iconic wave staircase in SoHo with green marble highlights.',
    ja: 'SOHOを代表するウェーブ階段とグリーンマーブルのハイライト。',
    fr: 'Escalier en vague emblématique à SoHo avec des accents de marbre vert.',
  },
  'Soaring grand archways lined with living Ficus trees and custom monolithic terrazzo tables.': {
    ko: '리젠트 스트리트 애플 매장의 생화 피쿠스 나무 및 아치형 테라조 전시대 연출.',
    en: 'Soaring grand archways lined with living Ficus trees and custom monolithic terrazzo tables.',
    ja: '本物のフィカスツリーとテラゾーテーブルが並ぶアーチ状のアトリウム。',
    fr: 'Grands arcs élancés bordés de ficus vivants et de tables monolithiques en terrazzo.',
  },
  'Biophilic retail atrium lined with trees and stone arches.': {
    ko: '나무와 대리석 아치가 어우러진 친환경 바이오필릭 인테리어 아트리움.',
    en: 'Biophilic retail atrium lined with trees and stone arches.',
    ja: '樹木と石材アーチが調和するバイオフィリック・リテールアトリウム。',
    fr: 'Atrium commercial biophilique bordé d\'arbres et d\'arches en pierre.',
  },
  'Opulent velvet padded window nook with vintage brass luggage mounts in the Milan Galleria.': {
    ko: '밀라노 갤러리아 구찌 윈도우의 럭셔리 벨벳 쇼케이스와 빈티지 황동 트렁크 마운트.',
    en: 'Opulent velvet padded window nook with vintage brass luggage mounts in the Milan Galleria.',
    ja: 'ミラノ・ヴィットーリオ・エマヌエーレガレリアのベルベットと真鍮トランクのウィンドウ。',
    fr: 'Niche de vitrine rembourrée en velours avec des supports de bagages en laiton vintage à la Galerie de Milan.',
  },
  'Velvet window display with brass luggage fixtures in Milan.': {
    ko: '밀라노 쇼핑 갤러리아 내 벨벳 및 황동 수화물 가방 디스플레이.',
    en: 'Velvet window display with brass luggage fixtures in Milan.',
    ja: 'ミラノのベルベット地に真鍮トランクを飾ったウィンドウディスプレイ。',
    fr: 'Vitrine en velours avec des éléments de bagages en laiton à Milan.',
  },
  'Raw construction scaffolding environment wrapped in heavy industrial plastic curtains.': {
    ko: '도쿄 발렌시아가 팝업의 공사장 스캐폴딩 스틸 파이프 및 비닐 커튼의 파격적 공간 연출.',
    en: 'Raw construction scaffolding environment wrapped in heavy industrial plastic curtains.',
    ja: '渋谷発起の建設足場とビニールシートで構成された発想のバレンシアガ・ポップアップ。',
    fr: 'Environnement d\'échafaudage de construction enveloppé dans de lourds rideaux plastiques industriels.',
  },
  'Raw scaffolding pop-up store environment in Shibuya.': {
    ko: '시부야에 선보인 공사장 철제 파이프와 인더스트리얼 비닐 팝업 스토어.',
    en: 'Raw scaffolding pop-up store environment in Shibuya.',
    ja: '渋谷の足場パイプとビニールシートによるインダストリアル・ポップアップ。',
    fr: 'Magasin éphémère d\'échafaudage brut à Shibuya.',
  },
  'Sculptural Grand Antique marble podiums set against mirrored brass panels and muted plaster.': {
    ko: '파리 셀린느 매장의 조형적 흑백 그랜드 안티크 마스터 마블 포디움과 황동 미러 패널.',
    en: 'Sculptural Grand Antique marble podiums set against mirrored brass panels and muted plaster.',
    ja: 'パリ・セリーヌ店内のグランドアンティーク大理石ポディウムと真鍮ミラー。',
    fr: 'Piédestaux sculpturaux en marbre Grand Antique sur fond de panneaux en laiton miroir.',
  },
};

export function translateDescription(desc: string, lang: Language): string {
  return lookupTranslation(DESCRIPTION_MAP, desc, lang);
}

/**
 * Format Date by Language Locale
 */
export function formatDate(dateStr: string, lang: Language, options?: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(dateStr);
    const locale = getLocale(lang);
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
  } catch {
    return dateStr;
  }
}
