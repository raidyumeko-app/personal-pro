/* Existing exercise identities mapped to attributed, browser-compatible demonstration media. */
(function (root) {
  "use strict";
  const entries = [
    {
      id: "73",
      sourceId: "Barbell_Bench_Press_-_Medium_Grip",
      names: ["Supino reto com barra"],
      poster: "/media/exercises/73.jpg",
      video: {
        url: "/media/exercises/73.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/21/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/73/2bdb390c-312c-4497-a722-5eed2c823e5a.MOV",
        licensed: true,
      },
    },
    {
      id: "75",
      sourceId: "Dumbbell_Bench_Press",
      names: ["Supino reto com halteres"],
      poster: "/media/exercises/75.jpg",
      video: {
        url: "/media/exercises/75.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/17/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/75/080c799b-8afd-4130-8d72-9cef0cd79f54.MOV",
        licensed: true,
      },
    },
    {
      id: "91",
      sourceId: "Barbell_Curl",
      names: ["Rosca direta com barra"],
      poster: "/media/exercises/91.jpg",
      video: {
        url: "/media/exercises/91.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/49/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/91/483f4bff-e108-41f1-8e7b-0caf24952552.MOV",
        licensed: true,
      },
    },
    {
      id: "371",
      sourceId: "Leg_Press",
      names: ["Leg press 45 graus"],
      poster: "/media/exercises/371.jpg",
      video: {
        url: "/media/exercises/371.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/44/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/371/6aae16b4-01b9-4eb4-935c-3250f84d2c59.MOV",
        licensed: true,
      },
    },
    {
      id: "512",
      sourceId: "Seated_Cable_Rows",
      names: ["Remada baixa na polia", "Remada baixa com triângulo"],
      poster: "/media/exercises/512.jpg",
      video: {
        url: "/media/exercises/512.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/1/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/512/fff4c294-93f0-4926-b3a2-bf59ad4afaa5.MOV",
        licensed: true,
      },
    },
    {
      id: "537",
      sourceId: "Incline_Dumbbell_Press",
      names: ["Supino inclinado com halteres"],
      poster: "/media/exercises/537.jpg",
      video: {
        url: "/media/exercises/537.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/24/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/537/b9c937e9-daeb-42a9-be8e-7a77e368478c.MOV",
        licensed: true,
      },
    },
    {
      id: "538",
      sourceId: "Barbell_Incline_Bench_Press_-_Medium_Grip",
      names: ["Supino inclinado com barra"],
      poster: "/media/exercises/538.jpg",
      video: {
        url: "/media/exercises/538.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/16/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/538/4349a6f6-4cee-4c09-828b-c5e7fc2c1ff1.MOV",
        licensed: true,
      },
    },
    {
      id: "348",
      sourceId: "Side_Lateral_Raise",
      names: ["Elevação lateral com halteres"],
      poster: "/media/exercises/348.jpg",
      video: {
        url: "/media/exercises/348.mp4",
        author: "Goulart",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        source: "https://wger.de/api/v2/video/6/?format=json",
        originalUrl:
          "https://wger.de/media/exercise-video/348/de69928a-8a35-4096-821c-1f46de5e0e03.MOV",
        licensed: true,
      },
    },
  ];
  function resolve(ex) {
    const item = entries.find(
      (item) =>
        item.sourceId === (ex.sourceId || ex.id) ||
        item.names.includes(ex.name),
    );
    return item
      ? {
          ...ex,
          poster: item.poster,
          images: ex.images?.length ? ex.images : [item.poster],
          video: item.video,
        }
      : ex;
  }
  root.PersonalProMedia = { resolve, entries };
})(window);
