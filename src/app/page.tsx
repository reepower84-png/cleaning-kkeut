"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

const navItems = [
  { id: "home", label: "홈" },
  { id: "services", label: "서비스" },
  { id: "why-us", label: "왜 청소대행끗인가" },
  { id: "reviews", label: "고객 후기" },
  { id: "contact", label: "문의하기" },
];

const services = [
  {
    title: "입주청소",
    description: "새로운 시작을 위한 완벽한 청소. 이사 전후 구석구석 깨끗하게 정리해드립니다.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "상가청소",
    description: "첫인상이 중요한 비즈니스 공간. 고객을 맞이할 준비를 도와드립니다.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "특수청소",
    description: "일반 청소로 해결되지 않는 곰팡이, 화재복구, 유품정리까지 전문적으로 처리합니다.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "정기청소",
    description: "매주, 매월 정기적인 관리로 항상 쾌적한 환경을 유지해드립니다.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// 로고 색상 기반 커스텀 컬러
const colors = {
  primary: "#3ECDC6",
  primaryDark: "#2BA8A2",
  primaryLight: "#E0F7F6",
  primaryLighter: "#F0FDFB",
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("home")}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/clean_logo-removebg-preview.png"
                alt="청소대행끗"
                width={140}
                height={40}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium transition-colors relative py-2"
                  style={{
                    color: activeSection === item.id ? colors.primary : "#374151",
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.color = colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.color = "#374151";
                    }
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: mobileMenuOpen ? colors.primary : undefined }}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeSection === item.id ? colors.primaryLight : undefined,
                    color: activeSection === item.id ? colors.primary : "#374151",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-16"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryLighter} 0%, white 50%, ${colors.primaryLighter} 100%)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: colors.primary }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up">
            말로 잘하는 청소가 아니라,
            <br />
            <span style={{ color: colors.primary }}>결과로 책임지는 청소</span>를 합니다.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            입주청소, 상가청소, 특수청소, 정기청소
            <br />
            수천 건의 현장에서 검증된 전문 청소 서비스
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 text-white font-semibold rounded-full transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              무료 상담 신청하기
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="px-8 py-4 bg-white font-semibold rounded-full border-2 transform hover:scale-105 transition-all"
              style={{ borderColor: colors.primary, color: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryLight)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              서비스 알아보기
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              전문 청소 서비스
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              어떤 공간이든, 어떤 상황이든 완벽하게 해결해드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f3f4f6")}
              >
                <div
                  className="mb-6 group-hover:scale-110 transition-transform"
                  style={{ color: colors.primary }}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p
              className="text-2xl md:text-3xl font-bold mb-8"
              style={{ color: colors.primary }}
            >
              &ldquo;보이는 곳은 물론, 보이지 않는 곳까지 정성껏 청소합니다.&rdquo;
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 text-white font-semibold rounded-full transform hover:scale-105 transition-all shadow-lg"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              지금 바로 상담받기
            </button>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              왜 청소대행끗인가?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              한 번 맡기면, 다른 곳은 생각나지 않습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">검증된 실력</h3>
              <p className="text-gray-600">
                수천 건의 현장 경험으로 쌓아온 노하우.
                <br />
                눈으로 확인하고 결정하세요.
              </p>
            </div>

            <div className="text-center p-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">신속한 대응</h3>
              <p className="text-gray-600">
                문의부터 방문까지 빠른 처리.
                <br />
                고객의 시간을 소중히 생각합니다.
              </p>
            </div>

            <div className="text-center p-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">고객 만족</h3>
              <p className="text-gray-600">
                작업 후 100% 만족 보장.
                <br />
                꼼꼼한 마무리까지 책임집니다.
              </p>
            </div>
          </div>

          <div
            className="rounded-3xl p-8 md:p-12 text-center text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              수천 건 현장에서 검증된 청소,
              <br />
              눈으로 확인하고 결정하세요.
            </h3>
            <p className="mb-8 max-w-2xl mx-auto opacity-90">
              청소대행끗은 결과로 증명합니다. 지금 바로 상담을 신청하시고 깨끗한 공간을 경험하세요.
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 bg-white font-semibold rounded-full transform hover:scale-105 transition-all"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryLight)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              무료 상담 신청하기
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고객 후기
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              청소대행끗을 경험한 고객님들의 생생한 후기입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;이사 후 입주청소 맡겼는데, 정말 새 집처럼 깨끗해졌어요!
                화장실 곰팡이까지 완벽하게 제거해주셔서 감동받았습니다.
                다음에도 꼭 다시 이용할게요.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  김
                </div>
                <div>
                  <p className="font-medium text-gray-900">김**</p>
                  <p className="text-sm text-gray-500">입주청소 · 인천 계양구</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;사무실 정기청소 3개월째 이용 중입니다.
                매번 꼼꼼하게 청소해주시고, 직원분들도 친절하세요.
                사무실이 항상 깔끔해서 업무 효율도 올라간 느낌이에요!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  이
                </div>
                <div>
                  <p className="font-medium text-gray-900">이**</p>
                  <p className="text-sm text-gray-500">정기청소 · 서울 강서구</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;카페 오픈 전 상가청소 의뢰했어요.
                인테리어 후 먼지가 엄청났는데 반짝반짝하게 만들어주셨어요.
                덕분에 기분 좋게 오픈할 수 있었습니다!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  박
                </div>
                <div>
                  <p className="font-medium text-gray-900">박**</p>
                  <p className="text-sm text-gray-500">상가청소 · 인천 부평구</p>
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;욕실 곰팡이가 너무 심해서 특수청소 요청했는데,
                전문 장비로 완벽하게 제거해주셨어요.
                냄새도 사라지고 욕실이 완전 새것 같아요. 강추합니다!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  최
                </div>
                <div>
                  <p className="font-medium text-gray-900">최**</p>
                  <p className="text-sm text-gray-500">특수청소 · 인천 남동구</p>
                </div>
              </div>
            </div>

            {/* Review 5 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;10년 된 아파트 입주청소 맡겼는데 진짜 놀랐어요.
                레인지후드, 창틀, 베란다까지 구석구석 깨끗하게 해주셨어요.
                가격도 합리적이고 결과도 만족스러워요!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  정
                </div>
                <div>
                  <p className="font-medium text-gray-900">정**</p>
                  <p className="text-sm text-gray-500">입주청소 · 부천시</p>
                </div>
              </div>
            </div>

            {/* Review 6 */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                &ldquo;음식점 운영하는데 주방 후드 청소가 고민이었어요.
                기름때가 완전히 제거되고 환기도 잘 되니까 요리하기 편해졌어요.
                위생 점검도 문제없이 통과했습니다!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  한
                </div>
                <div>
                  <p className="font-medium text-gray-900">한**</p>
                  <p className="text-sm text-gray-500">상가청소 · 인천 연수구</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 text-white font-semibold rounded-full transform hover:scale-105 transition-all shadow-lg"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              나도 청소대행끗 경험하기
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              무료 상담 신청
            </h2>
            <p className="text-lg text-gray-600">
              아래 양식을 작성해주시면 빠르게 연락드리겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all outline-none"
                  placeholder="홍길동"
                  style={{
                    boxShadow: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all outline-none"
                  placeholder="010-1234-5678"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  상담문의 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all resize-none outline-none"
                  placeholder="청소 종류, 평수, 희망 일정 등을 적어주세요."
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-white font-semibold rounded-xl transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = colors.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                {isSubmitting ? "전송 중..." : "상담 신청하기"}
              </button>

              <a
                href="http://pf.kakao.com/_xjXuhX/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 font-semibold rounded-xl transform hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: "#FEE500", color: "#191919" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.79 1.86 5.23 4.65 6.6-.21.79-.76 2.86-.87 3.3-.13.55.2.55.42.4.17-.12 2.74-1.86 3.85-2.62.65.09 1.3.14 1.95.14 5.52 0 10-3.48 10-7.82C22 6.48 17.52 3 12 3z"/>
                </svg>
                카카오톡으로 상담하기
              </a>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
                  상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                  전송에 실패했습니다. 다시 시도해주세요.
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/clean_logo-removebg-preview.png"
                alt="청소대행끗"
                width={180}
                height={50}
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400">결과로 책임지는 전문 청소 서비스</p>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-sm text-gray-400 space-y-2">
              <p>상호: 제이코리아 | 대표: 이주영</p>
              <p>사업자등록번호: 278-30-01540</p>
              <p>주소: 서울특별시 강남구 도곡로84길 6, B1층 25-68호</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} 청소대행끗. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Kakao Chat Floating Button */}
      <a
        href="http://pf.kakao.com/_xjXuhX/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        style={{
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <Image
          src="/카톡_원형_로고.png"
          alt="카카오톡 상담"
          width={64}
          height={64}
          className="w-full h-full rounded-full"
        />
      </a>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
