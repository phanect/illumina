#!/usr/bin/env nu

#MISE description="Prepare before build and related tasks."

use ./_libs *

if ($env.SERVER_ENV == "development") {
  container compose up -d --wait
}
