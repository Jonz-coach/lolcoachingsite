"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Sword, Eye, Target, Timer, Rocket, Play, Video, MessageSquare,
  CalendarCheck, ChartLine, Star, ChevronRight, CheckCircle2, Mail, Upload, ShieldCheck, Compass
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const progressData = [
  { week: "W1", mmr: 450 },
  { week: "W2", mmr: 520 },
  { week: "W3", mmr: 590 },
  { week: "W4", mmr: 630 },
  { week: "W5", mmr: 680 },
  { week: "W6", mmr: 740 },
  { week: "W7", mmr: 770 },
  { week: "W8", mmr: 820 },
];

const faqs = [
  { q: "코칭은 어떤 방식으로 진행되나요?", a: "디스코드로 실시간 화면 공유 코칭 또는 VOD 리뷰 중 선택 가능합니다. 세션 전 설문을 통해 목표/롤 포지션/문제점을 파악한 뒤 맞춤형 커리큘럼으로 진행합니다." },
  { q: "어떤 포지션 코칭이 강점인가요?", a: "정글과 원딜에 특화되어 있으며 파워 스파이크, 오브젝트 설계, 시야 장악 루틴, 교전 설계 등 팀 단위 운영까지 다룹니다." },
  { q: "실력 향상이 없으면 환불이 되나요?", a: "첫 1회 체험 후 만족하지 못하면 전액 환불해 드립니다. 이후 패키지는 세션별 피드백 리포트를 제공하여 누적 성장을 확인합니다." },
  { q: "팀 코칭도 가능한가요?", a: "가능합니다. 팀 전략 미팅, 스크림 VOD 분석, 픽밴 전략, 리뷰 문서 제공까지 포함한 팀 패키지를 제공합니다." },
];

const pkg = [
  { name: "체험 1회", price: "₩49,000", features: ["60분 1:1 실시간 또는 VOD 리뷰", "개인화 체크리스트 제공", "불만족 시 전액 환불"], popular: False },
  { name: "집중 4주", price: "₩179,000", features: ["주 1회 75분 세션 (총 4회)", "주간 과제 & 리플레이 리뷰", "개인화 빌드/루트 시트", "MMR/지표 추적 리포트"], popular: True },
  { name: "팀 패키지", price: "맞춤 견적", features: ["주 2회 팀 세션 + 스크림 리뷰", "픽밴 플랜 & 운영 매뉴얼", "선수 개별 피드백 문서"], popular: False },
];

const resourceCards = [
  { title: "정글 5분 루트 설계 법칙", desc: "초반 변수에 강한 3패턴으로 캠프 낭비 없이 주도권 확보하기.", icon: <Compass className="w-5 h-5" /> },
  { title: "원딜 파워 스파이크 체크리스트", desc: "코어 타이밍, 교전 거리, 시야 연계로 데스 줄이는 7가지 습관." },
  { title: "오브젝트 교전 시야 장악 루틴", desc: "와드/핑크 배치 순서와 라인 상태로 확률을 높이는 운영 프레임." },
];

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      {eyebrow && (<Badge variant="secondary" className="mb-3 text-sm px-3 py-1 rounded-2xl">{eyebrow}</Badge>)}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-3 text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="p-2 rounded-2xl bg-muted w-fit">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function PackageCard({ item, onBook }: { item: any; onBook: (name: string) => void }) {
  return (
    <Card className={`relative h-full ${item.popular ? "ring-2 ring-primary" : ""}`}>
      {item.popular && (<Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">가장 인기</Badge>)}
      <CardHeader>
        <CardTitle className="text-2xl">{item.name}</CardTitle>
        <CardDescription>{item.price}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {item.features.map((f: string) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full mt-4" onClick={() => onBook(item.name)}>
          예약하기
          <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function BookingDialog({ open, setOpen, prefill }: { open: boolean; setOpen: (v: boolean) => void; prefill?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pkgName, setPkgName] = useState(prefill ?? "");
  const [msg, setMsg] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>코칭 예약 요청</DialogTitle>
          <DialogDescription>연락처를 남겨주시면 일정 확정 메일을 보내드립니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium">이름</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="소환사명/실명" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">이메일</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">패키지</label>
            <Input value={pkgName} onChange={(e) => setPkgName(e.target.value)} placeholder="체험 1회 / 집중 4주 / 팀 패키지" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">메모</label>
            <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="포지션, 목표 티어, 고민 등을 적어주세요." />
          </div>
          <Button className="mt-2">
            <Mail className="w-4 h-4 mr-2" /> 신청 보내기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Testimonial({ name, note, tag }: { name: string; note: string; tag?: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <Badge variant="secondary">{tag ?? "솔랭 향상"}</Badge>
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{note}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<string | undefined>(undefined);
  const onBook = (p?: string) => { setPrefill(p); setOpen(true); };
  const rating = 4.9;
  const chartTheme = useMemo(() => ({ grid: "#e5e7eb", axis: "#9ca3af" }), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-semibold tracking-tight">J&ADC Coaching</span>
            <Badge className="ml-2" variant="outline">Master</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <a href="#features" className="hover:opacity-80">강점</a>
            <a href="#packages" className="hover:opacity-80">패키지</a>
            <a href="#progress" className="hover:opacity-80">성과</a>
            <a href="#resources" className="hover:opacity-80">자료실</a>
            <a href="#faq" className="hover:opacity-80">FAQ</a>
          </nav>
          <Button onClick={() => onBook()} size="sm">
            <CalendarCheck className="w-4 h-4 mr-1" /> 예약하기
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                정글·원딜 전문 <span className="underline decoration-primary/50">맞춤형 롤 코칭</span>
              </motion.h1>
              <p className="mt-4 text-lg text-muted-foreground">
                젠지 코치 아카데미 수료 · DRX 3군 연습생 육성 경험. 실전에서 통하는 루틴과 <span className="font-medium text-slate-800"> 파워 스파이크</span> 기반 의사결정으로 승률을 바꿉니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Badge variant="secondary" className="text-sm">마스터 300점 최고 600점</Badge>
                <Badge variant="outline" className="text-sm">평균 평점 {rating} / 5.0</Badge>
                <Badge variant="outline" className="text-sm">1:1 · 팀 코칭</Badge>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <Button size="lg" onClick={() => onBook("체험 1회")}>지금 체험하기</Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#packages">패키지 보기</a>
                </Button>
              </div>
            </div>
            <div>
              <Card className="p-6 md:p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-2xl p-4 bg-muted">
                    <Sword className="mx-auto" />
                    <p className="font-semibold mt-2">교전 설계</p>
                    <p className="text-xs text-muted-foreground">조건 맞추기 · 각도</p>
                  </div>
                  <div className="rounded-2xl p-4 bg-muted">
                    <Eye className="mx-auto" />
                    <p className="font-semibold mt-2">시야 루틴</p>
                    <p className="text-xs text-muted-foreground">오브젝트 장악</p>
                  </div>
                  <div className="rounded-2xl p-4 bg-muted">
                    <Brain className="mx-auto" />
                    <p className="font-semibold mt-2">판단력</p>
                    <p className="text-xs text-muted-foreground">파워 스파이크</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Timer className="w-4 h-4"/> 실전 루틴 과제</div>
                  <div className="flex items-center gap-2"><ChartLine className="w-4 h-4"/> MMR/지표 추적</div>
                  <div className="flex items-center gap-2"><Video className="w-4 h-4"/> VOD 리뷰</div>
                  <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4"/> 1:1 DM 피드백</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="Why Us" title="승률을 바꾸는 4가지 코칭 원칙" subtitle="루틴·지표·프레임·복기. 실전에서 바로 쓰이는 언어로 정리합니다." />
        <div className="grid md:grid-cols-4 gap-5">
          <Feature icon={<Target />} title="목표 역산" desc="티어·승률·KDA 등 목표를 역산하여 주간 과제를 설계합니다." />
          <Feature icon={<Rocket />} title="파워 스파이크" desc="레벨/아이템/조합 스파이크를 수치로 정의하고 콜로 전환합니다." />
          <Feature icon={<Eye />} title="시야 프레임" desc="오브젝트 타이밍에 맞춘 와드/라인/각도 프레임을 습관화합니다." />
          <Feature icon={<Play />} title="리뷰 루프" desc="VOD 리뷰→과제→다음 세션으로 학습 루프를 닫습니다." />
        </div>
      </section>

      <section id="packages" className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="Plans" title="원하는 방식으로 시작하세요" subtitle="첫 세션은 가볍게, 성과는 확실하게." />
        <div className="grid md:grid-cols-3 gap-6">
          {pkg.map((p) => (<PackageCard key={p.name} item={p} onBook={onBook} />))}
        </div>
      </section>

      <section id="progress" className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="Progress" title="8주 성과 예시" subtitle="세션마다 체크리스트로 습관을 점검하고, 수치로 성장을 확인합니다." />
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke={chartTheme.axis} />
                  <YAxis stroke={chartTheme.axis} />
                  <Tooltip />
                  <ReferenceLine y={600} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="mmr" dot activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">지표 트래킹</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 오브젝트 전 사전 체크 6항목</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 시야 루틴(핑크/트링킷/각도) 준수율</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 교전 설계 성공률(조건 충족 후 진입)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 리콜 타이밍 적중률(골드 효율)</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section id="resources" className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="Library" title="무료 자료실" subtitle="세션 유무와 관계없이 누구나 활용 가능한 핵심 요약 카드." />
        <div className="grid md:grid-cols-3 gap-6">
          {resourceCards.map((c) => (
            <Card key={c.title} className="hover:shadow-md transition">
              <CardHeader className="space-y-3">
                <div className="p-2 rounded-2xl bg-muted w-fit">{c.icon}</div>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">다운로드</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="vod" className="mt-10">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vod">VOD 리뷰</TabsTrigger>
            <TabsTrigger value="notes">체크리스트</TabsTrigger>
            <TabsTrigger value="team">팀 코칭</TabsTrigger>
          </TabsList>
          <TabsContent value="vod" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>VOD 제출</CardTitle>
                <CardDescription>경기 링크나 파일을 올려주세요. 핵심 구간 타임스탬프가 있으면 더 좋아요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-6 rounded-2xl border border-dashed text-center">
                  <Upload className="mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">여기에 드래그 앤 드롭 또는 클릭하여 선택</p>
                </div>
                <Button variant="outline">예시 가이드 다운로드</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>개인화 체크리스트</CardTitle>
                <CardDescription>포지션/챔피언에 맞춰 과제로 전환 가능한 문장으로 제공합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 첫 바위게 전 미드/정글 주도권 확인</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 원딜 1·2코어 타이밍 전 라인 주도권 확보</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 드래곤 60초 전 와드/핑크/각도 세팅</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> 템포 손실 리콜 금지(골드 800↑면 라인푸시 후 리콜)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>팀 코칭 구성</CardTitle>
                <CardDescription>스크림 리뷰 + 픽밴 브리핑 + 전략 문서 제공.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl p-4 bg-muted">
                  <p className="font-semibold">스크림 리뷰</p>
                  <p className="text-sm text-muted-foreground">하이라이트/저점 구간 명확화</p>
                </div>
                <div className="rounded-2xl p-4 bg-muted">
                  <p className="font-semibold">픽밴 전략</p>
                  <p className="text-sm text-muted-foreground">상대 대응 플랜/연계 콤보</p>
                </div>
                <div className="rounded-2xl p-4 bg-muted">
                  <p className="font-semibold">리포트</p>
                  <p className="text-sm text-muted-foreground">선수별 피드백 문서</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="Reviews" title="수강생 후기" subtitle="수강생들의 실제 개선 포인트와 결과 요약입니다." />
        <div className="grid md:grid-cols-3 gap-6">
          <Testimonial name="플래→에메 2주" note="정글 루트와 라인 상태 기준 잡아주신 게 제일 컸어요. 한타 참는 법 배워서 데스가 절반으로." tag="정글" />
          <Testimonial name="골드→다이아" note="원딜 파워 스파이크 타이밍과 포지셔닝 체크리스트로 교전 생존률이 상승." tag="원딜" />
          <Testimonial name="대회 준비 팀" note="픽밴 문서+스크림 리뷰로 운영 합의가 빨라졌습니다." tag="팀 코칭" />
        </div>
      </section>

      <section id="faq" className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <SectionHeader eyebrow="FAQ" title="자주 묻는 질문" subtitle="여기에 없는 질문은 우측 하단 문의로 연락주세요." />
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <Card key={f.q}>
              <CardHeader>
                <CardTitle className="text-lg">{f.q}</CardTitle>
                <CardDescription>{f.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-semibold">오늘부터 성장 루틴 시작하기</h3>
          <p className="text-muted-foreground mt-2">체험 1회로 방향을 잡고, 4주 집중으로 습관을 바꿔 보세요.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => onBook("집중 4주")}>집중 4주 예약</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">문의하기</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>문의 남기기</DialogTitle>
                  <DialogDescription>이메일을 남겨주시면 24시간 내 회신합니다.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Input placeholder="you@example.com" />
                  <Textarea placeholder="내용을 적어주세요." />
                  <Button><Mail className="w-4 h-4 mr-2" /> 보내기</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </section>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} J&ADC Coaching · 모든 권리 보유</p>
          <div className="flex items-center gap-4 text-sm">
            <a className="hover:opacity-80" href="#">이용약관</a>
            <a className="hover:opacity-80" href="#">개인정보처리방침</a>
            <a className="hover:opacity-80" href="#">연락처</a>
          </div>
        </div>
      </footer>

      <BookingDialog open={open} setOpen={setOpen} prefill={prefill} />
    </div>
  );
}
