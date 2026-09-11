import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

/**
 * Chặn lỗi lúc render để trang không bao giờ trắng câm lặng.
 *
 * Trang trắng là trạng thái tệ nhất: người dùng không biết chuyện gì xảy ra và
 * cũng không báo lại được gì hữu ích. Ở đây ta hiện thông báo đọc được, kèm nội
 * dung lỗi để chụp màn hình gửi đi, và hai lối thoát: tải lại, hoặc xoá dữ liệu
 * cục bộ phòng khi localStorage hỏng.
 */
interface State {
  error: Error | null
  info: string
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, info: '' }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info: info.componentStack?.slice(0, 600) ?? '' })
    // Giữ lại trong console để còn dò được khi mở DevTools.
    console.error('VHuman gặp lỗi khi hiển thị:', error)
  }

  private reset = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('vhuman:'))
        .forEach((k) => localStorage.removeItem(k))
    } catch {
      /* bỏ qua, vẫn tải lại được */
    }
    window.location.hash = '#/'
    window.location.reload()
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    return (
      <div style={wrap}>
        <div style={card}>
          <p style={eyebrow}>VHuman</p>
          <h1 style={title}>Trang này gặp lỗi khi hiển thị</h1>
          <p style={body}>
            Bản thử nghiệm lưu dữ liệu trên trình duyệt của bạn. Nếu dữ liệu cũ không còn khớp với
            phiên bản mới, trang có thể lỗi. Thử tải lại trước. Nếu vẫn lỗi, xoá dữ liệu cục bộ.
          </p>

          <div style={row}>
            <button type="button" style={primary} onClick={() => window.location.reload()}>
              Tải lại trang
            </button>
            <button type="button" style={secondary} onClick={this.reset}>
              Xoá dữ liệu và về trang chủ
            </button>
          </div>

          <details style={details}>
            <summary style={summary}>Chi tiết lỗi, chụp màn hình phần này khi báo lỗi</summary>
            <pre style={pre}>
              {String(error?.message || error)}
              {info ? `\n${info}` : ''}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}

/* Style viết thẳng bằng inline: nếu CSS không tải được thì màn này vẫn đọc được. */
const wrap: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 24, background: '#FFFBF0', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
}
const card: React.CSSProperties = {
  maxWidth: 640, width: '100%', background: '#FAF5E9', border: '1px solid #E4D9C4',
  borderRadius: 14, padding: 28,
}
const eyebrow: React.CSSProperties = {
  margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em',
  textTransform: 'uppercase', color: '#186848',
}
const title: React.CSSProperties = { margin: '12px 0 0', fontSize: 24, color: '#1C1917' }
const body: React.CSSProperties = { margin: '12px 0 0', fontSize: 15, lineHeight: 1.6, color: '#615041' }
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }
const primary: React.CSSProperties = {
  padding: '11px 20px', borderRadius: 999, border: '1px solid #186848',
  background: '#186848', color: '#FFFBF0', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
const secondary: React.CSSProperties = {
  padding: '11px 20px', borderRadius: 999, border: '1px solid #C9B99A',
  background: 'transparent', color: '#1C1917', fontSize: 14, fontWeight: 600, cursor: 'pointer',
}
const details: React.CSSProperties = { marginTop: 22 }
const summary: React.CSSProperties = { fontSize: 13, color: '#615041', cursor: 'pointer' }
const pre: React.CSSProperties = {
  marginTop: 10, padding: 12, background: '#F3ECDC', border: '1px solid #E4D9C4',
  borderRadius: 8, fontSize: 12, lineHeight: 1.5, color: '#1C1917',
  whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 260, overflow: 'auto',
}
