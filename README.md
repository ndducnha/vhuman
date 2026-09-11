# VHuman

**Bản demo đang chạy: https://ndducnha.github.io/vhuman/**

> **Hiểu con người. Tìm đúng hướng đi.**
>
> Nền tảng Talent Intelligence kết hợp CV, kỹ năng và hồ sơ cá nhân để giúp một cá nhân
> khám phá nghề nghiệp phù hợp, và giúp doanh nghiệp tìm ứng viên phù hợp hơn với công việc,
> người quản lý và môi trường làm việc.

Đây là **MVP demo chạy hoàn toàn client-side**: không backend, không database, không API key.
Clone về là chạy được ngay, và deploy thẳng lên GitHub Pages.

---

## Giới thiệu

VHuman đặt ba nguồn tín hiệu cạnh nhau:

| Nguồn | Trả lời câu hỏi |
| --- | --- |
| **CV & Kinh nghiệm** | Người này **đã làm gì**? |
| **Kỹ năng** | Người này **có thể làm gì**? |
| **Personal Profile** | Người này có xu hướng phù hợp với **cách làm việc và môi trường nào**? |

Lớp thứ ba: *Private Personal Reflection Layer*: được xây dựng từ thông tin ngày giờ sinh và
diễn đạt thành **tám chiều đo** về phong cách làm việc: tư duy phân tích, sáng tạo, lãnh đạo,
giao tiếp, độc lập, làm việc nhóm, chấp nhận rủi ro, ổn định.

> **Quan điểm sản phẩm.** VHuman không phải công cụ bói toán. Mọi diễn đạt đều ở dạng *xu hướng*
> và *mức độ phù hợp*, không bao giờ ở dạng định mệnh hay chắc chắn. Giao diện được thiết kế như
> một Talent Intelligence Platform: không có lá số, cung hoàng đạo, ngũ hành hay bát quái.

---

## Dữ liệu demo nạp sẵn

Mở app lần đầu là **mọi trang đã có dữ liệu**: không phải điền wizard 5 bước mới xem được kết quả:

| Nạp sẵn | Nội dung |
| --- | --- |
| Hồ sơ ứng viên mẫu | Nguyễn Văn An : Senior Data Analyst, 6.5 năm kinh nghiệm, 12 kỹ năng, 2 bằng cấp, 2 công việc |
| Kết quả phân tích | Personal Profile (8 chiều) + Top 5 nghề, cao nhất **Data Science 88%** |
| Shortlist nhà tuyển dụng | 3 ứng viên đã lưu sẵn |
| Hồ sơ người quản lý | 3 hồ sơ, đã chọn sẵn một hồ sơ để Compatibility chạy ngay |

Hồ sơ mẫu được gắn nhãn **“Hồ sơ mẫu”** kèm nút *Tạo hồ sơ của tôi*, nên người xem
luôn biết đâu là dữ liệu minh hoạ và bạn vẫn demo được luồng onboarding thật.

Điều khiển nhanh trong **Cài đặt → Chế độ demo**:

- **Nạp lại dữ liệu demo đầy đủ**: quay về trạng thái đầy dữ liệu giữa buổi demo
- **Bắt đầu với hồ sơ trống**: xoá hồ sơ mẫu để demo luồng tạo CV 5 bước từ đầu
- **Đặt lại dữ liệu demo**: xoá sạch mọi thay đổi rồi nạp lại bộ dữ liệu đầy đủ

Trạng thái trống được ghi nhớ: đã xoá thì tải lại trang sẽ **không** tự nạp lại.

---

## Demo concept

Kịch bản demo trong khoảng 3 phút:

```
VHuman
  → Trải nghiệm với tư cách Ứng viên
  → Tạo CV (5 bước)  →  Nhập ngày giờ sinh  →  Chọn skills
  → Generate Profile
  → Top Career Matches

  → Đổi vai trò → Nhà tuyển dụng
  → Tìm ứng viên → kéo thanh trượt Personal Profile → Candidate Ranking

  → Tab Compatibility
  → Tạo hồ sơ CEO → Find Compatible Candidates → Candidate Ranking
```

Hồ sơ bạn tự tạo cũng xuất hiện trong kết quả tìm kiếm ở chế độ nhà tuyển dụng: nên bạn có thể
"tìm thấy chính mình" khi đổi vai trò.

---

## Tính năng

### Dành cho ứng viên
- **Việc làm**: danh sách tin tuyển dụng xếp theo mức phù hợp với hồ sơ, lọc theo lĩnh vực,
  địa điểm, cấp bậc
- **Chi tiết tin** kèm phân tích khớp kỹ năng, kinh nghiệm, hồ sơ cá nhân, và kỹ năng còn thiếu
- **Ứng tuyển** kèm lời giới thiệu, rút đơn, theo dõi trạng thái từng đơn
- **Lộ trình 24 tháng**: gộp kỹ năng còn thiếu của nhóm nghề phù hợp nhất với gợi ý hành động
  theo đại vận và lưu niên, tự đánh dấu hoàn thành
- **Hai chế độ xem: Evidence ⇄ Destiny**
  - *Evidence*: CV, kỹ năng, kinh nghiệm, Personal Profile 8 chiều, Top nghề phù hợp
  - *Destiny*: Personal Blueprint: nhóm sao Tử Vi, Đại Vận, Lưu Niên kèm gợi ý hành động
- **Xuất hồ sơ JSON**: schema `vhuman.profile/v1`, **không kèm ngày giờ sinh**
- **Wizard tạo CV 5 bước**: thông tin cá nhân, học vấn, kinh nghiệm, kỹ năng, mong muốn nghề nghiệp
- **Tự động lưu nháp** vào `localStorage`; refresh trang không mất dữ liệu
- **Skill selector** với tìm kiếm không dấu, lọc theo nhóm, 4 mức độ thành thạo, thêm kỹ năng tuỳ ý
- **Màn hình phân tích** mô phỏng quá trình dựng Personal Profile
- **Career Dashboard**: Personal Profile (thanh đo + radar chart), điểm mạnh, phong cách làm việc,
  hướng phát triển, môi trường phù hợp
- **Top 5 nghề phù hợp** kèm phân rã điểm (kỹ năng / hồ sơ cá nhân / kinh nghiệm)
- **Chi tiết nghề**: vì sao phù hợp, skills đã có, skills nên bổ sung, vị trí gợi ý, so sánh
  radar giữa hồ sơ của bạn và đặc điểm nhóm nghề

### Dành cho nhà tuyển dụng
- **Đơn ứng tuyển**: xem toàn bộ hồ sơ đã nộp, đổi trạng thái theo sáu giai đoạn, ghi chú nội bộ
- **Chi tiết tin tuyển dụng**: đơn đã nộp cho tin đó, cộng danh sách ứng viên phù hợp trong nguồn
- **Ứng viên đã lưu** có giai đoạn theo dõi và ghi chú riêng
- **Dashboard riêng** với sidebar (desktop) / drawer (mobile)
- **Mode 1: Tìm theo Personal Profile**: 8 thanh trượt mô tả mẫu hồ sơ mong muốn
- **Mode 2: Tìm theo Compatibility**: tạo hồ sơ người quản lý / CEO, xếp hạng ứng viên theo mức
  độ tương thích về phong cách làm việc
- **Bộ lọc chuyên môn**: từ khoá, kỹ năng, kinh nghiệm, seniority, ngành nghề, địa điểm, học vấn,
  hình thức làm việc, ngân sách lương
- **Sắp xếp** theo phù hợp tổng thể / skills / compatibility / kinh nghiệm
- **Lưu ứng viên**, trang ứng viên đã lưu, tin tuyển dụng, hồ sơ công ty, cài đặt
- **Chi tiết ứng viên** với Career Profile, Career Fit và phần Compatibility kèm radar so sánh

### Chung
- **Light / Dark mode** đầy đủ, theo hệ điều hành + nút chuyển thủ công, ghi nhớ lựa chọn
- Badge **MVP Demo** kèm tooltip giải thích
- **Đặt lại dữ liệu demo**: xoá sạch `localStorage` và nạp lại dữ liệu mẫu
- Disclaimer ở footer, thông báo quyền riêng tư ở form nhập ngày giờ sinh
- Responsive desktop / tablet / mobile, không tràn ngang
- Toàn bộ vùng chạm ≥ 44px trên mobile, focus ring rõ ràng cho bàn phím
- Tôn trọng `prefers-reduced-motion`

---

## Lớp Destiny (Tử Vi)

Ngoài 8 chiều đo Personal Profile, engine còn suy ra:

| Thành phần | Nội dung |
| --- | --- |
| **Nhóm sao** | 1 trong 4 bộ: Tử-Phủ-Vũ-Tướng · Sát-Phá-Tham · Cơ-Nguyệt-Đồng-Lương · Cự Môn-Nhật-Hoả |
| **Đại Vận** | Chu kỳ 10 năm đang diễn ra, kèm định hướng và gợi ý hành động |
| **Lưu Niên** | Năm đang xét + **Can Chi tính bằng công thức** (1984 = Giáp Tý, `year − 4` index vào hai vòng) |

Nhóm sao còn *nudge* nhẹ vào matching qua `starAffinityBonus` (mặc định **4 điểm**) khi
lĩnh vực nghề trùng với `affinityFields`: đủ để thấy ảnh hưởng nhưng không bao giờ
lấn át bằng chứng từ CV và kỹ năng.

Toàn bộ vẫn **tất định** và vẫn đi qua interface `AstrologyEngine`, nên thay thuật toán
thật vào sau vẫn chỉ là sửa một dòng.

### Quyền riêng tư của lớp Destiny

- Bước 1 của wizard có **checkbox đồng ý PDPA**: không tích thì không đi tiếp được
- Ngày giờ sinh **không** hiển thị ở màn hình nhà tuyển dụng
- Bản xuất JSON **loại bỏ hoàn toàn** ngày/giờ/nơi sinh, chỉ mang kết quả đã suy ra
  cùng một `signature` không đảo ngược được, kèm cờ `birth_data_included: false`

---

## Logo & nhận diện

Nguồn: `logo.png` ở thư mục gốc (1254x1254, nền trắng đặc). Các bản dùng trong app
được tạo sẵn và đặt trong `src/assets/`:

| Tệp | Dùng ở đâu |
| --- | --- |
| `logo-mark.png` | Biểu tượng chữ V, nền trong suốt, cho giao diện sáng |
| `logo-mark-dark.png` | Bản nâng vùng tối, cho giao diện tối |
| `public/favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png` | Icon trình duyệt |

Ảnh gốc có nền trắng đặc, không có kênh alpha. Nền đã được tách bằng flood fill từ
viền vào, nên vùng trắng nằm bên trong logo vẫn được giữ. Biên được làm mềm để logo
không bị cắt cứng.

Bản lockup đầy đủ trong `logo.png` có sẵn tagline tiếng Anh nên không đưa vào giao diện.
Trong app, wordmark "VHuman" được dựng bằng chữ để đổi màu theo theme.

Màu chủ đạo của giao diện lấy trực tiếp từ logo: `#186848`. Nhờ vậy nút bấm, hoạ tiết
và logo cùng một hệ màu.

Bản gốc quá tối cho nền đen: điểm đậm nhất chỉ đạt 1.7:1 so với nền tối, nửa trái chữ V
gần như biến mất. Bản dark dùng đường cong gamma 0.52 để nâng vùng tối lên 3.6:1, đồng
thời không làm cháy vùng sáng như cách tăng sáng đều.

---

## Design system

Giao diện theo hướng **cultural editorial**: nền giấy kem ấm, chữ display đậm,
màu mực ấm, hoạ tiết đường nét truyền thống dùng tiết chế.

| Lớp | Giá trị |
| --- | --- |
| **Typography** | Space Grotesk (UI/body) + Bricolage Grotesque (display headings) |
| **Background / Card** | Kem `#FFFBF0` / `#FAF5E9` : không dùng trắng tinh |
| **Primary** | Xanh rêu đậm `#0F766E` : dùng cho nút, trạng thái active, thanh đo |
| **Crimson** | `#9D2933` : chỉ dùng cho display heading và CTA chính |
| **Gold** | `#EACD76` : chỉ dùng cho hoạ tiết |
| **Hình khối** | Nút bo tròn hoàn toàn (pill), thẻ phẳng không đổ bóng |
| **Hoạ tiết** | Góc triện, vân/sóng, đường kẻ kép : SVG tự vẽ, `aria-hidden` |
| **Motion** | 150-300ms, `ease-out`, chỉ animate `transform`/`opacity` |

### Token-driven theming

Mọi màu đều trỏ tới một CSS custom property chứa bộ ba kênh `R G B`:

```
src/index.css        →  :root  và  :root[data-theme="dark"]
tailwind.config.js   →  ánh xạ token sang class Tailwind
```

Nhờ đó `bg-primary`, `text-ink-muted`, `border-line`… tự đổi theo theme, và các
modifier độ trong suốt (`bg-primary/10`) vẫn hoạt động. Muốn đổi nhận diện toàn
bộ sản phẩm chỉ cần sửa khối biến trong `src/index.css`.

Theme được áp dụng **trước lần vẽ đầu tiên** bằng một script inline nhỏ trong
`index.html`, nên không có hiện tượng nháy sai màu khi tải trang.

### Kiểm chứng độ tương phản

Toàn bộ cặp màu chữ/nền đạt WCAG AA (≥ 4.5:1 cho chữ thường, ≥ 3:1 cho thanh đo
và thành phần đồ hoạ) ở **cả hai theme**: đã đo bằng script tự động, 68/68 cặp đạt.

Màu không bao giờ là tín hiệu duy nhất: mức độ phù hợp luôn kèm nhãn chữ
("Rất phù hợp") và một chấm tròn, nên vẫn đọc được khi mù màu.

---

## Architecture

```text
src/
  components/
    ui/                   Design system: Button, Card, Badge, ProgressBar,
                          ScoreCircle, TraitBar, SkillTag, Avatar, Modal,
                          EmptyState, PageHeader, Field, Tooltip
    CandidateCard.tsx     CareerCard.tsx      ProfileCard.tsx
    SearchFilters.tsx     ManagerProfileForm.tsx  TraitRadar.tsx
    SiteHeader.tsx        SiteFooter.tsx      Logo.tsx
    DemoBadge.tsx         ResetDemoButton.tsx ThemeToggle.tsx

  layouts/
    PublicLayout.tsx      CandidateLayout.tsx   RecruiterLayout.tsx

  pages/
    LandingPage.tsx       ChooseRolePage.tsx    AboutPage.tsx
    OnboardingPage.tsx    onboarding/Step*.tsx  onboarding/AnalyzingScreen.tsx
    CandidateDashboardPage.tsx  CareersPage.tsx  CareerDetailPage.tsx
    RecruiterOverviewPage.tsx   RecruiterSearchPage.tsx
    CandidateDetailPage.tsx     SavedCandidatesPage.tsx
    RecruiterJobsPage.tsx       RecruiterCompanyPage.tsx
    RecruiterSettingsPage.tsx   NotFoundPage.tsx

  services/
    astrology/
      types.ts                  Interface AstrologyEngine
      MockAstrologyEngine.ts    Bản mô phỏng tất định (MVP)
      AstrologyEngine.ts        ★ Nơi chọn implementation
    matching/
      types.ts                  Interface + MatchingConfig
      config.ts                 ★ Toàn bộ trọng số chấm điểm
      MatchingEngine.ts         Các công thức tính điểm
    storage/
      StorageService.ts         Bọc localStorage theo namespace

  data/
    skills.ts       143 kỹ năng, có alias tiếng Việt + tìm kiếm không dấu
    careers.ts      34 nhóm nghề theo taxonomy VN, 9 lĩnh vực
    starGroups.ts   4 bộ sao Tử Vi (dữ liệu tham chiếu)
    candidates.ts   34 ứng viên hư cấu
    demoProfile.ts  Hồ sơ ứng viên mẫu + shortlist nạp sẵn lần đầu chạy
    recruiters.ts   Nhà tuyển dụng + hồ sơ người quản lý mẫu
    jobs.ts         Tin tuyển dụng mẫu

  types/index.ts    Toàn bộ domain model
  utils/            cn, hash, score, format, filters, canChi, exportProfile
  hooks/            useDemoSession, useCandidateDraft, useCandidates,
                    useMediaQuery, useTheme, useThemeColors
```

### Nguyên tắc kiến trúc

**1. UI không bao giờ phụ thuộc vào implementation cụ thể.**
Không có logic Tử Vi nào nằm trong component React. Toàn bộ đi qua interface `AstrologyEngine`.

**2. Engine phải tất định.**
Cùng `birthDate + birthTime + gender + birthPlace` → luôn ra cùng một hồ sơ, trên mọi thiết bị.
Không dùng `Math.random()` ở bất kỳ đâu: đầu vào được hash bằng FNV-1a thành seed, rồi đưa qua
PRNG Mulberry32 (`src/utils/hash.ts`).

**3. Trọng số nằm một chỗ duy nhất.**
Mọi công thức đọc từ `services/matching/config.ts`:

```ts
Career Match      = Skill 40%  + Experience 25% + Personal Profile 35%
Compatibility     = Skill 35%  + Career 25%     + Compatibility   40%
Profile Search    = Skill 40%  + Experience 20% + Personal Profile 40%
```

**4. Sẵn sàng cho backend.**
Cấu trúc hiện tại ánh xạ trực tiếp sang:
`Frontend → API → VHuman Core Engine → Astrology Engine → Career Matching Engine → Database`.
`services/astrology/types.ts` đã có sẵn `AsyncAstrologyEngine` cho bản HTTP.

---

## Chạy local

```bash
git clone <repository-url>
cd vhuman
npm install
npm run dev
```

Mở http://localhost:5173

Không cần `.env`, không cần API key, không cần database.

## Build

```bash
npm run build     # tsc -b && vite build  →  dist/
npm run preview   # xem thử bản production
```

Các script khác:

```bash
npm run typecheck   # kiểm tra TypeScript
npm run lint        # ESLint
```

---

## Deploy GitHub Pages

Bản demo hiện deploy từ nhánh `gh-pages`, vì token đang dùng chưa có scope `workflow`
nên chưa đẩy được file CI lên.

### Cách đang dùng: deploy thủ công từ nhánh gh-pages

```bash
npm run build
touch dist/.nojekyll
cp dist/index.html dist/404.html
# đẩy nội dung dist lên nhánh gh-pages
```

Trong Settings của repo, Pages đang trỏ vào nhánh `gh-pages`, thư mục gốc.

### Cách nên dùng về lâu dài: CI tự động

Cấp thêm quyền cho token rồi đẩy file workflow lên:

```bash
gh auth refresh -s workflow
# xoá dòng .github/workflows/deploy.yml trong .gitignore
git add .github/workflows/deploy.yml && git commit -m "ci: deploy Pages" && git push
```

Sau đó vào Settings, Pages, đổi Source sang GitHub Actions. Từ đó mỗi lần đẩy lên
`main` là tự build và deploy.

### Cách cũ (tham khảo)

1. Push code lên GitHub (nhánh `main`).
2. Vào **Repository → Settings → Pages → Source → chọn "GitHub Actions"**.
3. Push tiếp một commit vào `main` (hoặc chạy tay workflow trong tab **Actions**).

Workflow `.github/workflows/deploy.yml` sẽ tự động: `npm ci` → `npm run typecheck` →
`npm run build` → deploy `dist/`. Chỉ dùng `GITHUB_TOKEN` mặc định, không cần thêm secret nào.

URL sau khi deploy:

```
https://<tên-tài-khoản>.github.io/<tên-repository>/
```

### Vì sao chạy được trên GitHub Pages

- `vite.config.ts` đặt `base: './'` → build chạy được ở mọi sub-path, không cần sửa cấu hình theo
  tên repository.
- App dùng **HashRouter** (`/#/candidate/profile`) → GitHub Pages không có SPA rewrite nên đường
  dẫn thường sẽ 404 khi refresh; hash route thì không.
- `public/.nojekyll` để Pages không bỏ qua thư mục `_`-prefixed.

---

## Phần nào đang dùng mock?

| Thành phần | Trạng thái | Ghi chú |
| --- | --- | --- |
| **Astrology / Personal Profile** | 🟡 Mock tất định | `MockAstrologyEngine` : hash ngày giờ sinh → 8 trait |
| **Matching Engine** | 🟡 Công thức giả lập | Thật về mặt cơ chế, trọng số cần hiệu chỉnh bằng dữ liệu |
| **Ứng viên** | 🟡 34 hồ sơ hư cấu | Không phải người thật |
| **Hồ sơ ứng viên mẫu** | 🟡 Nhân vật hư cấu | Nạp sẵn lần đầu chạy, gắn nhãn “Hồ sơ mẫu” |
| **Nhà tuyển dụng / công ty / tin tuyển dụng** | 🟡 Dữ liệu mẫu | |
| **Đăng nhập** | 🟡 Chọn vai trò, không xác thực | Lưu ở `localStorage` |
| **Liên hệ ứng viên** | 🟡 Modal hiển thị thông tin | Không gửi email/SMS |
| **Nhóm sao & vận trình** | 🟡 Suy ra tất định từ seed | Bộ sao/đại vận là placeholder, thay bằng engine thật sau |
| **Kỹ năng & nhóm nghề** | 🟢 Taxonomy nghề VN thật | Dùng lại được khi lên production |
| **Domain model & UI** | 🟢 Thật | Không cần viết lại khi có backend |

---

## Tích hợp thuật toán Tử Vi thật

Cần sửa **đúng một dòng**. Không component, page hay hook nào phải thay đổi.

**Bước 1.** Tạo `src/services/astrology/RealAstrologyEngine.ts`, implement interface trong
`src/services/astrology/types.ts`:

```ts
export interface AstrologyEngine {
  readonly name: string
  readonly version: string

  analyze(profile: BirthProfile): AstrologyProfile
  calculateCareerFit(profile: AstrologyProfile, career: Career): number
  calculateCompatibility(a: AstrologyProfile, b: AstrologyProfile): number
  describeCompatibility(a: AstrologyProfile, b: AstrologyProfile): CompatibilityResult
}
```

**Bước 2.** Sửa `src/services/astrology/AstrologyEngine.ts`:

```diff
- import { MockAstrologyEngine } from './MockAstrologyEngine'
+ import { RealAstrologyEngine } from './RealAstrologyEngine'

- export const astrologyEngine: AstrologyEngine = new MockAstrologyEngine()
+ export const astrologyEngine: AstrologyEngine = new RealAstrologyEngine()
```

Xong.

### Các file cần chú ý khi tích hợp

| File | Vai trò |
| --- | --- |
| `src/services/astrology/AstrologyEngine.ts` | **★ Dòng duy nhất cần sửa** |
| `src/services/astrology/types.ts` | Hợp đồng interface (có sẵn bản `Async` cho HTTP) |
| `src/types/index.ts` | `AstrologyProfile`, `BirthProfile`, `TraitScores` |
| `src/services/matching/config.ts` | Hiệu chỉnh trọng số chấm điểm |
| `src/services/matching/MatchingEngine.ts` | Công thức matching, nếu muốn đổi |

**Yêu cầu bắt buộc với engine thật:** phải **tất định**: cùng đầu vào phải cho cùng đầu ra, vì
điểm số được hiển thị cạnh nhau và so sánh qua nhiều phiên làm việc, nhiều thiết bị.

Nếu engine thật cần gọi API bất đồng bộ, dùng `AsyncAstrologyEngine` và bọc thêm một lớp cache
đồng bộ, hoặc chuyển các điểm gọi trong hook sang `useEffect`.

---

## Quyền riêng tư

Ngày giờ sinh là dữ liệu cá nhân. Trong bản demo này toàn bộ dữ liệu được lưu bằng `localStorage`
ngay trên trình duyệt người dùng: không có máy chủ, không có cơ sở dữ liệu, không có lệnh gọi API
nào được thực hiện. Người dùng có thể xoá sạch bằng nút **"Đặt lại dữ liệu demo"** trong Cài đặt.

---

## Disclaimer

> VHuman cung cấp công cụ tham khảo nhằm hỗ trợ khám phá bản thân và định hướng nghề nghiệp.
> Các kết quả không nên được sử dụng như căn cứ duy nhất cho quyết định tuyển dụng, giáo dục
> hoặc nghề nghiệp.

Toàn bộ ứng viên, nhà tuyển dụng, công ty và tin tuyển dụng trong bản demo đều là hư cấu.

---

## Tech stack

React 18 · Vite 5 · TypeScript (strict) · Tailwind CSS 3 (token-driven, light/dark) ·
React Router 6 (HashRouter) · Recharts · Lucide Icons · Space Grotesk + Bricolage Grotesque · localStorage

Không dùng backend, database, hay dịch vụ bên ngoài.
