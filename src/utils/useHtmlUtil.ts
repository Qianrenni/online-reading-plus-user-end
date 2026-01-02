
// paginationService.ts

// /**
//  * 获取 1rem 对应的像素值
//  */
// function getRemSizeInPx(): number {
//   const div = document.createElement('div');
//   div.style.cssText = 'width: 1rem; position: absolute; visibility: hidden;';
//   document.body.appendChild(div);
//   const width = parseFloat(getComputedStyle(div).width);
//   document.body.removeChild(div);
//   return width;
// }

// /**
//  * 获取每页可用高度（减去 5rem 的边距）
//  */
// function getPageHeight(): number {
//   return window.innerHeight - 5 * getRemSizeInPx();
// }

// /**
//  * 展平 HTML，保留指定标签，文本节点转为 <p> 并添加首行缩进
//  * @param html 原始 HTML 字符串
//  * @returns 展平后的完整 HTML 字符串（含 doctype、html、head、body）
//  */
// export function flattenHTML(html: string): string {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(html, 'text/html');
//   const head = doc.head;
//   const body = doc.body;

//   const preservedTags = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'IMG', 'UL', 'OL', 'LI']);

//   const result: string[] = [];

//   function dfs(node: ChildNode): void {
//     for (const child of Array.from(node.childNodes)) {
//       if (child.nodeType === Node.ELEMENT_NODE) {
//         const el = child as HTMLElement;
//         const tagName = el.tagName;

//         if (preservedTags.has(tagName)) {
//           // 保留原始属性，仅对 P 和 H* 添加缩进
//           if (tagName === 'P' || tagName.startsWith('H')) {
//             // 克隆元素以避免修改原始 DOM
//             const clone = el.cloneNode(true) as HTMLElement;
//             // 在 innerHTML 前加 4 个 &nbsp;
//             clone.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + clone.innerHTML;
//             result.push(clone.outerHTML);
//           } else {
//             result.push(el.outerHTML);
//           }
//         } else {
//           dfs(el); // 继续遍历子节点
//         }
//       } else if (child.nodeType === Node.TEXT_NODE) {
//         const text = child.textContent?.trim();
//         if (text && text !== '') {
//           result.push(`<p>&nbsp;&nbsp;&nbsp;&nbsp;${text}</p>`);
//         }
//       }
//     }
//   }

//   dfs(body);

//   return `<!DOCTYPE html>
// <html lang="en">
// ${head.outerHTML}
// <body>
// ${result.join('\n')}
// </body>
// </html>`;
// }

// /**
//  * 将 HTML 按指定行高和字距分页
//  * @param html 原始 HTML 字符串
//  * @param lineHeight 行高（单位：px）
//  * @param letterSpacing 字距（单位：px）
//  * @returns 分页后的 HTML 字符串数组，每页包含完整 <html> 结构
//  */
// export async function splitHtmlToPages(
//   html: string,
//   lineHeight: number,
//   letterSpacing: number
// ): Promise<string[]> {
//   if (!html.trim()) return [];

//   const pageHeight = getPageHeight();

//   // 展平 HTML
//   const flattenedHtml = flattenHTML(html);

//   const parser = new DOMParser();
//   const doc = parser.parseFromString(flattenedHtml, 'text/html');
//   const headerHtml = Array.from(doc.head.children)
//     .map(el => el.outerHTML)
//     .join('\n') + '<style>img { max-width: 100%; display: block; }</style>';

//   const container = document.createElement('div');
//   container.innerHTML = doc.body.innerHTML;
//   const children = Array.from(container.children);

//   const pages: string[] = [];
//   const tempContainer = document.createElement('div');

//   // 设置统一渲染样式
//   Object.assign(tempContainer.style, {
//     position: 'absolute',
//     visibility: 'hidden',
//     lineHeight: `${lineHeight}px`,
//     letterSpacing: `${letterSpacing}px`,
//     width: '100%',
//     boxSizing: 'border-box',
//     padding: '0',
//     margin: '0',
//   });

//   document.body.appendChild(tempContainer);

//   try {
//     for (const node of children) {
//       const clone = node.cloneNode(true) as HTMLElement;
//       tempContainer.appendChild(clone);

//       // 如果是图片且未加载完成，等待加载
//       if (clone.tagName === 'IMG' && !(clone as HTMLImageElement).complete) {
//         await new Promise<void>(resolve => {
//           (clone as HTMLImageElement).onload = resolve;
//           (clone as HTMLImageElement).onerror = resolve; // 避免卡死
//         });
//       }

//       // 强制重排
//       void tempContainer.offsetHeight;

//       if (tempContainer.offsetHeight > pageHeight) {
//         if (tempContainer.children.length > 1) {
//           // 弹出最后一个元素
//           const lastChild = tempContainer.lastElementChild!;
//           lastChild.remove();

//           // 保存当前页
//           const currentPage = Array.from(tempContainer.children)
//             .map(el => el.outerHTML)
//             .join('');
//           pages.push(`<html><head>${headerHtml}</head><body>${currentPage}</body></html>`);

//           // 清空并放入弹出的元素
//           tempContainer.innerHTML = '';
//           tempContainer.appendChild(lastChild);
//         } else {
//           // 单个元素超限，单独成页
//           pages.push(`<html><head>${headerHtml}</head><body>${clone.outerHTML}</body></html>`);
//           tempContainer.innerHTML = '';
//         }
//       }
//     }

//     // 处理最后一页
//     if (tempContainer.children.length > 0) {
//       const finalPage = Array.from(tempContainer.children)
//         .map(el => el.outerHTML)
//         .join('');
//       pages.push(`<html><head>${headerHtml}</head><body>${finalPage}</body></html>`);
//     }
//   } finally {
//     document.body.removeChild(tempContainer);
//   }

//   return pages;
// };

/**
 * 对 HTML 应用指定的行高和字距，不进行分页
 * @param html 原始 HTML 字符串
 * @returns 应用样式后的完整 HTML 字符串
 */
export function applySpacingToHtml(
  html: string,
): string {
  if (!html.trim()) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 克隆 head 内容
  const headContent = Array.from(doc.head.children)
    .map(el => el.outerHTML)
    .join('\n');

  // 添加全局样式（覆盖 img、body 等）
  const extraStyle = `
    <style>
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
      p {
        margin-top:1rem;
        margin-bottom:1rem;
      }
    </style>
  `;

  // 获取 body 内容
  const bodyContent = doc.body.innerHTML;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${headContent}
  ${extraStyle}
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

/**
 * 
 * @param str  字符串
 * @returns  是否是html
 */
export function isHtml(str:string) {
  // 简单判断：是否包含成对的 <...> 且不是转义字符
  return /<[a-z][\s\S]*>/i.test(str.trim());
}