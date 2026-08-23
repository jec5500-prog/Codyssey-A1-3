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
  },
  Window: {
    ko: '윈도우 디스플레이',
    en: 'Window Display',
    ja: 'ウィンドウディスプレイ',
    fr: 'Vitrine',
  },
  'Store Interior': {
    ko: '매장 인테리어',
    en: 'Store Interior',
    ja: '店舗内装',
    fr: 'Intérieur de Magasin',
  },
  'Store Exterior': {
    ko: '매장 파사드 (익스테리어)',
    en: 'Store Exterior (Facade)',
    ja: '店舗外観',
    fr: 'Façade de Magasin',
  },
  'Pop-up Store': {
    ko: '팝업 스토어',
    en: 'Pop-up Store',
    ja: 'ポップアップストア',
    fr: 'Boutique Éphémère',
  },
  Street: {
    ko: '스트리트 씬',
    en: 'Street Scene',
    ja: 'ストリート',
    fr: 'Scène de Rue',
  },
  Exhibition: {
    ko: '전시 공간',
    en: 'Exhibition',
    ja: '展示空間',
    fr: 'Exposition',
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
  },
  Japan: {
    ko: '일본',
    en: 'Japan',
    ja: '日本',
    fr: 'Japon',
  },
  France: {
    ko: '프랑스',
    en: 'France',
    ja: 'フランス',
    fr: 'France',
  },
  'South Korea': {
    ko: '대한민국',
    en: 'South Korea',
    ja: '韓国',
    fr: 'Corée du Sud',
  },
  'United States': {
    ko: '미국',
    en: 'United States',
    ja: 'アメリカ',
    fr: 'États-Unis',
  },
  'United Kingdom': {
    ko: '영국',
    en: 'United Kingdom',
    ja: 'イギリス',
    fr: 'Royaume-Uni',
  },
  Italy: {
    ko: '이탈리아',
    en: 'Italy',
    ja: 'イタリア',
    fr: 'Italie',
  },
  Global: {
    ko: '글로벌',
    en: 'Global',
    ja: 'グローバル',
    fr: 'Mondial',
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
  },
  Tokyo: {
    ko: '도쿄',
    en: 'Tokyo',
    ja: '東京',
    fr: 'Tokyo',
  },
  Paris: {
    ko: '파리',
    en: 'Paris',
    ja: 'パリ',
    fr: 'Paris',
  },
  Seoul: {
    ko: '서울',
    en: 'Seoul',
    ja: 'ソウル',
    fr: 'Séoul',
  },
  'New York': {
    ko: '뉴욕',
    en: 'New York',
    ja: 'ニューヨーク',
    fr: 'New York',
  },
  London: {
    ko: '런던',
    en: 'London',
    ja: 'ロンドン',
    fr: 'Londres',
  },
  Milan: {
    ko: '밀라노',
    en: 'Milan',
    ja: 'ミラノ',
    fr: 'Milan',
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
  },
  'Biophilic Luxury': {
    ko: '바이오필릭 럭셔리',
    en: 'Biophilic Luxury',
    ja: 'バイオフィリック・ラグジュアリー',
    fr: 'Luxe Biophilique',
  },
  'Minimalist Brutalism': {
    ko: '미니멀리스트 브루탈리즘',
    en: 'Minimalist Brutalism',
    ja: 'ミニマリスト・ブルータリズム',
    fr: 'Brutalisme Minimaliste',
  },
  'Soft Sculptural Surrealism': {
    ko: '소프트 조형 초현실주의',
    en: 'Soft Sculptural Surrealism',
    ja: 'ソフト彫刻超現実主義',
    fr: 'Surréalisme Sculptural Doux',
  },
  'Neo-Heritage Expressionism': {
    ko: '네오 헤리티지 표현주의',
    en: 'Neo-Heritage Expressionism',
    ja: 'ネオ・ヘリテージ表現主義',
    fr: 'Expressionnisme Néotraditionnel',
  },
  'Craft Rationalism': {
    ko: '크래프트 합리주의',
    en: 'Craft Rationalism',
    ja: 'クラフト・ラショナリズム',
    fr: 'Rationalisme Artisanal',
  },
  'Minimalist Oriental Modernism': {
    ko: '미니멀 동양 모더니즘',
    en: 'Minimalist Oriental Modernism',
    ja: 'ミニマル東洋モダニズム',
    fr: 'Modernisme Oriental Minimaliste',
  },
  'Surrealist Pop Minimalism': {
    ko: '초현실 팝 미니멀리즘',
    en: 'Surrealist Pop Minimalism',
    ja: 'シュルレアリスム・ポップ',
    fr: 'Minimalisme Pop Surréaliste',
  },
  'Minimalist Asian Serenity': {
    ko: '미니멀 아시안 동양미',
    en: 'Minimalist Asian Serenity',
    ja: '東洋の静寂ミニマリズム',
    fr: 'Sérénité Asiatique Minimaliste',
  },
  'Monumental Art Deco Modernism': {
    ko: '웅장한 아르데코 모더니즘',
    en: 'Monumental Art Deco Modernism',
    ja: 'モニュメンタル・アールデコ',
    fr: 'Modernisme Art Déco Monumental',
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
  'Custom Faceted Glass Tiles': {
    ko: '입체 칼라 유리 커튼월',
    en: 'Custom Faceted Glass Tiles',
    ja: '立体ファセットガラス',
    fr: 'Tuiles en Verre Facetté',
  },
  'Polished Platinum Rim': {
    ko: '폴리싱 플래티넘 몰딩',
    en: 'Polished Platinum Rim',
    ja: '研磨プラチナマージン',
    fr: 'Rebord en Platine Poli',
  },
  'White Indiana Limestone': {
    ko: '화이트 인디애나 라임스톤',
    en: 'White Indiana Limestone',
    ja: 'ホワイト・インディアナライムストーン',
    fr: 'Pierre Calcaire d\'Indiana Blanche',
  },
  'Brushed Steel': {
    ko: '브러시드 스틸',
    en: 'Brushed Steel',
    ja: 'ブラッシュドスチール',
    fr: 'Acier Brossé',
  },
  Glass: {
    ko: '유리',
    en: 'Glass',
    ja: 'ガラス',
    fr: 'Verre',
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
    default: return 'en-US';
  }
}

/**
 * Translate Category
 */
export function translateCategory(cat: string, lang: Language): string {
  if (CATEGORY_MAP[cat] && CATEGORY_MAP[cat][lang]) {
    return CATEGORY_MAP[cat][lang];
  }
  return cat;
}

/**
 * Translate Country
 */
export function translateCountry(country: string, lang: Language): string {
  if (COUNTRY_MAP[country] && COUNTRY_MAP[country][lang]) {
    return COUNTRY_MAP[country][lang];
  }
  return country;
}

/**
 * Translate City
 */
export function translateCity(city: string, lang: Language): string {
  if (CITY_MAP[city] && CITY_MAP[city][lang]) {
    return CITY_MAP[city][lang];
  }
  return city;
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
  if (ATTRIBUTE_MAP[term] && ATTRIBUTE_MAP[term][lang]) {
    return ATTRIBUTE_MAP[term][lang];
  }
  return term;
}

/**
 * Description & Notes Multilingual Translation Map
 */
const DESCRIPTION_MAP: Record<string, Partial<Record<Language, string>>> = {
  'Hyper-real kinetic sculpture installation integrated with brushed steel retail counters in Ginza.': {
    ko: '긴자 매장에 설치된 극실사 키네틱 조형물 및 헤어라인 스틸 전시대의 미래지향적 공간 디스플레이.',
    en: 'Hyper-real kinetic sculpture installation integrated with brushed steel retail counters in Ginza.',
    ja: '銀座店舗に設置されたハイパーリアルなキネティック彫刻とヘアラインスチール什器の近未来空間。',
    fr: 'Installation de sculpture cinétique hyperréaliste intégrée à des comptoirs en acier brossé à Ginza.',
  },
  'Champs-Élysées summer window concept featuring multi-layered organic timber arcs with warm spotlighting.': {
    ko: '샹젤리제 메인 윈도우에 연출된 곡면 유기적 원목 아치와 따뜻한 골드 황동 핀조명 연출.',
    en: 'Champs-Élysées summer window concept featuring multi-layered organic timber arcs with warm spotlighting.',
    ja: 'シャンゼリゼ通りのメインウィンドウに演出された曲面木製アーチと温かみのある真鍮照明。',
    fr: 'Concept de vitrine estivale aux Champs-Élysées avec des arcs en bois massif et un éclairage laiton chaud.',
  },
  'Raw concrete flagship façade in Seongsu with dramatic suspended botanical installation and LED wall.': {
    ko: '성수 플래그십 파사드에 적용된 노출 콘크리트 구조와 공중 식물 캐노피의 웅장한 연출.',
    en: 'Raw concrete flagship façade in Seongsu with dramatic suspended botanical installation and LED wall.',
    ja: '聖水（ソンス）フラッグシップ外観に適用された打ち放しコンクリート構造と吊り下げ植物キャノピー。',
    fr: 'Façade en béton brut à Seongsu avec une spectaculaire installation botanique suspendue et mur LED.',
  },
  'SoHo flagship interior featuring soft millennial pink plaster walls, oversized foam pedestals, and chrome detailing.': {
    ko: '소호 플래그십 내부에 적용된 은은한 핑크 스투코 플라스터와 대형 폼 전시대 및 크롬 포인트.',
    en: 'SoHo flagship interior featuring soft millennial pink plaster walls, oversized foam pedestals, and chrome detailing.',
    ja: 'SOHOフラッグシップ内に適用されたピンクスタッコ仕上げと大型フォーム什器、クロームのアクセント。',
    fr: 'Intérieur du magasin phare de SoHo avec des murs en plâtre rose doux, des piédestaux en mousse et des détails en chrome.',
  },
  'Bond Street flagship façade completely wrapped in dynamic mirrored check tiles that reflect heritage London brickwork.': {
    ko: '리젠트 스트리트 파사드를 감싼 거울 체크 미러 타일과 헤리티지 런던 벽돌의 입체 반사 연출.',
    en: 'Bond Street flagship façade completely wrapped in dynamic mirrored check tiles that reflect heritage London brickwork.',
    ja: 'ボンドストリート外観を包み込む鏡面チェックタイルとロンドンの伝統的なレンガ造りの反射。',
    fr: 'Façade du magasin phare de Bond Street enveloppée de carreaux miroirs à carreaux réfléchissant la brique londonienne.',
  },
  'Salone del Mobile immersive lounge pavilion constructed with woven leather acoustic panels and volcanic stone seats.': {
    ko: '밀라노 가구박람회에 연출된 인트레치아토 가죽 아쿠스틱 패널과 화산석 라운지 쉼터.',
    en: 'Salone del Mobile immersive lounge pavilion constructed with woven leather acoustic panels and volcanic stone seats.',
    ja: 'ミラノサローネに展示されたイントレチャートレザー壁面パネルと火山岩ラウンジチェア。',
    fr: 'Pavillon d\'exposition au Salone del Mobile avec des panneaux muraux en cuir tressé et des sièges en pierre volcanique.',
  },
  'Omotesando storefront window utilizing traditional Japanese Washi paper lanterns with modern geometric brass wireframes.': {
    ko: '오모테산도 윈도우 디스플레이에 연출된 은은한 전통 한지 등과 프레임 입체 조형물.',
    en: 'Omotesando storefront window utilizing traditional Japanese Washi paper lanterns with modern geometric brass wireframes.',
    ja: '表参道ウィンドウディスプレイに演出された和紙提灯と現代的な真鍮フレーム。',
    fr: 'Vitrine d\'Omotesando utilisant des lanternes traditionnelles en papier Washi et des structures en laiton.',
  },
  'Le Marais pop-up concept featuring monochromatic butter yellow foam structures and curved retail racks.': {
    ko: '르 마레 팝업 공간을 채운 단색 버터 옐로우 폼 조형물과 유선형 행거 구조.',
    en: 'Le Marais pop-up concept featuring monochromatic butter yellow foam structures and curved retail racks.',
    ja: 'マレ地区のポップアップ空間を彩るバターイエローのフォーム造形と曲面ハンガーラック。',
    fr: 'Concept éphémère au Marais avec des structures en mousse jaune beurre et des portants à vêtements cintrés.',
  },
  'Hannam-dong boutique interior displaying warm micro-cement plaster walls, hand-carved hanji light shades, and minimalist stainless hangers.': {
    ko: '한남동 부티크 내부에 연출된 따뜻한 마이크로시멘트 질감과 손수 만든 한지 등, 트라버틴 카운터.',
    en: 'Hannam-dong boutique interior displaying warm micro-cement plaster walls, hand-carved hanji light shades, and minimalist stainless hangers.',
    ja: '漢南洞ブティック内に演出された温かみのあるマイクロセメント仕上げと手作り韓紙照明、トラバーチンカウンター。',
    fr: 'Intérieur de la boutique de Hannam-dong avec des murs en béton ciré chaud, des suspensions en papier Hanji et un comptoir en travertin.',
  },
  'Fifth Avenue landmark façade featuring multi-faceted glass curtain wall with custom robin-egg blue lighting at dusk.': {
    ko: '5번가 플래그십 파사드 입면에 연출된 입체 글래스 커튼월과 티파니 블루 아키텍처 글로우.',
    en: 'Fifth Avenue landmark façade featuring multi-faceted glass curtain wall with custom robin-egg blue lighting at dusk.',
    ja: '5番街ランドマーク外観の立体ガラスカーテンウォールとティファニーブルーの建築照明。',
    fr: 'Façade emblématique de la Cinquième Avenue avec un mur-rideau en verre facetté et un éclairage bleu Tiffany.',
  },
  'Minimalist noir marble showroom with mirror polished steel racks on Rue Saint-Honoré.': {
    ko: '생토노레 거리에 위치한 생로랑 매장의 마이크로 흑대리석 럭셔리 쇼룸.',
    en: 'Minimalist noir marble showroom with mirror polished steel racks on Rue Saint-Honoré.',
    ja: 'サントノレ通りのサンローラン店舗内の黒大理石とクローム什器。',
    fr: 'Showroom en marbre noir minimaliste avec des portants en acier poli miroir.',
  },
  'Jonathan Anderson curated Casa Loewe interior featuring ceramic art, oak shelves, and custom hand-woven rugs.': {
    ko: '오모테산도 카사 로에베 내부에 연출된 조형 도자기 아트와 오크 원목 선반.',
    en: 'Jonathan Anderson curated Casa Loewe interior featuring ceramic art, oak shelves, and custom hand-woven rugs.',
    ja: 'カサ・ロエベ表参道内部のセラミックアートとオーク材什器の空間。',
    fr: 'Intérieur de Casa Loewe présentant de l\'art céramique, des étagères en chêne et des tapis tissés main.',
  },
  'Fifth Avenue neo-renaissance mansion storefront with gold panther sculpture accents.': {
    ko: '5번가 까르띠에 랜드마크 맨션 파사드와 골드 팬더 조형물 연출.',
    en: 'Fifth Avenue neo-renaissance mansion storefront with gold panther sculpture accents.',
    ja: '5番街カルティエ・マンション外観の金色のパンサー彫刻。',
    fr: 'Façade de manoir néo-renaissance de la Cinquième Avenue avec des sculptures de panthères dorées.',
  },
  'Pastel yellow damask silk window nook with brass framing in the Milan fashion quadrant.': {
    ko: '밀라노 미우미우 윈도우의 패스텔 옐로우 실크 다마스크 쇼케이스.',
    en: 'Pastel yellow damask silk window nook with brass framing in the Milan fashion quadrant.',
    ja: 'ミラノ・ミウミウのパステルイエローの絹ダマスク布地ウィンドウ。',
    fr: 'Vitrine en soie damassée jaune pastel avec cadre en laiton dans le quartier de la mode à Milan.',
  },
  'Ginza Maison Hermès paper origami installation window with golden sunlight projections.': {
    ko: '긴자 메종 에르메스 윈도우의 입체 종이 오리가미 조형물과 골드 햇살 투사 연출.',
    en: 'Ginza Maison Hermès paper origami installation window with golden sunlight projections.',
    ja: '銀座メゾンエルメスのウィンドウに飾られた和紙折り紙インスタレーションと黄金の光。',
    fr: 'Vitrine de Maison Hermès à Ginza avec installation d\'origami en papier et projections dorées.',
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
  'Sculptural marble podiums with brass mirror panels.': {
    ko: '조각 같은 마블 포디움과 황동 미러 패널이 조화를 이루는 프리미엄 쇼룸.',
    en: 'Sculptural marble podiums with brass mirror panels.',
    ja: '彫刻的な大理石ポディウムと真鍮ミラーパネルで構成された空間。',
    fr: 'Piédestaux en marbre sculpturaux avec des panneaux miroir en laiton.',
  },
  'Custom footwear archway constructed from 500 cast white sneaker molds with marble countertops.': {
    ko: '뉴욕 키스(Kith) 매장에 설치된 500개의 스니커즈 백색 석고 몰드 아치 및 마블 전시대.',
    en: 'Custom footwear archway constructed from 500 cast white sneaker molds with marble countertops.',
    ja: 'ニューヨークKith店舗内の500個のスニーカー金型で作られた彫刻アーチ。',
    fr: 'Arche de chaussures sur mesure construite à partir de 500 moules de baskets blanches en plâtre.',
  },
  'Sneaker mold archway retail layout in Williamsburg.': {
    ko: '윌리엄스버그 매장의 스니커즈 캐스팅 몰드 아치 입체 디스플레이.',
    en: 'Sneaker mold archway retail layout in Williamsburg.',
    ja: 'ウィリアムズバーグの500個のスニーカー金型アーチディスプレイ。',
    fr: 'Présentation commerciale d\'arche en moule de basket à Williamsburg.',
  },
};

export function translateDescription(desc: string, lang: Language): string {
  if (DESCRIPTION_MAP[desc] && DESCRIPTION_MAP[desc][lang]) {
    return DESCRIPTION_MAP[desc][lang];
  }
  return desc;
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
