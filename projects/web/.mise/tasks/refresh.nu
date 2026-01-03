#!/usr/bin/env nu

#MISE description="Add migrations"
#MISE wait_for = "//:prebuild"
#MISE raw=true # Required for interactive shell by Prisma

if ($env.SERVER_ENV == "development") {
  prisma migrate dev
  prisma db seed
}
