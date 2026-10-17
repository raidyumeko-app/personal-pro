(function (root) {
  'use strict';
  let libraryPromise;
  const clean = value => String(value ?? '').normalize('NFC')
    .replace(/[–—−]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7e\xa0-\xff\n]/g, '').trim();
  const dose = exercise => {
    if (exercise.series !== undefined || exercise.repetitions !== undefined)
      return [exercise.series, exercise.repetitions];
    const match = String(exercise.sets || '').match(/^(\d+)\s*[x×]\s*(.+)$/i);
    return match ? [match[1], match[2]] : ['', exercise.sets === 'A definir' ? '' : exercise.sets];
  };
  function loadLibrary() {
    if (root.jspdf?.jsPDF) return Promise.resolve();
    if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
      const script = root.document.createElement('script');
      script.src = '/vendor/jspdf-4.2.1.umd.min.js';
      script.onload = () => root.jspdf?.jsPDF ? resolve() : reject(new Error('Gerador de PDF indisponível.'));
      script.onerror = () => { script.remove(); reject(new Error('Não foi possível carregar o gerador. Tente novamente.')); };
      root.document.head.appendChild(script);
    }).catch(error => { libraryPromise = null; throw error; });
    return libraryPromise;
  }
  function makeDocument(student, coach = {}, date = new Date()) {
    if (!Array.isArray(student?.workout) || !student.workout.length)
      throw new Error('Adicione exercícios à ficha antes de gerar o PDF.');
    const doc = new root.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const name = clean(student.name) || 'Aluno';
    const professional = clean(coach.name) || 'Personal';
    const studio = clean(coach.studio);
    const dateLabel = date.toLocaleDateString('pt-BR');
    const left = 14, width = 182, bottom = 277, lineHeight = 4.7, padding = 3;
    const columns = [9, 65, 18, 32, 34, 24];
    let y = 0;
    const text = (value, x, baseline, size = 10, bold = false, color = [25, 35, 47]) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size); doc.setTextColor(...color);
      doc.text(clean(value), x, baseline);
    };
    const lines = (value, cellWidth, size = 9.5, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size);
      return doc.splitTextToSize(clean(value) || '-', cellWidth);
    };
    function tableHeader() {
      doc.setFillColor(26, 36, 49); doc.rect(left, y, width, 10, 'F');
      let x = left;
      ['#', 'Exercício', 'Séries', 'Repetições / tempo', 'Carga / intensidade', 'Descanso'].forEach((title, i) => {
        text(title, x + (i === 0 ? 2 : padding), y + 6.3, 8, true, [255, 255, 255]); x += columns[i];
      });
      y += 10;
    }
    function startPage(first) {
      if (!first) doc.addPage();
      doc.setFillColor(19, 28, 39); doc.rect(0, 0, 210, first ? 33 : 23, 'F');
      doc.setFillColor(211, 245, 86); doc.rect(left, first ? 27 : 18, 20, 1.4, 'F');
      text('PERSONAL PRO', left, 12, 9, true, [211, 245, 86]);
      text(first ? 'Ficha de treino' : 'Ficha de treino - continuação', left, first ? 23 : 17, first ? 21 : 11, true, [255, 255, 255]);
      y = first ? 43 : 32;
      if (first) {
        for (const [label, value] of [['ALUNO', name], ['PERSONAL', professional], ...(studio ? [['LOCAL', studio]] : [])]) {
          text(label, left, y, 8, true, [97, 108, 120]); y += 5;
          for (const line of lines(value, width, label === 'ALUNO' ? 15 : 10)) {
            if (y > bottom - 23) { startPage(false); y += 5; }
            text(line, left, y, label === 'ALUNO' ? 15 : 10, label === 'ALUNO'); y += label === 'ALUNO' ? 6.5 : 5;
          }
          y += 4;
        }
        text('Emitido em ' + dateLabel + '  |  ' + student.workout.length + ' exercícios', left, y, 9, false, [97, 108, 120]);
        y += 8;
      } else {
        text(lines(name, 120, 9)[0], left, y, 9, true);
        doc.setFontSize(9); doc.text(dateLabel, 196, y, { align: 'right' });
        y += 7;
      }
      tableHeader();
    }
    startPage(true);
    student.workout.forEach((exercise, index) => {
      const [series, repetitions] = dose(exercise);
      const rest = Number(exercise.rest);
      const cells = [String(index + 1), exercise.name, series, repetitions, exercise.load,
        exercise.rest !== undefined && exercise.rest !== '' && Number.isFinite(rest) ? Math.max(0, rest) + ' s' : '-'];
      const wrapped = cells.map((value, i) => lines(value, columns[i] - (i === 0 ? 2 : padding * 2), 9.5, i === 1));
      const count = Math.max(...wrapped.map(value => value.length));
      const rowHeight = count * lineHeight + padding * 2;
      if (y + rowHeight > bottom && rowHeight < bottom - 57) startPage(false);
      let offset = 0;
      while (offset < count) {
        let available = Math.floor((bottom - y - padding * 2) / lineHeight);
        if (available < 1) { startPage(false); available = Math.floor((bottom - y - padding * 2) / lineHeight); }
        const take = Math.min(available, count - offset), height = take * lineHeight + padding * 2;
        doc.setFillColor(...(index % 2 ? [242, 245, 247] : [255, 255, 255]));
        doc.rect(left, y, width, height, 'F');
        let x = left;
        wrapped.forEach((cell, i) => {
          cell.slice(offset, offset + take).forEach((line, j) => text(line, x + (i === 0 ? 2 : padding), y + padding + 3.3 + j * lineHeight, 9.5, i === 1));
          x += columns[i];
        });
        doc.setDrawColor(222, 228, 233); doc.line(left, y + height, 196, y + height);
        y += height; offset += take;
        if (offset < count) startPage(false);
      }
    });
    const total = doc.getNumberOfPages();
    for (let page = 1; page <= total; page++) {
      doc.setPage(page); doc.setDrawColor(222, 228, 233); doc.line(left, 284, 196, 284);
      text('PERSONAL PRO  |  Ficha preparada por ' + lines(professional, 80, 8)[0], left, 290, 8, false, [97, 108, 120]);
      doc.setFontSize(8); doc.text(page + ' / ' + total, 196, 290, { align: 'right' });
    }
    doc.setProperties({ title: 'Treino de ' + name, author: professional, subject: 'Ficha de treino - Personal Pro', creator: 'Personal Pro' });
    return doc;
  }
  async function prepare(student, coach) {
    await loadLibrary();
    const doc = makeDocument(student, coach);
    const slug = clean(student.name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 80) || 'aluno';
    return { blob: doc.output('blob'), fileName: 'treino-' + slug + '.pdf' };
  }
  function download(artifact) {
    const url = root.URL.createObjectURL(artifact.blob), anchor = root.document.createElement('a');
    anchor.href = url; anchor.download = artifact.fileName; anchor.style.display = 'none';
    root.document.body.appendChild(anchor); anchor.click(); anchor.remove();
    root.setTimeout(() => root.URL.revokeObjectURL(url), 60000);
  }
  const shareData = artifact => ({ files: [new root.File([artifact.blob], artifact.fileName, { type: 'application/pdf' })] });
  function canShare(artifact) {
    try { return Boolean(root.File && root.navigator?.share && root.navigator?.canShare?.(shareData(artifact))); }
    catch (_) { return false; }
  }
  function share(artifact) {
    if (!canShare(artifact)) return Promise.reject(new Error('Baixe o PDF e anexe o arquivo no WhatsApp.'));
    return root.navigator.share(shareData(artifact));
  }
  root.PersonalProPDF = { makeDocument, prepare, download, canShare, share };
})(typeof window === 'object' ? window : globalThis);
