# muxout frontend

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `prettier:write` – formats all files with Prettier


// shift routine dates and task ids in all tasks
db["Routine"].aggregate([
  {
    $match: { userId: ObjectId("680773f178509beb8ecacf3c"), createdAt: {$gte: ISODate("2025-04-20T10:46:33.303+00:00")} }
  },
  {
    $addFields: {
      createdAt: { $subtract: ["$createdAt", 10 * 24 * 60 * 60 * 1000] },
      startsAt: { $subtract: ["$startsAt", 9 * 24 * 60 * 60 * 1000] },
      lastDate: { $subtract: ["$lastDate", 9 * 24 * 60 * 60 * 1000] },
      allTasks: {
        $map: {
          input: "$allTasks",
          as: "task",
          in: {
            $mergeObjects: [
              "$$task",
              {
                ids: {
                  $map: {
                    input: "$$task.ids",
                    as: "id",
                    in: {
                      $mergeObjects: [
                        "$$id",
                        {
                          startsAt: { $subtract: ["$$id.startsAt", 9 * 24 * 60 * 60 * 1000] },
                          status: "completed"
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      }
    }
  },
  {
    $merge: {
      into: "Routine",
      on: "_id",
      whenMatched: "replace"
    }
  }
]);

// shift task dates
db["Task"].updateMany(
  { 
    userId: ObjectId("680773f178509beb8ecacf3c"),
    startsAt: {$gte: ISODate("2025-04-20T10:46:33.303+00:00")}
  },
  [
    {
      $set: {
        startsAt: { $subtract: ["$startsAt", 9 * 24 * 60 * 60 * 1000] },
        expiresAt: { $subtract: ["$expiresAt", 9 * 24 * 60 * 60 * 1000] },
        status: "completed",
        proofId: ObjectId("680775e278509beb8ecacf5b")
      }
    }
  ]
);
