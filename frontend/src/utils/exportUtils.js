import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const exportToWord = async (jsonData, option) => {
  const isCriterios = option === 'criterios';
  const items = jsonData.criteria;

  const docChildren = [
    new Paragraph({
      children: [new TextRun({ text: 'Documento generado con IA, revise su contenido.', bold: true, size: 32 })],
      spacing: { after: 300 },
    }),
  ];

  items.forEach((item, index) => {
    let title = `${index + 1}. ${item.title || 'Sin título'}`;
    if (item.jiraKey) title += ` (${item.jiraKey})`;

    docChildren.push(new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: '0000FF', size: 26 })],
      spacing: { after: 200 },
    }));

    if (item.description) {
      docChildren.push(new Paragraph({
        children: [new TextRun({ text: item.description, size: 22 })],
        spacing: { after: 200 },
      }));
    }

    if (isCriterios) {
      item.subtasks?.forEach((sub) => {
        let subText = `- ${sub.description}`;
        if (sub.jiraKey) subText += ` (${sub.jiraKey})`;
        docChildren.push(new Paragraph({ children: [new TextRun({ text: subText, size: 20 })] }));
      });
    } else {
      docChildren.push(new Paragraph({ children: [new TextRun({ text: 'Entrada:', bold: true })] }));
      docChildren.push(new Paragraph({ children: [new TextRun((item.preconditions || []).join('\n'))] }));
      docChildren.push(new Paragraph({ children: [new TextRun({ text: 'Salida esperada:', bold: true })] }));
      docChildren.push(new Paragraph({ children: [new TextRun(item.expectedOutput || '')] }));
      docChildren.push(new Paragraph({ children: [new TextRun({ text: 'Jira padre:', color: '0000FF', bold: true })] }));
      docChildren.push(new Paragraph({ children: [new TextRun(item.jiraCode || '')] }));
    }

    docChildren.push(new Paragraph(''));
  });

  const doc = new Document({ sections: [{ children: docChildren }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'documento-ia.docx');
};

export const exportToPDF = (jsonData, option) => {
  const doc = new jsPDF();
  const isCriterios = option === 'criterios';
  const items = jsonData?.criteria;
  let y = 20;

  const printWrappedText = (doc, lines, x, y, lineHeight = 6, options = {}) => {
    lines.forEach(line => {
      if (y + lineHeight > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, x, y, options);
      y += lineHeight;
    });
    return y;
  };

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Documento generado con IA, revise su contenido.', doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 15;

  items.forEach((item, index) => {
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    let title = `${index + 1}. ${item.title || 'Sin título'}`;
    if (item.jiraKey) title += ` (${item.jiraKey})`;

    y = printWrappedText(doc, doc.splitTextToSize(title, 180), 10, y);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    y = printWrappedText(doc, doc.splitTextToSize(item.description || '', 180), 10, y);

    if (isCriterios) {
      item.subtasks?.forEach((sub) => {
        let subText = `- ${sub.description}`;
        if (sub.jiraKey) subText += ` (${sub.jiraKey})`;
        y = printWrappedText(doc, doc.splitTextToSize(subText, 170), 15, y);
      });
    } else {
      const pre = (item.preconditions || []).join('\n');
      const exp = item.expectedOutput || '';
      const jira = item.jiraCode || '';

      doc.setFont('helvetica', 'bold');
      y = printWrappedText(doc, ['Entrada:'], 10, y);
      doc.setFont('helvetica', 'normal');
      y = printWrappedText(doc, doc.splitTextToSize(pre, 180), 10, y);

      doc.setFont('helvetica', 'bold');
      y = printWrappedText(doc, ['Salida esperada:'], 10, y);
      doc.setFont('helvetica', 'normal');
      y = printWrappedText(doc, doc.splitTextToSize(exp, 180), 10, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 255);
      y = printWrappedText(doc, ['Jira padre:'], 10, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      y = printWrappedText(doc, doc.splitTextToSize(jira, 180), 10, y);
    }

    y += 5;
  });

  doc.save('documento-ia.pdf');
};
