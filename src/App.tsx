/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Hotel, 
  Utensils, 
  Info,
  Camera,
  Coffee,
  ShoppingBag,
  Bus,
  Train
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---

interface ItineraryItem {
  time?: string;
  title: string;
  description: string;
  type: 'visit' | 'transport' | 'meal' | 'stay';
}

interface DayPlan {
  day: number;
  title: string;
  items: ItineraryItem[];
  stay: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

// --- Data ---
// 保持與原本行程相同的資料內容
const ITINERARY_DATA: DayPlan[] = [
  {
    day: 1,
    title: "台北 ✈ 高松",
    stay: "丸龜大倉飯店 或 同級",
    meals: { breakfast: "X", lunch: "X", dinner: "機上美食" },
    items: [
      { type: 'transport', time: "14:30", title: "搭乘中華航空 CI178", description: "從台北桃園國際機場出發，展開四國五日之旅。" },
      { type: 'transport', time: "17:55", title: "抵達高松空港", description: "辦理入境手續後，由導遊帶領前往飯店。" },
      { type: 'stay', title: "入住飯店", description: "入住高松市區或丸龜地區飯店，休息準備明日行程。" }
    ]
  },
  {
    day: 2,
    title: "秘境祖谷溪",
    stay: "丸龜大倉飯店 或 同級",
    meals: { breakfast: "飯店內早餐", lunch: "大步危風味餐", dinner: "會席料理或自助餐" },
    items: [
      { type: 'visit', title: "祖谷溪吊橋", description: "日本三大奇橋之一，由葛藤編織而成，距今已有800年歷史。" },
      { type: 'visit', title: "大步危溪谷遊船", description: "30分鐘航程，欣賞峽谷壯麗風光與奇岩怪石（如蝙蝠岩）。" },
      { type: 'visit', title: "雲邊寺纜車 & 空中鞦韆", description: "搭乘日本最大纜車，在山頂體驗「天空的鞦韆」，鳥瞰瀨戶內海。" }
    ]
  },
  {
    day: 3,
    title: "別子礦山",
    stay: "奧道後壹湯之守 或 同級",
    meals: { breakfast: "飯店內早餐", lunch: "別子國產豬御膳", dinner: "會席料理或自助餐" },
    items: [
      { type: 'visit', title: "別子礦山主題公園", description: "體驗淘金樂趣，搭乘復古礦山觀光列車穿越隧道。" },
      { type: 'visit', title: "少爺列車博物館", description: "追尋伊予鐵道歷史，館內還有星巴克可小憩。" },
      { type: 'visit', title: "道後溫泉街散策", description: "漫步3000年歷史名湯，造訪神隱少女「油屋」原型—道後溫泉本館。" },
      { type: 'visit', title: "少爺音樂鐘", description: "每整點會有精采的機關人偶表演。" }
    ]
  },
  {
    day: 4,
    title: "金刀比羅宮",
    stay: "丸龜大倉飯店 或 同級",
    meals: { breakfast: "飯店內早餐", lunch: "自製烏龍麵 DIY", dinner: "飯店內晚餐" },
    items: [
      { type: 'visit', title: "金刀比羅宮", description: "日本人一生必經參拜之道，挑戰785級石階至五岳一覽。" },
      { type: 'visit', title: "免稅店購物", description: "選購日本精緻伴手禮與電器用品。" },
      { type: 'visit', title: "烏龍學校 DIY", description: "香川縣特色體驗，在老師指導下親手製作讚岐烏龍麵。" },
      { type: 'visit', title: "高松丸龜商店街", description: "日本最長的拱廊商店街，全長2.7公里，自由逛街體驗當地生活。" }
    ]
  },
  {
    day: 5,
    title: "栗林公園 ✈ 台北",
    stay: "溫暖的家",
    meals: { breakfast: "飯店內早餐", lunch: "日式燒肉或風味餐", dinner: "機上美食" },
    items: [
      { type: 'visit', title: "栗林公園", description: "國家指定特別名勝，四國最大名園，六個水池與十三座假山交織出的珍貴遺產。" },
      { type: 'visit', title: "AEON 永旺夢樂城", description: "回台前最後採買，擁有200家品牌店、超市與美食廣場。" },
      { type: 'transport', time: "18:55", title: "搭乘中華航空 CI179", description: "前往高松空港，搭機返回台北。" },
      { type: 'transport', time: "21:05", title: "抵達台北桃園機場", description: "結束充滿回憶的四國秘境之旅。" }
    ]
  }
];

// --- Sub-components ---
const TypeIcon = ({ type }: { type: ItineraryItem['type'] }) => {
  switch (type) {
    case 'transport': return <Plane size={20} className="text-white" />;
    case 'meal': return <Utensils size={20} className="text-white" />;
    case 'stay': return <Hotel size={20} className="text-white" />;
    default: return <Camera size={20} className="text-white" />;
  }
};

const getTypeColor = (type: ItineraryItem['type']) => {
  switch (type) {
    case 'transport': return "bg-sky-400 border-sky-500 shadow-sky-400/30";
    case 'meal': return "bg-amber-400 border-amber-500 shadow-amber-400/30";
    case 'stay': return "bg-violet-400 border-violet-500 shadow-violet-400/30";
    default: return "bg-rose-400 border-rose-500 shadow-rose-400/30";
  }
};

export default function App() {
  const [activeDay, setActiveDay] = useState(1);
  const currentDayPlan = useMemo(() => ITINERARY_DATA.find(d => d.day === activeDay)!, [activeDay]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center sm:p-6 lg:p-8 font-sans">
      
      {/* Mobile Simulator Frame (Forces mobile layout even on desktop) */}
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#F7F9FC] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] sm:border-slate-800">
        
        {/* Playful Header Section */}
        <div className="bg-gradient-to-br from-rose-400 to-rose-500 pt-12 pb-6 px-6 relative z-10 rounded-b-3xl shadow-sm">
          {/* Decorative background circles */}
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-10 left-[-20px] w-24 h-24 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3 shadow-sm border border-white/10">
              5 Days Trip
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-2">
              四國秘境探金
            </h1>
            <p className="text-white/80 text-sm font-medium flex items-center gap-1.5">
              <MapPin size={14} /> 祖谷溪 • 道後溫泉 • 金刀比羅宮
            </p>
          </div>

           {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-6 pb-2 -mx-2 px-2">
            {ITINERARY_DATA.map((d) => (
              <motion.button
                key={d.day}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDay(d.day)}
                className={cn(
                  "px-4 py-3 rounded-2xl shrink-0 transition-all duration-300 flex flex-col items-center min-w-[70px]",
                  activeDay === d.day
                    ? "bg-white text-rose-500 shadow-md transform -translate-y-1"
                    : "bg-white/15 text-white hover:bg-white/25 border border-white/5"
                )}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">Day</span>
                <span className="text-xl font-extrabold leading-none">{d.day}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto w-full relative z-0 pb-24 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col p-5 gap-6"
            >
              
              {/* Daily Overview Title */}
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-amber-400 rounded-full" />
                <h2 className="text-xl font-bold text-slate-800">{currentDayPlan.title}</h2>
              </div>

              {/* Grid Info (Meals & Stay) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full -mr-8 -mt-8" />
                  <div className="flex items-center gap-1.5 text-amber-500 mb-1 relative z-10">
                    <Utensils size={14} className="stroke-[2.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider">今日餐食</span>
                  </div>
                  <div className="space-y-1 relative z-10 text-xs font-medium text-slate-600">
                    <p className="flex justify-between"><span>早</span> <span>{currentDayPlan.meals.breakfast}</span></p>
                    <p className="flex justify-between"><span>午</span> <span className="text-right truncate max-w-[80px]" title={currentDayPlan.meals.lunch}>{currentDayPlan.meals.lunch}</span></p>
                    <p className="flex justify-between"><span>晚</span> <span className="text-right truncate max-w-[80px]" title={currentDayPlan.meals.dinner}>{currentDayPlan.meals.dinner}</span></p>
                  </div>
                </div>
                
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-violet-50 rounded-full -mr-8 -mt-8" />
                  <div className="flex items-center gap-1.5 text-violet-500 mb-1 relative z-10">
                    <Hotel size={14} className="stroke-[2.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider">今晚住宿</span>
                  </div>
                  <div className="flex-1 flex items-center relative z-10 text-xs font-bold text-slate-700 leading-relaxed">
                    {currentDayPlan.stay}
                  </div>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="relative pt-2 pb-4">
                {/* Vertical Line */}
                <div className="absolute left-[23px] top-4 bottom-8 w-[2px] bg-slate-200 z-0 rounded-full" />
                
                <div className="space-y-6 relative z-10">
                  {currentDayPlan.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      {/* Icon Node */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm text-white shrink-0 z-10",
                          getTypeColor(item.type)
                        )}>
                          <TypeIcon type={item.type} />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1.5">
                          {item.time && (
                            <span className="inline-flex max-w-min px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wide border border-blue-100">
                              {item.time}
                            </span>
                          )}
                          <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminders / Bottom Note */}
              <div className="bg-blue-50 rounded-[20px] p-4 flex gap-3 items-start border border-blue-100 mt-2">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-700 mb-1">小提醒</p>
                  <p className="text-[11px] text-blue-600/80 font-medium leading-relaxed">
                    請隨身攜帶護照與貴重物品。當地天氣變化較大，建議攜帶輕薄外套。
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
