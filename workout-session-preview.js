/* A temporary execution view of the actual prescribed workout. No account writes. */
(function (root) {
  "use strict";
  function numberFrom(value, fallback) {
    const match = String(value ?? "")
      .replace(",", ".")
      .match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : fallback;
  }
  function adapt(exercises) {
    return (Array.isArray(exercises) ? exercises : [])
      .slice(0, 100)
      .map((item, index) => {
        const dose = String(item.sets || "").match(/(\d+)\s*[x×]\s*(\d+)/i);
        return {
          id: String(item.id || item.sourceId || "exercise") + "-" + index,
          name: String(item.name || "Exercício " + (index + 1)),
          sets: Math.max(
            1,
            Math.min(20, numberFrom(item.series ?? dose?.[1] ?? item.sets, 3)),
          ),
          reps: Math.max(
            1,
            Math.min(
              100,
              numberFrom(item.repetitions ?? item.reps ?? dose?.[2], 10),
            ),
          ),
          restSeconds: Math.max(0, Math.min(600, numberFrom(item.rest, 60))),
        };
      });
  }
  function Simulator(props) {
    const R = props.React || root.React,
      h = R.createElement,
      engine = root.PersonalProWorkoutSession,
      I = (name) => h(root.PersonalProUI.Icon, { React: R, name });
    const [session, setSession] = R.useState(null),
      [weights, setWeights] = R.useState({}),
      [error, setError] = R.useState(""),
      [current, setCurrent] = R.useState(0),
      [remaining, setRemaining] = R.useState(0),
      [running, setRunning] = R.useState(false),
      [view, setView] = R.useState("treino"),
      [imageFailed, setImageFailed] = R.useState(false),
      [reps, setReps] = R.useState(""),
      [videoFailed, setVideoFailed] = R.useState(false),
      [videoVariant, setVideoVariant] = R.useState("male"),
      [playing, setPlaying] = R.useState(false),
      [saving, setSaving] = R.useState(false),
      [effort, setEffort] = R.useState(null),
      [note, setNote] = R.useState("");
    const exercises = adapt(props.exercises),
      day = props.day || "A",
      studentId = String(props.studentId || "preview"),
      ex = session?.exercises[current],
      original = root.PersonalProMedia
        ? root.PersonalProMedia.resolve(props.exercises?.[current] || {})
        : props.exercises?.[current] || {},
      done = session
        ? engine.progress(session)
        : { done: 0, expected: 0, percent: 0 },
      logs = session?.logs.filter((l) => l.exerciseId === ex?.id) || [],
      nextSet = ex
        ? Array.from({ length: ex.sets }, (_, i) => i + 1).find(
            (n) => !logs.some((l) => l.setNumber === n),
          )
        : null,
      key = ex?.id;
    R.useEffect(() => {
      if (!running || remaining <= 0) return;
      const until = Date.now() + remaining * 1000;
      const timer = setInterval(() => {
        const value = Math.max(0, Math.ceil((until - Date.now()) / 1000));
        setRemaining(value);
        if (!value) setRunning(false);
      }, 250);
      return () => clearInterval(timer);
    }, [running, remaining, key]);
    R.useEffect(() => {
      setReps("");
      setImageFailed(false);
      setVideoFailed(false);
      setPlaying(false);
      setRunning(false);
      setRemaining(0);
    }, [key]);
    R.useEffect(() => {
      if (!session) return;
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }, [!!session]);
    async function start() {
      try {
        setError("");
        setWeights({});
        setCurrent(0);
        setView("treino");
        setSession(
          props.onStart
            ? await props.onStart(day)
            : engine.createSession({
                id: "preview-" + Date.now(),
                studentId,
                workoutId: "preview-" + day,
                exercises,
              }),
        );
      } catch (e) {
        setError(e.message);
      }
    }
    async function commit(next, finish = false) {
      if (saving) return;
      setSaving(true);
      try {
        const saved = props.onSave
          ? await props.onSave(next, finish, effort, note)
          : next;
        setSession(saved);
        return saved;
      } finally {
        setSaving(false);
      }
    }
    async function record() {
      try {
        const updated = engine.logSet(session, {
          exerciseId: ex.id,
          setNumber: nextSet,
          reps: reps === "" ? ex.reps : Number(reps),
          weightKg: weights[key] ?? String(numberFrom(original.load, 0)),
        });
        await commit(updated);
        setError("");
        setRemaining(ex.restSeconds);
        setRunning(ex.restSeconds > 0);
      } catch (e) {
        setError(e.message);
      }
    }
    const close = () => {
        setSession(null);
        setRunning(false);
        setRemaining(0);
        setError("");
      },
      pick = (i) => {
        setCurrent(i);
        setView("treino");
      },
      media = original.poster || original.images?.[0],
      first = root.PersonalProMedia
        ? root.PersonalProMedia.resolve(props.exercises?.[0] || {})
        : props.exercises?.[0] || {},
      minutes =
        String(Math.floor(remaining / 60)).padStart(2, "0") +
        ":" +
        String(remaining % 60).padStart(2, "0");
    const button = (label, fn, cls = "pp-secondary", extra = {}) =>
      h(
        "button",
        {
          type: "button",
          className: cls,
          onClick: fn,
          ...extra,
          disabled: saving || extra.disabled,
        },
        label,
      );
    return h(
      "section",
      {
        className: "pp-session-preview",
        "aria-label": props.onSave
          ? "Execução do treino"
          : "Conferir execução do treino",
      },
      props.hero
        ? h(
            "div",
            { className: "pp-workout-hero" },
            (first.poster || first.images?.[0]) &&
              h("img", {
                src: first.images?.[0] || first.poster,
                alt: first.name || "Treino do dia",
                className: "pp-workout-hero-photo",
              }),
            h("div", { className: "pp-workout-hero-shade" }),
            h(
              "div",
              { className: "pp-workout-hero-info" },
              h("span", { className: "pp-hero-eyebrow" }, "TREINO DO DIA"),
              h("h3", null, props.title || "Treino " + day),
              h(
                "p",
                null,
                exercises.length +
                  " exercícios · " +
                  exercises.reduce((n, e) => n + e.sets, 0) +
                  " séries",
              ),
              h(
                "div",
                { className: "pp-hero-meta" },
                h("span", null, "◷ Descanso guiado"),
                first.video && h("span", null, "▶ Execução em vídeo"),
              ),
              button(
                "Começar treino  ▶",
                start,
                "pp-primary pp-start-workout",
                { disabled: !exercises.length },
              ),
            ),
          )
        : h(
            "div",
            { className: "pp-session-preview-heading" },
            h(
              "div",
              null,
              h("h3", null, "Executar · Treino " + day),
              h(
                "p",
                null,
                "Abra a execução com as séries, cargas e descansos desta ficha.",
              ),
            ),
            button(
              props.onSave ? "Iniciar ou retomar treino" : "Conferir execução",
              start,
              "pp-primary",
              {
                disabled: !exercises.length,
              },
            ),
          ),
      session &&
        h(
          "section",
          {
            className: "pp-run-screen",
            role: "dialog",
            "aria-modal": true,
            "aria-label": "Execução do treino",
          },
          h(
            "div",
            { className: "pp-execution-inner" },
            h(
              "header",
              { className: "pp-execution-header" },
              button("Voltar", close, "pp-icon-back"),
              h("h2", null, "Treino " + day),
              h("span", null, "PERSONAL PRO"),
            ),
            h(
              "p",
              { className: "pp-simulation-label" },
              props.onSave
                ? "Seu progresso é salvo a cada série."
                : "Conferência do profissional · sem registro de execução",
            ),
            h(
              "div",
              { className: "pp-execution-progress" },
              h(
                "span",
                null,
                "EXERCÍCIO " +
                  (current + 1) +
                  " DE " +
                  session.exercises.length,
              ),
              h("strong", null, done.percent + "%"),
            ),
            h("progress", {
              value: done.done,
              max: done.expected,
              "aria-label": "Séries concluídas",
            }),
            view === "lista"
              ? h(
                  "div",
                  { className: "pp-execution-list" },
                  session.exercises.map((item, i) =>
                    button(
                      i +
                        1 +
                        ". " +
                        item.name +
                        " · " +
                        session.logs.filter((l) => l.exerciseId === item.id)
                          .length +
                        "/" +
                        item.sets +
                        " séries",
                      () => pick(i),
                    ),
                  ),
                )
              : view === "notas"
                ? h(
                    "section",
                    { className: "pp-home-panel" },
                    h("h3", null, "Orientações do exercício"),
                    h(
                      "p",
                      null,
                      original.notes ||
                        "Sem observações adicionais do personal.",
                    ),
                    (original.instructions || []).map((step, i) =>
                      h("p", { key: i }, i + 1 + ". " + step),
                    ),
                  )
                : h(
                    R.Fragment,
                    null,
                    h(
                      "div",
                      { className: "pp-execution-media" },
                      original.video && !videoFailed
                        ? h(
                            R.Fragment,
                            null,
                            h("video", {
                              key: original.video.url + videoVariant,
                              src: original.video.variants?.[videoVariant] || original.video.url,
                              poster: media,
                              controls: true,
                              playsInline: true,
                              preload: "metadata",
                              loop: true,
                              "aria-label": "Vídeo de execução de " + ex.name,
                              onPlay: () => setPlaying(true),
                              onPause: () => setPlaying(false),
                              onError: () => setVideoFailed(true),
                            }),
                            h(
                              "span",
                              { className: "pp-video-badge" },
                              "▶ " +
                                (playing
                                  ? "EM REPRODUÇÃO"
                                  : "VÍDEO DE EXECUÇÃO"),
                            ),
                          )
                        : media && !imageFailed
                          ? h("img", {
                              src: media,
                              alt: "Demonstração de " + ex.name,
                              referrerPolicy: "no-referrer",
                              onError: () => setImageFailed(true),
                            })
                          : h(
                              "div",
                              { className: "pp-media-fallback" },
                              I("weight"),
                              h(
                                "span",
                                null,
                                "Siga a orientação do seu personal.",
                              ),
                            ),
                      !original.video &&
                        h(
                          "span",
                          { className: "pp-media-caption" },
                          media && !imageFailed
                            ? "Foto demonstrativa"
                            : "Sem mídia demonstrativa disponível",
                        ),
                    ),
                    original.video?.variants && Object.keys(original.video.variants).length > 1 && h("label",{className:"pp-field"},"Demonstração",h("select",{"aria-label":"Modelo da demonstração",value:videoVariant,onChange:event=>{setVideoVariant(event.target.value);setVideoFailed(false);}},h("option",{value:"male"},"Masculino"),h("option",{value:"female"},"Feminino"))),
                    original.video?.licensed && /^CC BY/.test(original.video.license || "") &&
                      h(
                        "p",
                        { className: "pp-video-credit" },
                        "Vídeo: " + original.video.author + " · ",
                        h(
                          "a",
                          {
                            href: original.video.licenseUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          original.video.license,
                        ),
                        " · ",
                        h(
                          "a",
                          {
                            href: original.video.source,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          },
                          "Fonte",
                        ),

                      ),
                    videoFailed && h("p",{role:"status",className:"pp-hint"},"Não foi possível reproduzir o vídeo nesta conexão."),
                    h("h3", { className: "pp-exercise-title" }, ex.name),
                    h(
                      "p",
                      { className: "pp-exercise-dose" },
                      I("weight"),
                      ex.sets + " SÉRIES · " + ex.reps + " REPETIÇÕES",
                    ),
                    h(
                      "div",
                      { className: "pp-execution-controls" },
                      h(
                        "label",
                        { className: "pp-load-control" },
                        h("span", null, "CARGA (kg)"),
                        h("input", {
                          type: "number",
                          min: 0,
                          max: 1000,
                          step: 0.5,
                          inputMode: "decimal",
                          value:
                            weights[key] ??
                            String(numberFrom(original.load, 0)),
                          disabled: saving || !!session.completedAt,
                          "aria-label": "Carga da série em kg",
                          onChange: (e) =>
                            setWeights((old) => ({
                              ...old,
                              [key]: e.target.value,
                            })),
                        }),
                        h(
                          "small",
                          null,
                          "Prescrita: " + (original.load || "A definir"),
                          props.previousSessions?.length > 0 &&
                            h(
                              "small",
                              null,
                              (() => {
                                const v = engine.previousLoad(
                                  props.previousSessions,
                                  studentId,
                                  key,
                                );
                                return v === null
                                  ? "Sem carga anterior registrada"
                                  : "Última carga registrada: " + v + " kg";
                              })(),
                            ),
                        ),
                      ),
                      h(
                        "div",
                        {
                          className: "pp-rest-ring",
                          style: {
                            "--rest-progress":
                              (ex.restSeconds
                                ? (remaining / ex.restSeconds) * 100
                                : 0) + "%",
                          },
                        },
                        h("span", null, "DESCANSO"),
                        h("strong", { "aria-live": "off" }, minutes),
                        button(
                          running ? "Pausar" : "Continuar",
                          () => setRunning((v) => !v),
                          "pp-timer-toggle",
                          { disabled: remaining <= 0 },
                        ),
                      ),
                      h(
                        "label",
                        { className: "pp-reps-control" },
                        h("span", null, "REPETIÇÕES"),
                        h("input", {
                          type: "number",
                          min: 0,
                          max: 100,
                          inputMode: "numeric",
                          "aria-label": "Repetições feitas",
                          value: reps === "" ? ex.reps : reps,
                          disabled: saving || !!session.completedAt,
                          onChange: (e) => setReps(e.target.value),
                        }),
                        h("small", null, "Meta: " + ex.reps),
                      ),
                    ),
                    button(
                      nextSet
                        ? "Registrar série " + nextSet + " de " + ex.sets
                        : current < session.exercises.length - 1
                          ? "Próximo exercício →"
                          : "Ver exercícios",
                      nextSet
                        ? record
                        : () =>
                            current < session.exercises.length - 1
                              ? pick(current + 1)
                              : setView("lista"),
                      "pp-primary pp-log-set",
                      { disabled: !!session.completedAt },
                    ),
                    h(
                      "div",
                      { className: "pp-set-table" },
                      h(
                        "div",
                        { className: "pp-set-table-head" },
                        h("span", null, "SÉRIE"),
                        h("span", null, "CARGA"),
                        h("span", null, "REPS"),
                        h("span", null, "FEITO"),
                      ),
                      ...Array.from({ length: ex.sets }, (_, i) => {
                        const log = logs.find((l) => l.setNumber === i + 1);
                        return h(
                          "div",
                          {
                            key: i,
                            className:
                              "pp-set-table-row" + (log ? " done" : ""),
                          },
                          h("strong", null, String(i + 1).padStart(2, "0")),
                          h("span", null, log ? log.weightKg + " kg" : "—"),
                          h("span", null, log ? log.reps : ex.reps),
                          h(
                            "button",
                            {
                              type: "button",
                              "aria-label":
                                (log ? "Desmarcar" : "Marcar") +
                                " série " +
                                (i + 1),
                              disabled: saving || !!session.completedAt,
                              onClick: async () => {
                                if (saving) return;
                                if (log) {
                                  try {
                                    await commit({
                                      ...session,
                                      logs: session.logs.filter(
                                        (l) =>
                                          !(
                                            l.exerciseId === ex.id &&
                                            l.setNumber === i + 1
                                          ),
                                      ),
                                    });
                                    setError("");
                                  } catch (e) {
                                    setError(e.message);
                                  }
                                  return;
                                }
                                try {
                                  await commit(
                                    engine.logSet(session, {
                                      exerciseId: ex.id,
                                      setNumber: i + 1,
                                      reps:
                                        reps === "" ? ex.reps : Number(reps),
                                      weightKg:
                                        weights[key] ??
                                        String(numberFrom(original.load, 0)),
                                    }),
                                  );
                                  setRemaining(ex.restSeconds);
                                  setRunning(ex.restSeconds > 0);
                                  setError("");
                                } catch (e) {
                                  setError(e.message);
                                }
                              },
                            },
                            log ? "✓" : "○",
                          ),
                        );
                      }),
                    ),
                    h(
                      "div",
                      { className: "pp-exercise-navigation" },
                      button(
                        "← Anterior",
                        () => pick(current - 1),
                        "pp-secondary",
                        { disabled: current === 0 },
                      ),
                      button(
                        "Próximo →",
                        () => pick(current + 1),
                        "pp-secondary",
                        { disabled: current >= session.exercises.length - 1 },
                      ),
                    ),
                  ),
            error &&
              h("p", { className: "pp-session-error", role: "alert" }, error),
            props.onSave &&
              !session.completedAt &&
              h(
                "section",
                { className: "pp-home-panel" },
                h("h3", null, "Como foi o treino de hoje?"),
                h("p", null, "Resposta opcional para seu personal."),
                h(
                  "div",
                  { className: "portal-effort" },
                  ["Leve", "Na medida", "Puxado", "Muito puxado"].map((value) =>
                    h(
                      "button",
                      {
                        key: value,
                        type: "button",
                        "aria-pressed": effort === value,
                        disabled: saving,
                        onClick: () =>
                          setEffort(effort === value ? null : value),
                      },
                      value,
                    ),
                  ),
                ),
                h(
                  "label",
                  null,
                  "Observação opcional",
                  h("textarea", {
                    value: note,
                    maxLength: 1000,
                    onChange: (e) => setNote(e.target.value),
                  }),
                ),
              ),
            saving && h("p", { role: "status" }, "Salvando série…"),
            session.completedAt
              ? h(
                  "p",
                  { className: "pp-completed-message", role: "status" },
                  props.onSave
                    ? "Treino salvo. Você concluiu mais uma etapa!"
                    : "Conferência concluída.",
                )
              : button(
                  props.onSave ? "Concluir treino" : "Concluir conferência",
                  async () => {
                    try {
                      const finished = engine.finish(session);
                      const saved = await commit(finished, true);
                      setRunning(false);
                      props.onFinish?.(saved);
                      if(props.onSave) close();
                    } catch (e) {
                      setError(e.message);
                    }
                  },
                  "pp-home-outline",
                  { disabled: done.done === 0 },
                ),
            h(
              "nav",
              {
                className: "pp-execution-nav",
                "aria-label": "Áreas da execução",
              },
              [
                ["treino", "Treino", "weight"],
                ["lista", "Exercícios", "book"],
                ["notas", "Orientações", "user"],
              ].map(([v, label, icon]) =>
                h(
                  "button",
                  {
                    key: v,
                    type: "button",
                    "aria-pressed": view === v,
                    onClick: () => setView(v),
                  },
                  I(icon),
                  label,
                ),
              ),
            ),
          ),
        ),
    );
  }
  root.PersonalProSessionPreview = { Simulator, adapt };
})(window);
