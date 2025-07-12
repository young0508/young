'use strict';

/* ===================================
   웹사이트 제작 서비스 - JavaScript
   =================================== */

/* ===================================
   설정값 (Config)
   =================================== */
const config = {
    // 애니메이션 지연 시간
    animationDelay: 100,
    
    // 스크롤 오프셋
    scrollOffset: 80,
    
    // 타이핑 효과 속도
    typingSpeed: 100,
    typingDelay: 2000,
    
    // 카운터 애니메이션 시간
    counterDuration: 2000,
    
    // 파티클 설정
    particleCount: 50,
    
    // 프로모션 타이머 시간 (초)
    promoTime: 86400 // 24시간
};

/* ===================================
   텍스트 콘텐츠 관리
   =================================== */
const textContent = {
    // 타이핑 텍스트
    typingTexts: [
        "단 3만원으로 시작하는 전문가급 웹사이트",
        "24시간 내 완성, 빠른 비즈니스 시작",
        "코딩 몰라도 OK, 우리가 다 해드립니다"
    ],
    
    // 채팅 메시지
    chatMessages: {
        welcome: "안녕하세요! 웹사이트 제작 문의 도와드리겠습니다. 😊",
        responses: [
            "네, 말씀해주세요!",
            "자세한 상담을 원하시면 전화나 카카오톡으로 연락주세요.",
            "감사합니다! 빠른 시일 내에 연락드리겠습니다."
        ]
    }
};

/* ===================================
   DOM 요소 캐싱
   =================================== */
const elements = {
    // 로더
    loader: document.querySelector('.loader'),
    
    // 네비게이션
    nav: document.querySelector('.nav'),
    navMenu: document.querySelector('.nav__menu'),
    navToggle: document.querySelector('.nav__toggle'),
    navLinks: document.querySelectorAll('.nav__link'),
    
    // 테마 토글
    themeToggle: document.querySelector('.theme-toggle'),
    
    // 히어로
    typingText: document.querySelector('.typing-text'),
    particles: document.getElementById('particles'),
    statNumbers: document.querySelectorAll('.stat__number'),
    
    // 포트폴리오
    filterBtns: document.querySelectorAll('.filter-btn'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    
    // FAQ
    accordionItems: document.querySelectorAll('.accordion-item'),
    
    // 채팅
    chatWidget: document.querySelector('.chat-widget'),
    chatToggle: document.querySelector('.chat-widget__toggle'),
    chatForm: document.querySelector('.chat-widget__form'),
    chatInput: document.querySelector('.chat-widget__input'),
    chatMessages: document.querySelector('.chat-widget__messages'),
    
    // 프로모션
    promoTimer: document.getElementById('promoTimer'),
    
    // 커서
    cursor: document.querySelector('.cursor'),
    cursorFollower: document.querySelector('.cursor-follower')
};

/* ===================================
   초기화 함수
   =================================== */
function init() {
    // 로딩 화면 제거
    hideLoader();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 애니메이션 초기화
    initAnimations();
    
    // 타이핑 효과 시작
    initTypingEffect();
    
    // 파티클 효과 초기화
    initParticles();
    
    // 프로모션 타이머 시작
    startPromoTimer();
    
    // 스크롤 애니메이션 관찰자 설정
    setupIntersectionObserver();
    
    // 커스텀 커서 초기화
    initCustomCursor();
}

/* ===================================
   로더 관련 함수
   =================================== */
function hideLoader() {
    setTimeout(() => {
        elements.loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 1000);
}

/* ===================================
   이벤트 리스너 설정
   =================================== */
function setupEventListeners() {
    // 스크롤 이벤트
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // 네비게이션 토글
    elements.navToggle?.addEventListener('click', toggleMobileMenu);
    
    // 네비게이션 링크 클릭
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // 테마 토글
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // 포트폴리오 필터
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // FAQ 아코디언
    elements.accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-item__header');
        header?.addEventListener('click', () => toggleAccordion(item));
    });
    
    // 채팅 위젯
    elements.chatToggle?.addEventListener('click', toggleChat);
    elements.chatForm?.addEventListener('submit', handleChatSubmit);
    
    // 리사이즈 이벤트
    window.addEventListener('resize', debounce(handleResize, 300));
}

/* ===================================
   스크롤 관련 함수
   =================================== */
function handleScroll() {
    const scrollY = window.scrollY;
    
    // 네비게이션 스크롤 효과
    if (scrollY > 50) {
        elements.nav?.classList.add('scrolled');
    } else {
        elements.nav?.classList.remove('scrolled');
    }
    
    // 패럴랙스 효과
    applyParallax();
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - config.scrollOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/* ===================================
   네비게이션 관련 함수
   =================================== */
function toggleMobileMenu() {
    elements.navMenu?.classList.toggle('active');
    elements.navToggle?.classList.toggle('active');
}

function handleNavClick(e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    
    // 모바일 메뉴 닫기
    elements.navMenu?.classList.remove('active');
    elements.navToggle?.classList.remove('active');
    
    // 스무스 스크롤
    smoothScroll(target);
}

/* ===================================
   테마 관련 함수
   =================================== */
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    
    // 로컬 스토리지에 저장
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

// 저장된 테마 불러오기
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

/* ===================================
   타이핑 효과
   =================================== */
function initTypingEffect() {
    if (!elements.typingText) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = textContent.typingTexts[textIndex];
        
        if (isDeleting) {
            elements.typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            elements.typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // 타이핑 완료
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, config.typingDelay);
            return;
        }
        
        // 삭제 완료
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textContent.typingTexts.length;
        }
        
        const typeSpeed = isDeleting ? config.typingSpeed / 2 : config.typingSpeed;
        setTimeout(type, typeSpeed);
    }
    
    // 타이핑 시작
    setTimeout(type, config.typingDelay);
}

/* ===================================
   카운터 애니메이션
   =================================== */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = config.counterDuration;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.nextElementSibling?.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ===================================
   파티클 효과
   =================================== */
function initParticles() {
    if (!elements.particles) return;
    
    // 파티클 생성
    for (let i = 0; i < config.particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 랜덤 스타일 설정
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * duration;
    const x = Math.random() * 100;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 51, 102, ${Math.random() * 0.5 + 0.3});
        border-radius: 50%;
        left: ${x}%;
        top: 100%;
        animation: floatUp ${duration}s ${delay}s infinite linear;
    `;
    
    elements.particles?.appendChild(particle);
}

// 파티클 애니메이션 CSS 추가
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

/* ===================================
   포트폴리오 필터
   =================================== */
function handleFilterClick(e) {
    const filter = e.currentTarget.getAttribute('data-filter');
    
    // 버튼 활성화 상태 변경
    elements.filterBtns.forEach(btn => btn.classList.remove('filter-btn--active'));
    e.currentTarget.classList.add('filter-btn--active');
    
    // 포트폴리오 아이템 필터링
    elements.portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

/* ===================================
   FAQ 아코디언
   =================================== */
function toggleAccordion(item) {
    // 다른 아이템 닫기
    elements.accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
    
    // 현재 아이템 토글
    item.classList.toggle('active');
}

/* ===================================
   채팅 위젯
   =================================== */
function toggleChat() {
    elements.chatWidget?.classList.toggle('active');
    
    // 처음 열릴 때 환영 메시지 표시
    if (elements.chatWidget?.classList.contains('active') && 
        elements.chatMessages?.children.length === 1) {
        elements.chatInput?.focus();
    }
}

function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = elements.chatInput?.value.trim();
    if (!message) return;
    
    // 사용자 메시지 추가
    addChatMessage(message, 'user');
    
    // 입력 필드 초기화
    elements.chatInput.value = '';
    
    // 봇 응답 (시뮬레이션)
    setTimeout(() => {
        const randomResponse = textContent.chatMessages.responses[
            Math.floor(Math.random() * textContent.chatMessages.responses.length)
        ];
        addChatMessage(randomResponse, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message chat-message--${sender}`;
    messageEl.innerHTML = `<p>${message}</p>`;
    
    elements.chatMessages?.appendChild(messageEl);
    
    // 스크롤 하단으로
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

/* ===================================
   프로모션 타이머
   =================================== */
function startPromoTimer() {
    if (!elements.promoTimer) return;
    
    let timeRemaining = config.promoTime;
    
    function updateTimer() {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        elements.promoTimer.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeRemaining > 0) {
            timeRemaining--;
            setTimeout(updateTimer, 1000);
        }
    }
    
    updateTimer();
}

/* ===================================
   Intersection Observer (스크롤 애니메이션)
   =================================== */
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // 카운터 애니메이션
                if (entry.target.classList.contains('stat__number')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // 통계 숫자
    elements.statNumbers.forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   커스텀 커서
   =================================== */
function initCustomCursor() {
    if (!elements.cursor || !elements.cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // 마우스 위치 추적
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 커서 애니메이션
    function animateCursor() {
        // 메인 커서
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        elements.cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
        
        // 팔로워 커서
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        elements.cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // 호버 효과
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .pricing-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            elements.cursor.style.transform += ' scale(1.5)';
            elements.cursorFollower.style.transform += ' scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            elements.cursor.style.transform = elements.cursor.style.transform.replace(' scale(1.5)', '');
            elements.cursorFollower.style.transform = elements.cursorFollower.style.transform.replace(' scale(1.5)', '');
        });
    });
}

/* ===================================
   패럴랙스 효과
   =================================== */
function applyParallax() {
    const scrolled = window.pageYOffset;
    
    // 히어로 섹션 패럴랙스
    const heroDevice = document.querySelector('.hero__device');
    if (heroDevice) {
        heroDevice.style.transform = `perspective(1000px) rotateY(-5deg) translateY(${scrolled * 0.2}px)`;
    }
    
    // 파티클 패럴랙스
    if (elements.particles) {
        elements.particles.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

/* ===================================
   유틸리티 함수
   =================================== */
// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 리사이즈 핸들러
function handleResize() {
    // 모바일 메뉴 초기화
    if (window.innerWidth > 768) {
        elements.navMenu?.classList.remove('active');
        elements.navToggle?.classList.remove('active');
    }
}

/* ===================================
   애니메이션 초기화
   =================================== */
function initAnimations() {
    // GSAP 대신 CSS 애니메이션 사용
    document.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

/* ===================================
   가격 계산기
   =================================== */
function initPriceCalculator() {
    const packageInputs = document.querySelectorAll('input[name="package"]');
    const optionInputs = document.querySelectorAll('.calculator__options--checkbox input');
    const selectedItemsEl = document.getElementById('selectedItems');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (!packageInputs.length) return;
    
    function updateCalculator() {
        let total = 0;
        let items = [];
        
        // 선택된 패키지
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        if (selectedPackage) {
            total += parseInt(selectedPackage.value);
            const packageName = selectedPackage.nextElementSibling.querySelector('.calculator__option-name').textContent;
            items.push({
                name: packageName,
                price: parseInt(selectedPackage.value)
            });
        }
        
        // 선택된 옵션들
        optionInputs.forEach(input => {
            if (input.checked) {
                const price = parseInt(input.value);
                const name = input.nextElementSibling.querySelector('.calculator__option-name').textContent;
                total += price;
                items.push({
                    name: name,
                    price: price
                });
            }
        });
        
        // 선택 항목 표시
        selectedItemsEl.innerHTML = items.map(item => `
            <div class="calculator__result-item">
                <span>${item.name}</span>
                <span>₩${item.price.toLocaleString()}</span>
            </div>
        `).join('');
        
        // 총액 표시 (애니메이션)
        animatePrice(totalPriceEl, total);
    }
    
    // 가격 애니메이션
    function animatePrice(element, targetPrice) {
        const currentPrice = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 500;
        const steps = 20;
        const increment = (targetPrice - currentPrice) / steps;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            const newPrice = Math.round(currentPrice + (increment * step));
            element.textContent = `₩${newPrice.toLocaleString()}`;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = `₩${targetPrice.toLocaleString()}`;
            }
        }, duration / steps);
    }
    
    // 이벤트 리스너
    packageInputs.forEach(input => {
        input.addEventListener('change', updateCalculator);
    });
    
    optionInputs.forEach(input => {
        input.addEventListener('change', updateCalculator);
    });
}

// 패키지 선택 핸들러
function selectPackage(packageType) {
    // 계산기로 스크롤
    const calculator = document.querySelector('.pricing__calculator');
    if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 해당 패키지 선택
        setTimeout(() => {
            const packageInput = packageType === 'basic' 
                ? document.querySelector('input[name="package"][value="30000"]')
                : document.querySelector('input[name="package"][value="60000"]');
            
            if (packageInput) {
                packageInput.checked = true;
                packageInput.dispatchEvent(new Event('change'));
                
                // 선택 애니메이션
                const optionBox = packageInput.nextElementSibling;
                optionBox.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    optionBox.style.transform = 'scale(1)';
                }, 300);
            }
        }, 800);
    }
}

// 견적 문의하기 핸들러
function handleQuoteRequest() {
    const selectedItems = [];
    const packageName = document.querySelector('input[name="package"]:checked').nextElementSibling.querySelector('.calculator__option-name').textContent;
    const totalPrice = document.getElementById('totalPrice').textContent;
    
    selectedItems.push(packageName);
    
    document.querySelectorAll('.calculator__options--checkbox input:checked').forEach(input => {
        const name = input.nextElementSibling.querySelector('.calculator__option-name').textContent;
        selectedItems.push(name);
    });
    
    const message = `안녕하세요! 웹사이트 제작 문의드립니다.\n\n` +
                   `선택 항목:\n${selectedItems.join('\n')}\n\n` +
                   `예상 견적: ${totalPrice}`;
    
    // Tawk.to 채팅창 열기
    if (typeof Tawk_API !== 'undefined' && Tawk_API.toggle) {
        // Tawk.to API가 로드되었으면
        Tawk_API.maximize(); // 채팅창 열기
        
        // 메시지 자동 입력 (Tawk.to가 지원하는 경우)
        setTimeout(() => {
            if (Tawk_API.setAttributes) {
                Tawk_API.setAttributes({
                    'quote': message
                }, function(error){});
            }
        }, 1000);
        
        // 클립보드에도 복사
        navigator.clipboard.writeText(message).then(() => {
            alert('견적 내용이 복사되었습니다!\n\n채팅창에 붙여넣기(Ctrl+V) 해주세요.');
        });
    } else {
        // Tawk.to가 아직 로드되지 않았거나 설정되지 않은 경우
        alert('채팅 서비스를 준비중입니다.\n\n아래 내용을 복사해서 문의해주세요:\n\n' + message);
        
        // 클립보드에 복사
        navigator.clipboard.writeText(message);
    }
}

/* ===================================
   초기 실행
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 테마 로드
    loadTheme();
    
    // 초기화
    init();
    
    // 가격 계산기 초기화
    initPriceCalculator();
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('Script error:', e.message);
});