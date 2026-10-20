/* Trainer home contains training and appointments; finance has its own tab. */
(function (root) {
  "use strict";
  function Dashboard({
    React: R,
    students = [],
    profile = {},
    onStudents,
    onNewStudent,
    onWorkout,
    onLibrary,
    onAppointment,
  }) {
    const h = R.createElement,
      [sessions, setSessions] = R.useState([]),
      [links, setLinks] = R.useState([]),
      [error, setError] = R.useState(""),
      [busy, setBusy] = R.useState("");
    const marking = R.useRef(false);
    async function refresh() {
      try {
        const [s, l] = await Promise.all([
          root.PersonalProAPI.rows(
            "pp_sessions_v2",
            "select=*&completed_at=not.is.null&order=completed_at.desc&limit=20",
          ),
          root.PersonalProAPI.rows("pp_links", "select=id,legacy_student_id"),
        ]);
        setSessions(s);
        setLinks(l);
      } catch (e) {
        setError(e.message);
      }
    }
    R.useEffect(() => {
      refresh();
    }, []);
    const active = students.filter((s) => !s.archived),
      today = root.PersonalProSchedule.today(),
      appointments = active
        .flatMap((s) =>
          root.PersonalProSchedule.appointments(s, today).map((a) => ({
            ...a,
            student: s,
          })),
        )
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    return h(
      "section",
      { className: "portal-trainer-home" },
      h(
        "header",
        { className: "portal-heading" },
        h("p", { className: "portal-eyebrow" }, "SEU DIA EM MOVIMENTO"),
        h(
          "h1",
          null,
          "Olá, " + (profile.name?.split(" ")[0] || "personal") + ".",
        ),
        h("p", null, "Acompanhe de perto. Inspire o próximo passo."),
      ),
      h(
        "div",
        { className: "portal-stats" },
        h(
          "article",
          null,
          h("strong", null, active.length),
          h("span", null, "alunos ativos"),
        ),
        h(
          "article",
          null,
          h("strong", null, active.filter((s) => s.workout?.length).length),
          h("span", null, "com treino"),
        ),
        h(
          "article",
          null,
          h("strong", null, appointments.length),
          h("span", null, "na agenda hoje"),
        ),
      ),
      h(
        "section",
        { className: "portal-card portal-trainer-hero" },
        h("p", { className: "portal-eyebrow" }, "PRESENÇA FAZ DIFERENÇA"),
        h(
          "h2",
          null,
          "Seu trabalho transforma",
          h("br"),
          "o treino de alguém.",
        ),
        h(
          "div",
          { className: "portal-actions" },
          h(
            "button",
            { type: "button", className: "pp-primary", onClick: onNewStudent },
            "Adicionar aluno +",
          ),
          h(
            "button",
            { type: "button", className: "pp-secondary", onClick: onLibrary },
            "Explorar exercícios",
          ),
        ),
      ),
      h(
        "section",
        { className: "portal-card" },
        h("h3", null, "Agenda de hoje"),
        !appointments.length
          ? h(
              "p",
              null,
              "Nenhum atendimento programado para hoje. Organize a agenda na ficha do aluno.",
            )
          : appointments.map((a, i) =>
              h(
                "button",
                {
                  key: i,
                  type: "button",
                  className: "portal-agenda-row",
                  onClick: () => onAppointment?.(a.student.id, today),
                },
                h("strong", null, a.student.name),
                h("span", null, a.time || "Horário a definir"),
                " →",
              ),
            ),
      ),
      h(
        "section",
        null,
        h(
          "div",
          { className: "portal-section-title" },
          h("h2", null, "Seus alunos"),
          h(
            "button",
            { type: "button", className: "pp-secondary", onClick: onStudents },
            "Ver todos",
          ),
        ),
        !active.length
          ? h(
              "div",
              { className: "portal-empty" },
              h("p", null, "Cadastre seu primeiro aluno para começar."),
            )
          : active
              .slice(0, 4)
              .map((s) =>
                h(
                  "button",
                  {
                    type: "button",
                    key: s.id,
                    className: "portal-student-row",
                    onClick: () => onWorkout(s.id),
                  },
                  h(
                    "span",
                    { className: "portal-avatar" },
                    s.initials || s.name[0],
                  ),
                  h(
                    "span",
                    null,
                    h("strong", null, s.name),
                    h(
                      "small",
                      null,
                      (s.workout?.length || 0) + " exercícios na ficha",
                    ),
                  ),
                  "→",
                ),
              ),
      ),
      h(
        "section",
        { className: "portal-card" },
        h(
          "div",
          { className: "portal-section-title" },
          h("h2", null, "Treinos concluídos"),
          h(
            "button",
            { type: "button", className: "pp-secondary", onClick: refresh },
            "Atualizar",
          ),
        ),
        error && h("p", { role: "alert" }, error),
        !sessions.length
          ? h(
              "p",
              null,
              "As conclusões e os feedbacks dos alunos vinculados aparecerão aqui.",
            )
          : sessions.map((s) => {
              const linked = links.find((l) => l.id === s.link_id),
                student = students.find(
                  (a) => a.id === linked?.legacy_student_id,
                );
              return h(
                "article",
                { key: s.id, className: "portal-feedback" },
                h("h3", null, student?.name || "Aluno vinculado"),
                h(
                  "small",
                  null,
                  new Date(s.completed_at).toLocaleString("pt-BR") +
                    " · Treino " +
                    s.day,
                ),
                h(
                  "p",
                  null,
                  s.logs.length +
                    " séries · " +
                    (s.effort || "Sem avaliação de esforço"),
                ),
                s.student_note && h("p", null, s.student_note),
                h(root.PersonalProFeedback.Status, {
                  React: R, trainer: true, seenAt: s.feedback_seen_at,
                  busy: Boolean(busy),
                  onMark: async () => {
                    if (marking.current) return;
                    marking.current = true;
                    setBusy(s.id); setError("");
                    try {
                      const seenAt = await root.PersonalProAPI.markFeedbackSeen(s.id);
                      if (!seenAt) throw Error("Não foi possível confirmar a leitura. Tente novamente.");
                      setSessions(list => list.map(item => item.id === s.id ? {...item, feedback_seen_at: seenAt} : item));
                    } catch (e) { setError(e.message); }
                    finally { marking.current = false; setBusy(""); }
                  },
                }),
              );
            }),
      ),
    );
  }
  root.PersonalProDashboard = { Dashboard };
})(window);
