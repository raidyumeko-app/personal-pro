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
  // Additional exact movement/equipment matches from the authorized free YMove pack.
  entries.push(...[
  {
    "id": "ymove-barbell-back-squat",
    "sourceId": "Barbell_Squat",
    "names": [
      "Barbell Squat",
      "Agachamento livre",
      "Agachamento com barra"
    ],
    "poster": "https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/fd0eaa34-d14b-4421-b41c-1669f93253b3",
      "licensed": true
    }
  },
  {
    "id": "ymove-barbell-deadlift",
    "sourceId": "Barbell_Deadlift",
    "names": [
      "Barbell Deadlift",
      "Levantamento terra com barra"
    ],
    "poster": "https://ymove.app/api/free/b59952ca-1551-4c07-835d-ab78bfe9953c?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/b59952ca-1551-4c07-835d-ab78bfe9953c",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/b59952ca-1551-4c07-835d-ab78bfe9953c",
      "licensed": true
    }
  },
  {
    "id": "ymove-hammer-curls",
    "sourceId": "Hammer_Curls",
    "names": [
      "Hammer Curls",
      "Rosca martelo",
      "Rosca martelo com halteres"
    ],
    "poster": "https://ymove.app/api/free/b11e6c6f-b2e8-44ca-95dc-adf0dcd34426?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/b11e6c6f-b2e8-44ca-95dc-adf0dcd34426",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/b11e6c6f-b2e8-44ca-95dc-adf0dcd34426",
      "licensed": true
    }
  },
  {
    "id": "ymove-kettlebell-push-press",
    "sourceId": "One-Arm_Kettlebell_Push_Press",
    "names": [
      "One-Arm Kettlebell Push Press",
      "Push press unilateral com kettlebell"
    ],
    "poster": "https://ymove.app/api/free/3880aaa4-e1c0-4153-95d0-da44ea01e099?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/3880aaa4-e1c0-4153-95d0-da44ea01e099",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/3880aaa4-e1c0-4153-95d0-da44ea01e099",
      "licensed": true
    }
  },
  {
    "id": "ymove-goblet-squat-with-kettlebell",
    "sourceId": "Goblet_Squat",
    "names": [
      "Goblet Squat",
      "Agachamento goblet",
      "Agachamento goblet com kettlebell"
    ],
    "poster": "https://ymove.app/api/free/198d4a7d-bc23-41f8-ad67-4fe9ab876b89?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/198d4a7d-bc23-41f8-ad67-4fe9ab876b89",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/198d4a7d-bc23-41f8-ad67-4fe9ab876b89",
      "licensed": true
    }
  },
  {
    "id": "ymove-lat-pulldown",
    "sourceId": "V-Bar_Pulldown",
    "names": [
      "V-Bar Pulldown",
      "Puxada frontal com pegada neutra",
      "Puxada com triângulo"
    ],
    "poster": "https://ymove.app/api/free/5971eaa2-5264-49cc-99c2-1310305c5342?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/5971eaa2-5264-49cc-99c2-1310305c5342",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/5971eaa2-5264-49cc-99c2-1310305c5342",
      "licensed": true
    }
  },
  {
    "id": "ymove-seated-machine-chest-press",
    "sourceId": "Leverage_Chest_Press",
    "names": [
      "Leverage Chest Press",
      "Supino reto na máquina"
    ],
    "poster": "https://ymove.app/api/free/20cc4825-dd52-4887-99db-c492546741dc?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/20cc4825-dd52-4887-99db-c492546741dc",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/20cc4825-dd52-4887-99db-c492546741dc",
      "licensed": true
    }
  },
  {
    "id": "ymove-cable-lateral-raise",
    "sourceId": "Standing_Low-Pulley_Deltoid_Raise",
    "names": [
      "Standing Low-Pulley Deltoid Raise",
      "Elevação lateral na polia"
    ],
    "poster": "https://ymove.app/api/free/710d4aa4-e4ea-4fad-8930-a7b9bf582cae?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/710d4aa4-e4ea-4fad-8930-a7b9bf582cae",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/710d4aa4-e4ea-4fad-8930-a7b9bf582cae",
      "licensed": true
    }
  },
  {
    "id": "ymove-cable-rope-face-pull",
    "sourceId": "Face_Pull",
    "names": [
      "Face Pull",
      "Face pull"
    ],
    "poster": "https://ymove.app/api/free/d9b9cf47-c5ff-4672-b8a8-2fe5f4845231?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/d9b9cf47-c5ff-4672-b8a8-2fe5f4845231",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/d9b9cf47-c5ff-4672-b8a8-2fe5f4845231",
      "licensed": true
    }
  },
  {
    "id": "ymove-cable-bicep-curl-rope-23790c",
    "sourceId": "Cable_Hammer_Curls_-_Rope_Attachment",
    "names": [
      "Cable Hammer Curls - Rope Attachment",
      "Rosca martelo com corda na polia"
    ],
    "poster": "https://ymove.app/api/free/f32940f7-7da6-4741-a72f-13e52c56a79c?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/f32940f7-7da6-4741-a72f-13e52c56a79c",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/f32940f7-7da6-4741-a72f-13e52c56a79c",
      "licensed": true
    }
  },
  {
    "id": "ymove-cable-tricep-pushdown",
    "sourceId": "Triceps_Pushdown_-_Rope_Attachment",
    "names": [
      "Triceps Pushdown - Rope Attachment",
      "Tríceps na polia com corda"
    ],
    "poster": "https://ymove.app/api/free/3875dae4-14a6-4533-84d3-ef9acbadbaea?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/3875dae4-14a6-4533-84d3-ef9acbadbaea",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/3875dae4-14a6-4533-84d3-ef9acbadbaea",
      "licensed": true
    }
  },
  {
    "id": "ymove-overhead-cable-rope-extension",
    "sourceId": "Cable_Rope_Overhead_Triceps_Extension",
    "names": [
      "Cable Rope Overhead Triceps Extension",
      "Tríceps francês com corda na polia"
    ],
    "poster": "https://ymove.app/api/free/a1c3384e-62db-4595-9b97-df2e7f131234?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/a1c3384e-62db-4595-9b97-df2e7f131234",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/a1c3384e-62db-4595-9b97-df2e7f131234",
      "licensed": true
    }
  },
  {
    "id": "ymove-leg-extension",
    "sourceId": "Leg_Extensions",
    "names": [
      "Leg Extensions",
      "Cadeira extensora"
    ],
    "poster": "https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c",
      "licensed": true
    }
  },
  {
    "id": "ymove-lying-leg-curl",
    "sourceId": "Lying_Leg_Curls",
    "names": [
      "Lying Leg Curls",
      "Mesa flexora"
    ],
    "poster": "https://ymove.app/api/free/ee452f3b-4d5f-4deb-995e-64dd2a23f453?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/ee452f3b-4d5f-4deb-995e-64dd2a23f453",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/ee452f3b-4d5f-4deb-995e-64dd2a23f453",
      "licensed": true
    }
  },
  {
    "id": "ymove-cable-woodchop-high-to-low-842bc7",
    "sourceId": "Standing_Cable_Wood_Chop",
    "names": [
      "Standing Cable Wood Chop",
      "Lenhador na polia alta"
    ],
    "poster": "https://ymove.app/api/free/3a47b35a-a5ee-4b0c-8780-ba368d122f10?type=thumbnail",
    "video": {
      "url": "https://ymove.app/api/free/3a47b35a-a5ee-4b0c-8780-ba368d122f10",
      "author": "YMove / Your Move",
      "license": "Uso comercial autorizado — pacote gratuito YMove",
      "licenseUrl": "https://ymove.app/free-exercise-videos",
      "source": "https://ymove.app/free-exercise-videos",
      "originalUrl": "https://ymove.app/api/free/3a47b35a-a5ee-4b0c-8780-ba368d122f10",
      "licensed": true
    }
  }
]);
  function resolve(ex) {
    const identity = ex.sourceId || ex.id;
    const item = entries.find(item => item.sourceId === identity) ||
      entries.find(item => item.names.includes(ex.name));
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
