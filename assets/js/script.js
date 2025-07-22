/**
 * パン製造システムマニュアル - 共通JavaScript
 * =============================================
 */

class ManualSystem {
	constructor() {
		this.init();
	}

	init() {
		this.setupSmoothScroll();
		this.setupLoadingAnimation();
		this.setupNavigationTracking();
		this.setupSectionNavigation();
		this.setupResponsiveNavigation();
		this.setupPrintStyles();
	}

	/**
	 * スムーススクロール機能
	 */
	setupSmoothScroll() {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();
				const target = document.querySelector(anchor.getAttribute('href'));
				if (target) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			});
		});
	}

	/**
	 * ページローディングアニメーション
	 */
	setupLoadingAnimation() {
		window.addEventListener('load', () => {
			document.body.style.opacity = '0';
			document.body.style.transition = 'opacity 0.5s ease';

			setTimeout(() => {
				document.body.style.opacity = '1';
			}, 100);

			// フェードイン効果
			const elementsToFade = document.querySelectorAll(
				'.section, .nav-card, .function-card'
			);
			elementsToFade.forEach((element, index) => {
				element.style.opacity = '0';
				element.style.transform = 'translateY(20px)';
				element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

				setTimeout(() => {
					element.style.opacity = '1';
					element.style.transform = 'translateY(0)';
				}, 100 * (index + 1));
			});
		});
	}

	/**
	 * ナビゲーション追跡（アナリティクス用）
	 */
	setupNavigationTracking() {
		document.querySelectorAll('.nav-card, .quick-link').forEach((link) => {
			link.addEventListener('click', (e) => {
				const target = e.currentTarget;
				const linkText =
					target.querySelector('h3')?.textContent ||
					target.textContent ||
					'Unknown Link';

				console.log('Navigation clicked:', linkText);

				// 実際の環境では、ここでアナリティクスに送信
				// analytics.track('manual_navigation', { page: linkText });
			});
		});
	}

	/**
	 * セクション内ナビゲーション（単一ページ用）
	 */
	setupSectionNavigation() {
		// セクション表示切り替え機能
		window.showSection = (sectionId) => {
			// 全セクションを非表示
			const sections = document.querySelectorAll('.section');
			sections.forEach((section) => {
				section.classList.remove('active');
				section.style.display = 'none';
			});

			// 選択されたセクションを表示
			const targetSection = document.getElementById(sectionId);
			if (targetSection) {
				targetSection.classList.add('active');
				targetSection.style.display = 'block';
				targetSection.scrollIntoView({ behavior: 'smooth' });
			}

			// URLハッシュを更新
			window.location.hash = sectionId;
		};

		// ブラウザの戻る/進むボタン対応
		window.addEventListener('hashchange', () => {
			const hash = window.location.hash.substring(1);
			if (hash && document.getElementById(hash)) {
				this.showSection(hash);
			}
		});

		// 初期化時のハッシュチェック
		window.addEventListener('load', () => {
			const hash = window.location.hash.substring(1);
			if (hash && document.getElementById(hash)) {
				this.showSection(hash);
			} else {
				// デフォルトで最初のセクションを表示
				const firstSection = document.querySelector('.section');
				if (firstSection) {
					firstSection.classList.add('active');
					firstSection.style.display = 'block';
				}
			}
		});
	}

	/**
	 * レスポンシブナビゲーション
	 */
	setupResponsiveNavigation() {
		// モバイルメニューボタンの追加
		const nav = document.querySelector('.page-nav');
		if (nav && window.innerWidth <= 768) {
			const menuButton = document.createElement('button');
			menuButton.innerHTML = '📱 メニュー';
			menuButton.className = 'mobile-menu-button';
			menuButton.style.cssText = `
        display: none;
        background: linear-gradient(135deg, #74b9ff, #0984e3);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 15px;
      `;

			const navList = nav.querySelector('ul');
			if (navList) {
				nav.insertBefore(menuButton, navList);

				// モバイルでのメニュー表示切り替え
				menuButton.addEventListener('click', () => {
					const isHidden = navList.style.display === 'none';
					navList.style.display = isHidden ? 'flex' : 'none';
					menuButton.textContent = isHidden ? '❌ 閉じる' : '📱 メニュー';
				});

				// リサイズ時の対応
				window.addEventListener('resize', () => {
					if (window.innerWidth > 768) {
						navList.style.display = 'flex';
						menuButton.style.display = 'none';
					} else {
						menuButton.style.display = 'block';
						navList.style.display = 'none';
					}
				});
			}
		}
	}

	/**
	 * 印刷用スタイル
	 */
	setupPrintStyles() {
		// 印刷ボタンの追加
		const printButton = document.createElement('button');
		printButton.innerHTML = '🖨️ このページを印刷';
		printButton.className = 'print-button';
		printButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
      color: white;
      border: none;
      padding: 15px 20px;
      border-radius: 30px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
      z-index: 1000;
      transition: all 0.3s ease;
    `;

		printButton.addEventListener('click', () => {
			window.print();
		});

		printButton.addEventListener('mouseenter', () => {
			printButton.style.transform = 'translateY(-3px)';
			printButton.style.boxShadow = '0 10px 25px rgba(108, 92, 231, 0.4)';
		});

		printButton.addEventListener('mouseleave', () => {
			printButton.style.transform = 'translateY(0)';
			printButton.style.boxShadow = '0 5px 15px rgba(108, 92, 231, 0.3)';
		});

		document.body.appendChild(printButton);

		// 印刷用CSS
		const printStyles = document.createElement('style');
		printStyles.textContent = `
      @media print {
        body { 
          background: white !important; 
          color: black !important; 
        }
        .print-button, .page-nav, .quick-links { 
          display: none !important; 
        }
        .header, .main-content { 
          background: white !important; 
          box-shadow: none !important; 
        }
        .warning, .tip { 
          background: #f0f0f0 !important; 
          color: black !important; 
          border: 2px solid #ccc !important; 
        }
        .nav-card, .function-card { 
          break-inside: avoid; 
          margin-bottom: 15px; 
        }
      }
    `;
		document.head.appendChild(printStyles);
	}

	/**
	 * テーマ切り替え機能（ダークモード対応）
	 */
	setupThemeToggle() {
		const themeButton = document.createElement('button');
		themeButton.innerHTML = '🌙 ダークモード';
		themeButton.className = 'theme-toggle';
		themeButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: linear-gradient(135deg, #2d3436, #636e72);
      color: white;
      border: none;
      padding: 12px 18px;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(45, 52, 54, 0.3);
      z-index: 1000;
      transition: all 0.3s ease;
    `;

		let isDarkMode = localStorage.getItem('darkMode') === 'true';

		const toggleTheme = () => {
			isDarkMode = !isDarkMode;
			document.body.classList.toggle('dark-mode', isDarkMode);
			themeButton.innerHTML = isDarkMode
				? '☀️ ライトモード'
				: '🌙 ダークモード';
			localStorage.setItem('darkMode', isDarkMode);
		};

		themeButton.addEventListener('click', toggleTheme);
		document.body.appendChild(themeButton);

		// 初期テーマ設定
		if (isDarkMode) {
			document.body.classList.add('dark-mode');
			themeButton.innerHTML = '☀️ ライトモード';
		}
	}

	/**
	 * 検索機能
	 */
	setupSearch() {
		const searchContainer = document.createElement('div');
		searchContainer.innerHTML = `
      <input type="text" id="manual-search" placeholder="🔍 マニュアル内を検索..." 
             style="
               position: fixed; 
               top: 20px; 
               right: 20px; 
               padding: 10px 15px; 
               border: 2px solid #74b9ff; 
               border-radius: 25px; 
               background: rgba(255,255,255,0.9); 
               backdrop-filter: blur(10px);
               z-index: 1000;
               width: 250px;
             ">
    `;
		document.body.appendChild(searchContainer);

		const searchInput = document.getElementById('manual-search');
		searchInput.addEventListener('input', (e) => {
			const query = e.target.value.toLowerCase();
			const sections = document.querySelectorAll('.section');

			sections.forEach((section) => {
				const text = section.textContent.toLowerCase();
				const isMatch = text.includes(query);
				section.style.opacity = query === '' || isMatch ? '1' : '0.3';
			});
		});
	}

	/**
	 * パンくずリスト生成
	 */
	generateBreadcrumb(currentPage) {
		const breadcrumbContainer = document.querySelector('.breadcrumb');
		if (!breadcrumbContainer) return;

		const pages = {
			index: 'トップページ',
			basics: '基礎知識編',
			daily: '日常操作編',
			functions: '関数解説編',
			trouble: 'トラブル対応編',
		};

		let breadcrumbHTML = '<a href="index.html">🏠 トップページ</a>';

		if (currentPage !== 'index') {
			breadcrumbHTML += ` > <span>${pages[currentPage]}</span>`;
		}

		breadcrumbContainer.innerHTML = breadcrumbHTML;
	}

	/**
	 * エラーハンドリング
	 */
	setupErrorHandling() {
		window.addEventListener('error', (e) => {
			console.error('Manual System Error:', e.error);

			// ユーザーフレンドリーなエラー表示
			const errorNotification = document.createElement('div');
			errorNotification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff7675, #e17055);
        color: white;
        padding: 20px;
        border-radius: 15px;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 15px 35px rgba(255, 118, 117, 0.3);
      `;
			errorNotification.innerHTML = `
        <h4>⚠️ エラーが発生しました</h4>
        <p>ページを再読み込みしてください。問題が続く場合は管理者にお知らせください。</p>
        <button onclick="location.reload()" style="
          background: white; 
          color: #ff7675; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 20px; 
          margin-top: 10px;
          cursor: pointer;
          font-weight: 600;
        ">🔄 再読み込み</button>
      `;

			document.body.appendChild(errorNotification);

			setTimeout(() => {
				errorNotification.remove();
			}, 5000);
		});
	}
}

// システム初期化
document.addEventListener('DOMContentLoaded', () => {
	window.manualSystem = new ManualSystem();
	console.log('📚 パン製造システムマニュアルが読み込まれました');
});

// グローバル関数（後方互換性のため）
window.showSection = function (sectionId) {
	if (window.manualSystem) {
		window.manualSystem.showSection(sectionId);
	}
};

// ユーティリティ関数
window.scrollToTop = function () {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.goToPage = function (page) {
	window.location.href = `${page}.html`;
};

// キーボードショートカット
document.addEventListener('keydown', (e) => {
	// Ctrl/Cmd + P で印刷
	if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
		e.preventDefault();
		window.print();
	}

	// Ctrl/Cmd + F で検索にフォーカス
	if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
		const searchInput = document.getElementById('manual-search');
		if (searchInput) {
			e.preventDefault();
			searchInput.focus();
		}
	}

	// ESC でモーダルや検索をクリア
	if (e.key === 'Escape') {
		const searchInput = document.getElementById('manual-search');
		if (searchInput) {
			searchInput.value = '';
			searchInput.dispatchEvent(new Event('input'));
		}
	}
});

// パフォーマンス監視
if ('performance' in window) {
	window.addEventListener('load', () => {
		setTimeout(() => {
			const timing = performance.timing;
			const loadTime = timing.loadEventEnd - timing.navigationStart;
			console.log(`📊 ページ読み込み時間: ${loadTime}ms`);
		}, 0);
	});
}
