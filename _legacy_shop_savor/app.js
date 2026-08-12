/* ==========================================
   Shop&Savor - Global K-Shopping & Gourmet Route Engine
   JavaScript Complete Multilingual i18n & Dynamic Route Controller
   ========================================== */

// 1. Master Configuration & Comprehensive Place Database Repository
const CONFIG = {
  currencies: {
    USD: { symbol: '$', rate: 0.00075, label: 'USD ($)' },
    KRW: { symbol: '₩', rate: 1.0, label: 'KRW (₩)' },
    EUR: { symbol: '€', rate: 0.00069, label: 'EUR (€)' },
    JPY: { symbol: '¥', rate: 0.11, label: 'JPY (¥)' },
    CNY: { symbol: '¥', rate: 0.0054, label: 'CNY (¥)' }
  },
  currentCurrency: 'USD',
  currentLang: 'en',

  placePool: {
    Seongsu: [
      {
        id: "seongsu_street_1",
        name: "Ader Error Seongsu Space",
        category: "shopping",
        tags: ["Streetwear", "Hipster", "Concept"],
        catLabel: {
          en: "Hip Streetwear Flagship",
          ko: "힙한 스트릿 패션 플래그십",
          es: "Tienda Insignia Streetwear",
          "zh-CN": "潮牌 Streetwear 旗舰店",
          "zh-TW": "潮牌 Streetwear 旗艦店",
          ja: "ヒップ ストリートウェア フラグシップ",
          fr: "Flagship Streetwear Tendance",
          de: "Hip Streetwear Flagship-Store"
        },
        lat: 37.5452,
        lng: 127.0543,
        baseCostKRW: 140000,
        baseStayMins: 60,
        image: "assets/images/streetwear.jpg",
        desc: {
          en: "Architectural concept store & high-end unisex streetwear fashion space in Seongsu.",
          ko: "성수동 중심에 위치한 독창적인 건축 콘셉트 스토어 및 하이엔드 유니섹스 스트릿 브랜드.",
          es: "Tienda de concepto arquitectónico y ropa de calle unisex de alta gama en Seongsu.",
          "zh-CN": "位于圣水洞的建筑概念店与高端中性街头潮牌空间。",
          "zh-TW": "位於聖水洞的建築概念店與高端中性街頭潮牌空間。",
          ja: "聖水洞に位置する建築コンセプトストア＆ハイエンドユニセックスストリートファッション。",
          fr: "Espace streetwear unisexe haut de gamme et concept store architectural à Seongsu.",
          de: "Architektonischer Concept Store & High-End Unisex Streetwear in Seongsu."
        },
        menuItem: {
          en: "Seongsu Limited Edition Oversized Hoodie",
          ko: "성수 한정판 오버사이즈 후디 & 캡",
          es: "Sudadera Oversize Edición Limitada Seongsu",
          "zh-CN": "圣水限定版 Oversized 连帽衫",
          "zh-TW": "聖水限定版 Oversized 連帽衫",
          ja: "聖水限定オーバーサイズフーディー",
          fr: "Sweat à Capuche Oversize Édition Limitée",
          de: "Seongsu Limited Edition Oversized Hoodie"
        },
        waitingTip: {
          en: "Peak time 2pm-4pm (15 min wait). Fast-pass ready.",
          ko: "피크 타임 오후 2~4시 (약 15분 대기). 텍스프리 패스 가능.",
          es: "Hora punta 2pm-4pm (15 min de espera). Fast-pass listo.",
          "zh-CN": "高峰期 2pm-4pm（约排队15分钟）。可使用免税 Fast-pass。",
          "zh-TW": "高峰期 2pm-4pm（約排隊15分鐘）。可使用免稅 Fast-pass。",
          ja: "ピーク時14:00~16:00(約15分待ち)。免税パス対応。",
          fr: "Heure de pointe 14h-16h (15 min d'attente). Fast-pass détaxe.",
          de: "Stoßzeit 14:00-16:00 Uhr (15 Min. Wartezeit). Fast-Pass bereit."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://adererror.com",
        mapUrl: "https://maps.google.com/?q=Ader+Error+Seongsu",
        address: "82 Seongsu-i-ro, Seongdong-gu, Seoul",
        businessHours: "13:00 PM - 21:00 PM (Daily)",
        phone: "+82 2-2135-7005",
        rating: "★ 4.8 / 5.0 (2,450 Reviews)",
        menuItems: [
          { name: "Seongsu Space Limited Hoodie", desc: "Heavyweight cotton oversized hoodie", priceKRW: 189000 },
          { name: "Signature Metal Badge Cap", desc: "6-Panel cap with signature blue accent", priceKRW: 69000 },
          { name: "Deconstructed Denim Jacket", desc: "Raw edge denim jacket with custom hardware", priceKRW: 289000 },
          { name: "Leather Logo Card Holder", desc: "Italian tanned leather wallet with lanyard", priceKRW: 98000 }
        ]
      },
      {
        id: "seongsu_street_2",
        name: "Matin Kim Seongsu Store",
        category: "shopping",
        tags: ["Streetwear", "Minimal", "Trend"],
        catLabel: {
          en: "K-Fashion Minimal Boutique",
          ko: "K-패션 미니멀 부티크",
          es: "Boutique Minimalista K-Fashion",
          "zh-CN": "K-Fashion 极简精品店",
          "zh-TW": "K-Fashion 極簡精品店",
          ja: "K-ファッション ミニマルブティック",
          fr: "Boutique Minimaliste K-Fashion",
          de: "K-Fashion Minimal Boutique"
        },
        lat: 37.5435,
        lng: 127.0558,
        baseCostKRW: 95000,
        baseStayMins: 45,
        image: "assets/images/streetwear.jpg",
        desc: {
          en: "Trendy everyday streetwear & signature metal-accent accessories.",
          ko: "트렌디한 데일리 스트릿 패션과 시그니처 금속 장식 지갑 및 잡화.",
          es: "Moda urbana diaria y accesorios con acentos metálicos emblemáticos.",
          "zh-CN": "时尚日常街头服饰与标志性金属装饰配饰。",
          "zh-TW": "時尚日常街頭服飾與標誌性金屬裝飾配飾。",
          ja: "トレンドの日常ストリートウェア＆シグネチャー金属アクセサリ。",
          fr: "Mode streetwear quotidienne et accessoires métalliques emblématiques.",
          de: "Trendige Everyday-Streetwear & charakteristische Metall-Accessoires."
        },
        menuItem: {
          en: "Signature Logo Card Wallet & Crop Tee",
          ko: "시그니처 로고 지갑 & 크롭 티셔츠",
          es: "Cartera con Logotipo y Camiseta Crop",
          "zh-CN": "标志性金属卡包与短款T恤",
          "zh-TW": "標誌性金屬卡包與短款T恤",
          ja: "シグネチャーロゴカード財布＆クロップTシャツ",
          fr: "Porte-cartes Logo et T-shirt Court",
          de: "Signature Logo Karte Etui & Crop-Shirt"
        },
        waitingTip: {
          en: "Fast checkout line with instant Tax Refund.",
          ko: "빠른 결제 라인 및 현장 즉시 텍스프리 환급 가능.",
          es: "Línea de pago rápida con reembolso inmediato de impuestos.",
          "zh-CN": "快速结账通道，支持即时现场退税。",
          "zh-TW": "快速結帳通道，支援即時現場退稅。",
          ja: "スムーズな会計レジ、即時免税対応。",
          fr: "Caisse rapide avec détaxe immédiate sur place.",
          de: "Schnelle Kasse mit sofortiger Rückerstattung."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://matinkim.com",
        mapUrl: "https://maps.google.com/?q=Matin+Kim+Seongsu",
        address: "24 Yeonmujang-gil, Seongdong-gu, Seoul",
        businessHours: "11:30 AM - 20:00 PM (Daily)",
        phone: "+82 2-6953-9981",
        rating: "★ 4.7 / 5.0 (1,820 Reviews)",
        menuItems: [
          { name: "Accordian Metal Logo Wallet", desc: "Iconic metal plaque bi-fold card holder", priceKRW: 88000 },
          { name: "Cropped Ribbed Cotton Tee", desc: "Soft touch fitted tee with minimal logo", priceKRW: 54000 },
          { name: "Nylon Utility Shoulder Bag", desc: "Lightweight multi-pocket handbag", priceKRW: 128000 }
        ]
      },
      {
        id: "seongsu_beauty_1",
        name: "Amore Seongsu Beauty Lounge",
        category: "shopping",
        tags: ["K-Beauty", "Skincare", "Cosmetics"],
        catLabel: {
          en: "K-Beauty Flagship Lab",
          ko: "K-뷰티 플래그십 뷰티 랩",
          es: "Laboratorio Insignia K-Beauty",
          "zh-CN": "K-Beauty 旗舰美妆体验馆",
          "zh-TW": "K-Beauty 旗艦美妝體驗館",
          ja: "K-ビューティー フラグシップ ラボ",
          fr: "Laboratoire K-Beauty Flagship",
          de: "K-Beauty Flagship Lab"
        },
        lat: 37.5460,
        lng: 127.0565,
        baseCostKRW: 110000,
        baseStayMins: 50,
        image: "assets/images/kbeauty.jpg",
        desc: {
          en: "Custom foundation mixing lab & 1,500+ K-beauty skincare test bar.",
          ko: "나만의 맞춤형 파운데이션 제조 랩 및 1,500여 개 K-뷰티 스킨케어 체험존.",
          es: "Laboratorio de base personalizada y zona de prueba de 1,500+ productos.",
          "zh-CN": "定制粉底液调制实验室与1,500+款K-Beauty护肤品体验区。",
          "zh-TW": "客製化粉底液調製實驗室與1,500+款K-Beauty護膚品體驗區。",
          ja: "オーダーメイドファンデーション製造＆1,500種以上のK-ビューティー体験ゾーン。",
          fr: "Laboratoire de fond de teint sur mesure et zone de test de 1500+ soins.",
          de: "Individuelles Foundation-Labor & Testbereich für 1.500+ K-Beauty-Produkte."
        },
        menuItem: {
          en: "Custom Lip & Cushion Foundation Kit",
          ko: "커스텀 립 & 쿠션 파운데이션 키트",
          es: "Kit de Base de Cojín y Labial Personalizado",
          "zh-CN": "定制唇彩与气垫粉底套装",
          "zh-TW": "客製化唇彩與氣墊粉底套裝",
          ja: "カスタムリップ＆クッションファンデキット",
          fr: "Kit de Fond de Teint et Rouge à Lèvres Sur Mesure",
          de: "Custom Lip & Cushion Foundation Set"
        },
        waitingTip: {
          en: "Immediate Tax Refund counter on 2nd floor.",
          ko: "2층 전용 카운터에서 바로 텍스프리 환급 받으실 수 있습니다.",
          es: "Mostrador de reembolso de impuestos inmediato en el 2º piso.",
          "zh-CN": "2楼设有专门即时退税柜台。",
          "zh-TW": "2樓設有專門即時退稅櫃檯。",
          ja: "2階の専用カウンターにて即時免税手続可能。",
          fr: "Comptoir de détaxe immédiate au 2ème étage.",
          de: "Sofortige Tax-Free-Rückerstattung im 2. Stock."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://www.amoreseongsu.com",
        mapUrl: "https://maps.google.com/?q=Amore+Seongsu",
        address: "37-1 Achasan-ro 11-gil, Seongdong-gu, Seoul",
        businessHours: "10:30 AM - 20:30 PM (Closed Mondays)",
        phone: "+82 2-469-8600",
        rating: "★ 4.9 / 5.0 (3,100 Reviews)",
        menuItems: [
          { name: "Bespoke Silky Cushion Foundation", desc: "Personalized skin shade mixing experience", priceKRW: 45000 },
          { name: "Customized Tinted Lip Bar", desc: "Choose your exact lip tint formulation", priceKRW: 28000 },
          { name: "Botanical Hydrating Serum 50ml", desc: "Deep moisturizing green tea serum", priceKRW: 68000 }
        ]
      },
      {
        id: "seongsu_food_1",
        name: "Somunnan Seongsu Gamjatang",
        category: "food",
        tags: ["Hansik", "Traditional", "Soup"],
        catLabel: {
          en: "Traditional Hansik Dining",
          ko: "전통 한식 감자탕 전문점",
          es: "Restaurante Tradicional Coreano",
          "zh-CN": "传统韩餐脊骨汤名店",
          "zh-TW": "傳統韓餐脊骨湯名店",
          ja: "伝統韓国料理 ガムジャタン専門店",
          fr: "Restaurant Traditionnel Coréen",
          de: "Traditionelles Koreanisches Restaurant"
        },
        lat: 37.5439,
        lng: 127.0571,
        baseCostKRW: 35000,
        baseStayMins: 50,
        image: "assets/images/hansik.jpg",
        desc: {
          en: "Iconic 40-year local pork bone soup & full bansang side-dish set.",
          ko: "40년 전통의 깊고 깔끔한 돼지 뼈해장국 및 정갈한 밑반찬 차림.",
          es: "Iconica sopa de costilla de cerdo de 40 años y platos tradicionales acompañantes.",
          "zh-CN": "40年传统清爽浓郁的猪脊骨汤与精美韩式小菜。",
          "zh-TW": "40年傳統清爽濃郁的豬脊骨湯與精美韓式小菜。",
          ja: "40年の伝統を誇る深みのある豚骨スープと端正な小鉢セット。",
          fr: "Soupe de porc traditionnelle de 40 ans et accompagnements coréens.",
          de: "Legendäre 40 Jahre alte Schweinefleischsuppe mit koreanischen Beilagen."
        },
        menuItem: {
          en: "Clean Pork Rib Soup Set & Sujebi",
          ko: "소문난 뼈해장국 정식 & 손수제비",
          es: "Set de Sopa de Costilla de Cerdo y Sujebi",
          "zh-CN": "招牌猪脊骨汤定食与手撕面片",
          "zh-TW": "招牌豬脊骨湯定食與手撕麵片",
          ja: "名物 豚骨スープ定食＆手ちぎりス제비",
          fr: "Set de Soupe de Porc et Sujebi Artisanaux",
          de: "Schweinefleischsuppen-Set & Sujebi"
        },
        waitingTip: {
          en: "Average wait 15 mins. English picture menu provided.",
          ko: "평균 웨이팅 약 15분. 영어 사진 메뉴판 제공.",
          es: "Espera promedio de 15 min. Menú con fotos en inglés disponible.",
          "zh-CN": "平均排队约15分钟。提供带图片的英文菜单。",
          "zh-TW": "平均排隊約15分鐘。提供帶圖片的英文菜單。",
          ja: "平均待ち時間約15分。英語の写真付きメニューあり。",
          fr: "Attente moyenne 15 min. Menu en images en anglais disponible.",
          de: "Durchschnittlich 15 Min. Wartezeit. Englisches Bildermenü vorhanden."
        },
        englishMenu: true,
        taxFree: false,
        websiteUrl: "https://search.naver.com/search.naver?query=소문난성수감자탕",
        mapUrl: "https://maps.google.com/?q=Somunnan+Seongsu+Gamjatang",
        address: "38 Yeonmujang-gil, Seongdong-gu, Seoul",
        businessHours: "00:00 AM - 24:00 PM (Open 24 Hours)",
        phone: "+82 2-465-6580",
        rating: "★ 4.6 / 5.0 (4,800 Reviews)",
        menuItems: [
          { name: "Pork Bone Soup Individual Bowl", desc: "Tender pork ribs in aromatic savory perilla broth", priceKRW: 11000 },
          { name: "Hand-Pulled Sujebi Dough Add-on", desc: "Fresh handmade dough dropped live into soup", priceKRW: 3000 },
          { name: "K-Style Stir-fried Fried Rice", desc: "Rice crisped with gim seaweed in hot iron pot", priceKRW: 3000 }
        ]
      },
      {
        id: "seongsu_cafe_1",
        name: "Nudake Seongsu Dessert House",
        category: "food",
        tags: ["Cafe", "Dessert", "Trendy"],
        catLabel: {
          en: "Artisan Bakery & Cafe",
          ko: "감성 아티잔 베이커리 카페",
          es: "Cafetería y Panadería de Diseño",
          "zh-CN": "艺术概念甜品面包咖啡馆",
          "zh-TW": "藝術概念甜品麵包咖啡館",
          ja: "感性 アーティザンベーカリーカフェ",
          fr: "Boutique Pâtisserie & Café Designer",
          de: "Artisan Bäckerei & Design-Café"
        },
        lat: 37.5448,
        lng: 127.0588,
        baseCostKRW: 25000,
        baseStayMins: 45,
        image: "assets/images/cafe.jpg",
        desc: {
          en: "Avant-garde pastry shop famous for signature matcha black croissants.",
          ko: "시그니처 말차 먹물 크루아상으로 유명한 아방가르드 감성 디저트 하우스.",
          es: "Pastelería vanguardista famosa por sus croissants de matcha y tinta de calamar.",
          "zh-CN": "以招牌抹茶墨鱼汁可颂闻名的前卫艺术甜品屋。",
          "zh-TW": "以招牌抹茶墨魚汁可頌聞名的前衛藝術甜品屋。",
          ja: "シグネチャーの抹茶イカスミクロワッサンで有名なアヴァンギャルドデザートハウス。",
          fr: "Pâtisserie avant-gardiste célèbre pour ses croissants matcha au noir de seiche.",
          de: "Avantgardistische Konditorei bekannt für Signature-Matcha-Croissants."
        },
        menuItem: {
          en: "Peak Matcha Croissant Cake & Latte",
          ko: "피크 말차 크림 크루아상 케이크 & 시그니처 라떼",
          es: "Pastel Croissant Peak Matcha y Latte Signatura",
          "zh-CN": "Peak 抹茶流心可颂蛋糕与特调拿铁",
          "zh-TW": "Peak 抹茶流心可頌蛋糕與特調拿鐵",
          ja: "PEAK 抹茶クリームクロワッサンケーキ＆ラテ",
          fr: "Gâteau Croissant Peak Matcha & Latte Signature",
          de: "Peak Matcha Croissant Kuchen & Latte"
        },
        waitingTip: {
          en: "Spacious seating. Takeout line moves fast.",
          ko: "넓은 내부 좌석 보유. 테이크아웃 전용 줄은 매우 빠름.",
          es: "Asientos amplios. La fila de llevar se mueve rápido.",
          "zh-CN": "店内座位宽敞。外带通道流动迅速。",
          "zh-TW": "店內座位寬敞。外帶通道流動迅速。",
          ja: "広々とした店内席。テイクアウト列は非常にスムーズ。",
          fr: "Places assises spacieuses. File à emporter très rapide.",
          de: "Geräumige Sitzplätze. Takeout-Schlange bewegt sich schnell."
        },
        englishMenu: true,
        taxFree: false,
        websiteUrl: "https://nudake.com",
        mapUrl: "https://maps.google.com/?q=Nudake+Seongsu",
        address: "26 Seongsui-ro 7-gil, Seongdong-gu, Seoul",
        businessHours: "11:00 AM - 22:00 PM (Daily)",
        phone: "+82 70-4128-2125",
        rating: "★ 4.6 / 5.0 (3,400 Reviews)",
        menuItems: [
          { name: "Peak Matcha Cream Croissant Cake", desc: "Black squid-ink pastry filled with matcha cream", priceKRW: 39000 },
          { name: "Micro Croissant Box (4pcs)", desc: "World famous miniature edible mini croissants", priceKRW: 14000 },
          { name: "Nu Flat White Oat Latte", desc: "Dark roasted espresso with creamy oat milk", priceKRW: 8500 }
        ]
      }
    ],

    Hongdae: [
      {
        id: "hongdae_street_1",
        name: "Musinsa Standard Hongdae",
        category: "shopping",
        tags: ["Streetwear", "Minimal", "Fashion"],
        catLabel: {
          en: "K-Fashion Basics & Street",
          ko: "K-패션 베이직 & 스트릿 패션",
          es: "Ropa Básica y Urbana K-Fashion",
          "zh-CN": "K-Fashion 基础款与街头时尚",
          "zh-TW": "K-Fashion 基礎款與街頭時尚",
          ja: "K-ファッション ベーシック＆ストリート",
          fr: "Mode Coréenne Basics & Streetwear",
          de: "K-Fashion Basics & Streetwear"
        },
        lat: 37.5555,
        lng: 126.9220,
        baseCostKRW: 75000,
        baseStayMins: 50,
        image: "assets/images/streetwear.jpg",
        desc: {
          en: "Korea's #1 modern minimal streetwear & apparel mega store.",
          ko: "대한민국 1위 모던 미니멀 스트릿 패션 메가 플래그십 스토어.",
          es: "La mega tienda nº 1 de ropa urbana moderna y minimalista de Corea.",
          "zh-CN": "韩国排名第一的现代极简街头服饰大型旗舰店。",
          "zh-TW": "韓國排名第一的現代極簡街頭服飾大型旗艦店。",
          ja: "韓国No.1のモダンミニマルストリートファッションメガストア。",
          fr: "Le n°1 des grands magasins de streetwear moderne et minimaliste en Corée.",
          de: "Koreas Nr. 1 Mega-Store für moderne minimalistische Streetwear."
        },
        menuItem: {
          en: "Oversized Blazer & Wide Denim",
          ko: "오버사이즈 블레이저 & 와이드 데님 팬츠",
          es: "Blazer Oversize y Vaqueros Anchos",
          "zh-CN": "Oversized 西装外套与宽腿牛仔裤",
          "zh-TW": "Oversized 西裝外套與寬腿牛仔褲",
          ja: "オーバーサイズブレザー＆ワイドデニムパンツ",
          fr: "Blazer Oversize et Jean Large",
          de: "Oversized Blazer & Wide-Jeans"
        },
        waitingTip: {
          en: "No wait line. Tax Refund self-kiosk available.",
          ko: "대기 시간 없음. 매장 내 텍스프리 키오스크 완비.",
          es: "Sin fila de espera. Kiosco de reembolso de impuestos disponible.",
          "zh-CN": "无需排队。店门处备有自助退税机。",
          "zh-TW": "無需排隊。店門處備有自助退稅機。",
          ja: "待ち時間なし。店内にセルフレジ免税キオスクあり。",
          fr: "Pas d'attente. Borne de détaxe automatique disponible.",
          de: "Keine Wartezeit. Selbstbedienungs-Tax-Free-Kiosk verfügbar."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://www.musinsa.com",
        mapUrl: "https://maps.google.com/?q=Musinsa+Standard+Hongdae",
        address: "144 Yanghwa-ro, Mapo-gu, Seoul",
        businessHours: "11:00 AM - 21:00 PM (Daily)",
        phone: "+82 2-332-9900",
        rating: "★ 4.8 / 5.0 (4,200 Reviews)",
        menuItems: [
          { name: "Oversized Relaxed Fit Blazer", desc: "Wrinkle-resistant tailored casual jacket", priceKRW: 79900 },
          { name: "Wide Fit Raw Denim Pants", desc: "Heavy cotton straight wide indigo jeans", priceKRW: 49900 },
          { name: "Heavyweight 20s T-Shirt (3-Pack)", desc: "Essential daily crewneck tees", priceKRW: 39900 }
        ]
      },
      {
        id: "hongdae_food_1",
        name: "Yeonnam Pork Belly BBQ",
        category: "food",
        tags: ["K-BBQ", "Pork", "Hansik"],
        catLabel: {
          en: "Gourmet K-BBQ",
          ko: "연남동 제주 흑돼지 삼겹살 전문점",
          es: "Barbacoa Coreana Gourmet",
          "zh-CN": "延南洞黑猪肉烤肉名店",
          "zh-TW": "延南洞黑豬肉烤肉名店",
          ja: "延南洞 済州黒豚サムギョプサル専門店",
          fr: "BBQ Coréen Gourmet",
          de: "Gourmet K-BBQ Restaurant"
        },
        lat: 37.5582,
        lng: 126.9248,
        baseCostKRW: 48000,
        baseStayMins: 60,
        image: "assets/images/hansik.jpg",
        desc: {
          en: "Aged Jeju black pork belly served with grilled kimchi & soybean stew.",
          ko: "숙성 제주 흑돼지 삼겹살과 구운 구이 김치, 차돌 된장찌개 세트.",
          es: "Panceta de cerdo negro de Jeju madurada con kimchi a la parrilla.",
          "zh-CN": "熟成济州黑猪三层肉配合烤泡菜与牛肉大酱汤。",
          "zh-TW": "熟成濟州黑豬三層肉配合烤泡菜與牛肉大醬湯。",
          ja: "熟成済州黒豚サムギョプサルと焼きキムチ、味噌チゲセット。",
          fr: "Poitrine de porc noir de Jeju affinée avec kimchi grillé.",
          de: "Gereifter Jeju-Schwarzschweinebauch mit gegrilltem Kimchi."
        },
        menuItem: {
          en: "Samgyeopsal & Cold Noodles Set",
          ko: "제주 흑돼지 삼겹살 & 물냉면 세트",
          es: "Set de Samgyeopsal y Fideos Fríos",
          "zh-CN": "济州黑猪三层肉与水冷面套餐",
          "zh-TW": "濟州黑豬三層肉與水冷麵套裝",
          ja: "済州黒豚サムギョプサル＆水冷麺セット",
          fr: "Set de Samgyeopsal et Nouilles Froides",
          de: "Samgyeopsal & Kalte Nudeln Set"
        },
        waitingTip: {
          en: "Staff grills meat for you. English guide available.",
          ko: "직원이 고기를 직접 맛있게 구워드립니다. 영어 안내 가능.",
          es: "El personal asará la carne por ti. Guía en inglés disponible.",
          "zh-CN": "店员会全程代烤。提供英文说明指南。",
          "zh-TW": "店員會全程代烤。提供英文說明指南。",
          ja: "スタッフが肉を丁寧に焼いてくれます。英語の案内あり。",
          fr: "Le personnel grille la viande pour vous. Guide en anglais disponible.",
          de: "Personal grillt das Fleisch für Sie. Englische Anleitung verfügbar."
        },
        englishMenu: true,
        taxFree: false,
        websiteUrl: "https://search.naver.com/search.naver?query=연남동+삼겹살",
        mapUrl: "https://maps.google.com/?q=Yeonnam+Pork+Belly+BBQ",
        address: "32 Donggyo-ro 38-gil, Mapo-gu, Seoul",
        businessHours: "12:00 PM - 23:00 PM (Daily)",
        phone: "+82 2-336-1234",
        rating: "★ 4.8 / 5.0 (2,100 Reviews)",
        menuItems: [
          { name: "Jeju Aged Thick Black Pork Belly", desc: "Juicy marble pork grilled over charcoal", priceKRW: 18000 },
          { name: "Aged Kimchi Pork Stew", desc: "Rich spicy stew with aged kimchi", priceKRW: 8000 },
          { name: "Chilled Spicy Noodle", desc: "Refreshing cold spicy noodle bowl", priceKRW: 7000 }
        ]
      }
    ],

    Myeongdong: [
      {
        id: "myeongdong_beauty_1",
        name: "Olive Young Myeongdong Town Flagship",
        category: "shopping",
        tags: ["K-Beauty", "Skincare", "Cosmetics"],
        catLabel: {
          en: "Mega K-Beauty Center",
          ko: "메가 K-뷰티 플래그십 센터",
          es: "Centro Mega K-Beauty",
          "zh-CN": "Mega K-Beauty 旗舰购物中心",
          "zh-TW": "Mega K-Beauty 旗艦購物中心",
          ja: "メガ K-ビューティー フラグシップ センター",
          fr: "Grand Centre K-Beauty Flagship",
          de: "Mega K-Beauty Center"
        },
        lat: 37.5642,
        lng: 126.9850,
        baseCostKRW: 220000,
        baseStayMins: 70,
        image: "assets/images/kbeauty.jpg",
        desc: {
          en: "2-Story global beauty center with instant tax-free checkout.",
          ko: "2층 규모의 글로벌 K-뷰티 전용 매장 및 현장 즉시 텍스프리 서비스.",
          es: "Centro de belleza de 2 plantas con pago libre de impuestos inmediato.",
          "zh-CN": "双层全球K-Beauty美妆中心，支持现场即时退税。",
          "zh-TW": "雙層全球K-Beauty美妝中心，支援現場即時退稅。",
          ja: "2階建てのグローバルK-ビューティーセンター、即時免税レジ完備。",
          fr: "Centre de beauté de 2 étages avec détaxe immédiate à la caisse.",
          de: "2-stöckiges K-Beauty-Center mit sofortiger Tax-Free-Kasse."
        },
        menuItem: {
          en: "Sunscreen, Rejuran Serums & Sheet Masks",
          ko: "선크림 & 리쥬란 세럼 & 마스크팩 키트",
          es: "Protector Solar, Serums y Mascarillas",
          "zh-CN": "防晒爽、丽珠兰精华与面膜大礼包",
          "zh-TW": "防曬爽、麗珠蘭精華與面膜大禮包",
          ja: "日焼け止め＆リジュラン美容液＆パックセット",
          fr: "Écran Solaire, Sérums et Masques",
          de: "Sonnenschutz, Rejuran Seren & Gesichtsmasken"
        },
        waitingTip: {
          en: "Instant VAT discount at payment counter with passport.",
          ko: "여권 지참 시 결제 카운터에서 부가세 10% 즉시 차감 결제.",
          es: "Descuento inmediato de IVA en caja mostrando tu pasaporte.",
          "zh-CN": "结账时出示护照即可现场直接扣除VAT增值税。",
          "zh-TW": "結帳時出示護照即可現場直接扣除VAT增值稅。",
          ja: "パスポート提示で会計時に消費税10%即時割引。",
          fr: "Réduction immédiate de la TVA à la caisse sur présentation du passeport.",
          de: "Sofortiger MwSt.-Rabatt an der Kasse gegen Vorlage des Reisepasses."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://global.oliveyoung.com",
        mapUrl: "https://maps.google.com/?q=Olive+Young+Myeongdong",
        address: "53 Myeongdong-gil, Jung-gu, Seoul",
        businessHours: "10:00 AM - 22:30 PM (Daily)",
        phone: "+82 2-736-5290",
        rating: "★ 4.9 / 5.0 (6,500 Reviews)",
        menuItems: [
          { name: "Round Lab Birch Juice Sunscreen", desc: "Hydrating sun cream 1+1 promo pack", priceKRW: 25000 },
          { name: "Rejuran Healer Turnover Ampoule", desc: "Cellular rejuvenation anti-aging serum", priceKRW: 58000 },
          { name: "Torriden Hyaluronic Mask (10pcs)", desc: "Deep soothing moisture sheet masks", priceKRW: 20000 }
        ]
      },
      {
        id: "myeongdong_food_1",
        name: "Myeongdong Kyoja (Michelin Guide)",
        category: "food",
        tags: ["Michelin", "Hansik", "Noodle"],
        catLabel: {
          en: "Michelin Gourmet Noodle",
          ko: "미슐랭 가이드 칼국수 명가",
          es: "Fideos Michelin Gourmet",
          "zh-CN": "米其林指南韩式刀削面",
          "zh-TW": "米其林指南韓式刀削麵",
          ja: "ミシュランガイド カルグクス老舗",
          fr: "Nouilles Gourmandes Michelin",
          de: "Michelin Gourmet Nudeln"
        },
        lat: 37.5625,
        lng: 126.9855,
        baseCostKRW: 32000,
        baseStayMins: 40,
        image: "assets/images/hansik.jpg",
        desc: {
          en: "Michelin Bib Gourmand chopped noodle & steamed dumpling house.",
          ko: "미슐랭 빕구르망 연속 선정 닭육수 명동 칼국수 및 수제 만두.",
          es: "Restaurante galardonado con Michelin Bib Gourmand de fideos cortados a mano.",
          "zh-CN": "连续多年荣获米其林必比登推荐的鸡汤刀削面与手工蒸饺。",
          "zh-TW": "連續多年榮獲米其林必比登推薦的雞湯刀削麵與手工蒸餃。",
          ja: "ミシュラン・ビブグルマン選出の濃厚鶏スープカルグクスと蒸し餃子。",
          fr: "Pâtisserie et nouilles coupées à la main recommandées par le Guide Michelin.",
          de: "Vom Guide Michelin empfohlenes Restaurant für hausgemachte Nudeln."
        },
        menuItem: {
          en: "Kalguksu Noodle & Handmade Mandu",
          ko: "명동 칼국수 & 수제 만두",
          es: "Fideos Kalguksu y Mandu Hecho a Mano",
          "zh-CN": "明洞刀削面与手工鲜肉蒸饺",
          "zh-TW": "明洞刀削麵與手工鮮肉蒸餃",
          ja: "明洞カルグクス＆手作りマンドゥ",
          fr: "Nouilles Kalguksu et Ravisolis Mandu Artisanaux",
          de: "Kalguksu Nudeln & Hausgemachte Mandu"
        },
        waitingTip: {
          en: "Queue moves extremely fast (10 min max wait).",
          ko: "줄이 매우 회전율이 빨라 회전 대기 약 10분 이내 입장 가능.",
          es: "La fila se mueve extremadamente rápido (máximo 10 min de espera).",
          "zh-CN": "翻台极其迅速，排队通常在10分钟以内。",
          "zh-TW": "翻台極其迅速，排隊通常在10分鐘以內。",
          ja: "回転率が非常に高く、待ち時間は約10分以内。",
          fr: "File très fluide (maximum 10 minutes d'attente).",
          de: "Schlange bewegt sich extrem schnell (max. 10 Min. Warten)."
        },
        englishMenu: true,
        taxFree: false,
        websiteUrl: "http://www.mdkj.co.kr",
        mapUrl: "https://maps.google.com/?q=Myeongdong+Kyoja",
        address: "29 Myeongdong 10-gil, Jung-gu, Seoul",
        businessHours: "10:30 AM - 21:00 PM (Daily)",
        phone: "+82 2-776-5348",
        rating: "★ 4.8 / 5.0 (8,200 Reviews)",
        menuItems: [
          { name: "Handmade Kalguksu Noodle", desc: "Rich chicken broth noodle with dumplings", priceKRW: 11000 },
          { name: "Steamed Pork Mandu Dumplings", desc: "Thin skin dumplings packed with pork", priceKRW: 12000 },
          { name: "Bibim-Guksu Cold Spicy Noodle", desc: "Spicy noodles served with garlic kimchi", priceKRW: 11000 }
        ]
      }
    ],

    Gangnam: [
      {
        id: "gangnam_luxury_1",
        name: "Haus Dosan (Gentle Monster)",
        category: "shopping",
        tags: ["Luxury", "Eyewear", "Concept"],
        catLabel: {
          en: "Luxury Eyewear & Art",
          ko: "럭셔리 아이웨어 & 아티스틱 플래그십",
          es: "Gafas de Lujo y Galería de Arte",
          "zh-CN": "奢华眼镜与艺术概念馆",
          "zh-TW": "奢華眼鏡與藝術概念館",
          ja: "ラグジュアリーアイウェア＆アート空間",
          fr: "Lunettes de Luxe et Espace Artistique",
          de: "Luxus Eyewear & Art Concept Store"
        },
        lat: 37.5255,
        lng: 127.0368,
        baseCostKRW: 320000,
        baseStayMins: 60,
        image: "assets/images/streetwear.jpg",
        desc: {
          en: "Futuristic multi-brand space with kinetic art installations.",
          ko: "미래지향적 동적 아트 로봇 설치물을 갖춘 하이엔드 아이웨어 부티크.",
          es: "Espacio multimarca futurista con instalaciones de arte cinético.",
          "zh-CN": "充满未来感的时尚品牌空间，配有动能艺术装置。",
          "zh-TW": "充滿未來感的時尚品牌空間，配有動能藝術裝置。",
          ja: "近未来的なキネティックアート展示を備えたハイエンドアイウェア空間。",
          fr: "Espace futuriste avec installations d'art cinétique.",
          de: "Futuristischer Multibrand-Store mit kinetischen Kunstinstallationen."
        },
        menuItem: {
          en: "Gentle Monster Sunglasses & Tamburins Perfume",
          ko: "젠틀몬스터 선글라스 & 템버린즈 향수",
          es: "Gafas de Sol Gentle Monster y Perfume Tamburins",
          "zh-CN": "Gentle Monster 墨镜与 Tamburins 香水",
          "zh-TW": "Gentle Monster 墨鏡與 Tamburins 香水",
          ja: "Gentle Monster サングラス＆Tamburins 香水",
          fr: "Lunettes Gentle Monster et Parfum Tamburins",
          de: "Gentle Monster Sonnenbrille & Tamburins Parfüm"
        },
        waitingTip: {
          en: "VIP lounge available for passport holders.",
          ko: "외국인 여권 소지자 전용 VIP 라운지 혜택 제공.",
          es: "Lounge VIP disponible para titulares de pasaporte.",
          "zh-CN": "持外国护照者可享受VIP休息室服务。",
          "zh-TW": "持外國護照者可享受VIP休息室服務。",
          ja: "パスポート提示でVIPラウンジ利用可能。",
          fr: "Lounge VIP disponible pour les détenteurs de passeports étrangers.",
          de: "VIP-Lounge für Passinhaber verfügbar."
        },
        englishMenu: true,
        taxFree: true,
        websiteUrl: "https://www.gentlemonster.com",
        mapUrl: "https://maps.google.com/?q=Haus+Dosan+Gentle+Monster",
        address: "50 Dosan-daero 45-gil, Gangnam-gu, Seoul",
        businessHours: "11:00 AM - 21:00 PM (Daily)",
        phone: "+82 70-4128-2126",
        rating: "★ 4.9 / 5.0 (3,800 Reviews)",
        menuItems: [
          { name: "Heizer 01 Cat-Eye Sunglasses", desc: "Flat frame with 99.9% UV protection", priceKRW: 289000 },
          { name: "Bold Collection Oval Glasses", desc: "Ultra-lightweight titanium frame", priceKRW: 340000 }
        ]
      },
      {
        id: "gangnam_food_1",
        name: "Mingles Fine Dining",
        category: "food",
        tags: ["Michelin", "Hansik", "Luxury"],
        catLabel: {
          en: "2 Michelin Star Fine Dining",
          ko: "미슐랭 2스타 모던 한식 파인다이닝",
          es: "Alta Cocina 2 Estrellas Michelin",
          "zh-CN": "米其林二星现代韩餐精致餐饮",
          "zh-TW": "米其林二星現代韓餐精緻餐飲",
          ja: "ミシュラン2つ星 モダン韓国料理ファインダイニング",
          fr: "Haute Gastronomie 2 Étoiles Michelin",
          de: "2 Michelin-Sterne Fine Dining"
        },
        lat: 37.5240,
        lng: 127.0410,
        baseCostKRW: 210000,
        baseStayMins: 90,
        image: "assets/images/hansik.jpg",
        desc: {
          en: "Contemporary Korean innovative course meal with seasonal herbs.",
          ko: "한국의 전통 장과 제철 발효 재료를 활용한 모던 한식 창작 코스 요리.",
          es: "Menú degustación coreano contemporáneo con hierbas de temporada.",
          "zh-CN": "利用韩国传统酱料与时令食材打造的现代创置韩餐宴。",
          "zh-TW": "利用韓國傳統醬料與時令食材打造的現代創置韓餐宴。",
          ja: "韓国の伝統醤と旬の素材を生かしたモダン創意韓国料理コース。",
          fr: "Cuisine coréenne contemporaine raffinée aux herbes de saison.",
          de: "Moderne koreanische Innovationsküche mit saisonalen Zutaten."
        },
        menuItem: {
          en: "Jang sauce fermented fish & Hanwoo steak",
          ko: "전통 장소스 생선 요리 & 1+ 1++ 횡성 한우 구이",
          es: "Pescado Fermentado con Salsa Jang y Filete Hanwoo",
          "zh-CN": "传统酱汁鲜鱼与1++韩牛牛排",
          "zh-TW": "傳統醬汁鮮魚與1++韓牛牛排",
          ja: "伝統醤ソース鮮魚料理＆韓牛ステ-キ",
          fr: "Poisson Fermenté Sauce Jang & Steack Hanwoo",
          de: "Fermentierter Fisch Sauce Jang & Hanwoo Steak"
        },
        waitingTip: {
          en: "Reservation concierge assistance available.",
          ko: "사전 예약 권장 (Shop&Savor 컨시어지 대행 서비스 제공).",
          es: "Servicio de asistencia de reserva disponible.",
          "zh-CN": "建议提前预约（提供Shop&Savor礼宾协助）。",
          "zh-TW": "建議提前預約（提供Shop&Savor禮賓協助）。",
          ja: "事前予約推奨（Shop&Savorコンシェルジュ代行可能）。",
          fr: "Assistance conciergerie pour réservation disponible.",
          de: "Reservierungsservice über Concierge verfügbar."
        },
        englishMenu: true,
        taxFree: false,
        websiteUrl: "http://www.restaurant-mingles.com",
        mapUrl: "https://maps.google.com/?q=Mingles+Restaurant+Seoul",
        address: "19 Dosan-daero 67-gil, Gangnam-gu, Seoul",
        businessHours: "12:00 PM - 22:00 PM (Break 15:00-18:00)",
        phone: "+82 2-515-7306",
        rating: "★ 4.9 / 5.0 (1,150 Reviews)",
        menuItems: [
          { name: "Mingles Signature Course Meal", desc: "7-Course seasonal Korean innovative dining featuring Hanwoo Beef", priceKRW: 180000 },
          { name: "Jang Trio Fermented Dessert", desc: "Deconstructed dessert made of fermented traditional sauces", priceKRW: 35000 }
        ]
      }
    ]
  },

  districtsMeta: {
    Seongsu: { name: "Seongsu-dong (성수동)", center: [37.5445, 127.0560], zoom: 15 },
    Hongdae: { name: "Hongdae & Yeonnam (홍대)", center: [37.5563, 126.9237], zoom: 15 },
    Myeongdong: { name: "Myeongdong (명동)", center: [37.5636, 126.9837], zoom: 16 },
    Gangnam: { name: "Gangnam & Apgujeong (강남)", center: [37.5270, 127.0385], zoom: 15 }
  }
};

// Global State
let state = {
  activeDistrictKey: 'Seongsu',
  extractedBudgetKRW: 300000,
  extractedStyle: 'Hip Streetwear',
  extractedFood: 'Korean Course & Dessert Cafe',
  extractedTimeHours: 4.0,
  currentCalculatedStops: [],
  map: null,
  markers: [],
  polyline: null,
  activeFilter: 'all'
};

// Complete Translations Dictionary for Static & Footer Elements
const TRANSLATIONS = {
  en: {
    nav_planner: "Route Planner",
    nav_curation: "Hotspots",
    nav_taxfree: "Tax-Free & Pass",
    nav_b2b: "B2B Trends",
    hero_badge: "AI-Powered Seoul Tour & Gourmet Guide",
    hero_title: "Tell us your style, we build your perfect K-Shopping day.",
    hero_subtitle: "Zero time wasted searching blogs. Custom route tailored to your budget, culinary taste, and location in Seoul with 1-click tax refund tips.",
    prompt_tag: "AI Natural Language Prompt",
    preset_label: "Try Presets:",
    preset_seongsu: "📍 Seongsu Hipster (300k KRW / 4h)",
    preset_hongdae: "📍 Hongdae Vintage & Street (150k KRW / 3h)",
    preset_myeongdong: "📍 Myeongdong K-Beauty & TaxFree (500k KRW / 5h)",
    preset_gangnam: "📍 Gangnam Luxury & Gourmet (1,000k KRW / 6h)",
    prompt_ph: "e.g. Near Seongsu-dong. Want to spend around 300,000 KRW on hip streetwear. For lunch, neat traditional Korean course meal, and a cozy dessert cafe. Total time available: 4 hours.",
    btn_generate: "Generate AI Route",
    p_location: "Location:",
    p_budget: "Budget:",
    p_style: "Shopping:",
    p_food: "Gourmet:",
    p_time: "Time:",
    btn_fine_tune: "Fine Tune",
    m_stops: "Curated Stops",
    m_dist: "Total Walking",
    m_budget: "Est. Budget",
    m_taxrefund: "Estimated Tax Refund",
    btn_share: "Share Route",
    btn_start_nav: "Start Navigation",
    timeline_title: "Your Schedule & Itinerary",
    live_pill: "Real-time AI Routing",
    filter_all: "All Places",
    filter_shopping: "Shopping",
    filter_food: "Dining & Cafe",
    filter_taxfree: "Tax-Free",
    btn_view: "View",
    leg_shopping: "1. Shopping",
    leg_dining: "2. Dining",
    leg_cafe: "3. Cafe",
    leg_kbeauty: "4. K-Beauty",
    leg_walk: "Walk Route",
    tag_curation: "Pinpoint Smart Curation",
    title_curation: "Featured K-Hotspots & Local Gems",
    desc_curation: "Beyond standard maps. We provide english menus, tax-free statuses, waiting tips, and exclusive discount coupons.",
    tax_badge: "Shop&Savor VIP Tourist Pass",
    tax_title: "Instant Tax Refund & Local Perks",
    tax_desc: "Korea provides immediate Tax-Free (7~10% VAT refund) at participating shops for purchases over ₩15,000. Get your pass for zero waiting and partner shop discounts!",
    tax_feat_1: "Immediate On-site Refund: Show your passport at checkout for instant VAT deduction.",
    tax_feat_2: "VIP Priority Line: Skip lines at partner cafes & boutiques.",
    tax_feat_3: "Welcome Drink & Free Gifts: Exclusive gifts at Seongsu & Myeongdong flagship stores.",
    btn_get_pass: "Get 1-Day VIP Pass (Free Trial)",
    btn_calc_tax: "Calculate Tax Refund",
    calc_title: "Tax Refund Calculator",
    calc_vat: "VAT 10% (Est. 7-8% Refund)",
    lbl_calc_amount: "Enter Total Planned Purchases",
    calc_orig: "Original Price:",
    calc_refund: "Estimated VAT Refund:",
    calc_final: "Final Price After Refund:",
    protip_label: "Pro Tip:",
    protip_desc: "Airport kiosks at Incheon (T1/T2) allow instant cash payout in USD, JPY, or KRW.",
    b2b_tag: "B2B Analytics & RAG Engine",
    b2b_title: "Foreign Tourist Consumption & Route Trends",
    b2b_desc: "Real-time data insights on international visitor preferences, hotspot movement, and spending patterns across Seoul.",
    chart1_title: "Top Preferred Shopping Districts by Nationality",
    chart2_title: "Category Budget Distribution",
    modal_tune_title: "Customize Travel Parameters",
    lbl_district: "Target District in Seoul",
    opt_seongsu: "Seongsu-dong (성수동) - Trendy & Craft",
    opt_hongdae: "Hongdae & Yeonnam (홍대) - Youth & Vintage",
    opt_myeongdong: "Myeongdong (명동) - K-Beauty & TaxFree",
    opt_gangnam: "Gangnam & Apgujeong (강남) - Luxury & K-Pop",
    lbl_budget_range: "Budget Range:",
    lbl_shopping_style: "Shopping Preference",
    tag_streetwear: "Streetwear & Local Brands",
    tag_kbeauty: "K-Beauty & Skincare",
    tag_vintage: "Vintage & Thrift",
    tag_luxury: "Designer & High Fashion",
    lbl_food_pref: "Dining & Cafe Preference",
    tag_hansik: "Traditional Korean Course",
    tag_cafe: "Trendy Dessert Cafe",
    tag_bbq: "K-BBQ & Pork Belly",
    tag_michelin: "Michelin Guide Local",
    lbl_time_avail: "Total Available Time:",
    btn_cancel: "Cancel",
    btn_apply: "Apply & Re-Calculate",
    footer_desc: "Your ultimate AI-powered K-Shopping & Gourmet itinerary builder. Exploring Seoul with intelligence, ease, and savings.",
    ft_platform: "Platform",
    ft_b2b: "B2B Solutions",
    ft_merchant: "Merchant Partnerships",
    ft_reports: "Data Analytics Reports",
    ft_taxapi: "Tax Refund API",
    ft_contact: "Contact & Global",
    ft_support: "Support (EN/KO/ZH/JA)",
    ft_terms: "Terms of Service",
    ft_privacy: "Privacy Policy",
    footer_rights: "© 2026 Shop&Savor Inc. All rights reserved. Powered by OpenAI / Claude 3.5 & Google Maps RAG Engine."
  },
  ko: {
    nav_planner: "AI 루트 플래너",
    nav_curation: "핫플레이스",
    nav_taxfree: "텍스프리 & 패스",
    nav_b2b: "B2B 데이터 분석",
    hero_badge: "AI 기반 서울 쇼핑 & 미식 투어 가이드",
    hero_title: "취향만 말씀하세요, 완벽한 K-쇼핑의 하루를 만들어 드립니다.",
    hero_subtitle: "블로그 탐색 시간 zero. 예산, 음식 취향, 현재 위치에 맞춰 텍스프리 팁과 함께 최적화된 동선을 1초만에 제안합니다.",
    prompt_tag: "AI 자연어 입력 콘솔",
    preset_label: "추천 프리셋:",
    preset_seongsu: "📍 성수 힙스터 코스 (30만원 / 4시간)",
    preset_hongdae: "📍 홍대 빈티지/스트릿 (15만원 / 3시간)",
    preset_myeongdong: "📍 명동 K-뷰티 & 텍스프리 (50만원 / 5시간)",
    preset_gangnam: "📍 강남 럭셔리 & 미식 (100만원 / 6시간)",
    prompt_ph: "예: 성수동 근처야. 30만원 정도로 힙한 스트릿 브랜드 쇼핑하고 싶어. 점심은 깔끔한 한식 정식, 카페는 디저트가 맛있는 감성 카페로 추천해줘. 이용 시간은 총 4시간이야.",
    btn_generate: "AI 루트 생성하기",
    p_location: "위치:",
    p_budget: "예산:",
    p_style: "쇼핑:",
    p_food: "미식:",
    p_time: "시간:",
    btn_fine_tune: "상세 조건 조절",
    m_stops: "추천 스팟 수",
    m_dist: "총 도보 거리",
    m_budget: "예상 소비 예산",
    m_taxrefund: "예상 텍스프리 환급액",
    btn_share: "루트 공유하기",
    btn_start_nav: "길안내 시작",
    timeline_title: "타임라인 상세 코스",
    live_pill: "실시간 AI 루트 연산",
    filter_all: "전체 매장",
    filter_shopping: "쇼핑 브랜드",
    filter_food: "식당 및 카페",
    filter_taxfree: "텍스프리 매장",
    btn_view: "보기",
    leg_shopping: "1. 쇼핑",
    leg_dining: "2. 식당",
    leg_cafe: "3. 카페",
    leg_kbeauty: "4. K-뷰티",
    leg_walk: "도보 이동 경로",
    tag_curation: "핀포인트 큐레이션",
    title_curation: "엄선된 K-핫플레이스 & 고유 매장",
    desc_curation: "단순 위치 정보 이상! 영어 메뉴판, 텍스프리 지원 여부, 실시간 대기 팁 및 전용 할인 쿠폰을 제공합니다.",
    tax_badge: "Shop&Savor VIP 관광객 패스",
    tax_title: "현장 즉시 텍스프리 & 전용 혜택",
    tax_desc: "한국에서는 15,000원 이상 구매 시 가맹점에서 즉시 텍스프리(7~10% VAT 환급)를 제공합니다. 대기 없는 VIP 패스로 할인 쿠폰을 받아보세요!",
    tax_feat_1: "현장 즉시 환급: 결제 시 여권을 제시하면 부가세가 즉시 차감 결제됩니다.",
    tax_feat_2: "VIP 우선 대기 라인: 제휴 카페 및 매장에서 웨이팅 없이 빠른 입장.",
    tax_feat_3: "웰컴 드링크 & 기프트: 성수/명동 플래그십 매장에서 전용 무료 기프트 제공.",
    btn_get_pass: "1일 VIP 패스 받기 (무료 체험)",
    btn_calc_tax: "텍스프리 환급액 계산",
    calc_title: "실시간 텍스프리 계산기",
    calc_vat: "VAT 10% (실 환급율 약 7~8%)",
    lbl_calc_amount: "총 쇼핑 예정 금액 입력",
    calc_orig: "원래 구매 금액:",
    calc_refund: "예상 텍스프리 환급액:",
    calc_final: "환급 후 최종 지불 금액:",
    protip_label: "알짜 팁:",
    protip_desc: "인천공항(T1/T2) 환급 키오스크에서 USD, JPY, KRW 현금으로 즉시 수령 가능합니다.",
    b2b_tag: "B2B 데이터 분석 & RAG 엔진",
    b2b_title: "외국인 관광객 소비 패턴 및 이동 트렌드",
    b2b_desc: "서울 전역의 국적별 방문객 선호 지역, 핫플 이동 동선, 소비 패턴 실시간 빅데이터 리포트.",
    chart1_title: "국적별 선호 쇼핑 지구 분석",
    chart2_title: "카테고리별 소비 예산 비중",
    modal_tune_title: "여행 추천 파라미터 조절",
    lbl_district: "서울 주요 탐색 지역",
    opt_seongsu: "성수동 - 힙한 트렌드 & 수제버거/카페",
    opt_hongdae: "홍대 & 연남동 - 청춘/빈티지 & K-BBQ",
    opt_myeongdong: "명동 - K-뷰티 코스메틱 & 즉시 텍스프리",
    opt_gangnam: "강남 & 압구정 - 럭셔리 명품 & 파인다이닝",
    lbl_budget_range: "예산 범위:",
    lbl_shopping_style: "쇼핑 스타일 선호도",
    tag_streetwear: "스트릿 패션 & 디자이너 브랜드",
    tag_kbeauty: "K-뷰티 & 스킨케어 코스메틱",
    tag_vintage: "빈티지 & 구제 패션",
    tag_luxury: "럭셔리 명품 & 고엔드 디자이너",
    lbl_food_pref: "미식 및 카페 선호도",
    tag_hansik: "전통 한식 정식 & 탕 요리",
    tag_cafe: "감성 디저트 & 베이커리 카페",
    tag_bbq: "K-BBQ 삼겹살 & 숯불 구이",
    tag_michelin: "미슐랭 가이드 로컬 맛집",
    lbl_time_avail: "총 가용 시간:",
    btn_cancel: "취소",
    btn_apply: "적용 및 재계산",
    footer_desc: "AI 기반 글로벌 K-쇼핑 & 미식 일정 추천 플랫폼. 스마트하고 편리하게 서울을 즐겨보세요.",
    ft_platform: "플랫폼 카테고리",
    ft_b2b: "B2B 데이터 솔루션",
    ft_merchant: "제휴 매장 입점 문의",
    ft_reports: "관광 데이터 분석 리포트",
    ft_taxapi: "텍스프리 연동 API",
    ft_contact: "고객 지원 및 글로벌 약관",
    ft_support: "다국어 지원 센터 (EN/KO/ZH/JA)",
    ft_terms: "서비스 이용 약관",
    ft_privacy: "개인정보 처리방침",
    footer_rights: "© 2026 Shop&Savor Inc. 모든 권리 보유. Powered by OpenAI / Claude 3.5 & Google Maps RAG Engine."
  }
};

// Helper function to format currency
function formatCurrency(amountKRW) {
  const curr = CONFIG.currencies[CONFIG.currentCurrency];
  const converted = amountKRW * curr.rate;
  if (CONFIG.currentCurrency === 'KRW') {
    return `₩${amountKRW.toLocaleString()}`;
  } else if (CONFIG.currentCurrency === 'USD') {
    return `$${Math.round(converted).toLocaleString()}`;
  } else if (CONFIG.currentCurrency === 'EUR') {
    return `€${Math.round(converted).toLocaleString()}`;
  } else if (CONFIG.currentCurrency === 'JPY') {
    return `¥${Math.round(converted).toLocaleString()}`;
  } else if (CONFIG.currentCurrency === 'CNY') {
    return `¥${Math.round(converted).toLocaleString()}`;
  }
  return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
}

// Global UI Language Updater - Translates EVERY element including Footer
function updateUITranslations() {
  const lang = CONFIG.currentLang;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });

  // Re-render Dynamic Itinerary & Curation Cards with Selected Language!
  renderSynthesizedItinerary();
}

function getLocalized(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[CONFIG.currentLang] || obj.en || obj.ko || '';
}

// 3. NLP Prompt Parser & Route Synthesizer
function parseAndSynthesizeRoute(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('hongdae') || lower.includes('홍대') || lower.includes('yeonnam') || lower.includes('연남')) {
    state.activeDistrictKey = 'Hongdae';
  } else if (lower.includes('myeongdong') || lower.includes('명동')) {
    state.activeDistrictKey = 'Myeongdong';
  } else if (lower.includes('gangnam') || lower.includes('강남') || lower.includes('apgujeong') || lower.includes('압구정')) {
    state.activeDistrictKey = 'Gangnam';
  } else {
    state.activeDistrictKey = 'Seongsu';
  }

  let parsedBudget = null;
  const krwMatch = lower.match(/(\d+)\s*만/);
  const kMatch = lower.match(/(\d+)\s*k/);
  const numberMatch = lower.match(/(\d{5,7})/);

  if (krwMatch) parsedBudget = parseInt(krwMatch[1]) * 10000;
  else if (kMatch) parsedBudget = parseInt(kMatch[1]) * 1000;
  else if (numberMatch) parsedBudget = parseInt(numberMatch[1]);

  if (parsedBudget && parsedBudget >= 50000) {
    state.extractedBudgetKRW = parsedBudget;
  } else {
    if (state.activeDistrictKey === 'Gangnam') state.extractedBudgetKRW = 800000;
    else if (state.activeDistrictKey === 'Myeongdong') state.extractedBudgetKRW = 500000;
    else if (state.activeDistrictKey === 'Hongdae') state.extractedBudgetKRW = 200000;
    else state.extractedBudgetKRW = 300000;
  }

  if (lower.includes('beauty') || lower.includes('뷰티') || lower.includes('skincare') || lower.includes('화장품')) {
    state.extractedStyle = 'K-Beauty & Cosmetics';
  } else if (lower.includes('vintage') || lower.includes('빈티지') || lower.includes('thrift')) {
    state.extractedStyle = 'Vintage & Thrift';
  } else if (lower.includes('luxury') || lower.includes('명품') || lower.includes('designer')) {
    state.extractedStyle = 'Luxury Fashion';
  } else {
    state.extractedStyle = 'Hip Streetwear';
  }

  if (lower.includes('bbq') || lower.includes('고기') || lower.includes('삼겹살') || lower.includes('pork')) {
    state.extractedFood = 'Gourmet K-BBQ';
  } else if (lower.includes('michelin') || lower.includes('미슐랭') || lower.includes('미쉐린')) {
    state.extractedFood = 'Michelin Guide Local';
  } else if (lower.includes('dessert') || lower.includes('디저트') || lower.includes('카페') || lower.includes('bakery')) {
    state.extractedFood = 'Sensory Dessert Cafe';
  } else {
    state.extractedFood = 'Korean Traditional Course';
  }

  const timeMatch = lower.match(/(\d+(\.\d+)?)\s*(시간|h|hr|hour)/);
  if (timeMatch) {
    state.extractedTimeHours = parseFloat(timeMatch[1]);
  } else {
    state.extractedTimeHours = 4.0;
  }

  const districtObj = CONFIG.districtsMeta[state.activeDistrictKey];
  document.getElementById('val-location').textContent = districtObj.name;
  document.getElementById('val-budget').textContent = `${formatCurrency(state.extractedBudgetKRW)} (₩${state.extractedBudgetKRW.toLocaleString()})`;
  document.getElementById('val-style').textContent = state.extractedStyle;
  document.getElementById('val-food').textContent = state.extractedFood;
  document.getElementById('val-time').textContent = `${state.extractedTimeHours.toFixed(1)} Hours`;

  synthesizeDynamicPlan();
}

// 4. Dynamic AI Synthesis Algorithm
function synthesizeDynamicPlan() {
  const pool = CONFIG.placePool[state.activeDistrictKey] || CONFIG.placePool.Seongsu;
  const targetBudget = state.extractedBudgetKRW;
  const targetHours = state.extractedTimeHours;

  let selectedSpots = [...pool];

  let spotCount = 3;
  if (targetHours >= 4.0) spotCount = 4;
  if (targetHours >= 6.0) spotCount = 5;

  selectedSpots = selectedSpots.slice(0, Math.min(spotCount, selectedSpots.length));

  let totalBaseCost = selectedSpots.reduce((acc, curr) => acc + curr.baseCostKRW, 0);
  const costScaleFactor = targetBudget / (totalBaseCost || 1);

  let currentStartMinutes = 11 * 60;

  state.currentCalculatedStops = selectedSpots.map((spot, idx) => {
    const estCostKRW = Math.round((spot.baseCostKRW * Math.min(Math.max(costScaleFactor, 0.7), 1.8)) / 1000) * 1000;
    const stayMins = spot.baseStayMins;

    const startHour = Math.floor(currentStartMinutes / 60);
    const startMin = currentStartMinutes % 60;
    const endMinutes = currentStartMinutes + stayMins;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;

    const startStr = `${startHour > 12 ? startHour - 12 : startHour}:${startMin === 0 ? '00' : startMin} ${startHour >= 12 ? 'PM' : 'AM'}`;
    const endStr = `${endHour > 12 ? endHour - 12 : endHour}:${endMin === 0 ? '00' : endMin} ${endHour >= 12 ? 'PM' : 'AM'}`;

    currentStartMinutes = endMinutes + 10;
    const transitDistMeters = 250 + (idx * 120);
    const transitWalkMins = Math.round(transitDistMeters / 70);

    const isKo = CONFIG.currentLang === 'ko';
    const transitText = isKo ? 
      `도보 ${transitWalkMins}분 (${transitDistMeters}m) 이동 ➔ ${idx + 2}번 스팟` : 
      `Walk ${transitWalkMins} mins (${transitDistMeters}m) to Stop #${idx + 2}`;

    return {
      ...spot,
      num: idx + 1,
      estCostKRW: estCostKRW,
      stayTimeStr: isKo ? `${stayMins}분 체류` : `${stayMins} mins`,
      timeWindow: `${startStr} ~ ${endStr}`,
      transitText: transitText
    };
  });

  renderSynthesizedItinerary();
}

// 5. Render Itinerary UI & Leaflet Map with Localized Text
function renderSynthesizedItinerary() {
  const districtMeta = CONFIG.districtsMeta[state.activeDistrictKey];
  const stops = state.currentCalculatedStops;
  const isKo = CONFIG.currentLang === 'ko';

  const routeTitle = `${districtMeta.name.split(' ')[0]} ${state.extractedStyle} & ${state.extractedFood} (${state.extractedTimeHours}h Plan)`;
  document.getElementById('route-title').innerHTML = `<i class="fa-solid fa-wand-magic-sparkles gradient-icon"></i> ${routeTitle}`;
  document.getElementById('route-desc').textContent = isKo ? 
    `예산 ${formatCurrency(state.extractedBudgetKRW)} 및 가용 시간 ${state.extractedTimeHours}시간에 맞춘 AI 최적화 ${stops.length}개 스팟 동선입니다. 매장 사진이나 카드를 클릭하면 상세 정보와 메뉴판이 표시됩니다.` :
    `AI-synthesized ${stops.length} curated stops optimized for your budget of ${formatCurrency(state.extractedBudgetKRW)} and ${state.extractedTimeHours} hours. Click any place image or card to view full menu & official website!`;

  let totalCostKRW = 0;
  stops.forEach(s => totalCostKRW += s.estCostKRW);
  const estTaxRefundKRW = Math.round(totalCostKRW * 0.08);

  document.getElementById('metric-stops').textContent = stops.length;
  document.getElementById('metric-distance').textContent = `${(stops.length * 0.42).toFixed(1)} km`;
  document.getElementById('metric-budget').textContent = `${formatCurrency(totalCostKRW)}`;
  document.getElementById('metric-taxfree').textContent = `+${formatCurrency(estTaxRefundKRW)}`;

  const timelineEl = document.getElementById('timeline-list');
  timelineEl.innerHTML = '';

  stops.forEach((stop, idx) => {
    if (state.activeFilter !== 'all' && state.activeFilter !== stop.category && !(state.activeFilter === 'taxfree' && stop.taxFree)) {
      return;
    }

    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('data-id', stop.id);
    item.style.cursor = 'pointer';

    const catLabel = getLocalized(stop.catLabel);
    const desc = getLocalized(stop.desc);
    const menuItem = getLocalized(stop.menuItem);
    const waitingTip = getLocalized(stop.waitingTip);

    item.innerHTML = `
      <div class="timeline-badge">${stop.num}</div>
      <div class="timeline-body">
        <div class="timeline-meta">
          <span class="timeline-time"><i class="fa-regular fa-clock"></i> ${stop.timeWindow} (${stop.stayTimeStr})</span>
          <span class="timeline-cat">${catLabel}</span>
        </div>
        <h4 class="timeline-title">${stop.name} <i class="fa-solid fa-circle-info text-indigo" style="font-size:0.85rem;" title="${isKo ? '클릭 시 메뉴판 및 상세보기' : 'Click for menu & details'}"></i></h4>
        <p class="timeline-subtitle">${desc}</p>
        
        <div class="timeline-tags">
          <span class="tag-badge"><i class="fa-solid fa-utensils"></i> ${menuItem}</span>
          ${stop.taxFree ? `<span class="tag-badge taxfree"><i class="fa-solid fa-receipt"></i> ${isKo ? '현장 즉시 텍스프리' : 'Immediate Tax-Free'}</span>` : ''}
          ${stop.englishMenu ? `<span class="tag-badge"><i class="fa-solid fa-globe"></i> ${isKo ? '영어 메뉴 가능' : 'English Ready'}</span>` : ''}
        </div>

        <div class="spot-info-row" style="font-size:0.8rem; margin-top:4px; color:var(--text-muted);">
          <span><i class="fa-solid fa-lightbulb text-amber"></i> Tip: ${waitingTip}</span>
          <strong class="text-indigo">${formatCurrency(stop.estCostKRW)}</strong>
        </div>

        ${idx < stops.length - 1 ? `<div class="timeline-transit"><i class="fa-solid fa-person-walking"></i> ${stop.transitText}</div>` : ''}
      </div>
    `;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailModal(stop);
    });

    timelineEl.appendChild(item);
  });

  renderCurationCards(stops);
  updateMap(districtMeta.center, stops);
}

// 6. OPEN DETAILED PLACE MODAL WITH HIGH Z-INDEX AND COMPLETE MENU/WEB DATA
function openDetailModal(spot) {
  if (!spot) return;

  const modal = document.getElementById('detail-modal');
  const modalTitle = document.getElementById('modal-place-title');
  const modalContent = document.getElementById('detail-modal-content');
  const isKo = CONFIG.currentLang === 'ko';

  const catLabel = getLocalized(spot.catLabel);

  modalTitle.innerHTML = `<i class="fa-solid fa-shop"></i> ${spot.name}`;

  let menuListHTML = '';
  if (spot.menuItems && spot.menuItems.length > 0) {
    menuListHTML = spot.menuItems.map(item => `
      <div class="menu-card">
        <div class="menu-card-info">
          <h5>${item.name}</h5>
          <p>${item.desc}</p>
        </div>
        <div class="menu-card-price">${formatCurrency(item.priceKRW)}</div>
      </div>
    `).join('');
  } else {
    menuListHTML = `
      <div class="menu-card">
        <div class="menu-card-info">
          <h5>${getLocalized(spot.menuItem)}</h5>
          <p>${isKo ? '대표 시그니처 추천 상품/메뉴' : 'Featured signature pick'}</p>
        </div>
        <div class="menu-card-price">${formatCurrency(spot.estCostKRW)}</div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <div class="detail-hero-banner">
      <img src="${spot.image}" alt="${spot.name}" />
      <div class="detail-hero-overlay">
        <div>
          <div class="detail-place-name">${spot.name}</div>
          <div class="detail-place-category">${catLabel} • ${spot.tags ? spot.tags.join(', ') : ''}</div>
        </div>
        <div class="detail-rating-badge">
          <i class="fa-solid fa-star"></i> ${spot.rating || '★ 4.8 / 5.0'}
        </div>
      </div>
    </div>

    <!-- Essential Place Meta Info -->
    <div class="detail-info-grid">
      <div class="info-item">
        <i class="fa-solid fa-location-dot"></i>
        <div>
          <span>${isKo ? '매장 주소' : 'Address'}</span>
          <strong>${spot.address || 'Seoul, South Korea'}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-clock"></i>
        <div>
          <span>${isKo ? '영업 시간' : 'Business Hours'}</span>
          <strong>${spot.businessHours || '11:00 AM - 21:00 PM'}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-phone"></i>
        <div>
          <span>${isKo ? '매장 연락처' : 'Contact Number'}</span>
          <strong>${spot.phone || '+82 2-1234-5678'}</strong>
        </div>
      </div>
      <div class="info-item">
        <i class="fa-solid fa-receipt"></i>
        <div>
          <span>${isKo ? '텍스프리 상태' : 'Tax Refund Status'}</span>
          <strong class="${spot.taxFree ? 'text-emerald' : ''}">${spot.taxFree ? (isKo ? '현장 즉시 텍스프리 환급' : 'Immediate On-Site Tax Refund') : (isKo ? '부가세 포함 가격' : 'Standard VAT Included')}</strong>
        </div>
      </div>
    </div>

    <!-- Featured Menu / Product Collection -->
    <div class="menu-section-header">
      <h4><i class="fa-solid fa-utensils"></i> ${isKo ? (spot.category === 'food' ? '추천 대표 메뉴 & 가격표' : '추천 대표 상품 & 가격표') : (spot.category === 'food' ? 'Recommended Menu & Pricing' : 'Featured Products & Pricing')}</h4>
      <span style="font-size:0.8rem; color:var(--text-muted);">${isKo ? '실시간 통화 변환 적용:' : 'Real-time converted:'} ${CONFIG.currentCurrency}</span>
    </div>

    <div class="menu-items-grid">
      ${menuListHTML}
    </div>

    <!-- External Links & Actions -->
    <div class="detail-actions-bar">
      <a href="${spot.websiteUrl || '#'}" target="_blank" class="btn btn-primary" style="flex:1;">
        <i class="fa-solid fa-globe"></i> ${isKo ? '공식 웹사이트 / 브랜드 페이지 방문' : 'Visit Official Website'}
      </a>
      <a href="${spot.mapUrl || '#'}" target="_blank" class="btn btn-outline" style="flex:1;">
        <i class="fa-solid fa-map-location-dot"></i> ${isKo ? '구글 지도에서 위치 보기' : 'Open in Google Maps'}
      </a>
      <button class="btn btn-secondary" onclick="alert('${isKo ? '🎉 10% VIP 쿠폰이 저장되었습니다!' : '🎟️ 10% VIP Coupon saved!'}')">
        <i class="fa-solid fa-ticket"></i> ${isKo ? '10% 할인 쿠폰 받기' : 'Save 10% Coupon'}
      </button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Detail Modal Handler
document.addEventListener('DOMContentLoaded', () => {
  const detailModal = document.getElementById('detail-modal');
  const closeBtn = document.getElementById('close-detail-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  }
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
});

// 7. Map Controller
function initMap() {
  const seongsuCenter = CONFIG.districtsMeta.Seongsu.center;
  state.map = L.map('leaflet-map').setView(seongsuCenter, 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> & Shop&Savor AI',
    maxZoom: 19
  }).addTo(state.map);

  parseAndSynthesizeRoute("성수동 근처야. 30만원 정도로 힙한 스트릿 브랜드 쇼핑하고 싶어. 점심은 깔끔한 한식 정식, 카페는 디저트가 맛있는 감성 카페로 추천해줘. 이용 시간은 총 4시간이야.");
}

function updateMap(centerCoords, stops) {
  if (!state.map) return;
  const isKo = CONFIG.currentLang === 'ko';

  state.markers.forEach(m => state.map.removeLayer(m));
  state.markers = [];
  if (state.polyline) state.map.removeLayer(state.polyline);

  const latLngs = [];

  stops.forEach(stop => {
    if (state.activeFilter !== 'all' && state.activeFilter !== stop.category && !(state.activeFilter === 'taxfree' && stop.taxFree)) {
      return;
    }

    latLngs.push([stop.lat, stop.lng]);

    let pinColor = '#6366f1';
    if (stop.category === 'food') pinColor = '#ef4444';
    if (stop.num === 3) pinColor = '#f59e0b';
    if (stop.category === 'shopping' && stop.taxFree) pinColor = '#10b981';

    const customIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `<div class="custom-pin" style="background-color: ${pinColor}">${stop.num}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(state.map);
    marker.stopId = stop.id;

    const popupHTML = `
      <div style="font-family: 'Outfit', 'Noto Sans KR', sans-serif; width: 220px;">
        <img src="${stop.image}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px; cursor:pointer;" onclick="window.openDetailModalById('${stop.id}')" />
        <h4 style="margin:0 0 4px 0; font-weight:700; color:#0f172a; cursor:pointer;" onclick="window.openDetailModalById('${stop.id}')">${stop.name}</h4>
        <p style="margin:0 0 6px 0; font-size:12px; color:#64748b;">${stop.timeWindow}</p>
        <div style="font-weight:700; color:#6366f1; font-size:13px; margin-bottom:8px;">${isKo ? '예상 지출:' : 'Est. Spend:'} ${formatCurrency(stop.estCostKRW)}</div>
        <button onclick="window.openDetailModalById('${stop.id}')" style="width:100%; padding:8px; background:#6366f1; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:13px;">
          <i class="fa-solid fa-circle-info"></i> ${isKo ? '전체 메뉴판 & 상세보기' : 'View Full Menu & Info'}
        </button>
      </div>
    `;

    marker.bindPopup(popupHTML);
    state.markers.push(marker);
  });

  if (latLngs.length > 1) {
    state.polyline = L.polyline(latLngs, {
      color: '#6366f1',
      weight: 4,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(state.map);

    state.map.fitBounds(state.polyline.getBounds(), { padding: [40, 40] });
  } else {
    state.map.setView(centerCoords, 15);
  }
}

window.openDetailModalById = function(stopId) {
  const stop = state.currentCalculatedStops.find(s => s.id === stopId);
  if (stop) openDetailModal(stop);
};

// 8. Curation Cards Rendering (Clicking Store Image or Card opens Full Menu & Details Modal!)
function renderCurationCards(stops) {
  const container = document.getElementById('curation-cards-grid');
  container.innerHTML = '';
  const isKo = CONFIG.currentLang === 'ko';

  stops.forEach(stop => {
    const card = document.createElement('div');
    card.className = 'spot-card';

    const desc = getLocalized(stop.desc);
    const menuItem = getLocalized(stop.menuItem);

    card.innerHTML = `
      <div class="spot-img-wrap" title="${isKo ? '사진을 클릭하면 상세 메뉴와 정보를 보실 수 있습니다' : 'Click image for full menu and info'}">
        <img src="${stop.image}" alt="${stop.name}" />
        ${stop.taxFree ? `<span class="spot-badge-tf"><i class="fa-solid fa-receipt"></i> ${isKo ? '텍스프리 지원' : 'Tax Refund Available'}</span>` : ''}
        ${stop.englishMenu ? `<span class="spot-badge-lang"><i class="fa-solid fa-language"></i> ${isKo ? '영어 메뉴 가능' : 'English Menu'}</span>` : ''}
      </div>
      <div class="spot-card-body">
        <div class="spot-district">${state.activeDistrictKey} Spot #${stop.num}</div>
        <h3 class="spot-title">${stop.name} <i class="fa-solid fa-arrow-up-right-from-square text-indigo" style="font-size:0.8rem;"></i></h3>
        <p class="spot-desc">${desc}</p>
        
        <div class="spot-info-pills">
          <div class="spot-info-row">
            <span>${isKo ? '방문 시간:' : 'Schedule:'}</span>
            <strong>${stop.timeWindow}</strong>
          </div>
          <div class="spot-info-row">
            <span>${isKo ? '예상 지출:' : 'Est. Spend:'}</span>
            <strong class="text-indigo">${formatCurrency(stop.estCostKRW)}</strong>
          </div>
          <div class="spot-info-row">
            <span>${isKo ? '추천 메뉴/상품:' : 'Featured Item:'}</span>
            <strong>${menuItem}</strong>
          </div>
        </div>

        <div class="spot-card-footer">
          <button class="btn btn-primary btn-sm card-detail-btn" style="flex:1;" data-id="${stop.id}">
            <i class="fa-solid fa-utensils"></i> ${isKo ? '전체 메뉴판 & 공식 사이트' : 'View Full Menu & Website'}
          </button>
        </div>
      </div>
    `;

    // 1) Click Store Image directly to open Detail Modal
    const imgWrap = card.querySelector('.spot-img-wrap');
    imgWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailModal(stop);
    });

    // 2) Click Detail Button to open Detail Modal
    card.querySelector('.card-detail-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailModal(stop);
    });

    // 3) Click anywhere on Card Body to open Detail Modal
    card.addEventListener('click', (e) => {
      openDetailModal(stop);
    });

    container.appendChild(card);
  });
}

// 9. B2B Analytics Charts
function initB2BCharts() {
  const ctxDistrict = document.getElementById('districtChart');
  const ctxCategory = document.getElementById('categoryChart');

  if (ctxDistrict) {
    new Chart(ctxDistrict, {
      type: 'bar',
      data: {
        labels: ['USA / EU', 'China (CN/HK/TW)', 'Japan', 'SE Asia'],
        datasets: [
          { label: 'Seongsu-dong', data: [42, 35, 48, 25], backgroundColor: '#6366f1' },
          { label: 'Hongdae', data: [38, 45, 52, 40], backgroundColor: '#ec4899' },
          { label: 'Myeongdong', data: [25, 85, 70, 75], backgroundColor: '#10b981' },
          { label: 'Gangnam', data: [55, 60, 30, 35], backgroundColor: '#f59e0b' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  if (ctxCategory) {
    new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['Streetwear & Fashion (38%)', 'K-Beauty & Skincare (32%)', 'Gourmet & Dining (18%)', 'Cafes & Bakery (12%)'],
        datasets: [{
          data: [38, 32, 18, 12],
          backgroundColor: ['#6366f1', '#10b981', '#ec4899', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
      }
    });
  }
}

// 10. Initialization & Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initB2BCharts();

  const generateBtn = document.getElementById('generate-route-btn');
  generateBtn.addEventListener('click', () => {
    const text = document.getElementById('prompt-input').value;
    
    generateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Synthesizing Route...`;
    generateBtn.style.opacity = '0.7';

    setTimeout(() => {
      if (text.trim() !== '') {
        parseAndSynthesizeRoute(text);
      } else {
        parseAndSynthesizeRoute("성수동 30만원 스트릿 패션 및 한식 디저트 4시간");
      }
      generateBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span data-i18n="btn_generate">Generate AI Route</span>`;
      generateBtn.style.opacity = '1';
      document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
    }, 400);
  });

  // Preset Buttons
  document.querySelectorAll('.preset-pills .pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-pills .pill-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const presetKey = e.currentTarget.getAttribute('data-preset');
      if (presetKey === 'seongsu') {
        document.getElementById('prompt-input').value = "성수동 근처야. 30만원 정도로 힙한 스트릿 브랜드 쇼핑하고 싶어. 점심은 깔끔한 한식 정식, 카페는 디저트가 맛있는 감성 카페로 추천해줘. 이용 시간은 총 4시간이야.";
      } else if (presetKey === 'hongdae') {
        document.getElementById('prompt-input').value = "홍대 연남동 근처야. 15만원 예산으로 빈티지 구제 옷가게 구경하고 삼겹살 BBQ 먹을래. 3시간 코스로 추천해줘.";
      } else if (presetKey === 'myeongdong') {
        document.getElementById('prompt-input').value = "명동에서 50만원 예산으로 K-뷰티 올리브영 스킨케어 쇼핑하고 미슐랭 칼국수 먹고 싶어. 5시간 동안 즉시 텍스프리 추천해줘.";
      } else if (presetKey === 'gangnam') {
        document.getElementById('prompt-input').value = "강남 압구정에서 100만원으로 Gentle Monster 명품 선글라스 쇼핑하고 2스타 미슐랭 파인다이닝 먹고 싶어. 6시간 코스로 짜줘.";
      }

      parseAndSynthesizeRoute(document.getElementById('prompt-input').value);
      document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Currency Dropdown
  const currencyBtn = document.getElementById('currency-btn');
  const currencyMenu = document.getElementById('currency-menu');
  currencyBtn.addEventListener('click', () => {
    currencyMenu.parentElement.classList.toggle('open');
  });

  document.querySelectorAll('#currency-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('#currency-menu .dropdown-item').forEach(i => i.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const curr = e.currentTarget.getAttribute('data-currency');
      CONFIG.currentCurrency = curr;
      document.getElementById('current-currency').textContent = CONFIG.currencies[curr].label;
      document.getElementById('calc-currency-symbol').textContent = `${curr} (${CONFIG.currencies[curr].symbol})`;
      currencyMenu.parentElement.classList.remove('open');

      renderSynthesizedItinerary();
      updateTaxCalc();
    });
  });

  // Language Dropdown Event Handler
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  langBtn.addEventListener('click', () => {
    langMenu.parentElement.classList.toggle('open');
  });

  document.querySelectorAll('#lang-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('#lang-menu .dropdown-item').forEach(i => i.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const lang = e.currentTarget.getAttribute('data-lang');
      CONFIG.currentLang = lang;
      document.getElementById('current-lang').textContent = e.currentTarget.textContent;
      langMenu.parentElement.classList.remove('open');

      // Translate ALL elements including Footer!
      updateUITranslations();
    });
  });

  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  });

  // Map Filter Chips
  document.querySelectorAll('.map-filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.activeFilter = e.currentTarget.getAttribute('data-filter');
      renderSynthesizedItinerary();
    });
  });

  // Voice Input Simulation
  const voiceBtn = document.getElementById('voice-rec-btn');
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
      voiceBtn.classList.add('recording');
      recognition.start();
    });

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      document.getElementById('prompt-input').value = speechToText;
      voiceBtn.classList.remove('recording');
      parseAndSynthesizeRoute(speechToText);
    };

    recognition.onerror = () => voiceBtn.classList.remove('recording');
    recognition.onend = () => voiceBtn.classList.remove('recording');
  } else {
    voiceBtn.addEventListener('click', () => {
      document.getElementById('prompt-input').value = "홍대 연남동 20만원 빈티지 삼겹살 3시간 코스 추천해줘";
      parseAndSynthesizeRoute(document.getElementById('prompt-input').value);
    });
  }

  // Tune Modal
  const tuneModal = document.getElementById('tune-modal');
  document.getElementById('toggle-tune-modal').addEventListener('click', () => {
    tuneModal.classList.add('open');
  });
  document.getElementById('close-tune-modal').addEventListener('click', () => {
    tuneModal.classList.remove('open');
  });
  document.getElementById('cancel-tune').addEventListener('click', () => {
    tuneModal.classList.remove('open');
  });

  document.getElementById('tune-budget').addEventListener('input', (e) => {
    document.getElementById('budget-disp').textContent = `₩${parseInt(e.target.value).toLocaleString()}`;
  });
  document.getElementById('tune-time').addEventListener('input', (e) => {
    document.getElementById('time-disp').textContent = `${parseFloat(e.target.value).toFixed(1)} hrs`;
  });

  document.getElementById('apply-tune').addEventListener('click', () => {
    state.activeDistrictKey = document.getElementById('tune-district').value;
    state.extractedBudgetKRW = parseInt(document.getElementById('tune-budget').value);
    state.extractedTimeHours = parseFloat(document.getElementById('tune-time').value);

    document.getElementById('val-location').textContent = CONFIG.districtsMeta[state.activeDistrictKey].name;
    document.getElementById('val-budget').textContent = formatCurrency(state.extractedBudgetKRW);
    document.getElementById('val-time').textContent = `${state.extractedTimeHours} Hours`;

    synthesizeDynamicPlan();
    tuneModal.classList.remove('open');
  });

  // Tax Calculator
  const calcInput = document.getElementById('calc-input-amount');
  function updateTaxCalc() {
    const val = parseFloat(calcInput.value) || 0;
    const origStr = formatCurrency(val);
    const refundKRW = Math.round(val * 0.075);
    const refundStr = `${formatCurrency(refundKRW)} (${Math.round(refundKRW * 0.08 / 100)}%)`;
    const finalKRW = val - refundKRW;
    const finalStr = formatCurrency(finalKRW);

    document.getElementById('calc-orig-disp').textContent = origStr;
    document.getElementById('calc-refund-disp').textContent = refundStr;
    document.getElementById('calc-final-disp').textContent = finalStr;
  }

  calcInput.addEventListener('input', updateTaxCalc);
  updateTaxCalc();

  // VIP Pass & Share
  document.getElementById('get-pass-btn').addEventListener('click', () => {
    const isKo = CONFIG.currentLang === 'ko';
    alert(isKo ? 
      "🎫 Shop&Savor VIP 관광객 패스 발급 완료!\n\n혜택:\n- 현장 즉시 텍스프리 우선 대기\n- 제휴 브랜드 플래그십 10% 할인\n- 성수/명동 무료 웰컴 드링크\n\n결제 시 모바일 QR 코드를 제시하세요!" :
      "🎫 Shop&Savor VIP Tourist Pass Activated!\n\nBenefits:\n- Immediate Tax Refund Fast-Pass\n- 10% Off Partner Fashion Flagships\n- Welcome Drinks at Seongsu Cafes\n\nShow your mobile QR code at checkout!"
    );
  });

  document.getElementById('share-route-btn').addEventListener('click', () => {
    const isKo = CONFIG.currentLang === 'ko';
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(isKo ? "🔗 동적 AI 루트 링크가 클립보드에 복사되었습니다!\n동행자와 공유하세요." : "🔗 Dynamic AI Itinerary Link Copied to Clipboard!\nShare with your travel companions.");
    });
  });

  document.getElementById('start-nav-btn').addEventListener('click', () => {
    const isKo = CONFIG.currentLang === 'ko';
    const firstStop = state.currentCalculatedStops[0];
    alert(isKo ?
      `🧭 라이브 내비게이션 시작!\n\n출발지: ${state.activeDistrictKey}역\n첫번째 추천 스팟: #1 ${firstStop ? firstStop.name : ''}\n예정 도착: ${firstStop ? firstStop.timeWindow : ''}` :
      `🧭 Live Navigation Started!\n\nStarting Point: ${state.activeDistrictKey} Station\nNext Stop: #1 ${firstStop ? firstStop.name : 'Target Spot'}\nEst. Schedule: ${firstStop ? firstStop.timeWindow : ''}`
    );
  });

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    }
  });
});
