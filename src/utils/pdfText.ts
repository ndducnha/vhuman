/**
 * Rút chữ từ file PDF ngay trong trình duyệt.
 *
 * pdf.js nặng khoảng 400KB nên chỉ nạp khi người dùng thực sự thả một file
 * PDF vào, không nằm trong bundle khởi động. Worker cũng nạp cùng lúc đó.
 *
 * Chỉ đọc được PDF có lớp chữ. PDF scan từ máy quét là ảnh, muốn đọc phải có
 * OCR, và một OCR chạy ngầm rồi trả về rỗng còn tệ hơn là nói thẳng.
 */

import { isReadableFile } from './cvParser'

export interface PdfExtractResult {
  text: string
  pages: number
  /** Đúng khi file mở được nhưng gần như không có chữ, thường là bản scan. */
  looksScanned: boolean
}

/** Giới hạn để một file bất thường không treo trình duyệt. */
const MAX_PAGES = 30

export async function extractPdfText(file: File): Promise<PdfExtractResult> {
  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  const data = new Uint8Array(await file.arrayBuffer())
  const doc = await pdfjs.getDocument({ data }).promise

  const pages = Math.min(doc.numPages, MAX_PAGES)
  const chunks: string[] = []
  for (let i = 1; i <= pages; i += 1) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    // Ghép lại theo dòng: pdf.js trả về từng mảnh chữ rời, mất xuống dòng thì
    // bộ tách khoảng thời gian trong CV không nhận ra được các mốc công việc.
    let lastY: number | null = null
    let line = ''
    const lines: string[] = []
    for (const item of content.items) {
      if (!('str' in item)) continue
      const y = Math.round(item.transform[5])
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line.trim())
        line = ''
      }
      line += item.str + (item.hasEOL ? '\n' : ' ')
      lastY = y
    }
    if (line.trim()) lines.push(line.trim())
    chunks.push(lines.join('\n'))
    page.cleanup()
  }

  await doc.cleanup()
  const text = chunks.join('\n\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
  return { text, pages: doc.numPages, looksScanned: text.replace(/\s/g, '').length < 40 }
}

export function isPdfFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf'
}

/**
 * Đọc một file CV thành chữ, dùng chung cho cả ô tải nhanh lẫn bước tải CV
 * trong luồng tạo hồ sơ, để hai nơi báo lỗi giống hệt nhau.
 *
 * Ném Error với câu tiếng Việt đọc được, vì lời báo này hiện thẳng cho người
 * dùng chứ không phải ghi log.
 */
export async function readCvFile(file: File): Promise<{ text: string; note?: string }> {
  if (isPdfFile(file)) {
    let result: PdfExtractResult
    try {
      result = await extractPdfText(file)
    } catch {
      throw new Error(
        `Không mở được “${file.name}”. File có thể hỏng hoặc đang khoá bằng mật khẩu. ` +
          'Bạn thử mở file rồi dán nội dung vào ô bên dưới.',
      )
    }
    if (result.looksScanned) {
      throw new Error(
        `“${file.name}” là bản scan nên không có lớp chữ để đọc. ` +
          'Bạn dùng bản PDF xuất thẳng từ Word, hoặc dán nội dung vào ô bên dưới.',
      )
    }
    const note =
      result.pages > MAX_PAGES
        ? `Đọc ${MAX_PAGES} trang đầu trong tổng số ${result.pages} trang.`
        : undefined
    return { text: result.text, note }
  }

  if (!isReadableFile(file)) {
    throw new Error(
      `Không đọc được “${file.name}”. Luồng này nhận .pdf, .txt, .md, .csv. ` +
        'Với Word, bạn mở file rồi dán nội dung vào ô bên dưới.',
    )
  }

  return { text: await file.text() }
}
