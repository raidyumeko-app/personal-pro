/* Training-first presentation; financial information belongs to its existing tab. */
(function (root) {
  "use strict";
  function Dashboard({
    React: R,
    students = [],
    catalog = [],
    sessions = [],
    onFinish,
    onStudents,
    onWorkout,
  }) {
    return R.createElement(root.PersonalProStudentExperience.Experience, {
      React: R,
      students,
      catalog,
      sessions,
      onFinish,
      onStudents,
      onManage: onWorkout,
      embedded: true,
    });
  }
  root.PersonalProDashboard = { Dashboard };
})(window);
