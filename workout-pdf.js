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
  const dayOf = exercise => ['A','B','C'].includes(exercise.day) ? exercise.day : 'A';
  const technique = exercise => exercise.technique && exercise.technique !== 'Tradicional' ? exercise.technique + (exercise.block ? ' - ' + exercise.block : '') : '';
  const dayLabel = (student, day) => 'TREINO ' + day + ((student.workoutWeekdays?.[day]||[]).length ? ' | '+student.workoutWeekdays[day].map(index=>['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][index]).join(', ') : '') + (student.workoutDurations?.[day] ? ' | '+student.workoutDurations[day]+' min planejados' : '');
  function guidance(exercise, options) {
    return [...(technique(exercise)?['Técnica: '+technique(exercise)]:[]),...(exercise.notes?['Orientações: '+exercise.notes]:[]),...(exercise.alternatives?.length?['Substituições: '+exercise.alternatives.join('; ')]:[]),...(options.includeInstructions?(options.instructions?.get(exercise.name)?.map((step,index)=>'Execução '+(index+1)+': '+step)||['Instruções de execução indisponíveis nesta fonte.']):[])];
  }
  function makeDocument(student, coach = {}, date = new Date(), options = {}) {
    if (!Array.isArray(student?.workout) || !student.workout.length)
      throw new Error('Adicione exercícios à ficha antes de gerar o PDF.');
    if(options.mobile) return makeMobileDocument(student,coach,date,options);
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
      doc.setFillColor(24, 63, 49); doc.rect(0, 0, 210, first ? 33 : 23, 'F');
      doc.setFillColor(177, 224, 195); doc.rect(left, first ? 27 : 18, 20, 1.4, 'F');
      text('PERSONAL PRO', left, 12, 9, true, [177, 224, 195]);
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
    const dayOf = exercise => ['A','B','C'].includes(exercise.day) ? exercise.day : 'A';
    const ordered = ['A','B','C'].flatMap(day => student.workout.filter(exercise => dayOf(exercise) === day));
    let previousDay, dayIndex=0;
    ordered.forEach((exercise, index) => {
      if (previousDay !== dayOf(exercise)) {
        if (y + 25 > bottom) startPage(false);
        doc.setFillColor(232, 244, 236); doc.rect(left, y, width, 9, 'F');
        text(dayLabel(student,dayOf(exercise)), left + 3, y + 6, 9, true, [23, 107, 82]);
        y += 9; previousDay = dayOf(exercise); dayIndex=0;
      }
      const [series, repetitions] = dose(exercise);
      const rest = Number(exercise.rest);
      const cells = [String(++dayIndex), exercise.name, series, repetitions, exercise.load,
        exercise.rest !== undefined && exercise.rest !== '' && Number.isFinite(rest) ? Math.max(0, rest) + ' s' : '-'];
      const wrapped = cells.map((value, i) => lines(value, columns[i] - (i === 0 ? 2 : padding * 2), 9.5, i === 1));
      const count = Math.max(...wrapped.map(value => value.length));
      const rowHeight = count * lineHeight + padding * 2;
      const detailText = guidance(exercise,options).join('\n');
      const noteHeight = detailText ? lines(detailText, width - 8, 9).length * 4.7 + 3 : 0;
      const mediaHeight = options.illustrated ? ((options.photos?.get(exercise.name)||[]).length ? 60 : 12) : 0;
      const blockHeight = rowHeight + noteHeight + mediaHeight;
      if (blockHeight < bottom - 57 && y + blockHeight > bottom) startPage(false);
      else if (y + rowHeight > bottom && rowHeight < bottom - 57) startPage(false);
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
      if (detailText) {
        const noteLines = lines(detailText, width - 8, 9);
        for (const line of noteLines) {
          if (y + 8 > bottom) startPage(false);
          text(line, left + 4, y + 5, 9, false, [42, 86, 66]); y += 4.7;
        }
        y += 3;
      }
      if (options.illustrated) {
        const photos = options.photos?.get(exercise.name) || [];
        if (y + (photos.length ? 60 : 12) > bottom) {
          startPage(false);
          for (const line of lines(exercise.name + ' - fotos', width - 8, 9, true)) {
            text(line, left + 4, y + 5, 9, true); y += 5;
          }
          y += 3;
        }
        if (photos.length) {
          photos.forEach((bytes, position) => {
            const boxX = left + position * 91 + 3;
            try {
              const image = doc.getImageProperties(bytes);
              const scale = Math.min(85 / image.width, 50 / image.height);
              const w = image.width * scale, h = image.height * scale;
              doc.addImage(bytes, 'JPEG', boxX + (85 - w) / 2, y + (50 - h) / 2, w, h);
              text('Posição ' + (position + 1), boxX, y + 55, 8, false, [97, 108, 120]);
            } catch (_) { text('Foto indisponível.', boxX, y + 15, 9); }
          });
          y += 60;
        } else {
          text('Foto não disponível para esta variação.', left + 4, y + 6, 8, false, [97, 108, 120]); y += 12;
        }
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
  function makeMobileDocument(student,coach,date,options) {
    const doc=new root.jspdf.jsPDF({unit:'mm',format:'a5',compress:true});
    const left=12,width=124,bottom=190;let y=0;
    const text=(value,x,baseline,size=12,bold=false)=>{doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(24,52,42);doc.text(clean(value),x,baseline)};
    function page(first=false){if(!first)doc.addPage();doc.setFillColor(24,63,49);doc.rect(0,0,148,23,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text('PERSONAL PRO',left,13);y=32;if(!first){text(student.name,left,y,10,true);y+=8}}
    function para(value,size=12,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);for(const line of doc.splitTextToSize(clean(value),width)){if(y+6>bottom)page();text(line,left,y,size,bold);y+=size*.48}y+=3}
    page(true);para('Ficha de treino',21,true);para(student.name,17,true);para('Personal: '+(coach.name||'Personal'),11);if(coach.studio)para(coach.studio,11);para(date.toLocaleDateString('pt-BR'),10);y+=3;
    for(const day of ['A','B','C']){
      const exercises=student.workout.filter(ex=>dayOf(ex)===day);if(!exercises.length)continue;
      if(y+35>bottom)page();para(dayLabel(student,day),13,true);
      exercises.forEach((exercise,index)=>{
        if(y+45>bottom)page();para((index+1)+'. '+exercise.name,15,true);
        const [series,reps]=dose(exercise);
        para('Séries: '+(series||'-')+'  |  Repetições / tempo: '+(reps||'-'),12);
        para('Carga: '+(exercise.load||'-'),12);para('Descanso: '+(exercise.rest??'-')+' s',12);
        for(const detail of guidance(exercise,options))para(detail,12);
        if(options.illustrated){const photos=options.photos?.get(exercise.name)||[];if(photos.length){if(y+49>bottom){page();para(exercise.name+' - fotos',13,true)}photos.forEach((bytes,position)=>{try{const props=doc.getImageProperties(bytes),scale=Math.min(58/props.width,39/props.height),w=props.width*scale,h=props.height*scale;doc.addImage(bytes,'JPEG',left+position*63+(58-w)/2,y,w,h);text('Posição '+(position+1),left+position*63,y+43,9)}catch{text('Foto indisponível',left+position*63,y+12,9)}});y+=49}else para('Foto não disponível para esta variação.',10)}
        if(y+5>bottom)page();doc.setDrawColor(210,224,215);doc.line(left,y,left+width,y);y+=9;
      });
    }
    const total=doc.getNumberOfPages();for(let i=1;i<=total;i++){doc.setPage(i);text(i+' / '+total,122,201,9)}
    doc.setProperties({title:'Treino de '+clean(student.name),author:clean(coach.name)||'Personal',subject:'Ficha para celular - Personal Pro',creator:'Personal Pro'});return doc;
  }
  async function loadPhotos(student, options) {
    const photos = new Map(), instructions = new Map(), warnings = [];
    let catalog;
    try {
      const response = await root.fetch('/exercise-library.json', {signal: root.AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('catalog');
      catalog = await response.json();
      if (!Array.isArray(catalog)) throw new Error('catalog');
    } catch (_) {
      return {photos,instructions, warnings:['Não foi possível carregar a biblioteca. A ficha foi gerada com suas orientações e os campos do treino.']};
    }
    let translations={};
    if(options.includeInstructions)try{const response=await root.fetch('/exercise-instructions.pt.json',{signal:root.AbortSignal.timeout(15000)});if(!response.ok)throw Error();translations=await response.json()}catch{warnings.push('As instruções de execução não puderam ser carregadas.')}
    const byId = new Map(catalog.map(item => [item.id, item]));
    const byName = new Map(catalog.map(item => [item.name, item]));
    const jobs = [], entries = new Map(), downloads = new Map();
    let missing = 0,missingInstructions=0;
    for (const exercise of student.workout) {
      const source = byId.get(exercise.sourceId || options.exerciseSources?.[exercise.name]) || byName.get(exercise.name);
      if(options.includeInstructions){const steps=translations[source?.id];if(Array.isArray(steps)&&steps.length)instructions.set(exercise.name,steps);else missingInstructions++}
      const urls = options.illustrated ? (source?.images?.slice(0, 2) || []) : [];
      if (!urls.length) { if(options.illustrated)missing++; continue; }
      entries.set(exercise.name, urls);
      for (const url of urls) if (!downloads.has(url)) {
        downloads.set(url, null);
        jobs.push(async () => {
          try {
            const parsed = new URL(url);
            if (parsed.hostname !== 'raw.githubusercontent.com' || !parsed.pathname.startsWith('/yuhonas/free-exercise-db/')) throw new Error('source');
            const response = await root.fetch(url, {signal:root.AbortSignal.timeout(10000),referrerPolicy:'no-referrer'});
            if (!response.ok) throw new Error('photo');
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (bytes.length > 3000000 || bytes[0] !== 255 || bytes[1] !== 216) throw new Error('JPEG');
            // Validate before layout, so a failed image has a visible warning.
            const probe = new root.jspdf.jsPDF(); probe.getImageProperties(bytes);
            downloads.set(url, bytes);
          } catch (_) { downloads.set(url, null); }
        });
      }
    }
    let cursor = 0;
    await Promise.all(Array.from({length:Math.min(4,jobs.length)},async () => {
      while (cursor < jobs.length) await jobs[cursor++]();
    }));
    let failed = 0;
    for (const [name, urls] of entries) {
      const loaded = urls.map(url => downloads.get(url));
      failed += loaded.filter(value => !value).length;
      photos.set(name, loaded.some(Boolean) ? loaded : []);
    }
    if (missing) warnings.push(missing + ' exercício(s) sem foto nesta fonte.');
    if (failed) warnings.push(failed + ' foto(s) não carregada(s). As demais informações foram mantidas.');
    if(missingInstructions)warnings.push(missingInstructions+' exercício(s) sem instruções disponíveis.');
    return {photos,instructions, warnings};
  }
  async function prepare(student, coach, options = {}) {
    await loadLibrary();
    if (!Array.isArray(student?.workout) || !student.workout.length)
      throw new Error('Adicione exercícios à ficha antes de gerar o PDF.');
    const media = (options.illustrated||options.includeInstructions) ? await loadPhotos(student, options) : {photos:new Map(),instructions:new Map(),warnings:[]};
    const doc = makeDocument(student, coach, new Date(), {...options, photos:media.photos,instructions:media.instructions});
    const slug = clean(student.name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 80) || 'aluno';
    return { blob: doc.output('blob'), fileName: 'treino-' + slug + (options.mobile ? '-celular' : '') + (options.illustrated ? '-ilustrado' : '') + '.pdf', warnings:media.warnings };
  }
  function download(artifact) {
    const url = root.URL.createObjectURL(artifact.blob), anchor = root.document.createElement('a');
    anchor.href = url; anchor.download = artifact.fileName; anchor.style.display = 'none';
    root.document.body.appendChild(anchor); anchor.click(); anchor.remove();
    root.setTimeout(() => root.URL.revokeObjectURL(url), 60000);
  }
  function preview(artifact) {
    const url = root.URL.createObjectURL(artifact.blob), anchor = root.document.createElement('a');
    anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; anchor.style.display = 'none';
    root.document.body.appendChild(anchor); anchor.click(); anchor.remove();
    root.setTimeout(() => root.URL.revokeObjectURL(url), 120000);
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
  root.PersonalProPDF = { makeDocument, prepare, download, preview, canShare, share };
})(typeof window === 'object' ? window : globalThis);
