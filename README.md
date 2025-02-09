# Projector Assist

A small Keystone tool to project images onto a surface via a video projector. Useful for tracing images. In this case,
an ipad to achieve cleaner live or recorded white boarding in the iPads notes app.

![Example Aligning with iPad Screen](./assets/docs/2025-01-28_projector_assist_websocket_keystone.gif)

## Running

To run the project in one go, run the following command:

```bash
deno run -A npm:concurrently "cd server && deno task dev" "cd browser && deno task dev"
```

 - Edit `config.example.ts` and rename to `config.ts`. Otherwise default localhost.
 - Persists state changes to `server/db.json` (every 3 seconds if changes exist).

## Using

1. Open the browser at `http://localhost:3000` for the projector view.
2. Open the browser at `http://localhost:3000/controller` for the controller to keystone the projection.

## Dependencies

You need to have Deno v2.0.0 or later installed to run this repo.