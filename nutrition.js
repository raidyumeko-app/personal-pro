/* Private student journal. Imports preserve extracted text and require manual confirmation. */
(function (root) {
  "use strict";
  const mealHeader =
    /^(?:(?:[0-2]?\d)[:h][0-5]\d(?:\s*(?:h|horas))?\s*[-–:]?\s*|(?:café\s+da\s+manhã|cafe\s+da\s+manha|almoço|almoco|jantar|ceia|lanche|pré[- ]?treino|pós[- ]?treino|desjejum)\b)/i;
  function organize(lines) {
    const meals = [];
    let current = null;
    for (const raw of lines) {
      const text = raw.trim();
      if (!text) continue;
      if (mealHeader.test(text)) {
        current = {
          title: text,
          time:
            text.match(/\b([0-2]?\d)[:h]([0-5]\d)\b/)?.[0]?.replace("h", ":") ||
            "",
          text: "",
        };
        meals.push(current);
      } else if (current) current.text += (current.text ? "\n" : "") + text;
    }
    return {
      meals,
      unassigned: lines
        .slice(
          0,
          Math.max(
            0,
            lines.findIndex((x) => mealHeader.test(x)),
          ),
        )
        .join("\n"),
      uncertain: meals.length === 0,
    };
  }
  async function extract(file) {
    if (file.type !== "application/pdf" || file.size > 10485760)
      throw Error("Escolha um PDF de até 10 MB.");
    const pdfjs = await import("/vendor/pdfjs/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";
    const task = pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      isEvalSupported: false,
    });
    let doc;
    try {
      doc = await task.promise;
      if (doc.numPages > 60)
        throw Error("O PDF ultrapassa 60 páginas. Importe um plano menor.");
      const lines = [];
      for (let page = 1; page <= doc.numPages; page++) {
        const p = await doc.getPage(page);
        const content = await p.getTextContent();
        let line = "",
          previousY = null;
        for (const item of content.items) {
          if (!("str" in item)) continue;
          const y = item.transform[5];
          if (
            previousY !== null &&
            Math.abs(y - previousY) > 3 &&
            line.trim()
          ) {
            lines.push(line.trim());
            line = "";
          }
          line += (line ? " " : "") + item.str;
          previousY = y;
          if (item.hasEOL && line.trim()) {
            lines.push(line.trim());
            line = "";
            previousY = null;
          }
        }
        if (line.trim()) lines.push(line.trim());
      }
      const result = organize(lines);
      return {
        ...result,
        originalText: lines.join("\n"),
        scanned: lines.join("").trim().length < 20,
      };
    } finally {
      await task.destroy();
    }
  }
  function Panel({ React: R, member }) {
    const h = R.createElement,
      API = root.PersonalProAPI;
    const [area,setArea]=R.useState('plan');
    const [entries, setEntries] = R.useState([]),
      [settings, setSettings] = R.useState({
        goal_ml: 2500,
        portion_ml: 240,
        reminders: [],
      });
    const [paid, setPaid] = R.useState(false),
      [loaded, setLoaded] = R.useState(false),
      [message, setMessage] = R.useState(""),
      [busy, setBusy] = R.useState(false);
    const [text, setText] = R.useState(""),
      [when, setWhen] = R.useState(""),
      [photo, setPhoto] = R.useState(null),
      [consent, setConsent] = R.useState(false),
      [draft, setDraft] = R.useState(null),
      [pdf, setPdf] = R.useState(null),
      [reminder, setReminder] = R.useState("09:00");
    const b = (label, fn, primary = false, extra = {}) =>
      h(
        "button",
        {
          type: "button",
          className: primary ? "pp-primary" : "pp-secondary",
          onClick: fn,
          disabled: busy,
          ...extra,
        },
        label,
      );
    const card = (title, ...children) =>
      h(
        "section",
        { className: "portal-card" },
        h("h2", null, title),
        ...children,
      );
    const input = (label, props) =>
      h(
        "label",
        { className: "pp-field" },
        label,
        h("input", { "aria-label": label, ...props }),
      );
    async function run(fn) {
      setBusy(true);
      setMessage("");
      try {
        await fn();
      } catch (e) {
        setMessage(e.message);
      } finally {
        setBusy(false);
      }
    }
    async function load() {
      const [ent, info] = await Promise.all([
        API.studentAccess(),
        API.nutrition(),
      ]);
      setPaid(ent.active === true);
      setSettings(
        info[0][0] || { goal_ml: 2500, portion_ml: 240, reminders: [] },
      );
      setEntries(info[1]);
      setLoaded(true);
    }
    R.useEffect(() => {
      run(load);
    }, []);
    R.useEffect(() => {
      if (
        !paid ||
        !("Notification" in root) ||
        Notification.permission !== "granted"
      )
        return;
      let previous = "";
      const timer = setInterval(() => {
        const now = new Date(),
          time = now.toTimeString().slice(0, 5);
        if (time !== previous && (settings.reminders || []).includes(time)) {
          previous = time;
          new Notification("Sua pausa para água", {
            body: "Registre a água que você realmente consumiu no Personal Pro.",
          });
        }
      }, 15000);
      return () => clearInterval(timer);
    }, [paid, settings.reminders]);
    const today = new Date().toLocaleDateString("en-CA"),
      water = entries
        .filter(
          (e) =>
            e.kind === "water" &&
            new Date(e.occurred_at).toLocaleDateString("en-CA") === today,
        )
        .reduce((n, e) => n + e.amount_ml, 0),
      activePlan = entries.find((e) => e.kind === "plan" && e.confirmed);
    async function openFile(path) {
      await run(async () => {
        const url = await API.signed(path);
        root.open(url, "_blank", "noopener,noreferrer");
      });
    }
    const editMeal = (i, patch) =>
      setDraft((d) => ({
        ...d,
        meals: d.meals.map((m, n) => (n === i ? { ...m, ...patch } : m)),
      }));
    const review =
      draft &&
      h(
        "div",
        { className: "portal-import-review" },
        h("h3", null, "Conferência obrigatória"),
        h(
          "p",
          null,
          "Revise horários, substituições e quantidades com o PDF. A leitura preserva o texto e não cria porções.",
        ),
        draft.uncertain &&
          h(
            "p",
            { role: "alert" },
            "Não foram identificadas refeições com segurança. Organize os cartões manualmente.",
          ),
        h(
          "details",
          null,
          h("summary", null, "Todo o texto extraído"),
          h(
            "pre",
            null,
            draft.originalText || "Documento sem texto extraível.",
          ),
        ),
        ...draft.meals.map((meal, i) =>
          h(
            "fieldset",
            { key: i },
            h("legend", null, "Refeição " + (i + 1)),
            input("Título da refeição " + (i + 1), {
              value: meal.title,
              onChange: (e) => editMeal(i, { title: e.target.value }),
            }),
            input("Horário da refeição " + (i + 1), {
              type: "time",
              value: meal.time,
              onChange: (e) => editMeal(i, { time: e.target.value }),
            }),
            h(
              "label",
              { className: "pp-field" },
              "Alimentos, porções e orientações",
              h("textarea", {
                value: meal.text,
                onChange: (e) => editMeal(i, { text: e.target.value }),
              }),
            ),
            b("Remover cartão", () =>
              setDraft((d) => ({
                ...d,
                meals: d.meals.filter((_, n) => n !== i),
              })),
            ),
          ),
        ),
        b("Adicionar refeição manualmente", () =>
          setDraft((d) => ({
            ...d,
            meals: [...d.meals, { title: "", time: "", text: "" }],
          })),
        ),
        b(
          "Conferi e quero ativar o plano",
          () =>
            run(async () => {
              if (
                !draft.meals.length ||
                draft.meals.some((m) => !m.title.trim() || !m.text.trim())
              )
                throw Error(
                  "Preencha títulos e conteúdos das refeições conforme o PDF.",
                );
              const path = await API.upload(pdf);
              await API.write("pp_nutrition_entries", {
                id: crypto.randomUUID(),
                kind: "plan",
                text: draft.originalText.slice(0, 30000),
                file_path: path,
                plan_data: {
                  meals: draft.meals,
                  unassigned: draft.unassigned,
                  reviewedAt: new Date().toISOString(),
                  method: "local-text-headings-v1",
                },
                confirmed: true,
              });
              setDraft(null);
              setPdf(null);
              await load();
              setMessage("Plano salvo com o PDF original.");
            }),
          true,
        ),
      );
    const hydration = card(
      "Hidratação",
      h(
        "strong",
        { className: "portal-metric" },
        (water / 1000).toLocaleString("pt-BR") +
          " / " +
          (settings.goal_ml / 1000).toLocaleString("pt-BR") +
          " L",
      ),
      h("progress", {
        value: water,
        max: settings.goal_ml,
        "aria-label": "Água consumida hoje",
      }),
      input(
        "Meta diária · " +
          (settings.goal_ml / 1000).toLocaleString("pt-BR") +
          " L",
        {
          type: "range",
          min: 1000,
          max: 5000,
          step: 100,
          value: settings.goal_ml,
          onChange: (e) =>
            setSettings((s) => ({ ...s, goal_ml: +e.target.value })),
        },
      ),
      h(
        "p",
        { className: "portal-caption" },
        "Ajuste conforme a orientação recebida. 5 L é o limite do controle, não uma recomendação.",
      ),
      input("Volume por ingestão (ml)", {
        type: "number",
        min: 1,
        max: 5000,
        value: settings.portion_ml,
        onChange: (e) =>
          setSettings((s) => ({ ...s, portion_ml: e.target.value })),
      }),
      b(
        "Bebi " + settings.portion_ml + " ml",
        () =>
          run(async () => {
            if (
              !Number.isInteger(+settings.portion_ml) ||
              +settings.portion_ml < 1 ||
              +settings.portion_ml > 5000
            )
              throw Error("Informe um volume entre 1 e 5000 ml.");
            await API.write("pp_nutrition_entries", {
              id: crypto.randomUUID(),
              kind: "water",
              amount_ml: +settings.portion_ml,
            });
            await load();
          }),
        true,
      ),
      input("Horário do lembrete", {
        type: "time",
        value: reminder,
        onChange: (e) => setReminder(e.target.value),
      }),
      b("Adicionar horário", () =>
        setSettings((s) => ({
          ...s,
          reminders: [...new Set([...s.reminders, reminder])]
            .filter(Boolean)
            .sort(),
        })),
      ),
      h(
        "div",
        { className: "portal-actions" },
        ...settings.reminders.map((time) =>
          b(
            time + " ×",
            () =>
              setSettings((s) => ({
                ...s,
                reminders: s.reminders.filter((t) => t !== time),
              })),
            false,
            { key: time },
          ),
        ),
      ),
      b("Salvar meta e horários", () =>
        run(async () => {
          await API.write("pp_nutrition_settings", {
            ...settings,
            portion_ml: +settings.portion_ml,
          });
          setMessage("Meta e horários salvos.");
        }),
      ),
      b("Ativar lembretes nesta aba", () =>
        run(async () => {
          if (!("Notification" in root))
            throw Error("Este navegador não oferece notificações.");
          const p = await Notification.requestPermission();
          setMessage(
            p === "granted"
              ? "Lembretes permitidos enquanto esta aba estiver aberta."
              : "Notificações não autorizadas.",
          );
        }),
      ),
      h(
        "p",
        { className: "portal-caption" },
        "Lembretes funcionam com esta aba aberta. Notificações em segundo plano dependem da versão Android e das permissões do dispositivo.",
      ),
    );
    const mealForm = card(
      "Registrar refeição",
      h(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            run(async () => {
              if (!text.trim()) throw Error("Descreva a refeição.");
              let path = null;
              if (photo) {
                if (!consent) throw Error("Confirme o envio privado da foto.");
                path = await API.upload(await API.compress(photo));
              }
              await API.write("pp_nutrition_entries", {
                id: crypto.randomUUID(),
                kind: "meal",
                text: text.trim(),
                file_path: path,
                occurred_at: when
                  ? new Date(when).toISOString()
                  : new Date().toISOString(),
              });
              setText("");
              setPhoto(null);
              setWhen("");
              await load();
              setMessage("Refeição salva.");
            });
          },
        },
        h(
          "label",
          { className: "pp-field" },
          "Refeição, quantidades e observações",
          h("textarea", {
            value: text,
            maxLength: 3000,
            required: true,
            onChange: (e) => setText(e.target.value),
          }),
        ),
        input("Quando", {
          type: "datetime-local",
          value: when,
          onChange: (e) => setWhen(e.target.value),
        }),
        input("Fotografia opcional", {
          type: "file",
          accept: "image/jpeg,image/png,image/webp",
          onChange: (e) => setPhoto(e.target.files?.[0] || null),
        }),
        h(
          "label",
          { className: "portal-check" },
          h("input", {
            type: "checkbox",
            checked: consent,
            onChange: (e) => setConsent(e.target.checked),
          }),
          "Concordo em guardar fotos e PDFs na minha área privada.",
        ),
        b("Salvar refeição", undefined, true, { type: "submit" }),
      ),
    );
    const privacyConsent=h('label',{className:'portal-check'},h('input',{type:'checkbox',checked:consent,onChange:e=>setConsent(e.target.checked)}),'Concordo em guardar fotos e PDFs na minha área privada.');
    const importForm = card(
      "Importar minha dieta",
      h(
        "p",
        null,
        "Envie o PDF do seu nutricionista. A leitura local organiza os títulos e horários encontrados. Confira e corrija antes de ativar.",
      ),
      privacyConsent,
      input("PDF original · até 10 MB", {
        type: "file",
        accept: "application/pdf",
        onChange: (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          run(async () => {
            if (!consent)
              throw Error("Confirme acima o armazenamento privado de PDFs.");
            const result = await extract(file);
            setPdf(file);
            setDraft(result);
            setMessage(
              result.scanned
                ? "Documento escaneado: sem texto extraível. Organize os cartões manualmente conforme o original."
                : "Leitura feita no dispositivo. Confira os trechos antes de ativar.",
            );
          });
        },
      }),
      review,
    );
    const plan =
      activePlan &&
      card(
        "Meu plano alimentar",
        b("Abrir PDF original", () => openFile(activePlan.file_path)),
        ...(activePlan.plan_data?.meals || []).map((meal, i) =>
          h(
            "article",
            { key: i, className: "portal-meal" },
            h("small", null, meal.time),
            h("h3", null, meal.title),
            h("p", { style: { whiteSpace: "pre-wrap" } }, meal.text),
            paid &&
              b("Consumido agora", () =>
                run(async () => {
                  await API.write("pp_nutrition_entries", {
                    id: crypto.randomUUID(),
                    kind: "meal",
                    text: meal.title + "\n" + meal.text,
                  });
                  await load();
                  setMessage("Consumo registrado.");
                }),
              ),
          ),
        ),
      );
    const journalEntries=entries.filter(e=>area==='water'?e.kind==='water':e.kind==='meal');
    const journal = card(
      "Histórico pessoal",
      journalEntries.length
        ? journalEntries.map((entry) =>
            h(
              "article",
              { key: entry.id, className: "portal-journal-row" },
              h(
                "small",
                null,
                new Date(entry.occurred_at).toLocaleString("pt-BR"),
              ),
              h(
                "p",
                null,
                entry.kind === "water"
                  ? entry.amount_ml + " ml de água"
                  : entry.kind === "plan"
                    ? "Plano alimentar confirmado"
                    : entry.text,
              ),
              entry.file_path &&
                b(entry.kind === "plan" ? "Ver PDF" : "Ver fotografia", () =>
                  openFile(entry.file_path),
                ),
              paid &&
                b("Excluir registro", () =>
                  run(async () => {
                    await API.removeEntry(entry.id);
                    await load();
                  }),
                ),
            ),
          )
        : h("p", null, "Seus registros aparecerão aqui."),
    );
    return h(
      "section",
      { className: "portal-nutrition" },
      h(
        "header",
        { className: "portal-heading" },
        h("p", { className: "portal-eyebrow" }, "UM ESPAÇO SÓ SEU"),
        h("h1", null, "Minha nutrição"),
        h(
          "p",
          null,
          "Seus registros e orientações do nutricionista. Seu personal não acessa esta área.",
        ),
      ),
      message &&
        h("p", { role: "status", className: "portal-notice" }, message),
      !loaded
        ? h("p", { role: "status" }, "Carregando seu diário…")
        : h(
            R.Fragment,
            null,
            !paid &&
              card(
                "Uma rotina mais organizada.",
                h(
                  "p",
                  null,
                  "Personal Pro — 30 dias grátis para o aluno. Depois, R$ 9,90/mês para continuar com treinos, nutrição e evolução, sem anúncios.",
                ),
                b(
                  "Assinar Personal Pro+ · R$ 9,90/mês",
                  () =>
                    setMessage(
                      "A contratação pelo Google Play ainda não está disponível nesta prévia. Nenhuma assinatura foi ativada.",
                    ),
                  true,
                ),
                h(
                  "p",
                  { className: "portal-caption" },
                  "Registros anteriores permanecem disponíveis para consulta. Novos registros exigem assinatura confirmada.",
                ),
              ),
            h('nav',{className:'portal-nutrition-tabs','aria-label':'Áreas da nutrição'},...[['plan','Plano'],['diary','Diário'],['water','Água'],['import','Importar']].map(([key,label])=>b(label,()=>setArea(key),false,{key,'aria-pressed':area===key}))),
            area==='water'&&paid&&hydration,
            area==='diary'&&paid&&mealForm,
            area==='import'&&paid&&importForm,
            area==='plan'&&(plan||card('Meu plano alimentar',h('p',null,'Guarde o PDF recebido do seu nutricionista e organize as refeições com conferência.'),paid&&b('Importar minha dieta',()=>setArea('import'),true))),
            (area==='water'||area==='diary')&&journal,
          ),
    );
  }
  root.PersonalProNutrition = { Panel, organize, extract };
})(window);
