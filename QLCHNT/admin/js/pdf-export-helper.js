// PDF Export Helper - Dùng html2pdf.js để xuất tiếng Việt chính xác
// Sử dụng font Roboto từ Google Fonts

/**
 * Xuất HTML table thành PDF với font tiếng Việt
 * @param {string} title - Tiêu đề báo cáo
 * @param {Array} headers - Mảng header ['STT', 'Tên', ...]
 * @param {Array} rows - Mảng dữ liệu [[1, 'ABC', ...], ...]
 * @param {string} filename - Tên file xuất
 * @param {string} orientation - 'portrait' hoặc 'landscape'
 */
function exportTableToPDF(title, headers, rows, filename, orientation = 'landscape') {
  if (!rows || rows.length === 0) {
    alert('⚠️ Không có dữ liệu để xuất!');
    return Promise.reject('No data');
  }

  // Tạo HTML table
  const htmlContent = `
    <div style="font-family: 'Roboto', sans-serif; padding: 20px;">
      <h1 style="text-align: center; color: #333; margin-bottom: 5px; font-size: 20px;">
        ${title}
      </h1>
      <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 20px;">
        Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: ${orientation === 'landscape' ? '10px' : '11px'};">
        <thead>
          <tr style="background-color: #4CAF50; color: white;">
            ${headers.map(h => `
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: 600;">
                ${h}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : 'white'};">
              ${row.map(cell => `
                <td style="border: 1px solid #ddd; padding: 6px;">
                  ${cell !== null && cell !== undefined ? cell : ''}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 20px; text-align: center; color: #888; font-size: 10px;">
        <p>TDUNG DECOR - Hệ thống quản lý nội thất</p>
      </div>
    </div>
  `;

  // Tạo element tạm
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  document.body.appendChild(tempDiv);

  // Cấu hình html2pdf
  const opt = {
    margin: [10, 10, 15, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: orientation,
      compress: true
    }
  };

  // Xuất PDF
  return html2pdf()
    .set(opt)
    .from(tempDiv)
    .save()
    .then(() => {
      document.body.removeChild(tempDiv);
      return { success: true, count: rows.length };
    })
    .catch(error => {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      throw error;
    });
}

/**
 * Xuất nội dung HTML tùy chỉnh thành PDF
 * @param {string} htmlContent - HTML content
 * @param {string} filename - Tên file
 * @param {object} options - Tùy chọn html2pdf
 */
function exportCustomHTMLToPDF(htmlContent, filename, options = {}) {
  const defaultOptions = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const opt = { ...defaultOptions, ...options };

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  document.body.appendChild(tempDiv);

  return html2pdf()
    .set(opt)
    .from(tempDiv)
    .save()
    .then(() => {
      document.body.removeChild(tempDiv);
      return { success: true };
    })
    .catch(error => {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
      throw error;
    });
}
