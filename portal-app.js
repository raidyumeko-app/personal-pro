/* Authenticated student portal and integration components for the existing trainer app. */
(function (root) {
  "use strict";
  let R, h;
  const API = () => root.PersonalProAPI;
  const el = (type, props, ...children) => h(type, props, ...children);
  const title = (small, big) =>
    el(
      "header",
      { className: "portal-heading" },
      el("p", { className: "portal-eyebrow" }, small),
      el("h1", null, big),
    );
  const btn = (text, onClick, primary = false, props = {}) =>
    el(
      "button",
      {
        type: "button",
        className: primary ? "pp-primary" : "pp-secondary",
        onClick,
        ...props,
      },
      text,
    );
  const field = (text, value, set, type = "text", props = {}) =>
    el(
      "label",
      { className: "pp-field" },
      text,
      el("input", {
        type,
        value,
        "aria-label": text,
        onChange: (e) => set(e.target.value),
        ...props,
      }),
    );
  const empty = (text) =>
    el(
      "div",
      { className: "portal-empty" },
      el("span", { "aria-hidden": true }, "↗"),
      el("p", null, text),
    );
  const date = (value) =>
    new Date(value).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  function useAction() {
    const [busy, setBusy] = R.useState(false),
      [message, setMessage] = R.useState("");
    return {
      busy,
      message,
      setMessage,
      run: async (fn) => {
        setBusy(true);
        setMessage("");
        try {
          return await fn();
        } catch (e) {
          setMessage(e.message);
          return null;
        } finally {
          setBusy(false);
        }
      },
    };
  }
  function Notice({ action }) {
    return action.message
      ? el("p", { role: "status", className: "portal-notice" }, action.message)
      : null;
  }
  function Auth({ onAccount, reset = false }) {
    const [mode, setMode] = R.useState(reset ? "reset" : "login"),
      [email, setEmail] = R.useState(""),
      [password, setPassword] = R.useState(""),
      [consent, setConsent] = R.useState(false),
      act = useAction();
    return el(
      "main",
      { className: "portal-auth" },
      el(
        "section",
        { className: "portal-auth-art", "aria-hidden": true },
        el(
          "div",
          { className: "portal-brand" },
          "P",
          el("span", null, "PERSONAL PRO"),
        ),
        el(
          "div",
          { className: "portal-auth-statement" },
          el("small", null, "MOVIMENTO COM PROPÓSITO"),
          el(
            "strong",
            null,
            "Seu próximo ",
            el("br"),
            "nível começa",
            el("br"),
            el("em", null, "aqui."),
          ),
          el("a",{className:"portal-media-credit",href:"/media/exercises/LICENSE.md",target:"_blank",rel:"noopener noreferrer"},"Imagem: Goulart · CC BY-SA 4.0"),
        ),
      ),
      el(
        "section",
        { className: "portal-auth-form" },
        title(
          "TREINO · CONEXÃO · EVOLUÇÃO",
          mode === "signup"
            ? "Comece sua jornada."
            : mode === "recover"
              ? "Vamos recuperar seu acesso."
              : mode === "reset"
                ? "Uma nova senha."
                : "Bom ter você aqui.",
        ),
        el(
          "p",
          null,
          "Profissional e aluno, no mesmo aplicativo. Cada um com o seu espaço.",
        ),
        el(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
              act.run(async () => {
                if (mode === "reset") {
                  await root.PersonalProCloud.updatePassword(password);
                  setPassword("");
                  await root.PersonalProCloud.signOut();
                  setMode("login");
                  act.setMessage("Senha atualizada. Entre novamente.");
                  return;
                }
                if (mode === "recover") {
                  await root.PersonalProCloud.recover(email);
                  act.setMessage(
                    "Se o e-mail estiver cadastrado, você receberá o link de recuperação.",
                  );
                  return;
                }
                const account =
                  mode === "signup"
                    ? await root.PersonalProCloud.signUp(email, password)
                    : await root.PersonalProCloud.signIn(email, password);
                setPassword("");
                if (account) await onAccount(account);
                else
                  act.setMessage(
                    "Confirme o cadastro pelo link enviado ao seu e-mail e depois entre.",
                  );
              });
            },
          },
          mode !== "reset" &&
            field("E-mail", email, setEmail, "email", {
              required: true,
              autoComplete: "email",
            }),
          mode !== "recover" &&
            field("Senha", password, setPassword, "password", {
              required: true,
              minLength: 8,
              autoComplete:
                mode === "login" ? "current-password" : "new-password",
            }),
          mode === "signup" &&
            el(
              "label",
              { className: "portal-check" },
              el("input", {
                type: "checkbox",
                required: true,
                checked: consent,
                onChange: (e) => setConsent(e.target.checked),
              }),
              "Li como meus dados são usados e concordo com o cadastro.",
            ),
          btn(
            act.busy
              ? "Aguarde…"
              : mode === "signup"
                ? "Criar minha conta"
                : mode === "recover"
                  ? "Enviar link"
                  : mode === "reset"
                    ? "Salvar nova senha"
                    : "Entrar",
            undefined,
            true,
            { type: "submit", disabled: act.busy },
          ),
          el(Notice, { action: act }),
        ),
        el(
          "div",
          { className: "portal-auth-links" },
          btn(mode === "login" ? "Criar conta" : "Já tenho conta", () => {
            setMode(mode === "login" ? "signup" : "login");
            act.setMessage("");
          }),
          mode === "login" &&
            btn("Esqueci minha senha", () => setMode("recover")),
        ),
        el(
          "details",
          { className: "portal-privacy" },
          el("summary", null, "Privacidade e acesso"),
          el(
            "p",
            null,
            "Usamos seu e-mail para autenticação e recuperação. Treinos e avaliações ficam restritos ao aluno e ao profissional vinculado. Fotos e dietas são privadas do aluno. Não há publicação social. Solicitações sobre seus dados podem ser enviadas pelo suporte configurado no seu perfil.",
          ),
        ),
        el(
          "p",
          { className: "portal-caption" },
          "Profissional: 30 dias grátis. Depois, R$ 29,90/mês ou continuar grátis com anúncios. Aluno: 30 dias grátis; depois, R$ 9,90/mês para continuar, sem opção com anúncios.",
        ),
      ),
    );
  }
  function Registration({ account, onReady }) {
    const [role, setRole] = R.useState(
        account.students.length ? "trainer" : "student",
      ),
      [name, setName] = R.useState(account.profile.name || ""),
      [gender, setGender] = R.useState("undisclosed"),
      act = useAction();
    return el(
      "main",
      { className: "portal-onboarding" },
      title("BEM-VINDO AO PERSONAL PRO", "Qual é o seu espaço?"),
      el(
        "div",
        { className: "portal-role-grid" },
        [
          ["student", "Aluno", "Meus treinos e minha evolução."],
          ["trainer", "Personal trainer", "Meus alunos, treinos e agenda."],
        ].map(([key, label, desc]) =>
          el(
            "button",
            {
              key,
              type: "button",
              "aria-pressed": role === key,
              disabled: account.students.length > 0 && key !== "trainer",
              onClick: () => setRole(key),
            },
            el("strong", null, label),
            el("p", null, desc),
          ),
        ),
      ),
      el(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            act.run(async () =>
              onReady(await API().register(role, name, gender)),
            );
          },
        },
        field("Nome completo", name, setName, "text", {
          required: true,
          minLength: 3,
          maxLength: 120,
          autoComplete: "name",
        }),
        role === "student" &&
          el(
            "label",
            { className: "pp-field" },
            "Gênero",
            el(
              "select",
              {
                value: gender,
                "aria-label": "Gênero",
                onChange: (e) => setGender(e.target.value),
              },
              el("option", { value: "undisclosed" }, "Prefiro não informar"),
              el("option", { value: "male" }, "Masculino"),
              el("option", { value: "female" }, "Feminino"),
            ),
          ),
        el(
          "p",
          { className: "portal-caption" },
          role === "student"
            ? "Você tem 30 dias grátis. Depois, R$ 9,90/mês para continuar, sem anúncios. Após o cadastro, insira o convite do seu personal. O gênero declarado orienta apenas ilustrações."
            : "Seu período gratuito começa ao cadastrar o perfil profissional. No dia 31 não trava.",
        ),
        btn("Continuar", undefined, true, {
          type: "submit",
          disabled: act.busy,
        }),
        el(Notice, { action: act }),
      ),
      btn("Sair", () => root.PersonalProCloud.signOut()),
    );
  }
  function Spark({ values, label, unit = "" }) {
    const list = values.filter((v) => Number.isFinite(Number(v.value)));
    if (!list.length)
      return empty("Ainda não há registros de " + label.toLowerCase() + ".");
    const low = Math.min(...list.map((v) => +v.value)),
      high = Math.max(...list.map((v) => +v.value));
    const x = (i) => 24 + (i * 292) / Math.max(1, list.length - 1),
      y = (v) => 120 - ((v - low) / (high - low || 1)) * 90;
    return el(
      "section",
      { className: "portal-card" },
      el("h3", null, label),
      el(
        "strong",
        { className: "portal-metric" },
        list.at(-1).value + " " + unit,
      ),
      el(
        "svg",
        {
          viewBox: "0 0 340 152",
          role: "img",
          "aria-label":
            label + ": " + list.map((v) => v.value + " " + unit).join(", "),
        },
        el("path", {
          d: "M24 30H316M24 75H316M24 120H316",
          stroke: "#2d3735",
          fill: "none",
        }),
        el("polyline", {
          points: list.map((v, i) => x(i) + "," + y(+v.value)).join(" "),
          stroke: "var(--lime)",
          strokeWidth: 3,
          fill: "none",
        }),
        ...list.map((v, i) =>
          el(
            "g",
            { key: i },
            el("circle", {
              cx: x(i),
              cy: y(+v.value),
              r: 4,
              fill: "var(--lime)",
            }),
            el(
              "text",
              {
                x: x(i),
                y: 145,
                textAnchor: "middle",
                fill: "var(--text-dim)",
                fontSize: 10,
              },
              v.date
                ? String(v.date).slice(5, 10).replace("-", "/")
                : "#" + (i + 1),
            ),
          ),
        ),
      ),
      el(
        "details",
        null,
        el("summary", null, "Ver registros"),
        ...list
          .slice()
          .reverse()
          .map((v, i) =>
            el(
              "p",
              { key: i },
              (v.date ? date(v.date) : "Registro sem data") +
                " · " +
                v.value +
                " " +
                unit,
            ),
          ),
      ),
    );
  }
  function Evolution({ student, sessions, plus=false, onUpgrade }) {
    const [part, setPart] = R.useState("summary"),
      [region, setRegion] = R.useState("waist"),
      [exerciseId, setExerciseId] = R.useState("");
    const weights = (student.weightHistory || []).map((value, i) => ({
      value,
      date: student.weightRecords?.[i]?.date,
    }));
    const choices = new Map();
    for (const session of sessions)
      for (const ex of session.exercises) choices.set(ex.id, ex.name);
    const selected = exerciseId || choices.keys().next().value;
    const loads = sessions
      .filter((s) => s.completedAt)
      .slice()
      .reverse()
      .flatMap((s) => {
        const logs = s.logs.filter((l) => l.exerciseId === selected);
        return logs.length
          ? [
              {
                value: Math.max(...logs.map((l) => l.weightKg)),
                date: s.completedAt,
              },
            ]
          : [];
      });
    const measureValues = [
      ...(student.measureHistory || [])
        .filter((x) => x.region === region)
        .map((x) => ({ value: x.value, date: x.date })),
      ...(student.measures?.[region]
        ? [
            {
              value: student.measures[region],
              date:
                student.measureDates?.[region] || student.lastAssessmentDate,
            },
          ]
        : []),
    ];
    const names = {
      chest: "Peito",
      waist: "Cintura",
      hip: "Quadril",
      arm: "Braço",
      forearm: "Antebraço",
      thigh: "Coxa",
      calf: "Panturrilha",
    };
    if(!plus)return el('section',null,title('SEUS REGISTROS','Minha Evolução'),el('section',{className:'portal-card'},el('h2',null,'Seus dados básicos'),weights.length?el('p',null,'Último peso registrado: '+weights.at(-1).value+' kg'):el('p',null,'Nenhum peso registrado.'),Object.entries(student.measures||{}).filter(([,v])=>v!==''&&Number(v)>0).map(([key,value])=>el('p',{key},(names[key]||key)+': '+value+' cm')),el('p',{className:'portal-caption'},'Valores registrados pelo seu personal. Seus dados permanecem disponíveis mesmo sem assinatura.')),el('section',{className:'portal-card'},el('h2',null,'Personal Pro+'),el('p',null,'Nutrição e Evolução por R$ 9,90/mês: silhueta corporal, histórico, comparações e gráficos reais, além da sua nutrição privada.'),btn('Conhecer o Personal Pro+',onUpgrade,true)));
    return el(
      "section",
      null,
      title("SEUS REGISTROS", "Minha Evolução"),
      part === "measures"
        ? el(
            R.Fragment,
            null,
            btn("← Voltar à evolução", () => setPart("summary")),
            el(root.PersonalProStudentSections.BodyMeasures, {
              React: R,
              student,
            }),
          )
        : el(
            R.Fragment,
            null,
            btn("Medidas corporais →", () => setPart("measures"), true),
            el(
              "p",
              { className: "portal-caption" },
              "Avaliações registradas pelo seu personal. Cada medida tem a sua história.",
            ),
            el(Spark, { values: weights, label: "Peso corporal", unit: "kg" }),
            el(
              "label",
              { className: "pp-field" },
              "Região corporal",
              el(
                "select",
                { value: region, onChange: (e) => setRegion(e.target.value) },
                ...Object.entries(names).map(([id, label]) =>
                  el("option", { key: id, value: id }, label),
                ),
              ),
            ),
            el(Spark, {
              values: measureValues,
              label: names[region],
              unit: "cm",
            }),
            el(
              "label",
              { className: "pp-field" },
              "Exercício",
              el(
                "select",
                {
                  value: selected || "",
                  onChange: (e) => setExerciseId(e.target.value),
                },
                choices.size
                  ? [...choices].map(([id, label]) =>
                      el("option", { key: id, value: id }, label),
                    )
                  : el("option", { value: "" }, "Sem sessões registradas"),
              ),
            ),
            el(Spark, { values: loads, label: "Carga por sessão", unit: "kg" }),
          ),
    );
  }
  function Student({ member }) {
    const [data, setData] = R.useState(null), [plus,setPlus]=R.useState(false),
      [access, setAccess] = R.useState(null),
      [sessions, setSessions] = R.useState([]),
      [catalog, setCatalog] = R.useState([]),
      [tab, setTab] = R.useState("home"),
      [day, setDay] = R.useState("A"),
      [code, setCode] = R.useState(
        new URLSearchParams(location.search).get("invite") || "",
      ),
      [loaded, setLoaded] = R.useState(false),
      [summary, setSummary] = R.useState(null),
      [more, setMore] = R.useState(true),
      act = useAction();
    async function refresh() {
      let status;
      try { status = await API().studentAccess(); }
      catch(error) { setAccess(null); setLoaded(true); throw error; }
      setAccess(status);
      if (!status.active) { setData(null); setSessions([]); setPlus(false); setLoaded(true); return null; }
      const [d, s] = await Promise.all([API().studentData(), API().sessions()]);
      setPlus(true);
      setData(d);
      Promise.all([fetch("/exercise-library.json").then(r=>r.json()),fetch("/exercise-instructions.pt.json").then(r=>r.json())]).then(([items,steps])=>root.PersonalProExerciseCompatibility?root.PersonalProExerciseCompatibility.forWorkouts(items,steps,d.student?.workout||[]):{catalog:items,translations:steps}).then(resolved=>setCatalog(resolved.catalog.map(item=>({...item,instructions:resolved.translations[item.id]||item.instructions})))).catch(()=>{});
      setSessions(s);
      setMore(s.length === 30);
      setLoaded(true);
      return d;
    }
    R.useEffect(() => {
      act.run(refresh);

    }, []);
    R.useEffect(() => {
      if (!access?.active) return;
      const recheck = () => { setAccess(null); act.run(refresh); };
      const delay = Math.max(0, Date.parse(access.expiresAt) - Date.parse(access.serverNow));
      const timer = setTimeout(recheck, Math.min(delay, 2147483647));
      root.addEventListener('focus', recheck);
      return () => { clearTimeout(timer); root.removeEventListener('focus', recheck); };
    }, [access]);
    const pendingReceiptIds = sessions.filter(s=>s.completedAt&&!s.feedbackSeenAt).map(s=>s.id).join(',');
    R.useEffect(() => {
      if (!access?.active || !pendingReceiptIds || !API().feedbackReceipts) return;
      let disposed=false, pending=false;
      const sync=async()=>{
        if(pending) return;
        pending=true;
        try {
          const receipts=await API().feedbackReceipts(pendingReceiptIds.split(','));
          if(!disposed) setSessions(list=>list.map(s=>{
            const receipt=receipts.find(item=>item.id===s.id);
            return receipt?.feedback_seen_at ? {...s,feedbackSeenAt:receipt.feedback_seen_at} : s;
          }));
        } catch (_) { /* A failed read never invents a green receipt. Retry on next tick/focus. */ }
        finally { pending=false; }
      };
      const timer=setInterval(sync,15000);
      root.addEventListener('focus',sync);
      return()=>{disposed=true;clearInterval(timer);root.removeEventListener('focus',sync)};
    },[access?.active,pendingReceiptIds]);
    if (!access?.active) return el('main',{className:'portal-auth'},el('section',{className:'portal-card'},
      title('PERSONAL PRO', !loaded ? 'Conferindo seu acesso…' : access ? 'Seu período gratuito terminou.' : 'Não foi possível conferir seu acesso.'),
      loaded && el('p',null,'O aluno tem 30 dias grátis. Depois, a assinatura de R$ 9,90/mês libera treinos, nutrição e evolução. Não há opção com anúncios. Seus dados e o vínculo com o personal são preservados.'),
      el(Notice,{action:act}),
      loaded && btn('Assinar por R$ 9,90/mês',()=>act.setMessage('A contratação pelo Google Play ainda não está disponível nesta prévia. Nenhuma cobrança foi feita.'),true),
      loaded && btn('Verificar acesso novamente',()=>act.run(refresh),false,{disabled:act.busy}),
      btn('Sair',()=>root.PersonalProCloud.signOut())));
    const student = data?.student;
    const active = sessions.find((s) => !s.completedAt),
      prescription = active?.prescription || student?.workout || [];
    const exercises = prescription
      .filter((ex) => (ex.day || "A") === (active?.workoutId || day))
      .map((ex) => {
        const item = catalog.find(
          (i) => i.id === ex.sourceId || i.name === ex.name || i.aliases?.includes(ex.name),
        );
        return root.PersonalProMedia.resolve({ ...item, ...ex });
      });
    const days = [
      ...new Set((student?.workout || []).map((ex) => ex.day || "A")),
    ];
    function finish(s) {
      setSummary(s);
      setSessions((list) => [s, ...list.filter((x) => x.id !== s.id)]);
      setTab("home");
    }
    const completed = sessions.filter((s) => s.completedAt);
    return el(
      "main",
      { className: "portal-student" },
      el(
        "header",
        { className: "portal-topbar" },
        el("strong", null, "PERSONAL", el("em", null, " PRO")),
        el("img",{className:"portal-profile-illustration",src:"/media/profiles/"+(["male","female"].includes(member.gender)?member.gender:"undisclosed")+".svg",alt:"Ilustração de perfil conforme gênero declarado"}),
        btn("Sair", () => root.PersonalProCloud.signOut()),
      ),
      el(Notice, { action: act }),
      !loaded
        ? el("p", { role: "status" }, "Carregando seus treinos…")
        : !student
          ? el(
              "section",
              null,
              title(
                "OLÁ, " + member.name.split(" ")[0].toUpperCase(),
                "Vamos conectar seu treino.",
              ),
              el(
                "p",
                null,
                "Peça o convite ao seu personal e cole o código abaixo.",
              ),
              el(
                "form",
                {
                  onSubmit: (e) => {
                    e.preventDefault();
                    act.run(async () => {
                      await API().rpc("pp_accept_invite", { p_token: code });
                      await refresh();
                      history.replaceState(null, "", location.pathname);
                    });
                  },
                },
                field("Código do convite", code, setCode, "text", {
                  required: true,
                  minLength: 32,
                  maxLength: 32,
                  autoComplete: "off",
                }),
                btn("Vincular ao meu personal", undefined, true, {
                  type: "submit",
                  disabled: act.busy,
                }),
              ),
            )
          : el(
              R.Fragment,
              null,
              tab === "home" &&
                el(
                  "section",
                  null,
                  title(
                    "OLÁ, " + member.name.split(" ")[0].toUpperCase(),
                    "Um treino de cada vez.",
                  ),
                  el(
                    "p",
                    { className: "portal-caption" },
                    "Seu personal: " + data.trainerName,
                  ),
                  summary &&
                    el(
                      "section",
                      { className: "portal-conquest", role: "status" },
                      el("span", null, "✓"),
                      el(
                        "p",
                        { className: "portal-eyebrow" },
                        "TREINO CONCLUÍDO",
                      ),
                      el("h2", null, "Você fez acontecer."),
                      el(
                        "p",
                        null,
                        summary.logs.length +
                          " séries · " +
                          new Set(summary.logs.map((l) => l.exerciseId)).size +
                          " exercícios · " +
                          Math.max(
                            1,
                            Math.round(
                              (Date.parse(summary.completedAt) -
                                Date.parse(summary.startedAt)) /
                                60000,
                            ),
                          ) +
                          " min",
                      ),
                      summary.effort &&
                        el("p", null, "Seu esforço: " + summary.effort),
                      el(root.PersonalProFeedback.Status, {React:R,seenAt:sessions.find(s=>s.id===summary.id)?.feedbackSeenAt}),
                      btn("Continuar", () => setSummary(null)),
                    ),
                  el(
                    "div",
                    { className: "portal-day-picker" },
                    days.map((d) =>
                      btn("Treino " + d, () => setDay(d), d === day, {
                        key: d,
                        "aria-pressed": d === day,
                        disabled: !!active && active.workoutId !== d,
                      }),
                    ),
                  ),
                  !exercises.length
                    ? empty("Seu personal ainda está preparando os exercícios.")
                    : el(root.PersonalProSessionPreview.Simulator, {
                        key: active?.workoutId || day,
                        React: R,
                        studentId: member.user_id,
                        day: active?.workoutId || day,
                        exercises,
                        hero: true,
                        previousSessions: sessions,
                        onStart: async () => {
                          const s = await API().start(day);
                          setSessions((list) => [
                            s,
                            ...list.filter((x) => x.id !== s.id),
                          ]);
                          return s;
                        },
                        onSave: async (s, finish, effort, note) => {
                          const saved = await API().save(
                            s,
                            finish,
                            effort,
                            note,
                          );
                          setSessions((list) => [
                            saved,
                            ...list.filter((x) => x.id !== saved.id),
                          ]);
                          return saved;
                        },
                        onFinish: finish,
                      }),
                  active &&
                    el(
                      "p",
                      { className: "portal-notice" },
                      "Há um treino em andamento. Toque em Começar treino para retomar.",
                    ),
                  el(
                    "section",
                    { className: "portal-card" },
                    el("h3", null, "Sua semana"),
                    ...[0, 1, 2, 3, 4, 5, 6].map((i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
                      const weekday = d.getDay(),
                        assigned = Object.entries(
                          student.workoutWeekdays || {},
                        ).filter(([, values]) =>
                          (values || []).map(Number).includes(weekday),
                        );
                      return el(
                        "p",
                        { key: i, className: "portal-week-row" },
                        el(
                          "span",
                          null,
                          d.toLocaleDateString("pt-BR", {
                            weekday: "short",
                            day: "2-digit",
                          }),
                        ),
                        el(
                          "strong",
                          null,
                          assigned.length
                            ? assigned.map(([k]) => "Treino " + k).join(" · ")
                            : "Sem treino programado",
                        ),
                      );
                    }),
                  ),
                  completed.slice(0, 3).map((s) =>
                    el("article", {key:s.id,className:"portal-feedback-summary"},
                      el("small", null, "Treino " + s.workoutId + " · " + date(s.completedAt)),
                      el(root.PersonalProFeedback.Status, {React:R,seenAt:s.feedbackSeenAt}),
                    ),
                  ),
                ),
              tab === "evolution" && el(Evolution, { student, sessions, plus,onUpgrade:()=>setTab('nutrition') }),
              tab === "history" &&
                el(
                  "section",
                  null,
                  title("CADA SESSÃO CONTA", "Seu histórico"),
                  !completed.length
                    ? empty("Seu primeiro treino concluído aparecerá aqui.")
                    : completed.map((s) =>
                        el(
                          "article",
                          { key: s.id, className: "portal-card" },
                          el("h3", null, "Treino " + s.workoutId),
                          el(root.PersonalProFeedback.Status, {React:R,seenAt:s.feedbackSeenAt}),
                          el("p", null, date(s.completedAt)),
                          el(
                            "p",
                            null,
                            s.logs.length +
                              " séries registradas" +
                              (s.effort ? " · " + s.effort : ""),
                          ),
                          el(
                            "details",
                            null,
                            el("summary", null, "Exercícios e cargas"),
                            ...s.logs.map((l, i) =>
                              el(
                                "p",
                                { key: i },
                                (s.exercises.find((e) => e.id === l.exerciseId)
                                  ?.name || "Exercício") +
                                  " · série " +
                                  l.setNumber +
                                  " · " +
                                  l.reps +
                                  " repetições · " +
                                  l.weightKg +
                                  " kg",
                              ),
                            ),
                          ),
                        ),
                      ),
                  more &&
                    btn("Carregar anteriores", () =>
                      act.run(async () => {
                        const next = await API().sessions(sessions.length);
                        setSessions((old) => [...old, ...next]);
                        setMore(next.length === 30);
                      }),
                    ),
                ),
              tab === "nutrition" &&
                el(root.PersonalProNutrition.Panel, { React: R, member }),
              el(
                "nav",
                { className: "portal-bottom", "aria-label": "Áreas do aluno" },
                [
                  ["home", "Hoje", "weight"],
                  ["history", "Histórico", "calendar"],
                  ["evolution", "Evolução", "trend"],
                  ["nutrition", "Nutrição", "book"],
                ].map(([key, label, icon]) =>
                  el(
                    "button",
                    {
                      key,
                      type: "button",
                      "aria-current": key === tab ? "page" : undefined,
                      onClick: () => {
                        setTab(key);
                        window.scrollTo({ top: 0 });
                      },
                    },
                    el(root.PersonalProUI.Icon, { React: R, name: icon }),
                    label,
                  ),
                ),
              ),
            ),
    );
  }
  function TrainerTools({ React, studentId }) {
    const [token, setToken] = React.useState(""),
      [error, setError] = React.useState(""),
      [busy, setBusy] = React.useState(false);
    return React.createElement(
      "section",
      { className: "portal-invite" },
      React.createElement("h4", null, "Acesso do aluno"),
      React.createElement(
        "p",
        null,
        "O aluno cria a própria conta e usa este convite. O código vale por 7 dias e só pode ser usado uma vez.",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "pp-secondary",
          disabled: busy,
          onClick: async () => {
            setBusy(true);
            setError("");
            try {
              await root.PersonalProCloud.retry();
              setToken(
                await API().rpc("pp_create_invite", {
                  p_student_id: studentId,
                }),
              );
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          },
        },
        busy ? "Gerando…" : "Gerar convite do aluno",
      ),
      token &&
        React.createElement(
          "label",
          { className: "pp-field" },
          "Link do convite",
          React.createElement("input", {
            readOnly: true,
            value: location.origin + "/?invite=" + token,
            onFocus: (e) => e.target.select(),
          }),
        ),
      token &&
        React.createElement(
          "button",
          {
            type: "button",
            className: "pp-secondary",
            onClick: async () => {
              try {
                await navigator.clipboard.writeText(
                  location.origin + "/?invite=" + token,
                );
                setError("Link copiado.");
              } catch {
                setError("Selecione e copie o link acima.");
              }
            },
          },
          "Copiar convite",
        ),
      error && React.createElement("p", { role: "status" }, error),
    );
  }
  function Billing({ React, member, onFree }) {
    const [free, setFree] = React.useState(member.free_with_ads),
      [entitlements, setEntitlements] = React.useState([]),
      [message, setMessage] = React.useState(""),
      [referral, setReferral] = React.useState("");
    React.useEffect(() => {
      API()
        .entitlements()
        .then(setEntitlements)
        .catch((e) => setMessage(e.message));
    }, []);
    const paid = entitlements.some(
        (e) =>
          e.product === "trainer" && Date.parse(e.valid_until) > Date.now(),
      ),
      days = Math.max(
        0,
        30 -
          Math.floor((Date.now() - Date.parse(member.created_at)) / 86400000),
      );
    const e = React.createElement;
    return e(
      "section",
      { className: "portal-card portal-billing" },
      e(
        "h3",
        null,
        paid
          ? "Assinatura ativa"
          : days
            ? "Seu período gratuito · " + days + " dias restantes"
            : free
              ? "Plano gratuito"
              : "Deseja continuar usando o aplicativo?",
      ),
      e(
        "p",
        null,
        "Para o profissional, no dia 31 não trava: você pode continuar com anúncios. O aluno tem 30 dias grátis e, depois, assinatura de R$ 9,90/mês, sem opção com anúncios.",
      ),
      !paid &&
        e(
          "button",
          {
            type: "button",
            className: "pp-primary",
            onClick: () =>
              setMessage(
                "A contratação pelo Google Play ainda não está disponível nesta prévia. Nenhuma cobrança foi feita.",
              ),
          },
          "Assinar por R$ 29,90/mês",
        ),
      !paid &&
        e(
          "button",
          {
            type: "button",
            className: "pp-secondary",
            onClick: async () => {
              try {
                await API().rpc("pp_choose_free");
                setFree(true);
                    onFree?.();
                setMessage(
                  "Opção gratuita salva. A exibição de anúncios depende da configuração do provedor, ainda indisponível nesta prévia.",
                );
              } catch (err) {
                setMessage(err.message);
              }
            },
          },
          "Continuar grátis com anúncios",
        ),
      paid &&
        e(
          "details",
          null,
          e("summary", null, "Indique um amigo"),
          e(
            "p",
            null,
            "3 dias de benefício por profissional que pagar. Máximo de 5 indicações válidas e 15 dias por ciclo; aplicação depende da validação do Google Play.",
          ),
          e("input", {
            readOnly: true,
            "aria-label": "Link de indicação",
            value: location.origin + "/?ref=" + member.user_id,
          }),
        ),
      !paid &&
        e(
          "details",
          null,
          e("summary", null, "Fui indicado por um profissional"),
          e(
            "label",
            null,
            "Código do profissional",
            e("input", {
              value: referral,
              onChange: (event) => setReferral(event.target.value),
            }),
          ),
          e(
            "button",
            {
              type: "button",
              className: "pp-secondary",
              onClick: async () => {
                try {
                  await API().rpc("pp_register_referral", {
                    p_referrer: referral,
                  });
                  setMessage(
                    "Indicação registrada. O benefício depende de pagamento confirmado.",
                  );
                } catch (err) {
                  setMessage(err.message);
                }
              },
            },
            "Salvar indicação",
          ),
        ),
      message && e("p", { role: "status" }, message),
    );
  }
  function Shell({ React, Legacy }) {
    R = React;
    h = R.createElement;
    const [account, setAccount] = R.useState(null),
      [member, setMember] = R.useState(null),
      [loading, setLoading] = R.useState(true),
      [reset, setReset] = R.useState(false),
      [error, setError] = R.useState(""), [plan,setPlan]=R.useState(null);
    R.useEffect(()=>{if(member?.role==='trainer')API().entitlements().then(setPlan).catch(e=>setError(e.message));},[member?.user_id]);
    async function accept(a) {
      const found=await API().member();
      setMember(found);
      setAccount(a);
    }
    R.useEffect(() => {
      let live = true;
      async function init() {
        try {
          const recovery = await root.PersonalProCloud.acceptRecovery();
          if (recovery) {
            setReset(true);
            return;
          }
          const a = await root.PersonalProCloud.restore();
          if (live && a) await accept(a);
        } catch (e) {
          if (live) setError(e.message);
        } finally {
          if (live) setLoading(false);
        }
      }
      init();
      const signedOut = () => {
        setAccount(null);
        setMember(null);
        setReset(false);
      };
      root.addEventListener("personal-pro-signout", signedOut);
      return () => {
        live = false;
        root.removeEventListener("personal-pro-signout", signedOut);
      };
    }, []);
    if (loading)
      return el(
        "main",
        { className: "portal-loading", role: "status" },
        el("strong", null, "PERSONAL PRO"),
        el("p", null, "Preparando seu espaço…"),
      );
    if (!account)
      return el(
        R.Fragment,
        null,
        error && el("p", { role: "alert" }, error),
        el(Auth, {
          onAccount: async (a) => {
            try {
              await accept(a);
            } catch (e) {
              setError(e.message);
            }
          },
          reset,
        }),
      );
    if (!member) return el(Registration, { account, onReady: setMember });
    root.PersonalProMember = member;
    if (member.role === "student") return el(Student, { member });
    const expired=Date.now()-Date.parse(member.created_at)>=30*86400000;
    const active=plan?.some(e=>e.product==='trainer'&&Date.parse(e.valid_until)>Date.now());
    return el(R.Fragment,null,plan&&expired&&!active&&!member.free_with_ads&&el('aside',{className:'portal-trial-banner','aria-label':'Período gratuito'},el(Billing,{React:R,member,onFree:()=>setMember({...member,free_with_ads:true})})),el(Legacy));
  }
  root.PersonalProPortal = { Shell, TrainerTools, Billing, Evolution, Spark, Student };
})(window);
