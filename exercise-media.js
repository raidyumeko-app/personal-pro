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
  entries.push({
  "id": "ymove-single-arm-dumbbell-row-legs-apart",
  "sourceId": "One-Arm_Dumbbell_Row",
  "names": [
    "Remada unilateral com halter",
    "Single Arm Dumbbell Row - Legs apart"
  ],
  "poster": "https://ymove.app/api/free/d3fece95-c7e2-4794-ba8f-65a5b3e30a28?type=thumbnail",
  "video": {
    "url": "https://ymove.app/api/free/d3fece95-c7e2-4794-ba8f-65a5b3e30a28",
    "author": "YMove / Your Move",
    "license": "Uso comercial autorizado — pacote gratuito YMove",
    "licenseUrl": "https://ymove.app/free-exercise-videos",
    "source": "https://ymove.app/free-exercise-videos",
    "originalUrl": "https://ymove.app/api/free/d3fece95-c7e2-4794-ba8f-65a5b3e30a28",
    "licensed": true,
    "demonstrationVariant": "Em pé, com a mão apoiada na perna"
  }
});
  const previewEntries = [
  {
    "id": "free-preview-0025",
    "sourceId": "Barbell_Bench_Press_-_Medium_Grip",
    "names": [
      "Supino reto com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-bench-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-bench-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-bench-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-bench-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0047",
    "sourceId": "Barbell_Incline_Bench_Press_-_Medium_Grip",
    "names": [
      "Supino inclinado com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-incline-bench-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-incline-bench-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-incline-bench-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-incline-bench-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0033",
    "sourceId": "Decline_Barbell_Bench_Press",
    "names": [
      "Supino declinado com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-decline-bench-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-decline-bench-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-decline-bench-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-decline-bench-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0314",
    "sourceId": "Incline_Dumbbell_Press",
    "names": [
      "Supino inclinado com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-incline-bench-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-bench-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-bench-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-incline-bench-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0308",
    "sourceId": "Dumbbell_Flyes",
    "names": [
      "Crucifixo com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-fly.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-fly.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-fly.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-fly.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0319",
    "sourceId": "Incline_Dumbbell_Flyes",
    "names": [
      "Crucifixo inclinado com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-incline-fly.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-fly.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-fly.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-incline-fly.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1269",
    "sourceId": "Cable_Crossover",
    "names": [
      "Crossover na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-standing-fly-crossover-fly.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-fly-crossover-fly.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-fly-crossover-fly.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-standing-fly-crossover-fly.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-drv-lever-pec-deck-fly",
    "sourceId": "Butterfly",
    "names": [
      "Voador (Pec Deck)",
      "Crucifixo na máquina (peck deck)"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-pec-deck-fly.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-pec-deck-fly.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-pec-deck-fly.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-pec-deck-fly.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-drv-push-ups",
    "sourceId": "Pushups",
    "names": [
      "Flexão de braço",
      "Flexão de braços"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/push-ups.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/push-ups.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/push-ups.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/push-ups.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0493",
    "sourceId": "Incline_Push-Up_Medium",
    "names": [
      "Flexão inclinada",
      "Flexão de braços inclinada"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/incline-push-ups.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/incline-push-ups.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/incline-push-ups.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/incline-push-ups.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-drv-bench-dips",
    "sourceId": "Bench_Dips",
    "names": [
      "Mergulho no banco"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/bench-dips.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/bench-dips.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/bench-dips.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/bench-dips.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0030",
    "sourceId": "Close-Grip_Barbell_Bench_Press",
    "names": [
      "Supino fechado com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-close-grip-bench-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-close-grip-bench-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-close-grip-bench-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0340",
    "sourceId": "Dumbbell_Bench_Press_with_Neutral_Grip",
    "names": [
      "Supino com halteres pegada neutra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-lying-hammer-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-hammer-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-hammer-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-lying-hammer-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0302",
    "sourceId": "Decline_Dumbbell_Flyes",
    "names": [
      "Crucifixo declinado com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-decline-fly-45-degree-1.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-decline-fly-45-degree-1.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-decline-fly-45-degree-1.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1167",
    "sourceId": "Dynamic_Chest_Stretch",
    "names": [
      "Alongamento de peito"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-dynamic-chest-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-dynamic-chest-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-dynamic-chest-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-dynamic-chest-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0198",
    "sourceId": "Wide-Grip_Lat_Pulldown",
    "names": [
      "Puxada frontal na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-pulldown.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pulldown.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pulldown.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-pulldown.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0974",
    "sourceId": "selected-puxada-fechada-na-polia",
    "names": [
      "Puxada fechada na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-close-grip-front-lat-pulldown.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-close-grip-front-lat-pulldown.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-close-grip-front-lat-pulldown.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-close-grip-front-lat-pulldown.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0208",
    "sourceId": "Seated_Cable_Rows",
    "names": [
      "Remada sentada na polia",
      "Remada baixa na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-straight-back-seated-row-v-grip.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-straight-back-seated-row-v-grip.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-straight-back-seated-row-v-grip.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-straight-back-seated-row-v-grip.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1429",
    "sourceId": "Pullups",
    "names": [
      "Barra fixa (pull-up)",
      "Barra fixa"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/pull-up-wide-front-grip.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/pull-up-wide-front-grip.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/pull-up-wide-front-grip.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/pull-up-wide-front-grip.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2327",
    "sourceId": "selected-barra-fixa-pegada-supinada-chin-up",
    "names": [
      "Barra fixa pegada supinada (chin-up)"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/reverse-grip-pull-up.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/reverse-grip-pull-up.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/reverse-grip-pull-up.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/reverse-grip-pull-up.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0095",
    "sourceId": "Barbell_Shrug",
    "names": [
      "Encolhimento com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-shrug.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-shrug.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-shrug.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-shrug.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0406",
    "sourceId": "Dumbbell_Shrug",
    "names": [
      "Encolhimento com halter"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-shrug.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-shrug.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-shrug.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-shrug.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0327",
    "sourceId": "Dumbbell_Incline_Row",
    "names": [
      "Remada inclinada com halteres",
      "Remada com halteres no banco inclinado"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-incline-row.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-row.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-row.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-incline-row.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2616",
    "sourceId": "selected-puxada-unilateral-na-polia",
    "names": [
      "Puxada unilateral na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-one-arm-lateral-pulldown.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-lateral-pulldown.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-lateral-pulldown.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-one-arm-lateral-pulldown.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0203",
    "sourceId": "Face_Pull",
    "names": [
      "Face pull"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-rear-delt-row-with-rope.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-rear-delt-row-with-rope.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-rear-delt-row-with-rope.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-rear-delt-row-with-rope.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0489",
    "sourceId": "Hyperextensions_Back_Extensions",
    "names": [
      "Hiperextensão lombar",
      "Extensão lombar no banco romano"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/45-degree-hyperextension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/45-degree-hyperextension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/45-degree-hyperextension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/45-degree-hyperextension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0974",
    "sourceId": "V-Bar_Pulldown",
    "names": [
      "Puxada com pegada neutra",
      "Puxada frontal com pegada neutra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-close-grip-front-lat-pulldown.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-close-grip-front-lat-pulldown.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-close-grip-front-lat-pulldown.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-close-grip-front-lat-pulldown.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0690",
    "sourceId": "selected-alongamento-de-costas",
    "names": [
      "Alongamento de costas"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-seated-lower-back-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-seated-lower-back-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-seated-lower-back-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-seated-lower-back-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0289",
    "sourceId": "Dumbbell_Shoulder_Press",
    "names": [
      "Desenvolvimento com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-bench-seated-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-bench-seated-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-bench-seated-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-bench-seated-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2137",
    "sourceId": "Arnold_Dumbbell_Press",
    "names": [
      "Desenvolvimento Arnold"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-arnold-press.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-arnold-press.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-arnold-press.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-arnold-press.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0334",
    "sourceId": "Side_Lateral_Raise",
    "names": [
      "Elevação lateral com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-lateral-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lateral-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lateral-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-lateral-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0310",
    "sourceId": "Front_Dumbbell_Raise",
    "names": [
      "Elevação frontal com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-front-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-front-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-front-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-front-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0123",
    "sourceId": "selected-remada-alta-com-barra",
    "names": [
      "Remada alta com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-upright-row-wide-grip.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-upright-row-wide-grip.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-upright-row-wide-grip.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-upright-row-wide-grip.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0178",
    "sourceId": "Standing_Low-Pulley_Deltoid_Raise",
    "names": [
      "Elevação lateral na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-lateral-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-lateral-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-lateral-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-lateral-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0162",
    "sourceId": "selected-elevacao-frontal-na-polia",
    "names": [
      "Elevação frontal na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-one-arm-forward-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-forward-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-forward-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-one-arm-forward-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0669",
    "sourceId": "selected-alongamento-de-ombro",
    "names": [
      "Alongamento de ombro"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-rear-deltoid-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-rear-deltoid-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-rear-deltoid-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-rear-deltoid-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0031",
    "sourceId": "Barbell_Curl",
    "names": [
      "Rosca direta com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0285",
    "sourceId": "Dumbbell_Alternate_Bicep_Curl",
    "names": [
      "Rosca alternada com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-alternate-seated-biceps-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-alternate-seated-biceps-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-alternate-seated-biceps-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-alternate-seated-biceps-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0297",
    "sourceId": "Concentration_Curls",
    "names": [
      "Rosca concentrada"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-concentration-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-concentration-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-concentration-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-concentration-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0322",
    "sourceId": "Incline_Dumbbell_Curl",
    "names": [
      "Rosca inclinada com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-incline-biceps-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-biceps-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-incline-biceps-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-incline-biceps-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0190",
    "sourceId": "Standing_One-Arm_Cable_Curl",
    "names": [
      "Rosca unilateral na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-one-arm-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-one-arm-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-one-arm-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0061",
    "sourceId": "EZ-Bar_Skullcrusher",
    "names": [
      "Tríceps testa com barra",
      "Tríceps testa"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/ez-barbell-lying-triceps-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/ez-barbell-lying-triceps-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/ez-barbell-lying-triceps-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/ez-barbell-lying-triceps-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0200",
    "sourceId": "Triceps_Pushdown_-_Rope_Attachment",
    "names": [
      "Tríceps corda na polia",
      "Tríceps na polia com corda"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-pushdown-rope-attachment.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pushdown-rope-attachment.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pushdown-rope-attachment.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-pushdown-rope-attachment.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0351",
    "sourceId": "Lying_Dumbbell_Tricep_Extension",
    "names": [
      "Tríceps testa com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-lying-triceps-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-triceps-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lying-triceps-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-lying-triceps-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0333",
    "sourceId": "Tricep_Dumbbell_Kickback",
    "names": [
      "Tríceps coice",
      "Tríceps coice com halter"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-kickback.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-kickback.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-kickback.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-kickback.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2188",
    "sourceId": "Seated_Triceps_Press",
    "names": [
      "Tríceps francês",
      "Tríceps francês com halter"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-seated-triceps-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-triceps-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-triceps-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-seated-triceps-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0231",
    "sourceId": "Cable_One_Arm_Tricep_Extension",
    "names": [
      "Tríceps unilateral na polia"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-standing-one-arm-triceps-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-one-arm-triceps-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-standing-one-arm-triceps-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-standing-one-arm-triceps-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1723",
    "sourceId": "Triceps_Pushdown",
    "names": [
      "Extensão de tríceps na polia",
      "Tríceps na polia com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-triceps-pushdown.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-triceps-pushdown.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-triceps-pushdown.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-triceps-pushdown.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1771",
    "sourceId": "selected-alongamento-de-triceps",
    "names": [
      "Alongamento de tríceps"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-kneeling-triceps-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-kneeling-triceps-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-kneeling-triceps-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-kneeling-triceps-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1435",
    "sourceId": "Barbell_Squat",
    "names": [
      "Agachamento livre com barra",
      "Agachamento livre"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/classic-barbell-squat.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/classic-barbell-squat.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/classic-barbell-squat.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/classic-barbell-squat.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0042",
    "sourceId": "Front_Barbell_Squat",
    "names": [
      "Agachamento frontal",
      "Agachamento frontal com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-front-chest-squat.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-front-chest-squat.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-front-chest-squat.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-front-chest-squat.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0054",
    "sourceId": "selected-afundo-com-barra",
    "names": [
      "Afundo com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-lunge.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-lunge.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-lunge.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-lunge.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0336",
    "sourceId": "Dumbbell_Lunges",
    "names": [
      "Afundo com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-lunge.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lunge.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-lunge.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-lunge.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0116",
    "sourceId": "Stiff-Legged_Barbell_Deadlift",
    "names": [
      "Stiff com barra"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-straight-leg-deadlift.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-straight-leg-deadlift.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-straight-leg-deadlift.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-straight-leg-deadlift.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0432",
    "sourceId": "Stiff-Legged_Dumbbell_Deadlift",
    "names": [
      "Stiff com halteres"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-stiff-leg-deadlift.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-stiff-leg-deadlift.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-stiff-leg-deadlift.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-stiff-leg-deadlift.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0585",
    "sourceId": "Leg_Extensions",
    "names": [
      "Cadeira extensora"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-leg-extension.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-leg-extension.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-leg-extension.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-leg-extension.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0586",
    "sourceId": "Lying_Leg_Curls",
    "names": [
      "Mesa flexora"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-lying-leg-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-lying-leg-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-lying-leg-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-lying-leg-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0597",
    "sourceId": "Thigh_Abductor",
    "names": [
      "Abdução de quadril",
      "Cadeira abdutora"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-seated-hip-abduction.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-abduction.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-abduction.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-seated-hip-abduction.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0598",
    "sourceId": "Thigh_Adductor",
    "names": [
      "Adução de quadril"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-seated-hip-adduction.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-adduction.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-adduction.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-seated-hip-adduction.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0411",
    "sourceId": "selected-agachamento-unilateral",
    "names": [
      "Agachamento unilateral"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-single-leg-squat.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-single-leg-squat.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-single-leg-squat.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-single-leg-squat.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0605",
    "sourceId": "Standing_Calf_Raises",
    "names": [
      "Elevação de panturrilha em pé",
      "Panturrilha na máquina em pé"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lever-standing-calf-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-standing-calf-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-standing-calf-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lever-standing-calf-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0464",
    "sourceId": "Plank",
    "names": [
      "Prancha frontal",
      "Prancha abdominal"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/female/front-plank-female.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/front-plank-female.mp4",
      "variants": {
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/front-plank-female.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0705",
    "sourceId": "selected-prancha-lateral",
    "names": [
      "Prancha lateral"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/side-bridge-side-plank.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/side-bridge-side-plank.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/side-bridge-side-plank.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/side-bridge-side-plank.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0274",
    "sourceId": "Crunches",
    "names": [
      "Abdominal crunch",
      "Abdominal no solo"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/female/crunch-floor-female.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/crunch-floor-female.mp4",
      "variants": {
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/crunch-floor-female.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0872",
    "sourceId": "Reverse_Crunch",
    "names": [
      "Abdominal infra",
      "Abdominal reverso"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/female/reverse-crunch-female.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/reverse-crunch-female.mp4",
      "variants": {
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/reverse-crunch-female.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0985",
    "sourceId": "Cross-Body_Crunch",
    "names": [
      "Abdominal oblíquo",
      "Abdominal oblíquo no solo"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/twisting-crunch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/twisting-crunch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/twisting-crunch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/twisting-crunch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0175",
    "sourceId": "Cable_Crunch",
    "names": [
      "Abdominal na polia",
      "Abdominal na polia alta"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/cable-kneeling-crunch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-kneeling-crunch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-kneeling-crunch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/cable-kneeling-crunch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0865",
    "sourceId": "Flat_Bench_Lying_Leg_Raise",
    "names": [
      "Elevação de pernas"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/lying-floor-leg-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lying-floor-leg-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lying-floor-leg-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/lying-floor-leg-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1338",
    "sourceId": "Exercise_Ball_Crunch",
    "names": [
      "Abdominal com bola",
      "Abdominal na bola suíça"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/sit-up-on-exercise-ball.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/sit-up-on-exercise-ball.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/sit-up-on-exercise-ball.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/sit-up-on-exercise-ball.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0409",
    "sourceId": "selected-panturrilha-unilateral",
    "names": [
      "Panturrilha unilateral"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-single-leg-calf-raise.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-single-leg-calf-raise.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-single-leg-calf-raise.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-single-leg-calf-raise.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0369",
    "sourceId": "selected-rosca-de-punho",
    "names": [
      "Rosca de punho"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/dumbbell-over-bench-wrist-curl.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-over-bench-wrist-curl.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-over-bench-wrist-curl.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/dumbbell-over-bench-wrist-curl.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0082",
    "sourceId": "selected-rosca-inversa-de-punho",
    "names": [
      "Rosca inversa de punho"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/barbell-reverse-wrist-curl-over-grip.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-reverse-wrist-curl-over-grip.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/barbell-reverse-wrist-curl-over-grip.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/barbell-reverse-wrist-curl-over-grip.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1390",
    "sourceId": "selected-alongamento-de-panturrilha",
    "names": [
      "Alongamento de panturrilha"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-seated-calf-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-seated-calf-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-seated-calf-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-seated-calf-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0721",
    "sourceId": "selected-alongamento-de-antebraco",
    "names": [
      "Alongamento de antebraço"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-side-wrist-pull-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-side-wrist-pull-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-side-wrist-pull-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-side-wrist-pull-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1564",
    "sourceId": "selected-alongamento-de-flexores-de-quadril",
    "names": [
      "Alongamento de flexores de quadril"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-hip-flexor-and-quad-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-hip-flexor-and-quad-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-hip-flexor-and-quad-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-hip-flexor-and-quad-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-drv-stretching-band-warm-up-shoulder-stretch",
    "sourceId": "selected-mobilidade-de-ombro",
    "names": [
      "Mobilidade de ombro"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-band-warm-up-shoulder-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-band-warm-up-shoulder-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-band-warm-up-shoulder-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-band-warm-up-shoulder-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-0257",
    "sourceId": "selected-mobilidade-de-quadril",
    "names": [
      "Mobilidade de quadril"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stretching-hip-circles-stretch.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-hip-circles-stretch.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-hip-circles-stretch.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stretching-hip-circles-stretch.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-1160",
    "sourceId": "selected-burpee",
    "names": [
      "Burpee"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/burpee.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/burpee.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/burpee.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2138",
    "sourceId": "Bicycling_Stationary",
    "names": [
      "Bike",
      "Bicicleta ergométrica"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/stationary-bike.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/stationary-bike.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-drv-treadmill-running",
    "sourceId": "Running_Treadmill",
    "names": [
      "Esteira",
      "Corrida na esteira"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/treadmill-running.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/treadmill-running.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/treadmill-running.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/treadmill-running.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  },
  {
    "id": "free-preview-2612",
    "sourceId": "Rope_Jumping",
    "names": [
      "Pular corda"
    ],
    "poster": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-posters/male/jump-rope.jpg",
    "video": {
      "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/jump-rope.mp4",
      "variants": {
        "male": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/jump-rope.mp4",
        "female": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/female/jump-rope.mp4"
      },
      "author": "free-exercise-db-api",
      "license": "Demonstração em teste",
      "licenseUrl": "https://github.com/luisaraujoc/free-exercise-db-api",
      "source": "https://github.com/luisaraujoc/free-exercise-db-api/tree/38c5670c3210f69268a0255bdb2cb3edcb596c46",
      "licensed": false,
      "previewOnly": true,
      "reviewed": true
    }
  }
];
  function previewEnabled(){return /^(localhost|127\.0\.0\.1)$/.test(root.location?.hostname||"")||/^personal-[a-z0-9]{9}-raidyumeko-9261\.vercel\.app$/.test(root.location?.hostname||"")}
  function resolve(ex) {
    const identity = ex.sourceId || ex.id;
    const allowed = previewEnabled() ? [...entries,...previewEntries] : entries;
    const item = allowed.find(item => item.sourceId === identity) ||
      allowed.find(item => item.names.includes(ex.name));
    return item
      ? {
          ...ex,
          poster: item.poster,
          images: ex.images?.length ? ex.images : [item.poster],
          video: item.video,
        }
      : ex;
  }
  root.PersonalProMedia = { resolve, entries, previewEntries, previewEnabled };
})(window);
