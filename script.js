// 인터랙션 및 접근성 향상 스크립트
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-navigation.main-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      menuToggle.setAttribute(
        "aria-label",
        expanded ? "메뉴 열기" : "메뉴 닫기"
      );
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
      })
    );

    // 메뉴 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
      }
    });

    // ESC 키로 메뉴 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
        menuToggle.focus();
      }
    });
  }

  // 섹션 fade-in 관찰자
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const observer = !prefersReduced
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      )
    : null;

  // hero 섹션 즉시 표시하고 나머지 섹션은 관찰
  document.querySelectorAll(".fade-in").forEach((el) => {
    if (el.classList.contains("hero") || prefersReduced) {
      el.classList.add("visible");
    } else if (observer) {
      observer.observe(el);
    }
  });

  // 키보드 포커스 스타일 개선 (탭 사용 시만 표시)
  let usingKeyboard = false;
  function handleFirstTab(e) {
    if (e.key === "Tab") {
      usingKeyboard = true;
      document.documentElement.classList.add("using-keyboard");
      window.removeEventListener("keydown", handleFirstTab);
      window.addEventListener("mousedown", handleMouseDownOnce);
    }
  }
  function handleMouseDownOnce() {
    usingKeyboard = false;
    document.documentElement.classList.remove("using-keyboard");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  }
  window.addEventListener("keydown", handleFirstTab);
})();
