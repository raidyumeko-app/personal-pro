/* Visual presentation of the existing prescription, calendar and measurements. */
(function (root) {
  "use strict";
  const hDay = () => root.PersonalProSchedule.today();
  function sessionDate(session) {
    if (!session.completedAt) return null;
    const at = new Date(session.completedAt);
    if (!Number.isFinite(at.getTime())) return null;
    return at.getFullYear()+"-"+String(at.getMonth()+1).padStart(2,"0")+"-"+String(at.getDate()).padStart(2,"0");
  }
  function resolveExercise(ex, catalog) {
    const source = catalog.find(
      (item) =>
        item.name === ex.name ||
        (ex.sourceId &&
          (item.id === ex.sourceId || item.sourceId === ex.sourceId)),
    );
    const merged = { ...source, ...ex };
    return root.PersonalProMedia
      ? root.PersonalProMedia.resolve(merged)
      : merged;
  }
  function weeklyDates(date) {
    const at = new Date(date + "T12:00:00"),
      offset = (at.getDay() + 6) % 7;
    at.setDate(at.getDate() - offset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(at);
      d.setDate(d.getDate() + i);
      return {
        date:
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0"),
        weekday: d.getDay(),
        number: d.getDate(),
        label: ["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()],
      };
    });
  }
  function Progress({ React: R, student, sessions = [], catalog = [] }) {
    const h = R.createElement,
      history = sessions.filter((s) => s.studentId === student.id),
      week = weeklyDates(hDay()),
      recorded = new Set([
        ...(student.doneOn || []),
        ...history.map(sessionDate).filter(Boolean),
      ]),
      done = week.filter((d) => recorded.has(d.date)).length,
      planned = Object.values(student.workoutWeekdays || {})
        .flat()
        .filter((d, i, a) => a.indexOf(d) === i).length,
      expected =
        planned ||
        ["A", "B", "C"].filter((d) =>
          (student.workout || []).some((ex) => (ex.day || "A") === d),
        ).length,
      percent = expected
        ? Math.min(100, Math.round((done / expected) * 100))
        : 0,
      weights = (student.weightHistory || [])
        .map(Number)
        .filter((v) => Number.isFinite(v) && v > 0)
        .slice(-8),
      lo = Math.min(...weights) - 1,
      hi = Math.max(...weights) + 1,
      points = weights.map((v, i) => [
        22 + (i * 296) / Math.max(1, weights.length - 1),
        126 - ((v - lo) / (hi - lo)) * 100,
      ]),
      groups = {};
    for (const ex of student.workout || []) {
      const item = resolveExercise(ex, catalog),
        group = item.group || "Outros";
      groups[group] = (groups[group] || 0) + 1;
    }
    const total = Object.values(groups).reduce((a, b) => a + b, 0),
      colors = ["#b5f500", "#7bba2a", "#e9dc3e", "#68757a", "#38444b"],
      entries = Object.entries(groups).sort((a, b) => b[1] - a[1]),
      gradient = [];
    let stop = 0;
    entries.forEach(([name, count], i) => {
      const from = stop;
      stop += (count / Math.max(1, total)) * 100;
      gradient.push(colors[i % colors.length] + " " + from + "% " + stop + "%");
    });
    return h(
      "section",
      {
        className: "pp-training-progress",
        "aria-label": "Progresso do treino",
      },
      h(
        "div",
        { className: "pp-training-section-title" },
        h("h3", null, "Seu progresso"),
        h("span", null, "ESTA SEMANA"),
      ),
      h(
        "div",
        { className: "pp-week-progress-card" },
        h(
          "div",
          null,
          h("small", null, "FREQUÊNCIA SEMANAL"),
          h("strong", null, done + " / " + expected),
          h("p", null, "dias registrados"),
          h(
            "div",
            { className: "pp-week-checks" },
            week.map((d) =>
              h(
                "span",
                {
                  key: d.date,
                  className: recorded.has(d.date) ? "is-done" : "",
                },
                recorded.has(d.date) ? "✓" : d.label,
              ),
            ),
          ),
        ),
        h(
          "div",
          {
            className: "pp-frequency-ring",
            style: { "--progress": percent + "%" },
          },
          h("strong", null, percent + "%"),
          h("small", null, "DA META"),
        ),
      ),
      weights.length > 0 &&
        h(
          "section",
          { className: "pp-training-chart" },
          h(
            "div",
            { className: "pp-training-section-title" },
            h("h3", null, "Evolução corporal"),
            h("span", null, "PESO · kg"),
          ),
          h(
            "div",
            { className: "pp-current-weight" },
            h("strong", null, weights.at(-1)),
            h("small", null, "kg"),
            weights.length > 1 &&
              h(
                "span",
                null,
                (weights.at(-1) - weights[0] > 0 ? "+" : "") +
                  (weights.at(-1) - weights[0]).toFixed(1).replace(".", ",") +
                  " kg desde o primeiro registro",
              ),
          ),
          h(
            "svg",
            {
              viewBox: "0 0 340 155",
              role: "img",
              "aria-label": "Evolução de peso: " + weights.join(", ") + " kg",
            },
            h("path", {
              d: "M22 26H318 M22 76H318 M22 126H318",
              stroke: "#2a3337",
              fill: "none",
            }),
            h("path", {
              d:
                "M22 126 L" +
                points.map((p) => p.join(",")).join(" L") +
                " L318 126Z",
              fill: "#b5f500",
              opacity: 0.12,
            }),
            h("polyline", {
              points: points.map((p) => p.join(",")).join(" "),
              fill: "none",
              stroke: "#b5f500",
              strokeWidth: 3,
            }),
            ...points.map(([x, y], i) =>
              h(
                "g",
                { key: i },
                h("circle", { cx: x, cy: y, r: 4, fill: "#b5f500" }),
                h(
                  "text",
                  {
                    x,
                    y: 148,
                    textAnchor: "middle",
                    fill: "#aab4bb",
                    fontSize: 10,
                  },
                  String(weights[i]).replace(".", ","),
                ),
              ),
            ),
          ),
          h(
            "p",
            { className: "pp-chart-footnote" },
            "Sequência das avaliações cadastradas",
          ),
        ),
      total > 0 &&
        h(
          "section",
          { className: "pp-focus-card" },
          h(
            "div",
            { className: "pp-training-section-title" },
            h("h3", null, "Distribuição da ficha"),
            h("span", null, total + " EXERCÍCIOS"),
          ),
          h(
            "div",
            { className: "pp-focus-content" },
            h(
              "div",
              {
                className: "pp-muscle-ring",
                style: {
                  background: "conic-gradient(" + gradient.join(",") + ")",
                },
              },
              h("strong", null, total),
              h("small", null, "EXERCÍCIOS"),
            ),
            h(
              "ul",
              null,
              entries.map(([name, count], i) =>
                h(
                  "li",
                  { key: name },
                  h("i", { style: { background: colors[i % colors.length] } }),
                  h("span", null, name),
                  h("strong", null, Math.round((count / total) * 100) + "%"),
                ),
              ),
            ),
          ),
        ),
      history.length > 0 &&
        h(
          "section",
          { className: "pp-training-chart" },
          h("h3", null, "Histórico de execução"),
          history
            .slice()
            .reverse()
            .map((s) =>
              h(
                "div",
                { key: s.id, className: "pp-training-history" },
                h(root.PersonalProUI.Icon, { React: R, name: "check" }),
                h(
                  "div",
                  null,
                  h(
                    "strong",
                    null,
                    "Treino " + s.workoutId.replace("preview-", ""),
                  ),
                  h(
                    "small",
                    null,
                    new Date(s.completedAt).toLocaleDateString("pt-BR") +
                      " · " +
                      s.logs.length +
                      " séries",
                  ),
                ),
              ),
            ),
        ),
    );
  }
  function Experience({
    React: R,
    students = [],
    catalog = [],
    sessions = [],
    onFinish,
    onBack,
    onManage,
    onStudents,
    embedded = false,
  }) {
    const h = R.createElement,
      [studentId, setStudentId] = R.useState(
        students.find((s) => !s.archived)?.id || "",
      ),
      [day, setDay] = R.useState("A"),
      [tab, setTab] = R.useState("inicio"),
      [selectedDate, setSelectedDate] = R.useState(hDay()),
      active = students.filter((s) => !s.archived),
      student = active.find((s) => s.id === studentId) || active[0],
      all = student?.workout || [],
      exercises = all
        .filter((ex) => (ex.day || "A") === day)
        .map((ex) => resolveExercise(ex, catalog)),
      week = weeklyDates(selectedDate),
      I = (name) => h(root.PersonalProUI.Icon, { React: R, name }),
      button = (label, fn, cls = "pp-secondary") =>
        h("button", { type: "button", className: cls, onClick: fn }, label),
      recorded = new Set([
        ...(student?.doneOn || []),
        ...sessions
          .filter((s) => s.studentId === student?.id)
          .map(sessionDate)
          .filter(Boolean),
      ]);
    function selectDate(d) {
      setSelectedDate(d.date);
      const assigned = ["A", "B", "C"].find((key) =>
        (student?.workoutWeekdays?.[key] || []).map(Number).includes(d.weekday),
      );
      if (assigned) setDay(assigned);
    }
    return h(
      "section",
      { className: "pp-training-experience" + (embedded ? " is-embedded" : "") },
      !embedded && button("← Voltar ao início", onBack),
      h(
        "header",
        { className: "pp-training-heading" },
        h(
          "div",
          null,
          h("small", null, "PERSONAL PRO · TREINAMENTO"),
          h(
            "h2",
            null,
            tab === "evolucao"
              ? "Cada treino conta."
              : tab === "semana"
                ? "Sua semana. Seu ritmo."
                : "Vamos mais longe.",
          ),
        ),
        h("span", { className: "pp-training-mark" }, I("weight")),
      ),
      h(
        "div",
        { className: "pp-training-person" },
        h("span", null, "Treino de"),
        h(
          "select",
          {
            "aria-label": "Aluno da simulação",
            value: student?.id || "",
            onChange: (e) => {
              setStudentId(e.target.value);
              setDay("A");
            },
          },
          active.map((s) => h("option", { key: s.id, value: s.id }, s.name)),
        ),
        onManage &&
          button(
            "Editar ficha",
            () => onManage(student?.id),
            "pp-training-text-button",
          ),
      ),
      h(
        "nav",
        { className: "pp-training-tabs", "aria-label": "Áreas de treinamento" },
        [
          ["inicio", "Hoje"],
          ["semana", "Semana"],
          ["evolucao", "Progresso"],
        ].map(([key, label]) =>
          h(
            "button",
            {
              key,
              type: "button",
              "aria-pressed": tab === key,
              onClick: () => setTab(key),
            },
            label,
          ),
        ),
      ),
      !student
        ? h(
            "div",
            { className: "pp-empty" },
            h("p", null, "Escolha ou cadastre um aluno para abrir o treino."),
            onStudents && button("Abrir alunos", onStudents),
          )
        : h(
            R.Fragment,
            null,
            tab !== "evolucao" &&
              h(
                R.Fragment,
                null,
                h(root.PersonalProSessionPreview.Simulator, {
                  key: student.id + ":" + day,
                  React: R,
                  studentId: student.id,
                  day,
                  exercises,
                  onFinish,
                  hero: true,
                  title:
                    student.workoutTitles?.[day] ||
                    (exercises[0]?.group || student.goal || "Seu treino") +
                      " · Treino " +
                      day,
                }),
                h(
                  "div",
                  { className: "pp-training-section-title" },
                  h("h3", null, "Treino da semana"),
                  h(
                    "span",
                    null,
                    new Date(selectedDate + "T12:00:00").toLocaleDateString(
                      "pt-BR",
                      { month: "long", year: "numeric" },
                    ),
                  ),
                ),
                h(
                  "div",
                  { className: "pp-week-calendar" },
                  week.map((d) =>
                    h(
                      "button",
                      {
                        key: d.date,
                        type: "button",
                        "aria-label": "Treino de " + d.date,
                        "aria-pressed": selectedDate === d.date,
                        className:
                          (selectedDate === d.date ? "selected " : "") +
                          (recorded.has(d.date) ? "completed" : ""),
                        onClick: () => selectDate(d),
                      },
                      h("small", null, d.label),
                      h("strong", null, d.number),
                      h(
                        "i",
                        null,
                        recorded.has(d.date)
                          ? "✓"
                          : Object.values(student.workoutWeekdays || {})
                                .flat()
                                .map(Number)
                                .includes(d.weekday)
                            ? "•"
                            : "",
                      ),
                    ),
                  ),
                ),
                h(
                  "div",
                  { className: "pp-training-day-picker" },
                  ["A", "B", "C"].map((key) =>
                    h(
                      "button",
                      {
                        key,
                        type: "button",
                        "aria-pressed": day === key,
                        onClick: () => setDay(key),
                      },
                      "Treino " + key,
                    ),
                  ),
                ),
                h(
                  "div",
                  { className: "pp-training-section-title" },
                  h(
                    "h3",
                    null,
                    tab === "semana"
                      ? "Sua programação"
                      : "Exercícios do treino",
                  ),
                  h("span", null, exercises.length + " MOVIMENTOS"),
                ),
                tab === "semana"
                  ? h(
                      "div",
                      { className: "pp-week-workouts" },
                      ["A", "B", "C"].map((key) => {
                        const list = all.filter(
                            (ex) => (ex.day || "A") === key,
                          ),
                          cover = resolveExercise(list[0] || {}, catalog),
                          days = student.workoutWeekdays?.[key] || [];
                        return h(
                          "button",
                          {
                            key,
                            type: "button",
                            className: "pp-week-workout-card",
                            onClick: () => {
                              setDay(key);
                              setTab("inicio");
                            },
                          },
                          cover.images?.[0]
                            ? h("img", {
                                src: cover.images[0],
                                alt: "",
                                loading: "lazy",
                              })
                            : h(
                                "span",
                                { className: "pp-workout-cover-fallback" },
                                I("weight"),
                              ),
                          h(
                            "div",
                            null,
                            h(
                              "small",
                              null,
                              days.length
                                ? days
                                    .map(
                                      (i) =>
                                        [
                                          "Dom",
                                          "Seg",
                                          "Ter",
                                          "Qua",
                                          "Qui",
                                          "Sex",
                                          "Sáb",
                                        ][i],
                                    )
                                    .join(" · ")
                                : "Dias a definir",
                            ),
                            h("strong", null, "Treino " + key),
                            h(
                              "p",
                              null,
                              list.length +
                                " exercícios · " +
                                (student.workoutDurations?.[key] ||
                                  "duração a definir") +
                                (student.workoutDurations?.[key] ? " min" : ""),
                            ),
                          ),
                          I("arrow"),
                        );
                      }),
                    )
                  : h(
                      "div",
                      { className: "pp-exercise-visual-list" },
                      exercises.map((ex, i) =>
                        h(
                          "article",
                          {
                            key: ex.id || i,
                            className: "pp-exercise-visual-card",
                          },
                          ex.images?.[0]
                            ? h("img", {
                                src: ex.images[0],
                                alt: ex.name,
                                loading: "lazy",
                              })
                            : h(
                                "span",
                                { className: "pp-workout-cover-fallback" },
                                I("weight"),
                              ),
                          h(
                            "div",
                            null,
                            h("strong", null, ex.name),
                            h(
                              "p",
                              null,
                              (ex.series && ex.repetitions
                                ? ex.series + " × " + ex.repetitions
                                : ex.sets || "A definir") +
                                " · " +
                                (ex.rest ?? 60) +
                                "s",
                            ),
                            h(
                              "small",
                              null,
                              ex.video
                                ? "▶ Vídeo disponível"
                                : "Orientação do exercício",
                            ),
                          ),
                          h(
                            "span",
                            { className: "pp-exercise-index" },
                            String(i + 1).padStart(2, "0"),
                          ),
                        ),
                      ),
                    ),
              ),
            (tab === "evolucao" || tab === "inicio") &&
              h(Progress, { React: R, student, sessions, catalog }),
            h(
              "div",
              { className: "pp-training-bottom-actions" },
              onManage &&
                button("Montar / editar treino", () => onManage(student?.id)),
              onStudents && button("Gerenciar alunos", onStudents),
            ),
            h(
              "p",
              { className: "pp-training-demo-note" },
              "Na demonstração, os registros da execução ficam nesta sessão. A ficha é a mesma editada no aplicativo.",
            ),
          ),
    );
  }
  root.PersonalProStudentExperience = {
    Experience,
    Progress,
    resolveExercise,
    weeklyDates,
  };
})(window);
