// FAQの開閉制御
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// スクロール時のアニメーション表示 (Intersection Observer)
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ヘッダーのスクロール影の制御
window.addEventListener('scroll', () => {
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// スマホナビゲーションの開閉制御
const menuTrigger = document.getElementById('menu-trigger');
const siteNav = document.getElementById('site-nav');

if (menuTrigger && siteNav) {
  // ボタンクリックでメニューを開閉
  menuTrigger.addEventListener('click', () => {
    menuTrigger.classList.toggle('is-active');
    siteNav.classList.toggle('is-open');
  });

  // メニュー内のリンクをクリックしたら自動で閉じる（セクション移動時）
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuTrigger.classList.remove('is-active');
      siteNav.classList.remove('is-open');
    });
  });
}

// ==========================================
// 📞✉️ 電話・メールの誤タップ / PC動作制御
// ==========================================
function copyToClipboard(text, successMessage) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  tempTextArea.style.position = 'fixed';
  tempTextArea.style.top = '-1000px';
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast(successMessage);
    } else {
      console.warn('クリップボードへのコピーに失敗しました');
    }
  } catch (err) {
    console.error('コピー処理中にエラーが発生しました:', err);
  }
  
  document.body.removeChild(tempTextArea);
}

function showToast(message) {
  let toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.querySelectorAll('.prevent-desktop-link').forEach(link => {
  link.addEventListener('click', function(e) {
    if (window.innerWidth > 768) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      if (href.startsWith('tel:')) {
        const phoneNum = href.replace('tel:', '');
        copyToClipboard(phoneNum, '📞 電話番号をコピーしました: ' + phoneNum);
      } else if (href.startsWith('mailto:')) {
        const emailAddress = href.replace('mailto:', '');
        copyToClipboard(emailAddress, '✉️ メールアドレスをコピーしました: ' + emailAddress);
      }
    }
  });
});
