// PDF Generation utility using HTML5 Canvas and download

// SasaMum Logo SVG as base64
const SASAMUM_LOGO_SVG = `data:image/svg+xml;base64,${btoa(`
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 85C50 85 15 60 15 35C15 25 22.5 17.5 32.5 17.5C40 17.5 45 22.5 50 30C55 22.5 60 17.5 67.5 17.5C77.5 17.5 85 25 85 35C85 60 50 85 50 85Z" fill="url(#heartGradient)" stroke="#e06b75" stroke-width="2"/>
  <circle cx="50" cy="45" r="8" fill="#ffffff" opacity="0.9"/>
  <ellipse cx="50" cy="60" rx="6" ry="12" fill="#ffffff" opacity="0.9"/>
  <circle cx="35" cy="30" r="1.5" fill="#f4a5b9"/>
  <circle cx="65" cy="35" r="1" fill="#f4a5b9"/>
  <circle cx="70" cy="55" r="1.5" fill="#f4a5b9"/>
  <circle cx="30" cy="55" r="1" fill="#f4a5b9"/>
  <defs>
    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e06b75"/>
      <stop offset="50%" stop-color="#f4a5b9"/>
      <stop offset="100%" stop-color="#e06b75"/>
    </linearGradient>
  </defs>
</svg>
`)}`;

// Common watermark HTML
const getWatermarkHTML = () => `
  <div style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0.05;
    font-size: 80px;
    font-weight: bold;
    color: #e91e63;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
  ">
    SasaMum
  </div>
  <div style="
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0.03;
    z-index: 0;
    pointer-events: none;
  ">
    <img src="${SASAMUM_LOGO_SVG}" style="width: 200px; height: 200px;" />
  </div>
  <div style="
    position: fixed;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0.03;
    z-index: 0;
    pointer-events: none;
  ">
    <img src="${SASAMUM_LOGO_SVG}" style="width: 200px; height: 200px;" />
  </div>
`;

// Common header HTML with logo
const getHeaderHTML = (title: string, subtitle?: string) => `
  <div class="header">
    <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
      <img src="${SASAMUM_LOGO_SVG}" style="width: 60px; height: 60px;" />
      <div class="logo">SasaMum</div>
    </div>
    <h1>${title}</h1>
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
  </div>
`;

export const generateBirthPlanPDF = async (birthPlan: any[], userName: string, dueDate: string) => {
  // Create a formatted HTML string for the birth plan
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #e91e63;
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #e91e63;
      margin: 20px 0 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    
    .info-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      border-left: 4px solid #e91e63;
      position: relative;
      z-index: 1;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .info-label {
      font-weight: 600;
      color: #555;
    }
    
    .info-value {
      color: #333;
    }
    
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
      position: relative;
      z-index: 1;
    }
    
    .section-header {
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .preference-list {
      list-style: none;
      padding: 0;
    }
    
    .preference-item {
      padding: 12px 20px;
      margin: 8px 0;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #9c27b0;
      position: relative;
      padding-left: 50px;
    }
    
    .preference-item:before {
      content: "✓";
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: #9c27b0;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    
    .signature-box {
      margin: 30px 0;
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      position: relative;
      z-index: 1;
    }
    
    .signature-line {
      margin: 15px 0;
      padding-top: 20px;
      border-top: 2px solid #333;
      width: 300px;
    }
    
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
      position: relative;
      z-index: 1;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${getWatermarkHTML()}
  ${getHeaderHTML('My Birth Plan', 'A guide to help communicate my birth preferences')}
  
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Mother's Name:</span>
      <span class="info-value">${userName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Due Date:</span>
      <span class="info-value">${new Date(dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Plan Created:</span>
      <span class="info-value">${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</span>
    </div>
  </div>
  
  <div class="disclaimer">
    <strong>⚠️ Important Note:</strong> This birth plan represents my preferences under normal circumstances. 
    I understand that medical situations may require changes to this plan, and I trust my healthcare team 
    to make decisions in the best interest of my baby and myself.
  </div>
  
  ${birthPlan.map(section => `
    <div class="section">
      <div class="section-header">${section.category}</div>
      <ul class="preference-list">
        ${section.preferences.map((pref: string) => `
          <li class="preference-item">${pref}</li>
        `).join('')}
      </ul>
    </div>
  `).join('')}
  
  <div class="signature-box">
    <h3 style="margin-bottom: 20px; color: #555;">Acknowledgment</h3>
    <p style="margin-bottom: 30px; color: #666;">
      I have discussed these preferences with my healthcare provider and understand that 
      flexibility may be necessary based on medical circumstances.
    </p>
    <div style="display: flex; justify-content: space-between;">
      <div>
        <div class="signature-line"></div>
        <p style="margin-top: 5px; color: #666;">Mother's Signature</p>
      </div>
      <div>
        <div class="signature-line"></div>
        <p style="margin-top: 5px; color: #666;">Date</p>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p><strong>SasaMum</strong> - Supporting Kenyan Mothers Every Step of the Way</p>
    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>
</body>
</html>
  `;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Birth-Plan-${userName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

// Generic PDF generator for any report
export const generateGenericPDF = async (
  title: string,
  subtitle: string,
  sections: Array<{ header: string; content: string }>,
  fileName: string,
  userName?: string
) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #e91e63;
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #e91e63;
      margin: 20px 0 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
      position: relative;
      z-index: 1;
    }
    
    .section-header {
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .section-content {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #9c27b0;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${getWatermarkHTML()}
  ${getHeaderHTML(title, subtitle)}
  
  ${userName ? `
    <div style="text-align: center; margin-bottom: 30px; color: #666; position: relative; z-index: 1;">
      Prepared for: <strong>${userName}</strong>
    </div>
  ` : ''}
  
  ${sections.map(section => `
    <div class="section">
      <div class="section-header">${section.header}</div>
      <div class="section-content">${section.content}</div>
    </div>
  `).join('')}
  
  <div class="footer">
    <p><strong>SasaMum</strong> - Supporting Kenyan Mothers Every Step of the Way</p>
    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

// Generate Medical Report PDF
export const generateMedicalReportPDF = async (
  reportData: {
    userName: string;
    reportType: string;
    vitals?: any;
    symptoms?: any;
    medications?: any;
    notes?: string;
  }
) => {
  const sections = [];
  
  if (reportData.vitals) {
    sections.push({
      header: 'Vital Signs',
      content: Object.entries(reportData.vitals)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('')
    });
  }
  
  if (reportData.symptoms) {
    sections.push({
      header: 'Symptoms',
      content: Object.entries(reportData.symptoms)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('')
    });
  }
  
  if (reportData.medications) {
    sections.push({
      header: 'Current Medications',
      content: reportData.medications
        .map((med: any) => `<p>• ${med.name} - ${med.dosage} (${med.frequency})</p>`)
        .join('')
    });
  }
  
  if (reportData.notes) {
    sections.push({
      header: 'Additional Notes',
      content: `<p>${reportData.notes}</p>`
    });
  }
  
  return generateGenericPDF(
    `${reportData.reportType} Report`,
    'Comprehensive health summary',
    sections,
    `${reportData.reportType}-Report-${reportData.userName.replace(/\s+/g, '-')}`,
    reportData.userName
  );
};

// Generate Pregnancy Summary PDF
export const generatePregnancySummaryPDF = async (
  pregnancyData: {
    userName: string;
    currentWeek: number;
    dueDate: string;
    milestones: any[];
    appointments: any[];
  }
) => {
  const sections = [
    {
      header: 'Pregnancy Overview',
      content: `
        <p><strong>Current Week:</strong> ${pregnancyData.currentWeek}</p>
        <p><strong>Due Date:</strong> ${new Date(pregnancyData.dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        <p><strong>Weeks Remaining:</strong> ${40 - pregnancyData.currentWeek}</p>
      `
    },
    {
      header: 'Milestones Achieved',
      content: pregnancyData.milestones
        .map(m => `<p>✓ Week ${m.week}: ${m.description}</p>`)
        .join('')
    },
    {
      header: 'Upcoming Appointments',
      content: pregnancyData.appointments
        .map(a => `<p>• ${a.date} - ${a.title}</p>`)
        .join('')
    }
  ];
  
  return generateGenericPDF(
    'Pregnancy Journey Summary',
    'Your comprehensive pregnancy overview',
    sections,
    `Pregnancy-Summary-${pregnancyData.userName.replace(/\s+/g, '-')}`,
    pregnancyData.userName
  );
};

// Generate Partograph PDF
export const generatePartographPDF = async (
  partographData: {
    patientName: string;
    admissionTime: Date;
    gravida: string;
    parity: string;
    entries: any[];
  }
) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Partograph - ${partographData.patientName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #e91e63;
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #e91e63;
      margin: 20px 0 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    
    .header-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin: 20px 0;
      position: relative;
      z-index: 1;
    }
    
    .info-item {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #e91e63;
    }
    
    .label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    .value {
      font-size: 16px;
      color: #333;
      margin-top: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
      position: relative;
      z-index: 1;
    }
    
    th {
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      color: white;
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 10px 8px;
      border: 1px solid #ddd;
    }
    
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  ${getWatermarkHTML()}
  ${getHeaderHTML('WHO PARTOGRAPH', 'Labor Progress Monitoring Chart')}
  
  <div class="header-info">
    <div class="info-item">
      <div class="label">Patient Name</div>
      <div class="value">${partographData.patientName}</div>
    </div>
    <div class="info-item">
      <div class="label">Date</div>
      <div class="value">${partographData.admissionTime.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</div>
    </div>
    <div class="info-item">
      <div class="label">Gravida/Parity</div>
      <div class="value">${partographData.gravida}/${partographData.parity}</div>
    </div>
    <div class="info-item">
      <div class="label">Admission Time</div>
      <div class="value">${partographData.admissionTime.toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
    </div>
  </div>

  <h2 style="color: #e91e63; margin: 30px 0 15px; position: relative; z-index: 1;">Labor Progress</h2>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Hours</th>
        <th>Dilation (cm)</th>
        <th>FHR (bpm)</th>
        <th>Contractions</th>
        <th>Descent</th>
        <th>BP</th>
        <th>Pulse</th>
        <th>Temp</th>
        <th>Liquor</th>
      </tr>
    </thead>
    <tbody>
      ${partographData.entries.map(entry => `
        <tr>
          <td>${entry.time.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</td>
          <td>${entry.hoursInLabor.toFixed(1)}</td>
          <td>${entry.cervicalDilation}</td>
          <td>${entry.fetalHeartRate}</td>
          <td>${entry.contractions}/10min (${entry.contractionDuration}s)</td>
          <td>${entry.fetalHeadDescent}/5</td>
          <td>${entry.bloodPressureSystolic}/${entry.bloodPressureDiastolic}</td>
          <td>${entry.pulse}</td>
          <td>${entry.temperature}°C</td>
          <td>${entry.liquor}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>SasaMum</strong> - WHO Partograph Implementation</p>
    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Partograph-${partographData.patientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

// Generate Contraction Monitor PDF
export const generateContractionMonitorPDF = async (
  contractionData: {
    contractions: any[];
    userName?: string;
  }
) => {
  const totalContractions = contractionData.contractions.length;
  const avgDuration = totalContractions > 0
    ? contractionData.contractions.reduce((sum, c) => sum + c.duration, 0) / totalContractions
    : 0;
  
  // Calculate average interval using startTime (which is a Date object)
  const avgInterval = totalContractions > 1
    ? contractionData.contractions.slice(1).reduce((sum, c, i) => {
        const prev = contractionData.contractions[i];
        return sum + (c.startTime.getTime() - prev.startTime.getTime()) / 1000 / 60;
      }, 0) / (totalContractions - 1)
    : 0;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contraction Monitor Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #e91e63;
      position: relative;
      z-index: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #e91e63;
      margin: 20px 0 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
    
    .summary-box {
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin: 20px 0;
      position: relative;
      z-index: 1;
    }
    
    .summary-item {
      margin: 10px 0;
      font-size: 18px;
    }
    
    .summary-label {
      opacity: 0.9;
      font-size: 14px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      position: relative;
      z-index: 1;
    }
    
    th {
      background: linear-gradient(135deg, #e91e63, #9c27b0);
      color: white;
      padding: 12px;
      text-align: left;
    }
    
    td {
      padding: 12px;
      border: 1px solid #ddd;
    }
    
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    .alert {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      position: relative;
      z-index: 1;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  ${getWatermarkHTML()}
  ${getHeaderHTML('Labor Contraction Monitor', 'Detailed contraction tracking and analysis')}
  
  ${contractionData.userName ? `
    <div style="text-align: center; margin-bottom: 30px; color: #666; position: relative; z-index: 1;">
      Prepared for: <strong>${contractionData.userName}</strong>
    </div>
  ` : ''}
  
  <div class="summary-box">
    <div class="summary-item">
      <div class="summary-label">Total Contractions</div>
      <div><strong>${totalContractions}</strong></div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Average Duration</div>
      <div><strong>${avgDuration.toFixed(1)} seconds</strong></div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Average Interval</div>
      <div><strong>${avgInterval.toFixed(1)} minutes</strong></div>
    </div>
  </div>

  ${avgInterval > 0 && avgInterval < 5 ? `
    <div class="alert">
      <strong>⚠️ Important:</strong> Contractions are very close together (averaging ${avgInterval.toFixed(1)} minutes apart). 
      Please contact your healthcare provider or proceed to the hospital immediately.
    </div>
  ` : ''}

  <h2 style="color: #e91e63; margin: 30px 0 15px; position: relative; z-index: 1;">Contraction Log</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Time</th>
        <th>Duration</th>
        <th>Intensity</th>
        <th>Interval</th>
      </tr>
    </thead>
    <tbody>
      ${contractionData.contractions.map((c, i) => {
        const interval = i > 0 
          ? ((c.startTime.getTime() - contractionData.contractions[i - 1].startTime.getTime()) / 1000 / 60).toFixed(1)
          : '-';
        return `
        <tr>
          <td>${i + 1}</td>
          <td>${c.timestamp}</td>
          <td>${c.duration}s</td>
          <td>${c.intensity}/5</td>
          <td>${interval} ${interval !== '-' ? 'min' : ''}</td>
        </tr>
      `}).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>SasaMum</strong> - Labor Contraction Monitor</p>
    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Contraction-Monitor-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};
