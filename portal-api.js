/* The browser uses only the publishable key. All authorization is server-side. */
(function (root) {
  "use strict";
  const cloud = () => root.PersonalProCloud;
  const rpc = (name, args = {}) =>
    cloud().request("/rest/v1/rpc/" + name, {
      method: "POST",
      body: JSON.stringify(args),
    });
  const rows = (table, query = "") =>
    cloud().request("/rest/v1/" + table + "?" + query);
  const uid = () => cloud().userId();
  const write = (table, data) =>
    cloud().request(
      "/rest/v1/" +
        table +
        "?on_conflict=" +
        (table === "pp_nutrition_settings" ? "user_id" : "id"),
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify({ ...data, user_id: uid() }),
      },
    );
  function fromServer(s) {
    if (!s) return null;
    return {
      id: s.id,
      studentId: s.student_user_id,
      workoutId: s.day,
      startedAt: s.started_at,
      completedAt: s.completed_at,
      exercises: root.PersonalProSessionPreview.adapt(s.prescription),
      logs: s.logs,
      revision: s.revision,
      effort: s.effort,
      studentNote: s.student_note,
      feedbackSeenAt: s.feedback_seen_at || null,
      congratulations: s.congratulations,
      prescription: s.prescription,
    };
  }
  root.PersonalProAPI = {
    rpc,
    rows,
    write,
    uid,
    fromServer,
    markFeedbackSeen: id => rpc('pp_mark_feedback_seen', {p_session_id:id}),
    feedbackReceipts(ids) {
      const valid=ids.filter(id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)).slice(0,100);
      return valid.length ? rows('pp_sessions_v2','select=id,feedback_seen_at&id=in.('+valid.join(',')+')&completed_at=not.is.null') : Promise.resolve([]);
    },
    async member() {
      return (
        (await rows("pp_members", "select=*&user_id=eq." + uid()))[0] || null
      );
    },
    register: (role, name, gender) =>
      rpc("pp_register_member", {
        p_role: role,
        p_name: name,
        p_gender: gender,
      }),
    studentData: () => rpc("pp_student_data"),
    studentAccess: () => rpc("pp_student_access"),
    async sessions(offset = 0) {
      return (
        await rows(
          "pp_sessions_v2",
          "select=*&order=started_at.desc&limit=30&offset=" + offset,
        )
      ).map(fromServer);
    },
    async start(day) {
      return fromServer(
        await rpc("pp_start_session", {
          p_id: crypto.randomUUID(),
          p_day: day,
        }),
      );
    },
    async save(session, finished, effort = null, note = "") {
      return fromServer(
        await rpc("pp_save_session", {
          p_id: session.id,
          p_revision: session.revision,
          p_logs: session.logs,
          p_finish: finished,
          p_effort: effort,
          p_note: note,
        }),
      );
    },
    async entitlements() {
      return rows("pp_entitlements", "select=product,valid_until");
    },
    async nutrition() {
      return Promise.all([
        rows("pp_nutrition_settings", "select=*"),
        rows(
          "pp_nutrition_entries",
          "select=*&order=occurred_at.desc&limit=100",
        ),
      ]);
    },
    async upload(file) {
      const path =
        uid() +
        "/" +
        crypto.randomUUID() +
        "." +
        ({
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "application/pdf": "pdf",
        }[file.type] || "bin");
      if (file.size > 10485760) throw Error("Arquivo maior que 10 MB.");
      await cloud().request("/storage/v1/object/pp-nutrition/" + path, {
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type },
      });
      return path;
    },
    async signed(path) {
      if (!path || path.split("/")[0] !== uid())
        throw Error("Arquivo de outra conta.");
      const r = await cloud().request(
        "/storage/v1/object/sign/pp-nutrition/" + path,
        { method: "POST", body: JSON.stringify({ expiresIn: 120 }) },
      );
      return (
        "https://lnlwkjsfcpeofhajqesh.supabase.co/storage/v1" + r.signedURL
      );
    },
    async removeEntry(id) {
      return cloud().request(
        "/rest/v1/pp_nutrition_entries?id=eq." + encodeURIComponent(id),
        { method: "DELETE" },
      );
    },
    async compress(file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        throw Error("Escolha uma fotografia JPEG, PNG ou WebP.");
      if (file.size > 10485760) throw Error("Foto maior que 10 MB.");
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas
        .getContext("2d")
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.8),
      );
    },
  };
})(window);
